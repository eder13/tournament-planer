import { Button, Stack, TextField } from '@mui/material';
import Page from '../structure/page/Page';
import { useParams } from 'react-router';

const JointTournament = () => {
    const { tournamentId = '' } = useParams<{ tournamentId: string }>();

    return (
        <Page>
            <h1 className="mb-5">Enter your Name to Join the Competition!</h1>
            <form
                action={`/join/tournament/${tournamentId}`}
                method="post"
            >
                <Stack
                    sx={{ maxWidth: '500px' }}
                    spacing={2}
                >
                    <TextField
                        placeholder="YourName"
                        id="name"
                        name="name"
                        label="Name"
                    ></TextField>
                    <Button
                        className="mb-3"
                        variant="contained"
                        type="submit"
                    >
                        Enter Tournament
                    </Button>
                </Stack>
            </form>
        </Page>
    );
};

export default JointTournament;
