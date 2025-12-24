import { Button } from '@mui/material';
import { Link } from 'react-router';
import CommonConstants from '../../../constants/CommonConstants';
import { useContext } from 'react';
import { GlobalContext } from '../../../context/global-context/GlobalProvider';

const HeaderLoggedInContent = () => {
    const { csrfToken } = useContext(GlobalContext);
    return (
        <ul>
            <li>
                <Link to={CommonConstants.Routes.UserProfile}>
                    My Tournaments
                </Link>
            </li>
            <li>
                <Link to={CommonConstants.Routes.Rules}>Rules</Link>
            </li>

            <li>
                <form
                    method="post"
                    action="/logout"
                >
                    <input
                        type="hidden"
                        name="crumb"
                        id="crumb"
                        value={csrfToken}
                    />
                    <Button
                        variant="contained"
                        color="error"
                        value="Logout"
                        type="submit"
                        className="logout-btn"
                    >
                        Logout
                    </Button>
                </form>
            </li>
        </ul>
    );
};

export default HeaderLoggedInContent;
