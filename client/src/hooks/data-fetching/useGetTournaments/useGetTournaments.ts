import { useQuery } from '@tanstack/react-query';
import { QueryConstants } from '../../../constants/QueryConstants';
import type { DataTournamentsResult } from '../../../types/common';

export const useGetTournaments = () => {
    const {
        isPending,
        data: tournaments,
        isError,
        refetch,
    } = useQuery<Array<DataTournamentsResult>>({
        queryKey: [QueryConstants.DASHBOARD_TOURNAMENTS_DATA],
        queryFn: async () => {
            const res = await fetch('/tournaments');
            return await res.json();
        },
    });

    return { isPending, data: tournaments, isError, refetch };
};
