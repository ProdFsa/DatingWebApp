export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
    success: boolean;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ResetPasswordResponse {
    message: string;
    success: boolean;
}

export interface PasswordResetToken {
    token: string;
    email: string;
    expiresAt: Date;
}
