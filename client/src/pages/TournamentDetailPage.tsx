import { Button } from '@mui/material';
import { Link, useParams } from 'react-router';
import Page from '../structure/page/Page';
import TournamentDetails from '../components/tournament-details/TournamentDetails';

const TournamentDetailPage = () => {
    const { tournamentId = '' } = useParams<{ tournamentId: string }>();

    return (
        <Page>
            <TournamentDetails id={tournamentId} />
            <Button variant="text">
                <Link to="/userprofile">Back</Link>
            </Button>
        </Page>
    );
};

export default TournamentDetailPage;
