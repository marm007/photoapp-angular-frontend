import {ChangeDetectionStrategy, Component, Input, IterableDiffers, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {MessageService} from '../../services/message/message.service';
import {MatDialog} from '@angular/material/dialog';
import {SingleRelationComponent} from '../single-relation/single-relation.component';
import {RelationService} from '../../services/relation/relation.service';
import {Relation} from '../../models/relation';
import {User, UserFull} from '../../models/user';
import {UserFollowed} from '../../models/userFollowed';
import {AuthService} from '../../services/auth/auth.service';
import {DialogMode} from '../../models/dialogMode';
import {UserService} from '../../services/user/user.service';
import {UserRelations} from '../../models/userRelations';
import moment from 'moment';
import {Router} from '@angular/router';


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
  private url = 'http://127.0.0.1:8000';

  @Input()
  user: UserFull;

  @Input()
  usersFollowed: UserFollowed[] = [];

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
    this.user.profile.photo = this.url + this.user.profile.photo;
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
        this.getRelation(followed.followed).then(value => {
          this.relations = this.relations.concat(value.relations);
        }));
    });

    Promise.all(requests).then(() => {
      this.getRelation(this.user.id).then(value => {
        this.relations = this.relations.concat(value.relations);
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

  async getRelation(id: number): Promise<UserRelations> {
    return await new Promise<UserRelations>(resolve =>
      this.relationService.getRelation(id)
        .subscribe(userRelations => {
          const user: User = {username: userRelations.username, profile: userRelations.profile, id: userRelations.id};
          userRelations.relations.forEach(rel => {
            rel.user = JSON.parse(JSON.stringify(user));
            rel.image = this.url + rel.image;
            rel.user.profile.photo = this.url + rel.user.profile.photo;
            rel.created = this.addCorrectTime(rel.created);
          });
          resolve(userRelations);
        }));
  }

  public trackItem(index: number, item: Relation) {
    return item.id;
  }

  addRelation() {
    this.userService.getLoggedUserData().subscribe(user => {
      user.profile.photo = this.url + user.profile.photo;
      const dialogRef = this.dialog.open(SingleRelationComponent, {
        panelClass: 'custom-dialog-container',
        data: {mode: DialogMode.ADD, relation: {user}}
      });

      dialogRef.afterClosed().subscribe(relationData => {
        this.relationService.addRelation(relationData).subscribe(
          (res: any) => {
            console.log(res);
            res.image = this.url + res.image;
            res.user.profile.photo = this.url + res.user.profile.photo;
            res.created = this.addCorrectTime(res.created);
            this.relations.push(res);
            /*const u: User = {username: 'addaa', profile: null, id: 25};
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
