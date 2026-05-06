export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
}

export interface Conversation {
    id: string;
    participants: ConversationParticipant[];
    lastMessage?: Message;
    lastMessageTime?: Date;
    isActive: boolean;
}

export interface ConversationParticipant {
    userId: string;
    firstName: string;
    lastName: string;
    avatar?: string;
}

export interface CreateMessageRequest {
    conversationId: string;
    content: string;
}
