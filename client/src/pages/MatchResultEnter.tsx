import { useNavigate, useParams } from 'react-router';
import Page from '../structure/page/Page';
import { Alert, Button, Stack, TextField } from '@mui/material';
import { useContext, useState, type FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GlobalContext } from '../context/global-context/GlobalProvider';

const MatchResultEnter = () => {
    const { csrfToken } = useContext(GlobalContext);
    const params = useParams<{
        tournamentId: string;
        roundId: string;
        matchId: string;
        player1: string;
        player2: string;
    }>();
    const navigate = useNavigate();

    const [resultPlayer1, setResultPlayer1] = useState('0');
    const [resultPlayer2, setResultPlayer2] = useState('0');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const isFormValid =
        resultPlayer1.length > 0 &&
        resultPlayer2.length > 0 &&
        Number(resultPlayer1) >= 0 &&
        Number(resultPlayer2) >= 0;
    const isPlayer1TextFieldError =
        resultPlayer1.length === 0 || Number(resultPlayer1) < 0;
    const isPlayer2TextFieldError =
        resultPlayer2.length === 0 || Number(resultPlayer2) < 0;

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isFormValid) {
            return;
        }

        fetch(
            `/match/${params.tournamentId}/${params.roundId}/${params.matchId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({
                    result: {
                        player1: Number(resultPlayer1),
                        player2: Number(resultPlayer2),
                    },
                }),
            }
        )
            .then((res) => {
                if (res.ok) {
                    setShowSuccessAlert(true);
                    setTimeout(() => {
                        setShowSuccessAlert(false);
                    }, 5000);
                } else {
                    throw new Error('Failed setting a match result');
                }
            })
            .catch((e) => {
                console.error(e);

                setShowErrorAlert(true);
                setTimeout(() => {
                    setShowErrorAlert(false);
                }, 5000);
            });
    };

    return (
        <Page>
            <h1>
                {params.player1} vs {params.player2}
            </h1>

            {showSuccessAlert && (
                <Alert
                    className="mb-3"
                    severity="success"
                >
                    <FontAwesomeIcon icon="check" />
                    <span>Match Result and Winner has been set.</span>
                </Alert>
            )}

            {showErrorAlert && (
                <Alert
                    className="mb-3"
                    severity="error"
                >
                    <FontAwesomeIcon icon="xmark" />
                    <span>
                        There was an Error setting the score. Make sure that
                        there is a clear winner specified (no draws).
                    </span>
                </Alert>
            )}

            <form onSubmit={onSubmit}>
                <Stack
                    sx={{ maxWidth: '500px' }}
                    spacing={2}
                >
                    <div style={{ gap: '2rem', display: 'flex' }}>
                        <TextField
                            placeholder="0"
                            type="number"
                            value={resultPlayer1}
                            onChange={(e) => setResultPlayer1(e.target.value)}
                            error={isPlayer1TextFieldError}
                        ></TextField>
                        <TextField
                            placeholder="0"
                            type="number"
                            value={resultPlayer2}
                            onChange={(e) => setResultPlayer2(e.target.value)}
                            error={isPlayer2TextFieldError}
                        ></TextField>
                    </div>
                    <Button
                        className="mb-3"
                        variant="contained"
                        type="submit"
                    >
                        Confirm Result
                    </Button>
                </Stack>
            </form>

            <Button
                onClick={() => {
                    navigate(`/userprofile/tournaments/${params.tournamentId}`);
                }}
                variant="text"
            >
                Back to Knockout Table
            </Button>
        </Page>
    );
};

export default MatchResultEnter;
