import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../../models';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    userProfile: UserProfile | null = null;

    constructor() { }

    ngOnInit(): void {
        this.loadUserProfile();
    }

    loadUserProfile(): void {
        // TODO: Implement profile loading from service
        // this.userProfile = this.profileService.getUserProfile();
    }

    updateProfile(profile: UserProfile): void {
        // TODO: Implement profile update through service
        this.userProfile = profile;
    }

}
