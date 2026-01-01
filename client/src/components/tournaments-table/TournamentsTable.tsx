import { useEffect, useState, type FC } from 'react';
import type { DataTournamentsResult } from '../../types/common';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router';
import './TournamentsTable.css';
import CustomToolbar from './tournament-table-custom-toolbar/TournamentTableCustomToolbar';
import UtilsHelper from '../../utils/UtilsHelper';
import { useDeleteTournament } from '../../hooks/useDeleteTournament/useDeleteTournament';
import { useTimedMessageDisplay } from '../../hooks/useTimedMessageDisplay/useTimedMessageDisplay';
import { Alert, CircularProgress } from '@mui/material';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 500 },
    { field: 'name', headerName: 'Tournament Name', width: 360 },
    {
        field: 'created_on',
        headerName: 'Created',
        width: 200,
        valueFormatter: (params) => UtilsHelper.parseDate(params as Date),
    },
    { field: 'started', headerName: 'active', width: 100 },
];

const paginationModel = { page: 0, pageSize: 5 };

type Props = {
    tournaments: Array<DataTournamentsResult>;
};

const TournamentsTable: FC<Props> = ({ tournaments }) => {
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>();
    const [rowData, setRowData] = useState(tournaments);
    const { isSuccess, isPending, isError, mutateAsync } =
        useDeleteTournament();
    const showSuccessBox = useTimedMessageDisplay(isSuccess);
    const showDeleteBox = useTimedMessageDisplay(isError);

    useEffect(() => {
        const transformedData = tournaments.map((dataEntry) => {
            return {
                id: dataEntry.id,
                name: dataEntry.name,
                created_on: dataEntry.created_on,
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
                    await mutateAsync(rowData.map((data) => data.id));
                } else {
                    // delete only the ones that have NOT been excluded
                    const toDelete = rowData.filter(
                        (val) => !selectedIds?.ids.has(val.id)
                    );
                    await mutateAsync(toDelete.map((data) => data.id));
                }
            } else if (selectedIds.type === 'include') {
                // delete only the ones that HAVE BEEN included
                const toDelete = rowData.filter((val) =>
                    selectedIds?.ids.has(val.id)
                );
                await mutateAsync(toDelete.map((data) => data.id));
            }
        }
    };

    if (isPending) {
        return <CircularProgress />;
    }

    return (
        <>
            {showSuccessBox && (
                <Alert severity="success">
                    Successfully Deleted the selected items
                </Alert>
            )}
            {showDeleteBox && (
                <Alert severity="error">
                    There was an error deleting selected items
                </Alert>
            )}
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
        </>
    );
};

export default TournamentsTable;
