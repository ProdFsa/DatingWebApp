import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ResetPasswordRequest } from '../../models/forgot-password.model';

interface ValidationError {
    [key: string]: string | null;
}

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    token: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
    submitted: boolean = false;
    isSubmitting: boolean = false;
    isValidating: boolean = true;
    isTokenValid: boolean = false;
    errors: ValidationError = {};
    touched: { [key: string]: boolean } = {
        newPassword: false,
        confirmPassword: false
    };
    successMessage: string = '';
    showSuccessAlert: boolean = false;
    showPasswordNewPassword: boolean = false;
    showPasswordConfirm: boolean = false;

    private readonly minPasswordLength = 6;
    private readonly maxPasswordLength = 50;

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.clearErrors();
        // Get token from URL query parameter
        this.route.queryParams.subscribe(params => {
            this.token = params['token'] || '';
            if (this.token) {
                this.verifyToken();
            } else {
                this.isValidating = false;
                this.errors['form'] = 'Invalid reset link. Please request a new password reset.';
            }
        });
    }

    // Verify if reset token is valid
    verifyToken(): void {
        this.isValidating = true;
        this.authService.verifyResetToken(this.token).subscribe({
            next: (response) => {
                this.isValidating = false;
                this.isTokenValid = response.valid;
                if (!response.valid) {
                    this.errors['form'] = 'This password reset link has expired or is invalid. Please request a new one.';
                }
            },
            error: (error) => {
                this.isValidating = false;
                this.isTokenValid = false;
                this.errors['form'] = 'This password reset link has expired or is invalid. Please request a new one.';
            }
        });
    }

    // Password validation
    isValidPassword(password: string): boolean {
        if (!password) return false;
        return password.length >= this.minPasswordLength && password.length <= this.maxPasswordLength;
    }

    // Check if passwords match
    doPasswordsMatch(): boolean {
        return this.newPassword === this.confirmPassword;
    }

    // Validate new password field
    validateNewPassword(): void {
        this.touched['newPassword'] = true;
        this.errors['newPassword'] = null;

        if (!this.newPassword) {
            this.errors['newPassword'] = 'New password is required';
        } else if (this.newPassword.length < this.minPasswordLength) {
            this.errors['newPassword'] = `Password must be at least ${this.minPasswordLength} characters`;
        } else if (this.newPassword.length > this.maxPasswordLength) {
            this.errors['newPassword'] = `Password cannot exceed ${this.maxPasswordLength} characters`;
        } else if (this.confirmPassword && !this.doPasswordsMatch()) {
            this.errors['confirmPassword'] = 'Passwords do not match';
        } else {
            this.errors['confirmPassword'] = null;
        }
    }

    // Validate confirm password field
    validateConfirmPassword(): void {
        this.touched['confirmPassword'] = true;
        this.errors['confirmPassword'] = null;

        if (!this.confirmPassword) {
            this.errors['confirmPassword'] = 'Please confirm your password';
        } else if (!this.doPasswordsMatch()) {
            this.errors['confirmPassword'] = 'Passwords do not match';
        }
    }

    // Validate entire form
    validateForm(): boolean {
        this.validateNewPassword();
        this.validateConfirmPassword();
        return this.isFormValid();
    }

    // Check if form is valid
    isFormValid(): boolean {
        return this.newPassword.trim() !== '' &&
            this.confirmPassword.trim() !== '' &&
            this.isValidPassword(this.newPassword) &&
            this.doPasswordsMatch() &&
            !this.errors['newPassword'] &&
            !this.errors['confirmPassword'];
    }

    // Clear all errors
    clearErrors(): void {
        this.errors = {};
    }

    // Handle field blur
    onFieldBlur(field: string): void {
        if (field === 'newPassword') {
            this.validateNewPassword();
        } else if (field === 'confirmPassword') {
            this.validateConfirmPassword();
        }
    }

    // Toggle password visibility
    togglePasswordVisibility(field: string): void {
        if (field === 'newPassword') {
            this.showPasswordNewPassword = !this.showPasswordNewPassword;
        } else if (field === 'confirmPassword') {
            this.showPasswordConfirm = !this.showPasswordConfirm;
        }
    }

    // Handle form submission
    onSubmit(): void {
        if (!this.isTokenValid) {
            this.errors['form'] = 'Invalid or expired token. Please request a new password reset.';
            return;
        }

        this.submitted = true;
        this.showSuccessAlert = false;

        if (!this.validateForm()) {
            return;
        }

        this.isSubmitting = true;
        const request: ResetPasswordRequest = {
            token: this.token,
            newPassword: this.newPassword.trim(),
            confirmPassword: this.confirmPassword.trim()
        };

        this.authService.resetPassword(request).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.successMessage = response.message || 'Your password has been reset successfully!';
                this.showSuccessAlert = true;
                // Redirect to login after delay
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 3000);
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

    // Navigate to forgot password to request new link
    goToForgotPassword(): void {
        this.router.navigate(['/forgot-password']);
    }
}
