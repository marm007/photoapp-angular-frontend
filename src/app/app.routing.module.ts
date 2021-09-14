import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';



const appRoutes: Routes = [
  {
    path: 'not-found',
    component: PageNotFoundComponent
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent
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
