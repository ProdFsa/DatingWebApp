import { Component, OnInit } from '@angular/core';
import { Message, Conversation, CreateMessageRequest } from '../../models';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
    conversations: Conversation[] = [];
    messages: Message[] = [];
    selectedConversation: Conversation | null = null;
    newMessage: string = '';
    isLoadingConversations: boolean = false;
    isLoadingMessages: boolean = false;
    isSending: boolean = false;
    errorMessage: string = '';

    constructor(private messageService: MessageService) { }

    ngOnInit(): void {
        this.loadConversations();
    }

    loadConversations(): void {
        this.isLoadingConversations = true;
        this.errorMessage = '';
        this.messageService.getConversations().subscribe(
            (conversations) => {
                this.conversations = conversations;
                this.isLoadingConversations = false;
            },
            (error) => {
                console.error('Error loading conversations:', error);
                this.isLoadingConversations = false;
                this.errorMessage = 'Failed to load conversations.';
                // For demo purposes, show mock data
                this.conversations = this.getMockConversations();
            }
        );
    }

    selectConversation(conversation: Conversation): void {
        this.selectedConversation = conversation;
        this.loadMessages(conversation.id);
    }

    loadMessages(conversationId: string): void {
        this.isLoadingMessages = true;
        this.messageService.getMessages(conversationId).subscribe(
            (messages) => {
                this.messages = messages;
                this.isLoadingMessages = false;
                // Mark as read
                this.messageService.markAsRead(conversationId).subscribe();
            },
            (error) => {
                console.error('Error loading messages:', error);
                this.isLoadingMessages = false;
                // For demo purposes, show mock messages
                this.messages = this.getMockMessages();
            }
        );
    }

    sendMessage(): void {
        if (!this.selectedConversation || !this.newMessage.trim()) {
            return;
        }

        this.isSending = true;
        const messageRequest: CreateMessageRequest = {
            conversationId: this.selectedConversation.id,
            content: this.newMessage.trim()
        };

        this.messageService.sendMessage(messageRequest).subscribe(
            (message) => {
                this.messages.push(message);
                this.newMessage = '';
                this.isSending = false;
            },
            (error) => {
                console.error('Error sending message:', error);
                this.isSending = false;
                this.errorMessage = 'Failed to send message. Please try again.';
            }
        );
    }

    onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    getParticipantName(conversation: Conversation): string {
        const participant = conversation.participants.find(p => p.id !== 'current');
        return participant?.name || 'Unknown';
    }

    private getMockConversations(): Conversation[] {
        return [
            {
                id: '1',
                participants: [
                    { id: 'current', name: 'You' },
                    { id: 'user1', name: 'Sarah Johnson' }
                ],
                lastMessage: {
                    id: 'msg1',
                    conversationId: '1',
                    senderId: 'user1',
                    content: 'Hey! How are you doing?',
                    timestamp: new Date(Date.now() - 3600000),
                    isRead: false
                },
                unreadCount: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                participants: [
                    { id: 'current', name: 'You' },
                    { id: 'user2', name: 'Mike Chen' }
                ],
                lastMessage: {
                    id: 'msg2',
                    conversationId: '2',
                    senderId: 'current',
                    content: 'That sounds great! Let\'s meet up.',
                    timestamp: new Date(Date.now() - 7200000),
                    isRead: true
                },
                unreadCount: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
    }

    private getMockMessages(): Message[] {
        return [
            {
                id: 'msg1',
                conversationId: this.selectedConversation?.id || '1',
                senderId: 'user1',
                content: 'Hi there! I saw we matched. How are you?',
                timestamp: new Date(Date.now() - 7200000),
                isRead: true
            },
            {
                id: 'msg2',
                conversationId: this.selectedConversation?.id || '1',
                senderId: 'current',
                content: 'Hey Sarah! I\'m doing great, thanks for asking. How about you?',
                timestamp: new Date(Date.now() - 3600000),
                isRead: true
            },
            {
                id: 'msg3',
                conversationId: this.selectedConversation?.id || '1',
                senderId: 'user1',
                content: 'I\'m good too! I love your profile picture. What do you do for fun?',
                timestamp: new Date(Date.now() - 1800000),
                isRead: false
            }
        ];
    }
}
