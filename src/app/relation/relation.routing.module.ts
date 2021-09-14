import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RelationModalComponent } from './modal/modal.component';

const appRoutes: Routes = [
  {
    path: 'relations/:id',
    component: RelationModalComponent,
    canActivate: [AuthGuard]
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(
      appRoutes,
    ),
  ],
  exports: [RouterModule]
})
export class RelationRoutingModule { }
