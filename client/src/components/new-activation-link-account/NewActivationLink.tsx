import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Alert,
    Stack,
    TextField,
    Button,
    CircularProgress,
} from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router';
import CommonConstants from '../../constants/CommonConstants';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../context/global-context/GlobalProvider';
import { HTTPMethod } from '../../../../server/src/constants/common';
import Logger from '../../../../server/src/helpers/logger';

export const NewActivationLink = () => {
    const { csrfToken } = useContext(GlobalContext);
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const navigate = useNavigate();

    const emailError =
        email.length > 0 && !CommonConstants.RegExEmail.test(email);

    const isFormValid =
        email.length > 0 && CommonConstants.RegExEmail.test(email);

    return (
        <>
            {searchParams.get('error') && (
                <Alert
                    className="mb-3"
                    severity="error"
                >
                    <FontAwesomeIcon icon="xmark" />
                    <span>
                        The User could not be found. Are you sure you already{' '}
                        <Link to={CommonConstants.Routes.Register}>
                            registered?
                        </Link>
                    </span>
                </Alert>
            )}

            {searchParams.get('success') && (
                <Alert
                    className="mb-3"
                    severity="success"
                >
                    <FontAwesomeIcon icon="check" />
                    <span>
                        Your Activation Link for your account has been resent to
                        your E-Mail.
                    </span>
                </Alert>
            )}

            {showLoader && <CircularProgress className="mb-3" />}

            <form
                style={{
                    minWidth: '300px',
                }}
                onSubmit={(e) => {
                    e.preventDefault();

                    if (isFormValid) {
                        setShowLoader(true);

                        fetch('/user/activate', {
                            method: HTTPMethod.POST,
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-Token': csrfToken,
                            },
                            body: JSON.stringify({
                                email,
                            }),
                        })
                            .then((res) => {
                                if (res.ok) {
                                    navigate('/signup?email_sent=true');
                                }
                            })
                            .catch((e) => {
                                Logger.error(e);
                                navigate('/signup?email_error_generating=true');
                            })
                            .finally(() => {
                                setShowLoader(false);
                            });
                    }
                }}
            >
                <Stack
                    sx={{ maxWidth: '500px' }}
                    spacing={2}
                >
                    <TextField
                        placeholder="mail@example.com"
                        id="email"
                        name="email"
                        label="E-Mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                        helperText={
                            emailError
                                ? 'Please enter a valid email address'
                                : ' '
                        }
                    ></TextField>
                    <Button
                        className="mb-3"
                        variant="contained"
                        type="submit"
                        disabled={!isFormValid}
                    >
                        Resend Activation Link
                    </Button>
                </Stack>
            </form>
        </>
    );
};
