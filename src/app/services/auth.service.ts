import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth.model';
import { ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse } from '../models/forgot-password.model';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = environment.apiUrl + '/auth'; // Use environment API URL
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'current_user';

    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService
    ) {
        this.loadStoredAuth();
    }

    /**
     * Load stored authentication data on service initialization
     */
    private loadStoredAuth(): void {
        const token = this.localStorageService.getItem(this.TOKEN_KEY);
        const user = this.localStorageService.getItem(this.USER_KEY);

        if (token && user) {
            this.currentUserSubject.next(user);
        }
    }

    /**
     * Login user with email and password
     */
    login(request: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => {
                this.setAuthData(response.token, response.user);
            })
        );
    }

    /**
     * Register a new user
     */
    register(request: RegisterRequest): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, request).pipe(
            tap(response => {
                // Note: Registration typically doesn't auto-login
                // You might want to redirect to login page after successful registration
            })
        );
    }

    /**
     * Logout current user
     */
    logout(): void {
        this.localStorageService.removeItem(this.TOKEN_KEY);
        this.localStorageService.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const token = this.localStorageService.getItem(this.TOKEN_KEY);
        const user = this.localStorageService.getItem(this.USER_KEY);
        return !!(token && user);
    }

    /**
     * Get current user
     */
    getCurrentUser(): any {
        return this.currentUserSubject.value;
    }

    /**
     * Get authentication token
     */
    getToken(): string | null {
        return this.localStorageService.getItem(this.TOKEN_KEY);
    }

    /**
     * Set authentication data after successful login
     */
    private setAuthData(token: string, user: any): void {
        this.localStorageService.setItem(this.TOKEN_KEY, token);
        this.localStorageService.setItem(this.USER_KEY, user);
        this.currentUserSubject.next(user);
    }

    /**
     * Send password reset email
     */
    forgotPassword(request: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
        return this.http.post<ForgotPasswordResponse>(`${this.apiUrl}/forgot-password`, request);
    }

    /**
     * Reset password with token
     */
    resetPassword(request: ResetPasswordRequest): Observable<ResetPasswordResponse> {
        return this.http.post<ResetPasswordResponse>(`${this.apiUrl}/reset-password`, request);
    }

    /**
     * Verify if reset token is valid
     */
    verifyResetToken(token: string): Observable<{ valid: boolean; email?: string }> {
        return this.http.get<{ valid: boolean; email?: string }>(`${this.apiUrl}/verify-reset-token/${token}`);
    }
}
