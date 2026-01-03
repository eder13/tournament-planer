import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { QueryConstants } from '../../../constants/QueryConstants';
import { GlobalContext } from '../../../context/global-context/GlobalProvider';

export const usePostSetMatchResultForRound = () => {
    const { csrfToken } = useContext(GlobalContext);

    const { mutate, isSuccess, isError, isPending } = useMutation({
        mutationKey: [QueryConstants.SET_MATCH_RESULT_FOR_ROUND],
        mutationFn: async ({
            tournamentId,
            roundId,
            matchId,
            resultPlayer1,
            resultPlayer2,
        }: {
            tournamentId: string;
            roundId: string;
            matchId: string;
            resultPlayer1: string;
            resultPlayer2: string;
        }) => {
            return fetch(`/match/${tournamentId}/${roundId}/${matchId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                method: 'POST',
                body: JSON.stringify({
                    result: {
                        player1: Number(resultPlayer1),
                        player2: Number(resultPlayer2),
                    },
                }),
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to set match result');
                }

                return res.json();
            });
        },
    });

    return { mutate, isSuccess, isError, isPending };
};
