import {FormControl, Grid, Modal, OutlinedInput} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useCommonMutate from "../../../hooks/useCommonMutate";
import {createOrUpdateEnum} from "../../../utils/consts";


const styles = {
    box: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    },
    fullWidth: {
        width: '100%'
    }
};

const ServicerDeleteModal = ({open, setOpen, currentServicer}) => {
    const {
        mutate: updateServicer
    } = useCommonMutate(['queryAllServicers'], createOrUpdateEnum.delete, 'admin/servicer')

    const deleteServicerByServicerId = () => {
        updateServicer({
            id: currentServicer?.sm_id
        })
        setOpen(false)
    }

    return (
        <>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styles.box}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="space-around"
                        alignItems="stretch"
                        spacing={2}
                    >
                        <Grid item>
                            <Typography id="modal-modal-title" variant="subtitle">
                                Are you absolutely sure?
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }} variant='body2'>
                                This action <b>cannot</b> be undone.
                                This will permanently cancel the <b>{currentServicer?.sm_id}</b> servicer.
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Button
                                // disabled={trainingNameTyped !== trainingName}
                                variant="contained"
                                disableElevation
                                color='error'
                                sx={styles.fullWidth}
                                onClick={() => deleteServicerByServicerId()}
                            >
                                I understand the consequences, cancel this training
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    )
}

export default ServicerDeleteModal
