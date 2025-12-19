import ForgotPasswordForm from '../components/forgot-password-component/ForgotPasswordForm';
import Page from '../structure/page/Page';

const PasswordForgot = () => {
    return (
        <Page>
            <h1 className="mb-5">Reset Password via E-Mail</h1>
            <ForgotPasswordForm />
        </Page>
    );
};

export default PasswordForgot;
