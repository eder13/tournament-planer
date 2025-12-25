import {
    Stack,
    TextField,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommonConstants from '../../constants/CommonConstants';
import { GlobalContext } from '../../context/global-context/GlobalProvider';
import { HTTPMethod } from '../../../../server/src/constants/common';

const ForgotPasswordForm = () => {
    const { csrfToken } = useContext(GlobalContext);
    const [forgotEmail, setForgotEmail] = useState('');
    const [searchParams] = useSearchParams();
    const [showLoader, setShowLoader] = useState(false);
    const navigate = useNavigate();

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

            {showLoader && <CircularProgress className="mb-3" />}

            <form
                style={{
                    minWidth: '300px',
                }}
                onSubmit={(e) => {
                    e.preventDefault();

                    if (isFormValid) {
                        setShowLoader(true);

                        fetch('/forgot', {
                            method: HTTPMethod.POST,
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': csrfToken,
                            },
                            body: JSON.stringify({
                                email: forgotEmail,
                            }),
                        })
                            .then((res) => {
                                if (res.ok) {
                                    navigate(
                                        '/forgot-password?email_successfully_sent=true'
                                    );
                                }
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
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
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
                        Reset Password
                    </Button>
                </Stack>
            </form>
        </>
    );
};

export default ForgotPasswordForm;
