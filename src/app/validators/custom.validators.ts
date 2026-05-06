import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validators for registration forms
 */
export class CustomValidators {
    /**
     * Validator for password strength requirements
     * - Minimum 6 characters
     * - Maximum 50 characters
     */
    static passwordStrength(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null; // Don't validate empty values
            }

            const password = control.value;

            if (password.length < 6) {
                return { passwordTooShort: { requiredLength: 6, actualLength: password.length } };
            }

            if (password.length > 50) {
                return { passwordTooLong: { requiredLength: 50, actualLength: password.length } };
            }

            return null;
        };
    }

    /**
     * Validator to ensure password and confirmPassword match
     * Applied at FormGroup level
     */
    static passwordMatch(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.get('password')?.value;
            const confirmPassword = control.get('confirmPassword')?.value;

            if (!password || !confirmPassword) {
                return null; // Don't validate if either field is empty
            }

            if (password !== confirmPassword) {
                control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
                return { passwordMismatch: true };
            } else {
                // Clear the error if passwords match
                const errors = control.get('confirmPassword')?.errors;
                if (errors) {
                    delete errors['passwordMismatch'];
                    const hasOtherErrors = Object.keys(errors).length > 0;
                    if (!hasOtherErrors) {
                        control.get('confirmPassword')?.setErrors(null);
                    }
                }
            }

            return null;
        };
    }

    /**
     * Validator for email format
     */
    static validEmail(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(control.value)) {
                return { invalidEmail: true };
            }

            return null;
        };
    }

    /**
     * Validator for name fields (first name, last name)
     * Only letters, spaces, and hyphens allowed
     * Minimum 2 characters
     */
    static validName(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const namePattern = /^[a-zA-Z\s\-']{2,}$/;
            if (!namePattern.test(control.value)) {
                return { invalidName: true };
            }

            return null;
        };
    }

    /**
     * Validator to ensure field doesn't contain only whitespace
     */
    static noWhitespace(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            const isWhitespace = (control.value || '').trim().length === 0;
            return isWhitespace ? { whitespace: true } : null;
        };
    }
}
