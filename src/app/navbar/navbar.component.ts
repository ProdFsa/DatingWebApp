import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
    isAuthenticated: boolean = false;
    currentUser: any = null;
    private authSubscription: Subscription = new Subscription();

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authSubscription = this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
            this.isAuthenticated = this.authService.isAuthenticated();
        });
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
