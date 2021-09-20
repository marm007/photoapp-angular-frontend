import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BluredImageModule } from '../blured-image/blured-image.module';
import { RelationDetailComponent } from './detail/detail.component';
import { RelationModalComponent } from './modal/modal.component';
import { RelationOptionsComponent } from './options/options.component';



@NgModule({
  declarations: [RelationDetailComponent, RelationModalComponent, RelationOptionsComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressBarModule,
    BluredImageModule,
  ]
})
export class RelationModule { }
