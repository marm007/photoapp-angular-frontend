import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotComponent } from './components/forgot-password/forgot-password.component';
import { ActivateUserComponent } from './components/activate-user/activate-user.component';
import { ResetComponent } from './components/reset-password/reset-password.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { AuthRoutingModule } from './auth.routing.module';



@NgModule({
  declarations: [LoginComponent, RegisterComponent, ForgotComponent, ActivateUserComponent, ResetComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatProgressSpinnerModule,
    RecaptchaModule,
    AuthRoutingModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule { }
