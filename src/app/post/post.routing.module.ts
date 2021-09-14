import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/guards/auth.guard";
import { PostAddComponent } from "./add/add.component";
import { PostDetailComponent } from "./detail/detail.component";
import { PostEditComponent } from "./edit/edit.component";


const appRoutes: Routes = [
    {
        path: 'post/:id',
        component: PostDetailComponent
    },
    {
        path: 'add',
        component: PostAddComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'edit/:id',
        component: PostEditComponent,
        canActivate: [AuthGuard]
    }
];


@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [RouterModule]
})

export class PostRoutingModule { }