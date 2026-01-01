import Page from '../structure/page/Page';
import { useContext } from 'react';
import { GlobalContext } from '../context/global-context/GlobalProvider';
import ModalAddTournament from '../components/modal-add-new-tournament/ModalAddTournament';
import { Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'react-router';
import TournamentsTable from '../components/tournaments-table/TournamentsTable';
import type { DataTournamentsResult } from '../types/common';
import { useQuery } from '@tanstack/react-query';
import { QueryConstants } from '../constants/QueryConstants';

const UserProfile = () => {
    const { user } = useContext(GlobalContext);
    const [params] = useSearchParams();

    const {
        isPending,
        data: tournaments,
        isError,
    } = useQuery<Array<DataTournamentsResult>>({
        queryKey: [QueryConstants.DASHBOARD_TOURNAMENTS_DATA],
        queryFn: () => {
            return fetch('/tournaments').then((res) => res.json());
        },
    });

    if (isPending) {
        return <div>Loading Tournaments Data...</div>;
    }

    if (!tournaments || isError) {
        return <div>Error Loading Tournaments Data</div>;
    }

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
                <TournamentsTable tournaments={tournaments} />
            </div>
        </Page>
    );
};

export default UserProfile;
