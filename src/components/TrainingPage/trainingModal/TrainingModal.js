import Box from "@mui/material/Box";
import {
    createTheme,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    InputLabel,
    Modal,
    OutlinedInput,
    Select,
    TextField
} from "@mui/material";
import {useState} from "react";
import 'react-day-picker/dist/style.css';
import TrainingDatePicker from "./TrainingDatePicker";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {wordsLimit} from "../../../utils/consts";
import {ThemeProvider} from "@emotion/react";
import {commonStyles, commontStyles} from "../../../styles/commontStyles";
import Button from "@mui/material/Button";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import api from "../../../api/api";
import useCreateTraining from "../../../hooks/useCreateTraining";
import useFetchTrainingTypes from "../../../hooks/useFetchTrainingTypes";
import {useSelector} from "react-redux";
import useUpdateTraining from "../../../hooks/useUpdateTraining";

const styles = {
    modalStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }
}

const theme = createTheme({
    typography: {
        span: {
            fontSize: '14px'
        }
    }
})

const TrainingModal = ({open, setOpen, isCreating, isUpdating, training}) => {

    const [trainingNameWordsRemaining, setTrainingNameWordsRemaining] = useState(wordsLimit)
    const [trainingUrlWordsRemaining, setTrainingUrlWordsRemaining] = useState(wordsLimit)

    const [trainingName, setTrainingName] = useState(training?.trainingName || '')
    const [trainingType, setTrainingType] = useState(training?.trainingType || '')
    const [startDate, setStartDate] = useState(training?.startDate || '')
    const [endDate, setEndDate] = useState(training?.endDate || '')
    const [hoursCount, setHoursCount] = useState(training?.hoursCount || 1)
    const [trainingURL, setTrainingURL] = useState(training?.trainingURL || '')
    const { email } = useSelector( state => state.login )

    const {isLoading, data: trainingTypes}
        = useFetchTrainingTypes(['queryAllTrainingTypes'], '/training/trainingTypes', {})

    const { mutate: addTraining } = useCreateTraining()
    const { mutate: updateTraining } = useUpdateTraining()


    const trainingNameHandler = e => {
        const input = e.target.value
        if(input.length > wordsLimit){
            return
        }

        setTrainingNameWordsRemaining(wordsLimit - input.length)
        setTrainingName(input)
    }

    const trainingUrlHandler = e => {
        const input = e.target.value
        if(input.length > wordsLimit){
            return
        }

        setTrainingUrlWordsRemaining(wordsLimit - input.length)
        setTrainingURL(input)
    }

    // const inputWithWordsLimit = (e, inputName) => {
    //     const input = e.target.value
    //     if(input.length > wordsLimit){
    //         return
    //     }
    //
    //     if(inputName === 'trainingName'){
    //         setTrainingNameWordsRemaining(wordsLimit - input.length)
    //         setTrainingName(input)
    //     }
    //     if(inputName === 'trainingUrl'){
    //         setTrainingUrlWordsRemaining(wordsLimit - input.length)
    //         setUrl(input)
    //     }
    //
    // }

    const trainingHoursHandler = e => {
        const { value } = e.target
        if(value <= 0){
            return
        }
        setHoursCount(value)
    }

    const createTraining = () => {
        const newTraining = {
            trainingName,
            email,
            trainingType,
            startDate,
            endDate,
            hoursCount: +hoursCount,
            trainingURL,
        }

        addTraining(newTraining)
        setTrainingName('')
        setTrainingType('')
        setStartDate('')
        setEndDate('')
        setHoursCount(1)
        setTrainingURL('')
        setOpen(false)
    }

    const updateTrainingHandler = () => {
        const updatedTraining = {
            trainingId: training.id,
            trainingName,
            email,
            trainingType,
            startDate,
            endDate,
            hoursCount: +hoursCount,
            trainingURL,
        }
        updateTraining(updatedTraining)
        setOpen(false)
    }

    const renderCreateOrUpdateButton = () => {
        return training ?
            (<Button variant="contained" onClick={() => updateTrainingHandler()}>Update</Button>)
            :
            (<Button variant="contained" onClick={() => createTraining()}>Create</Button>)
    }

    return (
        <ThemeProvider theme={theme}>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styles.modalStyle}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="stretch"
                    >
                        <Grid item>
                            <FormControl sx={commonStyles.fullWidth} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Training Name</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type='text'
                                    value={trainingName}
                                    onChange={e => trainingNameHandler(e)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <Typography variant='span'>{trainingNameWordsRemaining} remaining</Typography>
                                        </InputAdornment>
                                    }
                                    label="trainingName"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl sx={commonStyles.fullWidth}>
                                <InputLabel id="demo-simple-select-label">Training Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={trainingType}
                                    label="trainingType"
                                    onChange={e => setTrainingType(e.target.value)}
                                >
                                    {
                                        !isLoading && trainingTypes.map((trainingType, index) => (<MenuItem key={index} value={trainingType}>{trainingType}</MenuItem>))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <TrainingDatePicker
                                date={startDate}
                                setDate={setStartDate}
                                name='Start Date'
                            />
                        </Grid>
                        <Grid item>
                            <TrainingDatePicker
                                date={endDate}
                                setDate={setEndDate}
                                name='End Date'
                            />
                        </Grid>

                        <Grid item>
                            <FormControl sx={commonStyles.fullWidth}>
                                <TextField
                                    value={hoursCount}
                                    onChange={e => trainingHoursHandler(e)}
                                    id="standard-basic"
                                    label="Hours"
                                    variant="outlined"
                                    type="number"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item>
                            <FormControl sx={commonStyles.fullWidth} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">URL</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type='text'
                                    value={trainingURL}
                                    onChange={e => trainingUrlHandler(e)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <Typography variant='span'>{trainingUrlWordsRemaining} remaining</Typography>
                                        </InputAdornment>
                                    }
                                    label="url"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item>
                            <Grid
                                container
                                alignItems='center'
                                justifyContent='center'
                                spacing={1}
                            >
                                <Grid item>
                                    {renderCreateOrUpdateButton()}
                                </Grid>

                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </ThemeProvider>
    )
}

export default TrainingModal
