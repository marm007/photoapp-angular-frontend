import { BrowserModule } from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PostsComponent } from './components/posts/posts.component';
import { RelationsComponent } from './components/relations/relations.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { TruncateModule } from '@yellowspot/ng-truncate';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import {DeviceDetectorModule, DeviceDetectorService} from 'ngx-device-detector';
import {MatMenuModule} from '@angular/material/menu';
import { LoginComponent } from './components/login/login.component';
import {MatDialogModule} from '@angular/material/dialog';
import { RegisterComponent } from './components/register/register.component';
import {RouterModule, Routes} from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import {AuthGuard, AuthInterceptor, AuthService} from './services/auth/auth.service';
import { ForgotComponent } from './components/forgot/forgot.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SinglePostComponent } from './components/single-post/single-post.component';
import { SingleRelationComponent } from './components/single-relation/single-relation.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { OptionsComponent } from './components/options/options.component';
import { ResetComponent } from './components/reset/reset.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
  {
    path: 'forgot',
    component: ForgotComponent
  },
  {
    path: 'reset/:token',
    component: ResetComponent
  },
  {
    path: 'profile/:id',
    component: ProfileComponent
  },
  {
    path: 'post/:id',
    component: SinglePostComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'add',
    component: AddPostComponent,
    canActivate: [AuthGuard]
  },
  { path: 'not-found',
    component: PageNotFoundComponent
  },
  { path: '',
    component: HomepageComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    RelationsComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    ProfileComponent,
    HomepageComponent,
    AddPostComponent,
    ForgotComponent,
    SinglePostComponent,
    SingleRelationComponent,
    OptionsComponent,
    ResetComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      /*{ enableTracing: true } // <-- debugging purposes only*/
    ),
    BrowserModule,
    TruncateModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule.withConfig({
      useColumnBasisZero: false,
      printWithBreakpoints: ['md', 'lt-lg', 'lt-xl', 'gt-sm', 'gt-xs']
    }),
    ScrollingModule,
    MatInputModule,
    FormsModule,
    DeviceDetectorModule.forRoot(),
    MatMenuModule,
    MatDialogModule,
    FontAwesomeModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    MatAutocompleteModule,
    MatExpansionModule,
    NgbCollapseModule
  ],
  providers: [ AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

}
