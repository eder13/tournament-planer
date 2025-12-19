import Page from '../structure/page/Page';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/global-context/GlobalProvider';
import ModalAddTournament from '../components/modal-add-new-tournament/ModalAddTournament';
import { Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'react-router';
import TournamentsTable from '../components/tournaments-table/TournamentsTable';
import type { DataTournamentsResult } from '../types/common';

const UserProfile = () => {
    const { user } = useContext(GlobalContext);
    const [tournaments, setTournaments] = useState<
        Array<DataTournamentsResult>
    >([]);
    const [params] = useSearchParams();

    useEffect(() => {
        fetch('/tournaments')
            .then((res) => res.json())
            .then((data) => setTournaments(data));
    }, []);

    return (
        <Page>
            <h1>Welcome</h1>
            <div className="d-flex justify-between mb-4">
                <div className="d-flex items-center">
                    <div>
                        <span>{user.email}</span>
                    </div>
                </div>
                <div>
                    <span className="ms-3">
                        {tournaments.length} Tournament(s)
                    </span>
                </div>
            </div>
            <div>
                {params.get('created') && (
                    <Alert
                        className="mb-3"
                        severity="success"
                    >
                        <FontAwesomeIcon icon="check" />
                        <span>Tournament has been created.</span>
                    </Alert>
                )}
            </div>
            <div className="mb-5">
                <ModalAddTournament />
            </div>
            <div>
                <TournamentsTable
                    tournaments={tournaments}
                    setTournaments={setTournaments}
                />
            </div>
        </Page>
    );
};

export default UserProfile;
