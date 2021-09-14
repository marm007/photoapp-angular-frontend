import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { PostAddComponent } from './add/add.component';
import { PostDetailComponent } from './detail/detail.component';
import { PostEditComponent } from './edit/edit.component';
import { PostRoutingModule } from './post.routing.module';


@NgModule({
  declarations: [PostDetailComponent, PostEditComponent, PostAddComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatCardModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    TruncateModule,
    PostRoutingModule
  ],
  exports: [PostDetailComponent, PostEditComponent, PostAddComponent]
})
export class PostModule { }
