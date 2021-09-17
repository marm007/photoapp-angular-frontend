import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogMode } from '../../models/dialogMode';
import { Relation } from '../../models/relation';
import { addCorrectTime } from '../../restConfig';
import { RelationService } from '../../services/relation/relation.service';
import { UserService } from '../../services/user/user.service';
import { RelationDetailComponent } from '../detail/detail.component';

@Component({
  selector: 'app-relation-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class RelationModalComponent implements OnInit, OnDestroy {

  @Output()
  relationDeleted: EventEmitter<Relation> = new EventEmitter<Relation>();

  destroy = new Subject<any>();

  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private relationService: RelationService) {
    route.params.pipe(takeUntil(this.destroy))
      .subscribe(params => {
        this.playRelation(params.id);
      });

  }

  ngOnInit(): void {
    console.log("INIT")
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }


  playRelation(id: string) {
    this.relationService.get(id).subscribe(relation => {
      if (relation !== null) {
        relation.created = addCorrectTime(relation.created);
        const dialogRef = this.dialog.open(RelationDetailComponent, {
          panelClass: 'custom-dialog-container',
          data: { mode: DialogMode.WATCH, relation }
        });
        dialogRef.afterClosed().subscribe(value => {
          if (value === 'deleted') {
            this.relationDeleted.emit(relation);
            // TODO: emmit relation to delete
            /*          const relationToDelete = this.relations.find(r => r.id === this.relations[i].id);
                      const index = this.relations.indexOf(relationToDelete);
                      if (index !== -1) {
                        this.relations.splice(index, 1);
                      }*/
            this.router.navigate(['/']);
          } else {
            // TODO: something went wrong
            this.router.navigate(['/']);
          }
        });
      }
    });


  }
}
