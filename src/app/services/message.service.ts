import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, Conversation, CreateMessageRequest } from '../models/message.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private readonly apiUrl = environment.apiUrl + '/messages'; // Use environment API URL

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    /**
     * Get user's conversations
     */
    getConversations(): Observable<Conversation[]> {
        const headers = this.getAuthHeaders();
        return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`, { headers });
    }

    /**
     * Get messages for a conversation
     */
    getMessages(conversationId: string): Observable<Message[]> {
        const headers = this.getAuthHeaders();
        return this.http.get<Message[]>(`${this.apiUrl}/conversations/${conversationId}`, { headers });
    }

    /**
     * Send a message
     */
    sendMessage(message: CreateMessageRequest): Observable<Message> {
        const headers = this.getAuthHeaders();
        return this.http.post<Message>(`${this.apiUrl}`, message, { headers });
    }

    /**
     * Mark messages as read
     */
    markAsRead(conversationId: string): Observable<void> {
        const headers = this.getAuthHeaders();
        return this.http.put<void>(`${this.apiUrl}/conversations/${conversationId}/read`, {}, { headers });
    }

    /**
     * Delete a message
     */
    deleteMessage(messageId: string): Observable<void> {
        const headers = this.getAuthHeaders();
        return this.http.delete<void>(`${this.apiUrl}/${messageId}`, { headers });
    }

    /**
     * Get conversation details
     */
    getConversation(conversationId: string): Observable<Conversation> {
        const headers = this.getAuthHeaders();
        return this.http.get<Conversation>(`${this.apiUrl}/conversations/${conversationId}/details`, { headers });
    }

    /**
     * Get authentication headers
     */
    private getAuthHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }
}