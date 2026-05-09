export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
}

export interface Conversation {
    id: string;
    participants: Participant[];
    lastMessage?: Message;
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Participant {
    id: string;
    name: string;
}

export interface CreateMessageRequest {
    conversationId: string;
    content: string;
}
