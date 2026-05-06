import { Component, OnInit } from '@angular/core';
import { Match, MatchResponse } from '../../models';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.component.html',
    styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
    matches: Match[] = [];

    constructor() { }

    ngOnInit(): void {
        this.loadMatches();
    }

    loadMatches(): void {
        // TODO: Implement matches loading from service
        // this.matches = this.matchService.getMatches();
    }

    likeMatch(match: Match): void {
        const response: MatchResponse = {
            id: match.id,
            userId: match.userId,
            actionType: 'like',
            timestamp: new Date()
        };
        // TODO: Send like response through service
        console.log('Match liked:', response);
    }

    passMatch(match: Match): void {
        const response: MatchResponse = {
            id: match.id,
            userId: match.userId,
            actionType: 'pass',
            timestamp: new Date()
        };
        // TODO: Send pass response through service
        console.log('Match passed:', response);
    }

}
