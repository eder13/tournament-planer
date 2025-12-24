import { useContext, useEffect } from 'react';
import UtilsHelper from '../../utils/UtilsHelper';
import { GlobalContextDispatch } from '../../context/global-context/GlobalProvider';

export const useSetCSRFToken = () => {
    const dispatch = useContext(GlobalContextDispatch);

    useEffect(() => {
        const csrfToken = UtilsHelper.getCookie('crumb');
        if (csrfToken) {
            dispatch({
                type: 'setCsrf',
                data: csrfToken,
            });
        }
    }, [dispatch]);
};
