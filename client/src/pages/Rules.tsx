import { Typography } from '@mui/material';
import Page from '../structure/page/Page';

const RulesPage = () => {
    return (
        <Page>
            <h1 className="mb-5">Rules</h1>
            <ol>
                <Typography
                    variant="body1"
                    gutterBottom
                >
                    <li className="pb-3">Everyone plays against everyone</li>
                    <li className="pb-3">
                        Group Phase: Every Player has a vs component in a 4
                        player group play. The the player only plays against the
                        vs component. The one player that loses will also loose
                        a life.
                    </li>
                    <li className="pb-3">
                        After 3 rounds the finalists are set and the finalists
                        are available.
                    </li>
                    <li className="pb-3">
                        They play against each other, it depends if there is
                        another group phase but this time where the first and
                        second will advance further.
                    </li>
                    <li className="pb-3">
                        In the final phase 4 players play for 1st, 2nd, 3rd and
                        4th
                    </li>
                </Typography>
            </ol>
        </Page>
    );
};

export default RulesPage;
