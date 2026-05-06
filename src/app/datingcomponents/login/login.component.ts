import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginRequest } from '../../models';

interface ValidationError {
    [key: string]: string | null;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    @ViewChild('loginForm') loginForm: NgForm | undefined;

    email: string = '';
    password: string = '';
    submitted: boolean = false;
    isSubmitting: boolean = false;
    errors: ValidationError = {};
    touched: { [key: string]: boolean } = { email: false, password: false };

    // Validation patterns
    private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private readonly minPasswordLength = 6;
    private readonly maxPasswordLength = 50;

    constructor() { }

    ngOnInit(): void {
        this.clearErrors();
    }

    // Email validation
    isValidEmail(email: string): boolean {
        if (!email) return false;
        return this.emailPattern.test(email);
    }

    // Password validation
    isValidPassword(password: string): boolean {
        if (!password) return false;
        return password.length >= this.minPasswordLength && password.length <= this.maxPasswordLength;
    }

    // Check if form is valid
    isFormValid(): boolean {
        return this.email.trim() !== '' &&
            this.isValidEmail(this.email) &&
            this.password !== '' &&
            this.isValidPassword(this.password);
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

    // Validate password field
    validatePassword(): void {
        this.touched['password'] = true;
        this.errors['password'] = null;

        if (!this.password) {
            this.errors['password'] = 'Password is required';
        } else if (this.password.length < this.minPasswordLength) {
            this.errors['password'] = `Password must be at least ${this.minPasswordLength} characters`;
        } else if (this.password.length > this.maxPasswordLength) {
            this.errors['password'] = `Password cannot exceed ${this.maxPasswordLength} characters`;
        }
    }

    // Validate entire form
    validateForm(): boolean {
        this.validateEmail();
        this.validatePassword();
        return this.isFormValid();
    }

    // Clear all errors
    clearErrors(): void {
        this.errors = {};
    }

    // Reset form
    resetForm(): void {
        this.email = '';
        this.password = '';
        this.submitted = false;
        this.isSubmitting = false;
        this.touched = { email: false, password: false };
        this.clearErrors();
        this.loginForm?.resetForm();
    }

    // Handle blur event
    onFieldBlur(field: string): void {
        if (field === 'email') {
            this.validateEmail();
        } else if (field === 'password') {
            this.validatePassword();
        }
    }

    // Handle form submission
    onSubmit(): void {
        this.submitted = true;

        if (!this.validateForm()) {
            return;
        }

        this.isSubmitting = true;
        const loginData: LoginRequest = {
            email: this.email.trim(),
            password: this.password
        };

        console.log('Login form submitted', loginData);
        // TODO: Call authentication service to submit login
        // this.authService.login(loginData).subscribe(
        //     (response) => {
        //         console.log('Login successful', response);
        //         this.resetForm();
        //         // Navigate to dashboard
        //     },
        //     (error) => {
        //         this.isSubmitting = false;
        //         this.errors['form'] = error.message || 'Login failed. Please try again.';
        //     }
        // );

        // Simulate API response
        setTimeout(() => {
            this.isSubmitting = false;
            alert('Login form validated successfully!');
        }, 1500);
    }

}
