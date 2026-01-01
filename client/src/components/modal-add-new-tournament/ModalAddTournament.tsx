import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Modal,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { usePostCreateTournament } from '../../hooks/usePostCreateTournament/usePostCreateTournament';
import { useTimedMessageDisplay } from '../../hooks/useTimedMessageDisplay/useTimedMessageDisplay';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ModalAddTournament = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const { mutate, isError, isSuccess, isPending } = usePostCreateTournament();
    const showSuccessBox = useTimedMessageDisplay(isSuccess);
    const showErrorBox = useTimedMessageDisplay(isError);

    const isErrorText = !!text.length && text.length < 4;
    const isFormValid = text.length >= 4;

    return (
        <>
            <Button
                className="mb-3"
                variant="contained"
                type="button"
                onClick={() => setOpen(true)}
            >
                Create new Tournament
            </Button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {showSuccessBox && (
                        <Alert
                            className="mb-3"
                            severity="success"
                        >
                            Successfully Created your Tournament
                        </Alert>
                    )}

                    {showErrorBox && (
                        <Alert
                            className="mb-3"
                            severity="error"
                        >
                            Could not create Tournament
                        </Alert>
                    )}

                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        className="mb-3"
                    >
                        Create a new Tournament
                    </Typography>
                    {!isPending ? (
                        <form
                            style={{
                                minWidth: '300px',
                            }}
                            onSubmit={(e) => {
                                e.preventDefault();

                                if (isFormValid) {
                                    mutate(text, {
                                        onSuccess: () => setText(''),
                                    });
                                }
                            }}
                        >
                            <Stack
                                sx={{ maxWidth: '500px' }}
                                spacing={2}
                            >
                                <TextField
                                    placeholder="My awesome Tournament"
                                    id="name"
                                    name="name"
                                    label="Name of Tournament"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    error={isErrorText}
                                    helperText={
                                        isErrorText
                                            ? 'Specify a name with at least 4 characters'
                                            : ''
                                    }
                                ></TextField>
                                <Button
                                    className="mb-3"
                                    variant="contained"
                                    type="submit"
                                    disabled={!isFormValid}
                                >
                                    Create
                                </Button>
                            </Stack>
                        </form>
                    ) : (
                        <div>
                            <CircularProgress />
                        </div>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default ModalAddTournament;
