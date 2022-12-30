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

const TrainingModal = ({open, setOpen, isCreating, isUpdating}) => {

    const [wordsRemaining, setWordsRemaining] = useState(wordsLimit)

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [trainingType, setTrainingType] = useState('')
    const [trainingName, setTrainingName] = useState('')
    const [url, setUrl] = useState('')


    const trainingNameHandler = e => {
        const input = e.target.value
        if(input.length > wordsLimit){
            return
        }

        setWordsRemaining(wordsLimit - input.length)
        setTrainingName(input)
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
                        alignItems="center"
                    >
                        <Grid item>
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Training Name</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type='text'
                                    value={trainingName}
                                    onChange={e => trainingNameHandler(e)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <Typography variant='span'>{wordsRemaining} remaining</Typography>
                                        </InputAdornment>
                                    }
                                    label="trainingName"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Training Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={trainingType}
                                        label="trainingType"
                                        onChange={e => setTrainingType(e.target.value)}
                                    >
                                        <MenuItem value='LiveTraining'>LiveTraining</MenuItem>
                                        <MenuItem value='ECLASS'>ECLASS</MenuItem>
                                        <MenuItem value='Webinar'>Webinar</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
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

                        <Grid item><TextField id="standard-basic" label="Hours" variant="outlined" /></Grid>

                        {/* TODO: distract url input and training name input to a single component */}
                        <Grid item>
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">URL</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type='text'
                                    value={trainingName}
                                    onChange={e => trainingNameHandler(e)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <Typography variant='span'>{wordsRemaining} remaining</Typography>
                                        </InputAdornment>
                                    }
                                    label="url"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>


                </Box>
            </Modal>
        </ThemeProvider>
    )
}

export default TrainingModal
