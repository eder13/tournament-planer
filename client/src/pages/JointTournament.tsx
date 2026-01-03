import {
    Alert,
    Button,
    CircularProgress,
    Stack,
    TextField,
} from '@mui/material';
import Page from '../structure/page/Page';
import { useParams } from 'react-router';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePostJoinTournament } from '../hooks/usePostJoinTournament/usePostJoinTournament';
import { useTimedMessageDisplay } from '../hooks/useTimedMessageDisplay/useTimedMessageDisplay';

const JointTournament = () => {
    const { mutate, isSuccess, isError, isPending, data } =
        usePostJoinTournament();

    const { tournamentId = '' } = useParams<{ tournamentId: string }>();
    const [name, setName] = useState('');
    const showSuccessBox = useTimedMessageDisplay(isSuccess, 15000);
    const showErrorBox = useTimedMessageDisplay(isError);

    const isFormValid = name.length >= 4;
    const isErrorForm = name.length !== 0 && name.length < 4;

    return (
        <Page>
            <h1 className="mb-5">Enter your Name to Join the Competition!</h1>

            {isPending && <CircularProgress className="mb-3" />}

            {showSuccessBox && data && (
                <Alert
                    className="mb-3"
                    severity="success"
                >
                    <FontAwesomeIcon icon="check" />
                    <span>{data.message}</span>
                </Alert>
            )}

            {showErrorBox && (
                <Alert
                    className="mb-3"
                    severity="error"
                >
                    <FontAwesomeIcon icon="xmark" />
                    <span>
                        Could not join tournament. Are you sure it is still
                        joinable?
                    </span>
                </Alert>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();

                    if (isFormValid) {
                        mutate(
                            { tournamentId, name },
                            {
                                onSuccess: () => {
                                    setName('');
                                },
                            }
                        );
                    }
                }}
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
                        error={isErrorForm}
                        helperText={
                            isErrorForm
                                ? 'Specify your Name with at least 4 characters'
                                : ''
                        }
                    ></TextField>
                    <Button
                        className="mb-3"
                        variant="contained"
                        type="submit"
                        disabled={!isFormValid || isPending || !name.length}
                    >
                        Enter Tournament
                    </Button>
                </Stack>
            </form>
        </Page>
    );
};

export default JointTournament;
