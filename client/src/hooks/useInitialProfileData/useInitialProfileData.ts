import { useQuery } from '@tanstack/react-query';
import { QueryConstants } from '../../constants/QueryConstants';

type InitialFetchResultSuccess = {
    id: string;
    email: string;
};
type InitialFetchResultFailure = {
    error: 'Unauthorized';
    message: 'Missing authentication';
    statusCode: 401;
};
type InitialFetchResult = InitialFetchResultSuccess | InitialFetchResultFailure;

export function isSuccess(
    arg: InitialFetchResult
): arg is InitialFetchResultSuccess {
    return 'id' in arg && 'email' in arg;
}

export const useInitialProfileData = () => {
    const { isPending, data, error } = useQuery<InitialFetchResult>({
        queryKey: [QueryConstants.INITIAL_PROFILE_DATE],
        queryFn: () => {
            return fetch('/profile').then((res) => {
                return res.json();
            });
        },
    });

    return { isPending, data, error };
};
