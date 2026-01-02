import { useQuery } from '@tanstack/react-query';
import { QueryConstants } from '../../constants/QueryConstants';
import type { DataTournamentResultDetails, Player } from '../../types/common';

type PlayersForTournamentDataResult = {
    tournament: DataTournamentResultDetails;
    players: Player[];
};

export const useGetPlayersForTournament = (
    tournamentId: string | undefined,
    refetchInterval: number,
    hasTournamentStarted: boolean
) => {
    const { isSuccess, isPending, data, isError } =
        useQuery<PlayersForTournamentDataResult>({
            queryKey: [QueryConstants.TOURNAMENT_BY_ID, tournamentId],
            queryFn: () => {
                return fetch(`/tournaments/${tournamentId}`)
                    .then((res) => {
                        if (res.ok) {
                            return res.json();
                        } else {
                            throw new Error('Could not fetch Data');
                        }
                    })
                    .then((res) => {
                        return {
                            tournament: res,
                            players: res.players,
                        };
                    });
            },
            refetchInterval: hasTournamentStarted ? false : refetchInterval,
        });

    return { isSuccess, isPending, data, isError };
};
