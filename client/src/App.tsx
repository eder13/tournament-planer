import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';
import { GlobalContextDispatch } from './context/global-context/GlobalProvider';
import { useContext, useEffect } from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CommonConstants from './constants/CommonConstants';
import PasswordForgot from './pages/PasswordForgot';
import UserProfile from './pages/UserProfile';
import TournamentDetailPage from './pages/TournamentDetailPage';
import JointTournament from './pages/JointTournament';
import RulesPage from './pages/Rules';

const App = () => {
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
            });
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route
                    index
                    element={<Home />}
                />
                <Route
                    path={CommonConstants.Routes.TournamentDetails}
                    element={<TournamentDetailPage />}
                />
                <Route
                    path={CommonConstants.Routes.Rules}
                    element={<RulesPage />}
                />
                <Route
                    path={CommonConstants.Routes.Login}
                    element={<SignIn />}
                />
                <Route
                    path={CommonConstants.Routes.Register}
                    element={<SignUp />}
                />
                <Route
                    path={CommonConstants.Routes.PasswordForgot}
                    element={<PasswordForgot />}
                />
                <Route
                    path={CommonConstants.Routes.UserProfile}
                    element={<UserProfile />}
                />
                <Route
                    path={CommonConstants.Routes.JoinTournament}
                    element={<JointTournament />}
                />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
};

export default App;
