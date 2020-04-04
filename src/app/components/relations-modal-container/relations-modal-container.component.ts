import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {RelationDetailComponent} from '../relation-detail/relation-detail-component';
import {addCorrectTime, prepareImage} from '../../restConfig';
import {DialogMode} from '../../models/dialogMode';
import {UserService} from '../../services/user/user.service';
import {User} from '../../models/user';
import {RelationService} from '../../services/relation/relation.service';
import {Relation} from '../../models/relation';
import {Post} from '../../models/post';

@Component({
  selector: 'app-relations-modal-container',
  templateUrl: './relations-modal-container.component.html',
  styleUrls: ['./relations-modal-container.component.css']
})
export class RelationsModalContainerComponent implements OnInit, OnDestroy {

  @Output()
  relationDeleted: EventEmitter<Relation> = new EventEmitter<Relation>();

  destroy = new Subject<any>();

  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private relationService: RelationService) {
    route.params.pipe(takeUntil(this.destroy)).subscribe(params => {
      this.playRelation(params.id);
    });

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }


  playRelation(id: string) {
    this.relationService.get(id).subscribe(relation => {
        if (relation !== null) {
          relation.user.meta.avatar = prepareImage(relation.user.meta.avatar);
          relation.image = prepareImage(relation.image);
          relation.created = addCorrectTime(relation.created);
          const dialogRef = this.dialog.open(RelationDetailComponent, {
            panelClass: 'custom-dialog-container',
            data: {mode: DialogMode.WATCH, relation}
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
