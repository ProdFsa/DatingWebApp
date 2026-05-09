export interface Match {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    age?: number;
    avatar?: string;
    bio?: string;
    interests?: string[];
    matchDate: Date;
    compatibility: number;
    isLiked?: boolean;
}

export interface MatchResponse {
    id: string;
    userId: string;
    actionType: 'like' | 'pass';
    timestamp: Date;
}
