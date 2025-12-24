import { Stack, TextField, Button, Alert } from '@mui/material';
import { useContext, useState, type FC } from 'react';
import { Link, useSearchParams } from 'react-router';
import CommonConstants from '../../constants/CommonConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GlobalContext } from '../../context/global-context/GlobalProvider';

type Props = {
    isSignUp?: boolean;
};

const MIN_PASSWORD_LENGTH = 8;

const SusiComponent: FC<Props> = ({ isSignUp }) => {
    const { csrfToken } = useContext(GlobalContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [params] = useSearchParams();

    const emailError =
        email.length > 0 && !CommonConstants.RegExEmail.test(email);
    const passwordError =
        password.length !== 0 && password.length < MIN_PASSWORD_LENGTH;
    const confirmPasswordError = password !== confirmPassword;

    const isFormValid =
        CommonConstants.RegExEmail.test(email) &&
        password.length >= MIN_PASSWORD_LENGTH &&
        (isSignUp
            ? confirmPassword.length >= MIN_PASSWORD_LENGTH &&
              confirmPassword === password
            : true);

    return (
        <>
            {params.get('username_password_error') && (
                <Alert
                    className="mb-3"
                    severity="error"
                >
                    <FontAwesomeIcon icon="xmark" />
                    <span>E-Mail or Password are incorrect.</span>
                </Alert>
            )}

            {params.get('email_error_generating') && (
                <Alert
                    className="mb-3"
                    severity="error"
                >
                    <FontAwesomeIcon icon="xmark" />
                    <span>
                        There was an error while trying to register. Please try
                        again.
                    </span>
                </Alert>
            )}

            {params.get('email_already_exists') && (
                <Alert
                    className="mb-3"
                    severity="info"
                >
                    <FontAwesomeIcon icon="info" />
                    <span>
                        The account is already registered. Please Login or click
                        on the forgot password button if you do not know your
                        password.
                    </span>
                </Alert>
            )}

            {params.get('account_not_activated') && (
                <Alert
                    className="mb-3"
                    severity="info"
                >
                    <FontAwesomeIcon icon="info" />
                    <span>
                        Your Account is not activated yet. Please confirm the
                        link from the confirmation mail. If the link expired,
                        you can get a new Link{' '}
                        <Link to={CommonConstants.Routes.ResendActivationLink}>
                            here
                        </Link>{' '}
                        by specifying your E-Mail.
                    </span>
                </Alert>
            )}

            {params.get('account_not_activated_but_registered') && (
                <Alert
                    className="mb-3"
                    severity="info"
                >
                    <FontAwesomeIcon icon="info" />
                    <span>
                        Your Account is already registered but not activated
                        yet. Please confirm the link from the confirmation mail.
                    </span>
                </Alert>
            )}

            {params.get('email_sent') && (
                <Alert
                    className="mb-3"
                    severity="success"
                >
                    <FontAwesomeIcon icon="check" />
                    <span>
                        User created. To finish your registration please confirm
                        your account by clicking the link in the registration
                        mail you received.
                    </span>
                </Alert>
            )}

            <form
                {...(isFormValid
                    ? {
                          method: 'post',
                          action: isSignUp ? '/register' : '/login',
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
                        type="email"
                        placeholder="mail@example.com"
                        id="email"
                        fullWidth
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
                    <TextField
                        type="password"
                        id="password"
                        fullWidth
                        name="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={passwordError}
                        helperText={
                            passwordError
                                ? 'Password must be at least 8 characters'
                                : ' '
                        }
                    ></TextField>
                    {isSignUp && (
                        <TextField
                            type="password"
                            id="confirmPassword"
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={confirmPasswordError}
                            helperText={
                                confirmPassword
                                    ? 'Passwords need to match'
                                    : ' '
                            }
                        ></TextField>
                    )}
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
                        {isSignUp ? 'Register' : 'Login'}
                    </Button>
                    {!isSignUp && (
                        <Link to={CommonConstants.Routes.PasswordForgot}>
                            <Button type="button">Forgot your Password?</Button>
                        </Link>
                    )}
                </Stack>
            </form>
        </>
    );
};

export default SusiComponent;
