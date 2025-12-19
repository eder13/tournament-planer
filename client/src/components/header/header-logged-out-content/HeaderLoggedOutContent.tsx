import { Link } from 'react-router';
import CommonConstants from '../../../constants/CommonConstants';

const HeaderLoggedOutContent = () => {
    return (
        <ul>
            <li className="mb-3">
                <Link to={CommonConstants.Routes.Home}>Home</Link>
            </li>
            <li>
                <Link to={CommonConstants.Routes.Login}>Login</Link>
            </li>
            <li>
                <Link to={CommonConstants.Routes.Register}>Register</Link>
            </li>
        </ul>
    );
};

export default HeaderLoggedOutContent;
