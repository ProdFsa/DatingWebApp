import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfile } from '../../models';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    userProfile!: UserProfile
    profileForm: FormGroup;
    isEditing: boolean = false;
    isLoading: boolean = false;
    isSaving: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService,
        private authService: AuthService
    ) {
        this.profileForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
            bio: ['', [Validators.maxLength(500)]],
            interests: ['']
        });
    }

    ngOnInit(): void {
        this.loadUserProfile();
    }

    loadUserProfile(): void {
        this.isLoading = true;
        this.profileService.getUserProfile().subscribe(
            (profile) => {
                this.userProfile = profile;
                this.populateForm(profile);
                this.isLoading = false;
            },
            (error) => {
                console.error('Error loading profile:', error);
                this.isLoading = false;
                // For demo purposes, create a mock profile
                this.userProfile = this.getMockProfile();
                this.populateForm(this.userProfile);
            }
        );
    }

    populateForm(profile: UserProfile): void {
        this.profileForm.patchValue({
            firstName: profile.firstName,
            lastName: profile.lastName,
            age: profile.age,
            bio: profile.bio,
            interests: profile.preferences?.interests?.join(', ') || ''
        });
    }

    toggleEdit(): void {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            this.populateForm(this.userProfile!);
            this.clearMessages();
        }
    }

    saveProfile(): void {
        if (this.profileForm.invalid) {
            this.markFormGroupTouched();
            return;
        }

        this.isSaving = true;
        this.clearMessages();

        const formValue = this.profileForm.value;
        const updatedProfile: Partial<UserProfile> = {
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            age: formValue.age,
            bio: formValue.bio,
            preferences: {
                ...this.userProfile?.preferences,
                interests: formValue.interests ? formValue.interests.split(',').map((i: string) => i.trim()) : []
            }
        };

        this.profileService.updateUserProfile(updatedProfile).subscribe(
            (profile) => {
                this.userProfile = profile;
                this.isEditing = false;
                this.isSaving = false;
                this.successMessage = 'Profile updated successfully!';
                setTimeout(() => this.clearMessages(), 3000);
            },
            (error) => {
                console.error('Error updating profile:', error);
                this.isSaving = false;
                this.errorMessage = 'Failed to update profile. Please try again.';
            }
        );
    }

    private markFormGroupTouched(): void {
        Object.keys(this.profileForm.controls).forEach(key => {
            const control = this.profileForm.get(key);
            control?.markAsTouched();
        });
    }

    clearMessages(): void {
        this.successMessage = '';
        this.errorMessage = '';
    }

    private getMockProfile(): UserProfile {
        const currentUser = this.authService.getCurrentUser();
        return {
            id: currentUser?.id || '1',
            firstName: currentUser?.firstName || 'John',
            lastName: currentUser?.lastName || 'Doe',
            email: currentUser?.email || 'john.doe@example.com',
            age: 30,
            bio: 'I love meeting new people and exploring new places. Looking for someone to share adventures with!',
            avatar: 'https://via.placeholder.com/150',
            photos: ['https://via.placeholder.com/300'],
            preferences: {
                minAge: 25,
                maxAge: 35,
                interests: ['Travel', 'Music', 'Sports', 'Cooking']
            },
            createdAt: new Date()
        };
    }
}
