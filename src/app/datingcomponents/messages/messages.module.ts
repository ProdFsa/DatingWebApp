import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages.component';
import { MessagesRoutingModule } from './messages-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        MessagesComponent
    ],
    imports: [
        CommonModule,
        MessagesRoutingModule,
        FormsModule
    ]
})
export class MessagesModule { }
