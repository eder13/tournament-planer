import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Stack, TextField, Button } from '@mui/material';
import { Link, useSearchParams } from 'react-router';
import CommonConstants from '../../constants/CommonConstants';
import { useState } from 'react';

export const NewActivationLink = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');

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

            <form
                {...(isFormValid
                    ? {
                          action: '/user/activate',
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
