export type DataTournamentsResult = {
    id: string;
    name: string;
    created_on: string | Date;
    created_by: number;
    started: 0 | 1 | 'ongoing' | 'pending' | string;
};

export interface DataTournamentResultDetails extends DataTournamentsResult {
    players: Array<Player>;
}

export type Player = {
    id: number;
    player_id: number;
    tournament_id: string;
    player: {
        id: number;
        name: string;
    };
};
