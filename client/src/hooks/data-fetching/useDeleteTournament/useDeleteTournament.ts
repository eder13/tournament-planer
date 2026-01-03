import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPMethod } from '../../../../../server/src/constants/common';
import { QueryConstants } from '../../../constants/QueryConstants';
import { useContext } from 'react';
import { GlobalContext } from '../../../context/global-context/GlobalProvider';

export const useDeleteTournament = () => {
    const { csrfToken } = useContext(GlobalContext);
    const queryClient = useQueryClient();

    const { isSuccess, isPending, isError, mutateAsync } = useMutation({
        mutationKey: [QueryConstants.DASHBOARD_TOURNAMENTS_DATA],
        mutationFn: (ids: string[]) => {
            return Promise.all(
                ids.map((id) =>
                    fetch(`/tournaments/${id}`, {
                        method: HTTPMethod.DELETE,
                        headers: {
                            'X-CSRF-Token': csrfToken,
                        },
                    }).then((res) => {
                        if (!res.ok) {
                            throw new Error(
                                'Error deleting tournament with id: ' + id
                            );
                        }
                    })
                )
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QueryConstants.DASHBOARD_TOURNAMENTS_DATA],
            });
        },
    });

    return { isError, isPending, isSuccess, mutateAsync };
};
