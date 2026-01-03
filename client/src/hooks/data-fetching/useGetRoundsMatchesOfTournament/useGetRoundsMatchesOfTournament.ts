import { useQuery } from '@tanstack/react-query';
import { QueryConstants } from '../../../constants/QueryConstants';
import type { DataTournamentRoundAndMatchesResult } from '../../../types/common';

export const useGetRoundsMatchesOfTournament = (
    tournamentId: string,
    enabled: boolean
) => {
    const { data, isPending, isError } =
        useQuery<DataTournamentRoundAndMatchesResult>({
            enabled,
            queryKey: [
                QueryConstants.ROUNDS_MATCHES_BY_TOURNAMENT_ID,
                tournamentId,
                enabled,
            ],
            queryFn: () =>
                fetch(`/rounds/matches/${tournamentId}`).then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error(
                            'Error while fetching tournament rounds'
                        );
                    }
                }),
        });

    return { data, isPending, isError };
};
