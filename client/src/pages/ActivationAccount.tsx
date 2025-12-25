import Page from '../structure/page/Page';
import { NewActivationLink } from '../components/new-activation-link-account/NewActivationLink';

const ActivationAccount = () => {
    return (
        <Page>
            <h1 className="mb-5">Enter E-Mail to activate Account</h1>
            <NewActivationLink />
        </Page>
    );
};

export default ActivationAccount;
