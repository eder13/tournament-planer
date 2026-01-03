import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { HTTPMethod } from '../../../../../server/src/constants/common';
import { GlobalContext } from '../../../context/global-context/GlobalProvider';
import { QueryConstants } from '../../../constants/QueryConstants';

export const usePostJoinTournament = () => {
    const { csrfToken } = useContext(GlobalContext);

    const { data, mutate, isSuccess, isError, isPending } = useMutation<
        | {
              message: string;
          }
        | undefined,
        Error,
        {
            tournamentId: string;
            name: string;
        }
    >({
        mutationKey: [QueryConstants.JOIN_TOURNAMENT_BY_TOURNAMENT_ID],
        mutationFn: async ({
            tournamentId,
            name,
        }: {
            tournamentId: string;
            name: string;
        }) => {
            return fetch(`/join/tournament/${tournamentId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                method: HTTPMethod.POST,
                body: JSON.stringify({
                    name,
                }),
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to join tournament');
                }

                return res.json() as Promise<{ message: string }>;
            });
        },
    });

    return { mutate, isSuccess, isError, isPending, data };
};
