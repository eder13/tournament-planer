import { useEffect } from 'react';
import { useLocation, type Location } from 'react-router';

const useHistoryChangeListener = (callback: (location: Location) => void) => {
    const location = useLocation();

    useEffect(() => {
        callback(location);
    }, [location, callback]);
};

export default useHistoryChangeListener;
