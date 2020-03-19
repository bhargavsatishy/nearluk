import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FormsModule } from "@angular/forms";
import { KeyFilterModule } from 'primeng/keyfilter';


@NgModule({
  declarations: [LoginComponent, ForgotPasswordComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,DialogModule,FormsModule,KeyFilterModule
  ],
  exports: [LoginComponent,ForgotPasswordComponent,ChangePasswordComponent]
})
export class LoginModule { }
