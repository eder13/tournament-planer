import {
    Alert,
    Box,
    Button,
    Modal,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { usePostCreateTournament } from '../../hooks/usePostCreateTournament/usePostCreateTournament';

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

    const isErrorText = text.length < 2;
    const isFormValid = text.length >= 2;

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
                    {/* TODO: Style properly */}
                    {isSuccess && (
                        <Alert
                            className="mb-3"
                            severity="success"
                        >
                            Successfully Created your Tournament "{text}""
                        </Alert>
                    )}

                    {isError && (
                        <Alert
                            className="mb-3"
                            severity="error"
                        >
                            Could not create Tournament "{text}""
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
                                    mutate(text);
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
                                            ? 'Specify a name with at least 2 characters'
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
                        <div>Loading...</div>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default ModalAddTournament;
