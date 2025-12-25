import {
    Box,
    Button,
    Modal,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../context/global-context/GlobalProvider';
import { HTTPMethod } from '../../../../server/src/constants/common';
import Logger from '../../../../server/src/helpers/logger';

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
    const { csrfToken } = useContext(GlobalContext);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');

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
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        className="mb-3"
                    >
                        Create a new Tournament
                    </Typography>
                    <form
                        style={{
                            minWidth: '300px',
                        }}
                        onSubmit={(e) => {
                            e.preventDefault();

                            if (isFormValid) {
                                fetch('/tournament', {
                                    method: HTTPMethod.POST,
                                    headers: {
                                        'X-CSRF-Token': csrfToken,
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        name: text,
                                    }),
                                })
                                    .then((res) => {
                                        if (res.ok) {
                                            window.location.href =
                                                '/userprofile?created=true';
                                        }
                                        throw new Error(
                                            'Failed to Create Tournament'
                                        );
                                    })
                                    .catch((e) => {
                                        Logger.error(e);
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
                                        ? 'Specify a name with at least 2 characters'
                                        : ''
                                }
                            ></TextField>
                            <input
                                type="hidden"
                                name="crumb"
                                id="crumb"
                                value={csrfToken}
                            />
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
                </Box>
            </Modal>
        </>
    );
};

export default ModalAddTournament;
