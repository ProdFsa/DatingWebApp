import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match, MatchResponse } from '../models/match.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MatchService {
    private readonly apiUrl = environment.apiUrl + '/matches'; // Use environment API URL

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    /**
     * Get user's matches
     */
    getMatches(): Observable<Match[]> {
        const headers = this.getAuthHeaders();
        return this.http.get<Match[]>(`${this.apiUrl}`, { headers });
    }

    /**
     * Get potential matches for swiping
     */
    getPotentialMatches(): Observable<Match[]> {
        const headers = this.getAuthHeaders();
        return this.http.get<Match[]>(`${this.apiUrl}/potential`, { headers });
    }

    /**
     * Like or pass a match
     */
    respondToMatch(response: MatchResponse): Observable<void> {
        const headers = this.getAuthHeaders();
        return this.http.post<void>(`${this.apiUrl}/respond`, response, { headers });
    }

    /**
     * Unmatch with someone
     */
    unmatch(matchId: string): Observable<void> {
        const headers = this.getAuthHeaders();
        return this.http.delete<void>(`${this.apiUrl}/${matchId}`, { headers });
    }

    /**
     * Get match details
     */
    getMatchDetails(matchId: string): Observable<Match> {
        const headers = this.getAuthHeaders();
        return this.http.get<Match>(`${this.apiUrl}/${matchId}`, { headers });
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