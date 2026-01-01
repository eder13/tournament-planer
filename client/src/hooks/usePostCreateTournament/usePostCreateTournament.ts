import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPMethod } from '../../../../server/src/constants/common';
import { QueryConstants } from '../../constants/QueryConstants';
import { useContext } from 'react';
import { GlobalContext } from '../../context/global-context/GlobalProvider';

export const usePostCreateTournament = () => {
    const queryClient = useQueryClient();
    const { csrfToken } = useContext(GlobalContext);

    const { mutate, isError, isSuccess, isPending } = useMutation({
        mutationKey: [QueryConstants.DASHBOARD_TOURNAMENTS_DATA],
        mutationFn: (text: string) => {
            return fetch('/tournament', {
                method: HTTPMethod.POST,
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: text,
                }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryConstants.DASHBOARD_TOURNAMENTS_DATA],
            });
        },
    });

    return { mutate, isError, isSuccess, isPending };
};
