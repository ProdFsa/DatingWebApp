import { Component, OnInit } from '@angular/core';
import { Match, MatchResponse } from '../../models';
import { MatchService } from '../../services/match.service';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.component.html',
    styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
    matches: Match[] = [];
    isLoading: boolean = false;
    errorMessage: string = '';

    constructor(private matchService: MatchService) { }

    ngOnInit(): void {
        this.loadMatches();
    }

    loadMatches(): void {
        this.isLoading = true;
        this.errorMessage = '';
        this.matchService.getMatches().subscribe(
            (matches) => {
                this.matches = matches;
                this.isLoading = false;
            },
            (error) => {
                console.error('Error loading matches:', error);
                this.isLoading = false;
                this.errorMessage = 'Failed to load matches. Please try again.';
                // For demo purposes, show mock data
                this.matches = this.getMockMatches();
            }
        );
    }

    likeMatch(match: Match): void {
        const response: MatchResponse = {
            id: match.id,
            userId: match.userId,
            actionType: 'like',
            timestamp: new Date()
        };

        this.matchService.respondToMatch(response).subscribe(
            () => {
                // Remove from matches list
                this.matches = this.matches.filter(m => m.id !== match.id);
            },
            (error) => {
                console.error('Error liking match:', error);
                // For demo, still remove from list
                this.matches = this.matches.filter(m => m.id !== match.id);
            }
        );
    }

    passMatch(match: Match): void {
        const response: MatchResponse = {
            id: match.id,
            userId: match.userId,
            actionType: 'pass',
            timestamp: new Date()
        };

        this.matchService.respondToMatch(response).subscribe(
            () => {
                // Remove from matches list
                this.matches = this.matches.filter(m => m.id !== match.id);
            },
            (error) => {
                console.error('Error passing match:', error);
                // For demo, still remove from list
                this.matches = this.matches.filter(m => m.id !== match.id);
            }
        );
    }

    unmatch(match: Match): void {
        this.matchService.unmatch(match.id).subscribe(
            () => {
                // Remove from matches list
                this.matches = this.matches.filter(m => m.id !== match.id);
            },
            (error) => {
                console.error('Error unmatching:', error);
                this.errorMessage = 'Failed to unmatch. Please try again.';
            }
        );
    }

    private getMockMatches(): Match[] {
        return [
            {
                id: '1',
                userId: 'user1',
                firstName: 'Sarah',
                lastName: 'Johnson',
                age: 28,
                bio: 'Love hiking and trying new restaurants!',
                avatar: 'https://via.placeholder.com/150',
                interests: ['Hiking', 'Food', 'Travel'],
                matchDate: new Date(),
                compatibility: 85
            },
            {
                id: '2',
                userId: 'user2',
                firstName: 'Mike',
                lastName: 'Chen',
                age: 32,
                bio: 'Software engineer who loves gaming and coffee.',
                avatar: 'https://via.placeholder.com/150',
                interests: ['Gaming', 'Coffee', 'Technology'],
                matchDate: new Date(),
                compatibility: 78
            },
            {
                id: '3',
                userId: 'user3',
                firstName: 'Emma',
                lastName: 'Davis',
                age: 26,
                bio: 'Artist and yoga enthusiast.',
                avatar: 'https://via.placeholder.com/150',
                interests: ['Art', 'Yoga', 'Music'],
                matchDate: new Date(),
                compatibility: 92
            }
        ];
    }
}
