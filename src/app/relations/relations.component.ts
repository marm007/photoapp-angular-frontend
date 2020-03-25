import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import * as data from '../relations_data.json';
import {MessageService} from '../services/message/message.service';
import {MatDialog} from '@angular/material/dialog';
import {SingleRelationComponent} from '../single-relation/single-relation.component';
import {RelationService} from '../services/relation/relation.service';
import {Post} from '../models/post';
import {Relation} from '../models/relation';
import {User} from '../models/user';

export enum DIALOG_MODE {
  ADD,
  WATCH
}

interface RelationsByUser {
  user: User;
  relations: Relation[];
}

@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationsComponent implements OnInit, OnDestroy {
  private url = 'http://127.0.0.1:8000/api/';

  relations: Relation[];
  relationsByUser: RelationsByUser[];

  subscription: Subscription;

  message: string = null;

  postsLoaded: Subject<boolean> = new Subject();

  constructor(private messageService: MessageService,
              public dialog: MatDialog,
              public relationService: RelationService) {
    this.subscription = this.messageService.getMessage()
      .subscribe(myMessage => {
        if (myMessage === 'posts loaded') {
          this.postsLoaded.next(true);
        }
        this.message = myMessage;
      });
    this.getRelations();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getRelations() {
    this.relationService.getRelations().subscribe(relations => {
      console.log(relations);
      relations.forEach(relation => {
      });
      this.relations = relations;
    });
  }

  addRelation() {
    const dialogRef = this.dialog.open(SingleRelationComponent, {
      panelClass: 'custom-dialog-container',
      data: { mode: DIALOG_MODE.ADD, relation: null }
    });

    dialogRef.afterClosed().subscribe(relationData => {
      this.relationService.addRelation(relationData).subscribe(
        (res: any) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        });
      console.log('DALDALadldaldla');
    });
  }

  playRelation(i?: number) {
    if (i !== null) {
      const dialogRef = this.dialog.open(SingleRelationComponent, {
        panelClass: 'custom-dialog-container',
        data: { mode: DIALOG_MODE.WATCH, relation: this.relations[i] }
      });
    } else {
      const dialogRef = this.dialog.open(SingleRelationComponent, {
        panelClass: 'custom-dialog-container',
        data: { mode: DIALOG_MODE.WATCH, relation: null }
      });
    }
  }

}
