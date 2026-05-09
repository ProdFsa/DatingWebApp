export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    age?: number;
    avatar?: string;
    bio?: string;
    createdAt?: Date;
}

export interface UserProfile extends User {
    photos?: string[];
    preferences?: UserPreferences;
}

export interface UserPreferences {
    minAge?: number;
    maxAge?: number;
    interests?: string[];
    location?: string;
}
