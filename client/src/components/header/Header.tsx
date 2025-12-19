import { useCallback, useContext, useRef } from 'react';
import { GlobalContext } from '../../context/global-context/GlobalProvider';
import './Header.css';
import useHistoryChangeListener from '../../hooks/useHistoryChangeListener/useHistoryChangeListener';
import HeaderLoggedInContent from './header-logged-in-content/HeaderLoggedInContent';
import HeaderLoggedOutContent from './header-logged-out-content/HeaderLoggedOutContent';
import Logo from '../../assets/logo.png';
import { Link } from 'react-router';
import CommonConstants from '../../constants/CommonConstants';

const Header = () => {
    const { user } = useContext(GlobalContext);
    const inputCheckboxRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(() => {
        if (inputCheckboxRef.current?.checked) {
            inputCheckboxRef.current.checked = false;
        }
    }, []);

    useHistoryChangeListener(handleChange);

    return (
        <nav>
            <div className="nav-wrapper">
                <Link
                    to={
                        user.isLoggedIn
                            ? CommonConstants.Routes.UserProfile
                            : CommonConstants.Routes.Home
                    }
                    className="logo-name"
                >
                    <div>
                        <img
                            alt="Logo"
                            width={30}
                            height={30}
                            src={Logo}
                        />
                    </div>
                </Link>
                <div className="menu-wrap-mobile menu-wrap">
                    <label
                        className="sr-only"
                        htmlFor="toggler"
                        style={{ display: 'none' }}
                    >
                        Hamburger menu
                    </label>
                    <input
                        aria-expanded="false"
                        type="checkbox"
                        id="toggler"
                        ref={inputCheckboxRef}
                    />
                    <div className="hamburger">
                        <div style={{ backgroundColor: 'black' }}></div>
                    </div>
                    <div
                        id="menuID"
                        className="menu loadingHidden"
                    >
                        <div>
                            {user.isLoggedIn ? (
                                <HeaderLoggedInContent />
                            ) : (
                                <HeaderLoggedOutContent />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
