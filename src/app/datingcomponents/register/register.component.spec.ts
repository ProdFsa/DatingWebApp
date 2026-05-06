import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { LocalStorageService } from '../../services/local-storage.service';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let localStorageService: LocalStorageService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RegisterComponent],
            imports: [
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule
            ],
            providers: [LocalStorageService]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        localStorageService = TestBed.inject(LocalStorageService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
        expect(component.registerForm.get('firstName')?.value).toBe('');
        expect(component.registerForm.get('lastName')?.value).toBe('');
        expect(component.registerForm.get('email')?.value).toBe('');
        expect(component.registerForm.get('password')?.value).toBe('');
        expect(component.registerForm.get('confirmPassword')?.value).toBe('');
    });

    it('should validate first name field', () => {
        component.validateFirstName();
        expect(component.errors['firstName']).toBeTruthy();
    });

    it('should validate email field', () => {
        component.validateEmail();
        expect(component.errors['email']).toBeTruthy();
    });

    it('should validate password field', () => {
        component.validatePassword();
        expect(component.errors['password']).toBeTruthy();
    });

    it('should toggle password visibility', () => {
        expect(component.showPassword).toBeFalsy();
        component.togglePasswordVisibility();
        expect(component.showPassword).toBeTruthy();
        component.togglePasswordVisibility();
        expect(component.showPassword).toBeFalsy();
    });

    it('should toggle confirm password visibility', () => {
        expect(component.showConfirmPassword).toBeFalsy();
        component.toggleConfirmPasswordVisibility();
        expect(component.showConfirmPassword).toBeTruthy();
        component.toggleConfirmPasswordVisibility();
        expect(component.showConfirmPassword).toBeFalsy();
    });

    it('should validate matching passwords', () => {
        component.registerForm.get('password')?.setValue('password123');
        component.registerForm.get('confirmPassword')?.setValue('password123');
        expect(component.registerForm.hasError('passwordMismatch')).toBeFalsy();
    });

    it('should detect mismatched passwords', () => {
        component.registerForm.get('password')?.setValue('password123');
        component.registerForm.get('confirmPassword')?.setValue('password456');
        expect(component.registerForm.hasError('passwordMismatch')).toBeTruthy();
    });
});
