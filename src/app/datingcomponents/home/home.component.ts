import { Component, OnInit } from '@angular/core';
import { User } from '../../models';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    currentUser: User | null = null;

    constructor() { }

    ngOnInit(): void {
        this.loadCurrentUser();
    }

    loadCurrentUser(): void {
        // TODO: Implement current user loading from service
        // this.currentUser = this.authService.getCurrentUser();
    }

}
