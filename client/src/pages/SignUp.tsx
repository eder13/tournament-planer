import type { FC } from 'react';
import Page from '../structure/page/Page';
import SusiComponent from '../components/signup-signin-component/SusiComponent';

const SignUp: FC = () => {
    return (
        <Page>
            <h1 className="mb-5">Register</h1>
            <SusiComponent isSignUp={true} />
        </Page>
    );
};

export default SignUp;
