import {
    Alert,
    Button,
    CircularProgress,
    Stack,
    TextField,
} from '@mui/material';
import Page from '../structure/page/Page';
import { useParams } from 'react-router';
import { useContext, useState } from 'react';
import { GlobalContext } from '../context/global-context/GlobalProvider';
import { HTTPMethod } from '../../../server/src/constants/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const JointTournament = () => {
    const { csrfToken } = useContext(GlobalContext);
    const [successMsg, setSuccessMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);

    const { tournamentId = '' } = useParams<{ tournamentId: string }>();
    const [name, setName] = useState('');

    const isFormValid = name.length >= 2;
    const isError = name.length < 2;

    return (
        <Page>
            <h1 className="mb-5">Enter your Name to Join the Competition!</h1>

            {showLoadingSpinner && <CircularProgress className="mb-3" />}

            {successMsg && (
                <Alert
                    className="mb-3"
                    severity="success"
                >
                    <FontAwesomeIcon icon="check" />
                    <span>
                        You have entered the tournament successfully! 🎉 Your
                        name will be visible in the dashboard shortly.
                    </span>
                </Alert>
            )}

            {errorMsg && (
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
                        setSuccessMsg(false);
                        setErrorMsg(false);
                        setShowLoadingSpinner(true);

                        fetch(`/join/tournament/${tournamentId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-Token': csrfToken,
                            },
                            method: HTTPMethod.POST,
                            body: JSON.stringify({
                                name,
                            }),
                        })
                            .then((res) => {
                                if (res.ok) {
                                    setSuccessMsg(true);
                                }
                            })
                            .catch(() => {
                                setErrorMsg(true);
                            })
                            .finally(() => {
                                setShowLoadingSpinner(false);
                            });
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
                        error={isError}
                        helperText={
                            isError
                                ? 'Specify your Name with at least 2 characters'
                                : ''
                        }
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
