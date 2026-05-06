export interface Match {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    age?: number;
    avatar?: string;
    bio?: string;
    interests?: string[];
    matchedDate: Date;
    isLiked?: boolean;
}

export interface MatchResponse {
    id: string;
    userId: string;
    actionType: 'like' | 'pass';
    timestamp: Date;
}
