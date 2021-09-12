import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { ActivateUserComponent } from './components/activate-user/activate-user.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { RelationsModalContainerComponent } from './components/relations-modal-container/relations-modal-container.component';
import { ResetComponent } from './components/reset/reset.component';



const appRoutes: Routes = [
  {
    path: 'relations/:id',
    component: RelationsModalContainerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'forgot',
    component: ForgotComponent
  },
  {
    path: 'reset/:token',
    component: ResetComponent
  },
  {
    path: 'activate/:token',
    component: ActivateUserComponent
  },
  {
    path: 'edit/:id',
    component: EditPostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/:id',
    component: ProfileComponent
  },
  {
    path: 'post/:id',
    component: PostDetailComponent
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
  {
    path: 'not-found',
    component: PageNotFoundComponent
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent
  },
  {
    path: '',
    component: HomepageComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      /*{ enableTracing: true } // <-- debugging purposes only*/
    ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
