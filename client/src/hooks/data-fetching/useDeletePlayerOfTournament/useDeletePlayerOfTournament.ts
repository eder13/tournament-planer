import { useContext } from 'react';
import { GlobalContext } from '../../../context/global-context/GlobalProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryConstants } from '../../../constants/QueryConstants';
import {
    HTTPMethod,
    HttpCode,
} from '../../../../../server/src/constants/common';

export const useDeletePlayerOfTournament = () => {
    const { csrfToken } = useContext(GlobalContext);
    const queryClient = useQueryClient();

    const { mutate, isError } = useMutation({
        mutationKey: [QueryConstants.DELETE_PLAYER_FROM_TOURNAMENT],
        mutationFn: async (playerId: number) => {
            return fetch(`/players/${playerId}`, {
                headers: {
                    'X-CSRF-Token': csrfToken,
                },
                method: HTTPMethod.DELETE,
            }).then((res) => {
                if (res.status === HttpCode.NO_CONTENT) {
                    return;
                }
                throw new Error('Error deleting player from tournament');
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryConstants.TOURNAMENT_BY_ID],
            });
        },
    });

    return { mutate, isError };
};
