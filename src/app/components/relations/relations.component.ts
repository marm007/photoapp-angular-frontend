import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {MessageService} from '../../services/message/message.service';
import {MatDialog} from '@angular/material/dialog';
import {SingleRelationComponent} from '../single-relation/single-relation.component';
import {RelationService} from '../../services/relation/relation.service';
import {Relation} from '../../models/relation';
import {User} from '../../models/user';
import {DialogMode} from '../../models/dialogMode';
import {UserService} from '../../services/user/user.service';
import moment from 'moment';
import {Router} from '@angular/router';
import {ImageType, prepareImage} from '../../restConfig';
import {Filter, Sort} from '../filter/filter.component';
import {PostFilterSortModel} from '../../models/post';


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

  relations: Relation[] = [];

  subscription: Subscription;
  messageFilterSubscription: Subscription;

  message: string = null;

  postsLoaded: Subject<boolean> = new Subject();

  sortFilterMessage: PostFilterSortModel = {};

  constructor(private messageService: MessageService,
              public dialog: MatDialog,
              public relationService: RelationService,
              private userService: UserService,
              private router: Router) {

    this.messageFilterSubscription = this.messageService.getSortFilterMessage()
      .subscribe((message: Sort | Filter) => {
        if (!message.isPost) {
          if ('dir' in message) {
            // sortowanie
            this.relations = [];
            this.sortFilterMessage.ordering = message.dir === 1 ? message.id : '-'.concat(message.id);
            this.listFollowedRelations(null, this.sortFilterMessage);
          } else {
            this.relations = [];
            this.sortFilterMessage.created_after = message.created_after;
            this.sortFilterMessage.created_before = message.created_before;
            this.listFollowedRelations(null, this.sortFilterMessage);
          }
        }
      });


    this.subscription = this.messageService.getMessage()
      .subscribe(myMessage => {
        if (myMessage === 'posts loaded') {
          this.postsLoaded.next(true);
        }
        if (myMessage === 'reset_filter_false') {
          this.sortFilterMessage = {};
          this.relations = [];
          this.listFollowedRelations(null,  this.sortFilterMessage);
        }
        this.message = myMessage;
      });

  }

  ngOnInit(): void {
    this.listFollowedRelations();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  listFollowedRelations(offset?: number, queryParams?: PostFilterSortModel): void {
    this.userService.listFollowedRelations(offset, queryParams)
      .subscribe((relations: Relation[]) => {
        if (relations.length > 0) {
          relations.forEach(relation => {
            relation.user.meta.avatar = prepareImage(relation.user.meta.avatar);
            relation.image = prepareImage(relation.image);
            relation.created = this.addCorrectTime(relation.created);
          });
          this.relations = this.relations.concat(relations);
        }
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

  addRelation() {
    this.userService.get(this.user.id).subscribe(user => {
      user.meta.avatar = prepareImage(user.meta.avatar);
      const dialogRef = this.dialog.open(SingleRelationComponent, {
        panelClass: 'custom-dialog-container',
        data: {mode: DialogMode.ADD, relation: {user}}
      });

      dialogRef.afterClosed().subscribe(relationData => {
        if (relationData == null) {
          return;
        }
        this.relationService.add(relationData).subscribe(
          (res: any) => {
            res.user.meta.avatar = prepareImage(res.user.meta.avatar);
            res.image = prepareImage(res.image);
            res.created = this.addCorrectTime(res.created);
            this.relations.push(res);
          },
          (err) => {
          });
      });
    }, error => {
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
