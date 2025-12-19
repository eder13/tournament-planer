import { Stack, TextField, Button, Alert } from '@mui/material';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ForgotPasswordForm = () => {
    const [forgotEmail, setForgotEmail] = useState('');
    const [searchParams] = useSearchParams();

    const isSuccessfulEmailSent = searchParams.get('email_successfully_sent');
    const isErrorEmailSent = searchParams.get('email_error_generating');
    const isPasswordResetDoneSuccessfully = searchParams.get(
        'password_successfully_reset'
    );

    return (
        <>
            {isSuccessfulEmailSent && (
                <Alert
                    className="mb-3"
                    severity="success"
                >
                    <FontAwesomeIcon icon="check" />
                    <span>
                        E-Mail for password reset has been successfully sent.
                        Please check your inbox as well as your spam folder.
                    </span>
                </Alert>
            )}

            {isErrorEmailSent && (
                <Alert
                    className="mb-3"
                    severity="error"
                >
                    <FontAwesomeIcon icon="xmark" />
                    <span>
                        E-Mail generation failed. Please try again later.
                    </span>
                </Alert>
            )}

            {isPasswordResetDoneSuccessfully && (
                <Alert
                    className="mb-3"
                    severity="success"
                >
                    <FontAwesomeIcon icon="check" />
                    <span>Password has been successfully reset! 🎉</span>
                </Alert>
            )}

            <form
                action="/forgot"
                method="post"
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
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                    ></TextField>
                    <Button
                        className="mb-3"
                        variant="contained"
                        type="submit"
                    >
                        Reset Password
                    </Button>
                </Stack>
            </form>
        </>
    );
};

export default ForgotPasswordForm;
