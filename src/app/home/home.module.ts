import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PostModule } from '../post/post.module';
import { RelationModule } from '../relation/relation.module';
import { HomepageComponent } from './home.component';
import { HomeRoutingModule } from './home.routing.module';
import { PostsComponent } from './posts/posts.component';
import { RelationsComponent } from './relations/relations.component';


@NgModule({
  declarations: [
    HomepageComponent,
    PostsComponent,
    RelationsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    InfiniteScrollModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule,
    ScrollingModule,
    PostModule,
    RelationModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
