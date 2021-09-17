import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RelationModalComponent } from "../relation/modal/modal.component";
import { HomepageComponent } from "./home.component";

const appRoutes: Routes = [
    {
        path: '',
        component: HomepageComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'relations/:id',
                component: RelationModalComponent,
                canActivate: [AuthGuard],
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }