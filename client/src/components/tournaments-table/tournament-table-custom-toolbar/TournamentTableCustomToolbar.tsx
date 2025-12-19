import { Button } from '@mui/material';
import type { GridRowSelectionModel } from '@mui/x-data-grid';
import type { FC } from 'react';

type Props = {
    selectedIds: GridRowSelectionModel | undefined;
    onDelete: () => void;
};

const CustomToolbar: FC<Props> = ({ selectedIds, onDelete }) => {
    return (
        <div className="d-flex justify-content-end p-2">
            <Button
                onClick={onDelete}
                disabled={
                    !selectedIds ||
                    (selectedIds?.ids?.size === 0 &&
                        selectedIds?.type !== 'exclude')
                }
                style={{ marginRight: 8 }}
                variant="outlined"
                color="error"
            >
                Delete
            </Button>
        </div>
    );
};

export default CustomToolbar;
