import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryConstants } from '../../constants/QueryConstants';
import { useContext } from 'react';
import { GlobalContext } from '../../context/global-context/GlobalProvider';

export const usePatchStartTournament = (tournamentId: string | undefined) => {
    const { csrfToken } = useContext(GlobalContext);
    const queryClient = useQueryClient();

    const { mutateAsync, isSuccess, isError, isPending } = useMutation({
        mutationKey: [QueryConstants.TOURNAMENT_BY_ID, tournamentId],
        mutationFn: async () => {
            if (!tournamentId) {
                throw new Error('No tournamentId provided');
            }
            const res = await fetch(`/tournament/${tournamentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ started: true }),
            });
            if (res.ok) {
                const res2 = await fetch(`/tournament/start/${tournamentId}`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-Token': csrfToken,
                    },
                });

                if (!res2.ok) {
                    throw new Error(
                        'Failed to start tournament and generate the tournament tree'
                    );
                }
                return;
            } else {
                throw new Error(
                    'Failed to patch tournament data and set started to true'
                );
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [QueryConstants.TOURNAMENT_BY_ID, tournamentId],
            });

            await queryClient.invalidateQueries({
                queryKey: [
                    QueryConstants.ROUNDS_MATCHES_BY_TOURNAMENT_ID,
                    tournamentId,
                    true,
                ],
            });
        },
        onError: (err) => {
            console.error('Mutation failed', err);
        },
    });

    return { mutateAsync, isSuccess, isError, isPending };
};
