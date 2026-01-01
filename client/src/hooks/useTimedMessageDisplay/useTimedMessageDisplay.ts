import { useState, useEffect } from 'react';
import CommonConstants from '../../constants/CommonConstants';

export const useTimedMessageDisplay = (value: boolean) => {
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (value) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
            }, CommonConstants.SUCCESS_ERROR_MSG_DISPLAY_DURATION_MS);

            return () => clearTimeout(timer);
        }
    }, [value, setShow]);

    return show;
};
