import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ForgotPasswordRequest } from '../../models/forgot-password.model';

interface ValidationError {
    [key: string]: string | null;
}

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
    email: string = '';
    submitted: boolean = false;
    isSubmitting: boolean = false;
    errors: ValidationError = {};
    touched: { [key: string]: boolean } = { email: false };
    successMessage: string = '';
    showSuccessAlert: boolean = false;

    private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.clearErrors();
    }

    // Email validation
    isValidEmail(email: string): boolean {
        if (!email) return false;
        return this.emailPattern.test(email);
    }

    // Validate email field
    validateEmail(): void {
        this.touched['email'] = true;
        this.errors['email'] = null;

        if (!this.email.trim()) {
            this.errors['email'] = 'Email is required';
        } else if (!this.isValidEmail(this.email)) {
            this.errors['email'] = 'Please enter a valid email format (e.g., user@example.com)';
        }
    }

    // Check if form is valid
    isFormValid(): boolean {
        return this.email.trim() !== '' &&
            this.isValidEmail(this.email);
    }

    // Clear all errors
    clearErrors(): void {
        this.errors = {};
    }

    // Handle field blur
    onFieldBlur(field: string): void {
        if (field === 'email') {
            this.validateEmail();
        }
    }

    // Handle form submission
    onSubmit(): void {
        this.submitted = true;
        this.showSuccessAlert = false;

        if (!this.validateForm()) {
            return;
        }

        this.isSubmitting = true;
        const request: ForgotPasswordRequest = { email: this.email.trim() };

        this.authService.forgotPassword(request).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.successMessage = response.message ||
                    'Password reset link has been sent to your email. Please check your inbox.';
                this.showSuccessAlert = true;
                this.resetForm();
                // Optionally redirect to login after a delay
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 5000);
            },
            error: (error) => {
                this.isSubmitting = false;
                const errorMessage = error?.error?.message ||
                    error?.error?.error ||
                    'An error occurred. Please try again.';
                this.errors['form'] = errorMessage;
            }
        });
    }

    // Validate entire form
    validateForm(): boolean {
        this.validateEmail();
        return this.isFormValid();
    }

    // Reset form
    resetForm(): void {
        this.email = '';
        this.submitted = false;
        this.touched = { email: false };
        this.clearErrors();
    }

    // Close alert
    closeAlert(type: string): void {
        if (type === 'success') {
            this.showSuccessAlert = false;
        } else if (type === 'error') {
            this.errors['form'] = null;
        }
    }

    // Navigate back to login
    goToLogin(): void {
        this.router.navigate(['/login']);
    }
}
