import { Link, Navigate } from 'react-router';
import Page from '../structure/page/Page';
import { Button } from '@mui/material';
import CommonConstants from '../constants/CommonConstants';
import { useContext } from 'react';
import { GlobalContext } from '../context/global-context/GlobalProvider';
import TextImageComponent from '../components/text-image-component/TextImageComponent';
import OverviewDashboardImage from './../assets/overview_dashboard.png';
import TournamentGeneratorGifImage from './../assets/tournament_generator.gif';
import QRCodeDashboardJoinImage from './../assets/qr.png';

const Home = () => {
    const { user } = useContext(GlobalContext);

    if (user.isLoggedIn) {
        return <Navigate to={CommonConstants.Routes.UserProfile} />;
    }

    return (
        <Page>
            <h1
                style={{ wordBreak: 'break-word' }}
                className="mb-5"
            >
                Knockout Tournament Planner
            </h1>
            <p>
                Create, manage, and run single-elimination tournaments with
                ease.
            </p>
            <div className="mb-lg-0 mb-5">
                <Link
                    to={CommonConstants.Routes.Login}
                    className="pe-3"
                >
                    <Button variant="contained">Login</Button>
                </Link>
                <Link to={CommonConstants.Routes.Register}>
                    <Button variant="outlined">Register</Button>
                </Link>
            </div>

            <div className="w-100 mb-5">
                <TextImageComponent
                    headlineText="Create and Manage Tournaments"
                    text="Easily manage your tournaments: add players, start rounds, and let the system advance winners automatically until a champion is crowned."
                    switchOrder={false}
                    image={{
                        url: OverviewDashboardImage,
                        width: 2578,
                        height: 1226,
                        alt: 'overview-dashboard-image',
                    }}
                />
            </div>

            <div className="w-100 mb-5">
                <TextImageComponent
                    headlineText="Player Joining System"
                    text="Automatic QR Code creation. Players can simply join the tournament by scanning the code and entering their names."
                    switchOrder={true}
                    image={{
                        url: QRCodeDashboardJoinImage,
                        width: 1591,
                        height: 1392,
                        alt: 'overview-dashboard-qr-code-image',
                    }}
                />
            </div>

            <div className="w-100 mb-5">
                <TextImageComponent
                    headlineText="Automatic Tournament Generation"
                    text="Live tournament bracket with match results and advancing teams."
                    switchOrder={false}
                    image={{
                        url: TournamentGeneratorGifImage,
                        width: 2600,
                        height: 1350,
                        alt: 'overview-dashboard-image',
                    }}
                />
            </div>
        </Page>
    );
};

export default Home;
