import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { DialogMode } from '../../models/dialogMode';
import { PostFilterSortModel } from '../../models/post';
import { Relation } from '../../models/relation';
import { User } from '../../models/user';
import { addCorrectTime, prepareImage } from '../../restConfig';
import { MessageService } from '../../services/message/message.service';
import { RelationService } from '../../services/relation/relation.service';
import { UserService } from '../../services/user/user.service';
import { SortFilterMessage } from '../../navigation/filter/filter.component';
import { RelationDetailComponent } from '../../relation/detail/detail.component';

@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css'],
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
      .subscribe((message: SortFilterMessage) => {
        if (!message.isPost) {
          if (message.sort) {
            // sortowanie
            this.relations = [];
            this.sortFilterMessage.ordering = message.sort.dir === 1 ? message.sort.id : '-'.concat(message.sort.id);
            this.listFollowedRelations(null, this.sortFilterMessage);
          } else {
            this.relations = [];
            this.sortFilterMessage.created_after = message.filter.created_after;
            this.sortFilterMessage.created_before = message.filter.created_before;
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
          this.listFollowedRelations(null, this.sortFilterMessage);
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
            relation.created = addCorrectTime(relation.created);
          });
          this.relations = this.relations.concat(relations);
        }
      });
  }


  addRelation() {
    this.userService.get(this.user.id).subscribe(user => {
      user.meta.avatar = prepareImage(user.meta.avatar);
      const dialogRef = this.dialog.open(RelationDetailComponent, {
        panelClass: 'custom-dialog-container',
        data: { mode: DialogMode.ADD, relation: { user } }
      });
      dialogRef.afterClosed().subscribe(relationData => {
        if (relationData == null) {
          return;
        }
        this.relations.push(relationData);
      });
    }, error => {
      if (error.status === 404) {
        this.router.navigate(['login']);
      }
    });

  }

  playRelation(i?: number) {
    if (i !== undefined) {
      const dialogRef = this.dialog.open(RelationDetailComponent, {
        panelClass: 'custom-dialog-container',
        data: { mode: DialogMode.WATCH, relation: this.relations[i] }
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
        const dialogRef = this.dialog.open(RelationDetailComponent, {
          panelClass: 'custom-dialog-container',
          data: { mode: DialogMode.WATCH, relation: usersRelations[0] }
        });
        dialogRef.afterClosed().subscribe(value => {
          if (value === 'deleted') {
            const relationToDelete = this.relations.find(r => r.id === usersRelations[0].id);
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
