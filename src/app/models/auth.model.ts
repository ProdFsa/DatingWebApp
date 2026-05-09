export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {
    message: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}
