import { Component, OnInit } from '@angular/core';
import { Message, Conversation, CreateMessageRequest } from '../../models';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
    conversations: Conversation[] = [];
    messages: Message[] = [];
    selectedConversation: Conversation | null = null;

    constructor() { }

    ngOnInit(): void {
        this.loadConversations();
    }

    loadConversations(): void {
        // TODO: Implement conversations loading from service
        // this.conversations = this.messageService.getConversations();
    }

    selectConversation(conversation: Conversation): void {
        this.selectedConversation = conversation;
        this.loadMessages(conversation.id);
    }

    loadMessages(conversationId: string): void {
        // TODO: Implement messages loading from service
        // this.messages = this.messageService.getMessages(conversationId);
    }

    sendMessage(content: string): void {
        if (this.selectedConversation && content.trim()) {
            const messageRequest: CreateMessageRequest = {
                conversationId: this.selectedConversation.id,
                content: content.trim()
            };
            // TODO: Send message through service
            console.log('Message sent:', messageRequest);
        }
    }

}
