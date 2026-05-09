import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatchService } from '../../services/match.service';
import { User } from '../../models';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    currentUser: User | null = null;
    potentialMatches: any[] = [];
    isLoading: boolean = false;

    constructor(
        private authService: AuthService,
        private matchService: MatchService
    ) { }

    ngOnInit(): void {
        this.loadCurrentUser();
        this.loadPotentialMatches();
    }

    loadCurrentUser(): void {
        this.currentUser = this.authService.getCurrentUser();
    }

    loadPotentialMatches(): void {
        this.isLoading = true;
        this.matchService.getPotentialMatches().subscribe(
            (matches) => {
                this.potentialMatches = matches;
                this.isLoading = false;
            },
            (error) => {
                console.error('Error loading potential matches:', error);
                this.isLoading = false;
                // For demo purposes, show some mock data
                this.potentialMatches = this.getMockMatches();
            }
        );
    }

    likeMatch(match: any): void {
        // TODO: Implement like functionality
        console.log('Liked match:', match);
        // Remove from potential matches
        this.potentialMatches = this.potentialMatches.filter(m => m.id !== match.id);
    }

    passMatch(match: any): void {
        // TODO: Implement pass functionality
        console.log('Passed match:', match);
        // Remove from potential matches
        this.potentialMatches = this.potentialMatches.filter(m => m.id !== match.id);
    }

    private getMockMatches(): any[] {
        return [
            {
                id: '1',
                firstName: 'Sarah',
                lastName: 'Johnson',
                age: 28,
                bio: 'Love hiking and trying new restaurants!',
                avatar: 'https://via.placeholder.com/150',
                interests: ['Hiking', 'Food', 'Travel']
            },
            {
                id: '2',
                firstName: 'Mike',
                lastName: 'Chen',
                age: 32,
                bio: 'Software engineer who loves gaming and coffee.',
                avatar: 'https://via.placeholder.com/150',
                interests: ['Gaming', 'Coffee', 'Technology']
            },
            {
                id: '3',
                firstName: 'Emma',
                lastName: 'Davis',
                age: 26,
                bio: 'Artist and yoga enthusiast.',
                avatar: 'https://via.placeholder.com/150',
                interests: ['Art', 'Yoga', 'Music']
            }
        ];
    }
}
