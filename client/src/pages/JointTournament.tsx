import { Button, Stack, TextField } from '@mui/material';
import Page from '../structure/page/Page';
import { useParams } from 'react-router';
import { useContext, useState } from 'react';
import { GlobalContext } from '../context/global-context/GlobalProvider';

const JointTournament = () => {
    const { csrfToken } = useContext(GlobalContext);

    const { tournamentId = '' } = useParams<{ tournamentId: string }>();
    const [name, setName] = useState('');

    const isFormValid = name.length >= 2;
    const isError = name.length < 2;

    return (
        <Page>
            <h1 className="mb-5">Enter your Name to Join the Competition!</h1>
            <form
                {...(isFormValid
                    ? {
                          action: `/join/tournament/${tournamentId}`,
                          method: 'post',
                      }
                    : {})}
                style={{
                    minWidth: '300px',
                }}
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={isError}
                        helperText={
                            isError
                                ? 'Specify your Name with at least 2 characters'
                                : ''
                        }
                    ></TextField>
                    <input
                        type="hidden"
                        name="crumb"
                        id="crumb"
                        value={csrfToken}
                    />
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
