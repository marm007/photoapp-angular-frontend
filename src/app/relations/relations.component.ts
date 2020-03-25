import {ChangeDetectionStrategy, Component, DoCheck, Input, IterableDiffers, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import * as data from '../relations_data.json';
import {MessageService} from '../services/message/message.service';
import {MatDialog} from '@angular/material/dialog';
import {SingleRelationComponent} from '../single-relation/single-relation.component';
import {RelationService} from '../services/relation/relation.service';
import {Post} from '../models/post';
import {Relation} from '../models/relation';
import {User} from '../models/user';
import {UserFollowed} from '../models/userFollowed';
import {AuthService} from '../services/auth/auth.service';
import {DIALOG_MODE} from '../models/DIALOG_MODE';
import {UserService} from '../user.service';
import {UserRelations} from '../models/userRelations';


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
  usersFollowed: UserFollowed[] = [];

  relations: Relation[] = [];
  relationsByUser: RelationsByUser[];

  subscription: Subscription;

  message: string = null;

  postsLoaded: Subject<boolean> = new Subject();
  iterableDiffer: any;


  constructor(private messageService: MessageService,
              public dialog: MatDialog,
              public relationService: RelationService,
              private authService: AuthService,
              private userService: UserService,
              private iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
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
        this.getRelation(followed.followed).then(value => {
        this.relations = this.relations.concat(value.relations);
      }));
    });

    Promise.all(requests).then(() => {
      this.getRelation(this.authService.userId).then(value => {
        this.relations = this.relations.concat(value.relations);
      });
    });
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
        });
        resolve(userRelations);
      }));
  }

  public trackItem(index: number, item: Relation) {
    return item.id;
  }

  addRelation() {
   this.userService.getLoggedUserData().subscribe(user => {
     const dialogRef = this.dialog.open(SingleRelationComponent, {
       panelClass: 'custom-dialog-container',
       data: { mode: DIALOG_MODE.ADD, relation: {user} }
     });

     dialogRef.afterClosed().subscribe(relationData => {
       this.relationService.addRelation(relationData).subscribe(
         (res: any) => {
           console.log(res);
           res.image = this.url + res.image;
           res.user.profile.photo = this.url + res.user.profile.photo;
           this.relations.push(res);
           /*const u: User = {username: 'addaa', profile: null, id: 25};
           this.relations = [...this.relations, ({id: res.id, image: res.image, user: u})];*/
         },
         (err) => {
           console.log(err);
         });
     });
    });

  }

  playRelation(i?: number) {
    if (i !== undefined) {
      const dialogRef = this.dialog.open(SingleRelationComponent, {
        panelClass: 'custom-dialog-container',
        data: { mode: DIALOG_MODE.WATCH, relation: this.relations[i] }
      });
    } else {
      const currentUser = this.authService.userId;
      const usersRelations = this.relations.filter(r => r.user.id === currentUser);
      console.log(usersRelations);
      if (usersRelations.length > 0) {
        const dialogRef = this.dialog.open(SingleRelationComponent, {
          panelClass: 'custom-dialog-container',
          data: { mode: DIALOG_MODE.WATCH, relation: usersRelations[0] }
        });
      } else {
        // TODO user has got no relations
      }
    }
  }

}
