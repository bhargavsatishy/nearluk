import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthenticateService as AuthGuard } from '../services/authenticate.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login/forgotpassword', component: ForgotPasswordComponent },
  { path: 'changepassword/:id', component: ChangePasswordComponent,canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ],
})
export class LoginRoutingModule { }
