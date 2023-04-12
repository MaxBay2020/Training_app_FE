import {FormControl, Grid, Modal, OutlinedInput} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useState} from "react";
import {useSelector} from "react-redux";
import useWithdrawTraining from "../../../hooks/trainingHooks/useWithdrawTraining";


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

const TrainingWithdrawModal = ({open, setOpen, training}) => {
    const { trainingName } = training

    const [trainingNameTyped, setTrainingNameTyped] = useState('')
    const { email } = useSelector( state => state.user )

    const { mutate: withdrawTraining } = useWithdrawTraining()

    const withdrawTrainingByTrainingId = training => {
        const { id: trainingId } = training
        withdrawTraining({ email, trainingId })
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
                                This will permanently cancel the <b>{trainingName}</b> training.
                            </Typography>
                        </Grid>
                        {/*<Grid item>*/}
                        {/*    <Typography id="modal-modal-description" sx={{ mt: 2 }}  variant='body2'>*/}
                        {/*        Please type <b>{trainingName}</b> to confirm.*/}
                        {/*    </Typography>*/}
                        {/*</Grid>*/}
                        {/*<Grid item>*/}
                        {/*    <FormControl sx={{ width: '100%' }} variant="outlined" size="small">*/}
                        {/*        <OutlinedInput*/}
                        {/*            id="outlined-adornment-withdraw-notice"*/}
                        {/*            aria-describedby="outlined-withdraw-notice-helper-text"*/}
                        {/*            inputProps={{*/}
                        {/*                'aria-label': 'notice',*/}
                        {/*            }}*/}
                        {/*            onChange={ e => setTrainingNameTyped(e.target.value)}*/}
                        {/*        />*/}
                        {/*    </FormControl>*/}
                        {/*</Grid>*/}
                        <Grid item>
                            <Button
                                // disabled={trainingNameTyped !== trainingName}
                                variant="contained"
                                disableElevation
                                color='error'
                                sx={styles.fullWidth}
                                onClick={() => withdrawTrainingByTrainingId(training)}
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

export default TrainingWithdrawModal
