import { Link } from 'react-router';
import Page from '../structure/page/Page';
import { Button } from '@mui/material';
import CommonConstants from '../constants/CommonConstants';

const Home = () => {
    return (
        <Page>
            <h1
                style={{ wordBreak: 'break-word' }}
                className="mb-5"
            >
                Knockout Tournament Planer
            </h1>
            <p>
                A basic knockout tournament generator. Create your own
                tournaments and let teams join your competition.
            </p>
            <div className="mb-5">
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
                <h2
                    style={{ wordBreak: 'break-word' }}
                    className="mb-5"
                >
                    Create and manage Tournaments
                </h2>
                <p>
                    Manage Tournaments by inviting players, shuffling them in
                    groups and let them fight against each other. A pointing
                    system takes track of the current leader in a group.
                </p>
            </div>

            <div className="w-100">
                <h2
                    style={{ wordBreak: 'break-word' }}
                    className="mb-5"
                >
                    Automatic Tournament Generation
                </h2>
                <p>
                    Let the application generate your knockout plan. Everything
                    is shuffled and randomly assigned.
                </p>
            </div>
        </Page>
    );
};

export default Home;
