import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ActivateUserComponent } from "./components/activate-user/activate-user.component";
import { ForgotComponent } from "./components/forgot-password/forgot-password.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { ResetComponent } from "./components/reset-password/reset-password.component";


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
        path: 'activate/:token',
        component: ActivateUserComponent
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }