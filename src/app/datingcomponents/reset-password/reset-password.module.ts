import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';

@NgModule({
    declarations: [
        ResetPasswordComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ResetPasswordRoutingModule
    ]
})
export class ResetPasswordModule { }
