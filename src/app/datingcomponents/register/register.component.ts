import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../models';
import { CustomValidators } from '../../validators/custom.validators';
import { LocalStorageService } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';

interface FieldError {
    [key: string]: string | null;
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    submitted: boolean = false;
    isSubmitting: boolean = false;
    errors: FieldError = {};
    touched: { [key: string]: boolean } = {
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false
    };
    successMessage: string = '';
    showSuccessAlert: boolean = false;
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;

    constructor(
        private fb: FormBuilder,
        private localStorageService: LocalStorageService,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group(
            {
                firstName: [
                    '',
                    [
                        Validators.required,
                        CustomValidators.noWhitespace(),
                        CustomValidators.validName()
                    ]
                ],
                lastName: [
                    '',
                    [
                        Validators.required,
                        CustomValidators.noWhitespace(),
                        CustomValidators.validName()
                    ]
                ],
                email: [
                    '',
                    [
                        Validators.required,
                        Validators.email,
                        CustomValidators.validEmail()
                    ]
                ],
                password: [
                    '',
                    [
                        Validators.required,
                        CustomValidators.passwordStrength()
                    ]
                ],
                confirmPassword: [
                    '',
                    [Validators.required]
                ]
            },
            {
                validators: CustomValidators.passwordMatch()
            }
        );
    }

    ngOnInit(): void {
        this.clearErrors();
    }

    /**
     * Validate first name field
     */
    validateFirstName(): void {
        this.touched['firstName'] = true;
        this.errors['firstName'] = null;
        const control = this.registerForm.get('firstName');

        if (!control?.value?.trim()) {
            this.errors['firstName'] = 'First name is required';
        } else if (control?.hasError('invalidName')) {
            this.errors['firstName'] = 'First name must contain only letters, spaces, hyphens, and apostrophes';
        } else if (control?.hasError('whitespace')) {
            this.errors['firstName'] = 'First name cannot be only whitespace';
        }
    }

    /**
     * Validate last name field
     */
    validateLastName(): void {
        this.touched['lastName'] = true;
        this.errors['lastName'] = null;
        const control = this.registerForm.get('lastName');

        if (!control?.value?.trim()) {
            this.errors['lastName'] = 'Last name is required';
        } else if (control?.hasError('invalidName')) {
            this.errors['lastName'] = 'Last name must contain only letters, spaces, hyphens, and apostrophes';
        } else if (control?.hasError('whitespace')) {
            this.errors['lastName'] = 'Last name cannot be only whitespace';
        }
    }

    /**
     * Validate email field
     */
    validateEmail(): void {
        this.touched['email'] = true;
        this.errors['email'] = null;
        const control = this.registerForm.get('email');

        if (!control?.value?.trim()) {
            this.errors['email'] = 'Email is required';
        } else if (control?.hasError('email') || control?.hasError('invalidEmail')) {
            this.errors['email'] = 'Please enter a valid email address (e.g., user@example.com)';
        }
    }

    /**
     * Validate password field
     */
    validatePassword(): void {
        this.touched['password'] = true;
        this.errors['password'] = null;
        const control = this.registerForm.get('password');

        if (!control?.value) {
            this.errors['password'] = 'Password is required';
        } else if (control?.hasError('passwordTooShort')) {
            this.errors['password'] = 'Password must be at least 6 characters long';
        } else if (control?.hasError('passwordTooLong')) {
            this.errors['password'] = 'Password cannot exceed 50 characters';
        }

        // Also validate confirm password when password changes
        if (this.touched['confirmPassword']) {
            this.validateConfirmPassword();
        }
    }

    /**
     * Validate confirm password field
     */
    validateConfirmPassword(): void {
        this.touched['confirmPassword'] = true;
        this.errors['confirmPassword'] = null;
        const control = this.registerForm.get('confirmPassword');

        if (!control?.value) {
            this.errors['confirmPassword'] = 'Please confirm your password';
        } else if (this.registerForm?.hasError('passwordMismatch')) {
            this.errors['confirmPassword'] = 'Passwords do not match';
        }
    }

    /**
     * Handle field blur event
     */
    onFieldBlur(field: string): void {
        switch (field) {
            case 'firstName':
                this.validateFirstName();
                break;
            case 'lastName':
                this.validateLastName();
                break;
            case 'email':
                this.validateEmail();
                break;
            case 'password':
                this.validatePassword();
                break;
            case 'confirmPassword':
                this.validateConfirmPassword();
                break;
        }
    }

    /**
     * Handle field change event
     */
    onFieldChange(field: string): void {
        if (this.touched[field]) {
            this.onFieldBlur(field);
        }
    }

    /**
     * Check if all form fields are valid
     */
    isFormValid(): boolean {
        return this.registerForm.valid && !this.registerForm.hasError('passwordMismatch');
    }

    /**
     * Clear all errors
     */
    clearErrors(): void {
        this.errors = {};
    }

    /**
     * Toggle password visibility
     */
    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    /**
     * Toggle confirm password visibility
     */
    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    /**
     * Validate entire form
     */
    validateForm(): boolean {
        this.validateFirstName();
        this.validateLastName();
        this.validateEmail();
        this.validatePassword();
        this.validateConfirmPassword();
        return this.isFormValid();
    }

    /**
     * Handle form submission
     */
    onSubmit(): void {
        this.submitted = true;
        this.showSuccessAlert = false;
        this.clearErrors();

        if (!this.validateForm()) {
            return;
        }

        this.isSubmitting = true;

        const registerData: RegisterRequest = {
            firstName: this.registerForm.get('firstName')?.value.trim(),
            lastName: this.registerForm.get('lastName')?.value.trim(),
            email: this.registerForm.get('email')?.value.trim().toLowerCase(),
            password: this.registerForm.get('password')?.value,
            confirmPassword: this.registerForm.get('confirmPassword')?.value
        };

        this.authService.register(registerData).subscribe(
            (response) => {
                this.isSubmitting = false;
                this.successMessage = response.message || 'Registration successful! Please login with your credentials.';
                this.showSuccessAlert = true;

                // Reset form
                this.resetForm();

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 3000);
            },
            (error) => {
                this.isSubmitting = false;
                console.error('Registration error:', error);
                this.errors['form'] = error.message || 'Registration failed. Please try again.';
            }
        );
    }

    /**
     * Reset form to initial state
     */
    resetForm(): void {
        this.registerForm.reset();
        this.submitted = false;
        this.touched = {
            firstName: false,
            lastName: false,
            email: false,
            password: false,
            confirmPassword: false
        };
        this.clearErrors();
        this.showPassword = false;
        this.showConfirmPassword = false;
    }

    /**
     * Close alert
     */
    closeAlert(type: string): void {
        if (type === 'success') {
            this.showSuccessAlert = false;
        } else if (type === 'error') {
            this.errors['form'] = null;
        }
    }

    /**
     * Navigate to login
     */
    goToLogin(): void {
        this.router.navigate(['/login']);
    }
}

