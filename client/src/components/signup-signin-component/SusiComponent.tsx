import { Stack, TextField, Button, Alert } from '@mui/material';
import { useState, type FC } from 'react';
import { Link, useSearchParams } from 'react-router';
import CommonConstants from '../../constants/CommonConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
    isSignUp?: boolean;
};

const MIN_PASSWORD_LENGTH = 8;

const SusiComponent: FC<Props> = ({ isSignUp }) => {
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
