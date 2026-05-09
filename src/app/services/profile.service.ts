import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private readonly apiUrl = environment.apiUrl + '/profile'; // Use environment API URL

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    /**
     * Get user profile
     */
    getUserProfile(): Observable<UserProfile> {
        const headers = this.getAuthHeaders();
        return this.http.get<UserProfile>(`${this.apiUrl}`, { headers });
    }

    /**
     * Update user profile
     */
    updateUserProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
        const headers = this.getAuthHeaders();
        return this.http.put<UserProfile>(`${this.apiUrl}`, profile, { headers });
    }

    /**
     * Upload profile photo
     */
    uploadProfilePhoto(file: File): Observable<{ photoUrl: string }> {
        const headers = this.getAuthHeaders();
        const formData = new FormData();
        formData.append('photo', file);

        return this.http.post<{ photoUrl: string }>(`${this.apiUrl}/photo`, formData, { headers });
    }

    /**
     * Delete profile photo
     */
    deleteProfilePhoto(photoUrl: string): Observable<void> {
        const headers = this.getAuthHeaders();
        return this.http.delete<void>(`${this.apiUrl}/photo`, {
            headers,
            body: { photoUrl }
        });
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