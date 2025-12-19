import {
    Box,
    Button,
    Modal,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';

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
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        className="mb-3"
                    >
                        Create a new Tournament
                    </Typography>
                    <form
                        action="/tournament"
                        method="post"
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
                            ></TextField>
                            <Button
                                className="mb-3"
                                variant="contained"
                                type="submit"
                            >
                                Create
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Modal>
        </>
    );
};

export default ModalAddTournament;
