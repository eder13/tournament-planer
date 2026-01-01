import { useContext } from 'react';
import {
    GlobalContext,
    LoginStatus,
} from '../../context/global-context/GlobalProvider';
import { Navigate, Outlet } from 'react-router';
import CommonConstants from '../../constants/CommonConstants';

const PrivateRoute = () => {
    const { user } = useContext(GlobalContext);

    if (user.loginStatus === LoginStatus.LOGGED_OUT) {
        return (
            <Navigate
                to={CommonConstants.Routes.Login}
                replace
            />
        );
    }

    return <Outlet />;
};

export default PrivateRoute;
