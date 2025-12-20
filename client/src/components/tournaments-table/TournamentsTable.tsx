import {
    useEffect,
    useState,
    type Dispatch,
    type FC,
    type SetStateAction,
} from 'react';
import type { DataTournamentsResult } from '../../types/common';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router';
import './TournamentsTable.css';
import CustomToolbar from './tournament-table-custom-toolbar/TournamentTableCustomToolbar';
import { HttpCode, HTTPMethod } from '../../../../server/src/constants/common';
import UtilsHelper from '../../utils/UtilsHelper';
import Logger from '../../../../server/src/helpers/logger/index';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 500 },
    { field: 'name', headerName: 'Tournament Name', width: 360 },
    { field: 'created_on', headerName: 'Created', width: 200 },
    { field: 'started', headerName: 'active', width: 100 },
];

const paginationModel = { page: 0, pageSize: 5 };

type Props = {
    tournaments: Array<DataTournamentsResult>;
    setTournaments: Dispatch<SetStateAction<DataTournamentsResult[]>>;
};

const TournamentsTable: FC<Props> = ({ tournaments, setTournaments }) => {
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>();
    const [rowData, setRowData] = useState(tournaments);

    useEffect(() => {
        const transformedData = tournaments.map((dataEntry) => {
            return {
                id: dataEntry.id,
                name: dataEntry.name,
                created_on: UtilsHelper.parseDate(dataEntry.created_on),
                created_by: dataEntry.created_by,
                started: dataEntry.started ? 'ongoing' : 'pending',
            };
        });
        setRowData(transformedData);
    }, [tournaments]);

    const handleDelete = async (
        selectedIds: GridRowSelectionModel | undefined
    ) => {
        if (selectedIds) {
            if (selectedIds.type === 'exclude') {
                if (selectedIds.ids.size === 0) {
                    // delete all of them
                    const promises = rowData.map(async (data) => {
                        const res = await fetch(`/tournaments/${data.id}`, {
                            method: HTTPMethod.DELETE,
                        });

                        if (res.status === HttpCode.NO_CONTENT) {
                            Logger.info(`Deleted ${data.id} successfully.`);
                        }
                    });

                    await Promise.allSettled(promises).then(() => {
                        Logger.info('Table has been updated');
                    });

                    // reset row data to empty array since we deleted everything
                    setRowData([]);
                    setTournaments([]);
                } else {
                    // delete only the ones that have NOT been excluded
                    const toDelete = rowData.filter(
                        (val) => !selectedIds?.ids.has(val.id)
                    );

                    const promises = toDelete.map(async (data) => {
                        const res = await fetch(`/tournaments/${data.id}`, {
                            method: HTTPMethod.DELETE,
                        });

                        if (res.status === HttpCode.NO_CONTENT) {
                            Logger.info(`Deleted ${data.id} successfully.`);
                        }
                    });

                    await Promise.allSettled(promises).then(() => {
                        Logger.info(
                            'Table has been updated - Deleted the ones that have NOT been excluded.'
                        );
                    });

                    // reverse Logic: Removes the once that have been excluded from the row data
                    const filtered = rowData.filter((val) =>
                        selectedIds?.ids.has(val.id)
                    );

                    setRowData(filtered);
                    setTournaments(filtered);
                }
            } else if (selectedIds.type === 'include') {
                // delete only the ones that HAVE BEEN included
                const toDelete = rowData.filter((val) =>
                    selectedIds?.ids.has(val.id)
                );

                const promises = toDelete.map(async (data) => {
                    const res = await fetch(`/tournaments/${data.id}`, {
                        method: HTTPMethod.DELETE,
                    });

                    if (res.status === HttpCode.NO_CONTENT) {
                        Logger.info(`Deleted ${data.id} successfully.`);
                    }
                });

                await Promise.allSettled(promises).then(() => {
                    Logger.info(
                        'Table has been updated - Deleted the ones that HAVE BEEN included.'
                    );
                });

                // reverse Logic: Removes the once that have been included from the row data
                const filtered = rowData.filter(
                    (val) => !selectedIds?.ids.has(val.id)
                );

                setRowData(filtered);
                setTournaments(filtered);
            }
        }
    };

    return (
        <Paper sx={{ height: 420, width: '100%' }}>
            <DataGrid
                rows={rowData}
                columns={columns}
                localeText={{
                    noRowsLabel:
                        'No tournaments found. Start by creating your tournament above.',
                }}
                initialState={{
                    pagination: { paginationModel },
                    sorting: {
                        sortModel: [{ field: 'created_on', sort: 'desc' }],
                    },
                }}
                pageSizeOptions={[5, 10]}
                rowSelection
                checkboxSelection
                sx={{ border: 0 }}
                onCellClick={(params) => {
                    if (params.field === 'id') {
                        navigate(`/userprofile/tournaments/${params.id}`);
                    }
                }}
                rowSelectionModel={selectedIds}
                onRowSelectionModelChange={(ids) => {
                    setSelectedIds(ids);
                }}
                showToolbar
                slots={{
                    toolbar: () => (
                        <CustomToolbar
                            selectedIds={selectedIds}
                            onDelete={() => handleDelete(selectedIds)}
                        />
                    ),
                }}
            />
        </Paper>
    );
};

export default TournamentsTable;
