import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth.model';
import { ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse } from '../models/forgot-password.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = 'https://api.example.com/api/auth'; // Replace with your actual API URL

    constructor(private http: HttpClient) { }

    /**
     * Login user with email and password
     */
    login(request: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
    }

    /**
     * Register a new user
     */
    register(request: RegisterRequest): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, request);
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
