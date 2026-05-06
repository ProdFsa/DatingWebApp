import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';

@NgModule({
    declarations: [
        ForgotPasswordComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ForgotPasswordRoutingModule
    ]
})
export class ForgotPasswordModule { }
