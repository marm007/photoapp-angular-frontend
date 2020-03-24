import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import * as data from '../relations_data.json';
import {MessageService} from '../services/message/message.service';
import {MatDialog} from '@angular/material/dialog';
import {SingleRelationComponent} from '../single-relation/single-relation.component';

export enum DIALOG_MODE {
  ADD,
  WATCH
}

@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationsComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  message: string = null;

  // @ts-ignore
  relations = data.default;

  postsLoaded: Subject<boolean> = new Subject();

  constructor(private messageService: MessageService,
              public dialog: MatDialog) {
    console.log(this.relations);
    this.subscription = this.messageService.getMessage()
      .subscribe(myMessage => {
        if (myMessage === 'posts loaded') {
          this.postsLoaded.next(true);
        }
        this.message = myMessage;
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addRelation() {
    const dialogRef = this.dialog.open(SingleRelationComponent, {
      panelClass: 'custom-dialog-container',
      data: DIALOG_MODE.ADD
    });
  }

  playRelation() {
    const dialogRef = this.dialog.open(SingleRelationComponent, {
      panelClass: 'custom-dialog-container',
      data: DIALOG_MODE.WATCH
    });
  }

}
