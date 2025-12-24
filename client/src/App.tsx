import { BrowserRouter, Route, Routes } from 'react-router';
import { GlobalContext } from './context/global-context/GlobalProvider';
import { useContext } from 'react';
import { useInitialProfileData } from './hooks/useInitialProfileData/useInitialProfileData';
import Home from './pages/Home';
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
import MatchResultEnter from './pages/MatchResultEnter';
import Error404 from './pages/Error404';
import ActivationAccount from './pages/ActivationAccount';
import PrivateRoute from './structure/private-route/PrivateRoute';
import { useSetCSRFToken } from './hooks/useSetCSRFToken/useSetCSRFToken';

const App = () => {
    useInitialProfileData();
    useSetCSRFToken();
    const { isMounted } = useContext(GlobalContext);

    if (!isMounted) {
        return null;
    }

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route
                    index
                    element={<Home />}
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
                    path={CommonConstants.Routes.ResendActivationLink}
                    element={<ActivationAccount />}
                />
                <Route
                    path={CommonConstants.Routes.JoinTournament}
                    element={<JointTournament />}
                />

                <Route element={<PrivateRoute />}>
                    <Route
                        path={CommonConstants.Routes.UserProfile}
                        element={<UserProfile />}
                    />
                    <Route
                        path={CommonConstants.Routes.EnterMatchResult}
                        element={<MatchResultEnter />}
                    />
                    <Route
                        path={CommonConstants.Routes.TournamentDetails}
                        element={<TournamentDetailPage />}
                    />
                    <Route
                        path={CommonConstants.Routes.Rules}
                        element={<RulesPage />}
                    />
                </Route>

                <Route
                    path="*"
                    element={<Error404 />}
                />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
};

export default App;
