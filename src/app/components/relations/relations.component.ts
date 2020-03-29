import {ChangeDetectionStrategy, Component, Input, IterableDiffers, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
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


  getRelations(): void {
    this.relations = [];
    const requests = [];

    this.usersFollowed.forEach((followed, index) => {
      requests.push(
        this.userService.getUser(followed.user_being_followed).subscribe(user => {
          user.relations.forEach((relationID) => {
            this.getRelation(relationID).then(relation => {
              this.relations = this.relations.concat(relation);
            });
          });
        }));
    });

    Promise.all(requests).then(() => {
      this.userService.getUser(this.user.id).subscribe(user => {
        user.relations.forEach((relationID) => {
          this.getRelation(relationID).then(relation => {
            this.relations = this.relations.concat(relation);
          });
        });
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
        created = currentTime.diff(relTime, 'seconds') + ' seconds ago';
      }
    }
    return created;
  }

  async getRelation(id: number): Promise<Relation> {
    return await new Promise<Relation>(resolve =>
      this.relationService.getRelation(id)
        .subscribe(relation => {
          relation.created = this.addCorrectTime(relation.created);
          resolve(relation);
        }));
  }

  public trackItem(index: number, item: Relation) {
    return item.id;
  }

  addRelation() {
    this.userService.getUser(this.authService.userID).subscribe(user => {
      const dialogRef = this.dialog.open(SingleRelationComponent, {
        panelClass: 'custom-dialog-container',
        data: {mode: DialogMode.ADD, relation: {user}}
      });

      dialogRef.afterClosed().subscribe(relationData => {
        this.relationService.addRelation(relationData).subscribe(
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
