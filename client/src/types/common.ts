export type DataTournamentsResult = {
    id: string;
    name: string;
    created_on: string | Date;
    created_by: number;
    started: 0 | 1 | 'ongoing' | 'pending' | string;
};

export interface DataTournamentResultDetails extends DataTournamentsResult {
    players: Array<Players>;
}

export type Players = {
    id: number;
    player_id: number;
    tournament_id: string;
    player: {
        id: number;
        name: string;
    };
};

export type Player = {
    id: number;
    name: string;
};

export interface DataTournamentRoundAndMatchesResult {
    tournamentWithRounds: {
        id: string;
        name: string;
        created_on: Date | string;
        created_by: number;
        started: boolean;
        rounds: Array<Round>;
    };
}

interface Round {
    id: number;
    tournament_id: string;
    round_number: number;
    matches: Array<Match>;
}

interface Match {
    id: number;
    round_id: number;
    player1_id: number;
    player2_id: number;
    winner_id: null | number;
    result: null | {
        player1: number;
        player2: number;
    };
    player1: Player;
    player2: Player | null;
    winner: null | Player;
}
