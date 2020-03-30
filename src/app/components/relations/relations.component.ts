import {ChangeDetectionStrategy, Component, Input, IterableDiffers, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {forkJoin, Observable, Subject, Subscription} from 'rxjs';
import {MessageService} from '../../services/message/message.service';
import {MatDialog} from '@angular/material/dialog';
import {SingleRelationComponent} from '../single-relation/single-relation.component';
import {RelationService} from '../../services/relation/relation.service';
import {Relation} from '../../models/relation';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth/auth.service';
import {DialogMode} from '../../models/dialogMode';
import {UserService} from '../../services/user/user.service';
import moment from 'moment';
import {Router} from '@angular/router';
import {Post} from '../../models/post';
import {mediaURL} from '../../restConfig';
import {Follower} from '../../models/follower';


interface RelationsByUser {
  user: User;
  relations: Relation[];
}

@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RelationsComponent implements OnInit, OnDestroy {

  @Input()
  user: User;

  @Input()
  usersFollowed: Follower[] = [];

  relations: Relation[] = [];

  subscription: Subscription;

  message: string = null;

  postsLoaded: Subject<boolean> = new Subject();

  constructor(private messageService: MessageService,
              public dialog: MatDialog,
              public relationService: RelationService,
              private authService: AuthService,
              private userService: UserService,
              private router: Router) {
    this.subscription = this.messageService.getMessage()
      .subscribe(myMessage => {
        if (myMessage === 'posts loaded') {
          this.postsLoaded.next(true);
        }
        this.message = myMessage;
      });
  }

  ngOnInit(): void {
    this.getRelations();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getRelation(id: number): Observable<Relation> {

      return this.relationService.get(id);
        // .subscribe(relation => {
        //   relation.created = this.addCorrectTime(relation.created);
        //   resolve(relation);
        // }));
  }

  getRelations(): void {
    this.relations = [];
    const requests = [];

    this.usersFollowed.forEach((followed, index) => {
      requests.push(this.userService.get(followed.user_being_followed));
    });

    requests.push(this.userService.get(this.user.id));
    forkJoin(requests)
      .subscribe((users: User[]) => {
        const requestsUser = [];
        users.forEach(user => {
          user.relations.forEach((relationID) => {
            requestsUser.push(this.getRelation(relationID));
          });
        });
        forkJoin(requestsUser)
          .subscribe((relations: Relation[]) => {
            relations.forEach(relation => relation.created = this.addCorrectTime(relation.created));
            this.relations = relations;
          });
      });
  }

  addCorrectTime(created: Date | number | string): string {
    const currentTime = moment();
    const relTime = moment(created);

    const hours = currentTime.diff(relTime, 'hours');
    created = hours + ' hours ago';
    if (hours === 0) {
      const minutes = currentTime.diff(relTime, 'minutes');
      created = minutes + ' minutes ago';
      if (minutes === 0) {
        const seconds = currentTime.diff(relTime, 'seconds');
        created = currentTime.diff(relTime, 'seconds') + ' seconds ago';
        if (seconds === 0) {
          created = 'just now';
        }
      }
    }
    return created;
  }


  public trackItem(index: number, item: Relation) {
    return item.id;
  }

  addRelation() {
    this.userService.get(this.authService.userID).subscribe(user => {
      const dialogRef = this.dialog.open(SingleRelationComponent, {
        panelClass: 'custom-dialog-container',
        data: {mode: DialogMode.ADD, relation: {user}}
      });

      dialogRef.afterClosed().subscribe(relationData => {
        this.relationService.add(relationData).subscribe(
          (res: any) => {
            console.log(res);
            res.created = this.addCorrectTime(res.created);
            this.relations.push(res);
            /*const u: User = {username: 'addaa', meta: null, id: 25};
            this.relations = [...this.relations, ({id: res.id, image: res.image, user: u})];*/
          },
          (err) => {
            console.log(err);
          });
      });
    }, error => {
      console.log('ERROR WHILE GETTING LOGGED USER DATA FROM RELATIONS');
      console.log(error);
      if (error.status === 404) {
          this.router.navigate(['login']);
      }
    });

  }

  playRelation(i?: number) {
    if (i !== undefined) {
      const dialogRef = this.dialog.open(SingleRelationComponent, {
        panelClass: 'custom-dialog-container',
        data: {mode: DialogMode.WATCH, relation: this.relations[i]}
      });
      dialogRef.afterClosed().subscribe(value => {
        if (value === 'deleted') {
          const relationToDelete = this.relations.find(r => r.id === this.relations[i].id);
          const index = this.relations.indexOf(relationToDelete);
          if (index !== -1) {
            this.relations.splice(index, 1);
          }
        }
      });
    } else {
      const usersRelations = this.relations.filter(r => r.user.id === this.user.id);
      console.log(usersRelations);
      if (usersRelations.length > 0) {
        const dialogRef = this.dialog.open(SingleRelationComponent, {
          panelClass: 'custom-dialog-container',
          data: {mode: DialogMode.WATCH, relation: usersRelations[0]}
        });
        dialogRef.afterClosed().subscribe(value => {
          if (value === 'deleted') {
            const relationToDelete = this.relations.find(r => r.id ===  usersRelations[0].id);
            const index = this.relations.indexOf(relationToDelete);
            if (index !== -1) {
              this.relations.splice(index, 1);
            }
          }
        });
      } else {
        // TODO user has got no relations
      }
    }
  }

}
