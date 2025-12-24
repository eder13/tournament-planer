import { Stack, TextField, Button, Alert } from '@mui/material';
import { useContext, useState } from 'react';
import { useSearchParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommonConstants from '../../constants/CommonConstants';
import { GlobalContext } from '../../context/global-context/GlobalProvider';

const ForgotPasswordForm = () => {
    const { csrfToken } = useContext(GlobalContext);
    const [forgotEmail, setForgotEmail] = useState('');
    const [searchParams] = useSearchParams();

    const isSuccessfulEmailSent = searchParams.get('email_successfully_sent');
    const isErrorEmailSent = searchParams.get('email_error_generating');
    const isPasswordResetDoneSuccessfully = searchParams.get(
        'password_successfully_reset'
    );

    const emailError =
        forgotEmail.length > 0 && !CommonConstants.RegExEmail.test(forgotEmail);

    const isFormValid =
        forgotEmail.length > 0 && CommonConstants.RegExEmail.test(forgotEmail);

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
                {...(isFormValid
                    ? {
                          action: '/forgot',
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
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        error={emailError}
                        helperText={
                            emailError
                                ? 'Please enter a valid email address'
                                : ' '
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
                        disabled={!isFormValid}
                    >
                        Reset Password
                    </Button>
                </Stack>
            </form>
        </>
    );
};

export default ForgotPasswordForm;
