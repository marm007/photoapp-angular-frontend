import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelationDetailComponent } from './detail/detail.component';
import { RelationModalComponent } from './modal/modal.component';
import { RelationOptionsComponent } from './options/options.component';
import { RelationRoutingModule } from './relation.routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatProgressBarModule } from '@angular/material/progress-bar';



@NgModule({
  declarations: [RelationDetailComponent, RelationModalComponent, RelationOptionsComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressBarModule,
    RelationRoutingModule,
  ]
})
export class RelationModule { }
