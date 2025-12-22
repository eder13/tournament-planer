import { useContext, useEffect } from 'react';
import { GlobalContextDispatch } from '../../context/global-context/GlobalProvider';

export const useInitialProfileData = () => {
    const dispatch = useContext(GlobalContextDispatch);

    useEffect(() => {
        fetch('/profile')
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res?.id && res?.email) {
                    dispatch({
                        type: 'loggedIn',
                        data: {
                            id: Number(res.id),
                            email: res.email,
                        },
                    });
                }
                dispatch({
                    type: 'mounted',
                });
            })
            .catch(() => {
                dispatch({
                    type: 'mounted',
                });
            });
    }, [dispatch]);
};
