import Box from "@mui/material/Box";
import {
    Checkbox, Chip,
    createTheme,
    FormControl,
    FormHelperText,
    Grid, Input,
    InputAdornment,
    InputLabel,
    Modal,
    OutlinedInput,
    Select,
    TextField, Tooltip
} from "@mui/material";
import {useState} from "react";
import 'react-day-picker/dist/style.css';
import TrainingDatePicker from "./TrainingDatePicker";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import {AddCircleOutlineOutlined, RemoveCircleOutlineOutlined} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {UserRole, wordsLimit} from "../../../utils/consts";
import {ThemeProvider} from "@emotion/react";
import {commonStyles, modalStyles} from "../../../styles/commontStyles";
import Button from "@mui/material/Button";
import useCreateTraining from "../../../hooks/trainingHooks/useCreateTraining";
import useFetchTrainingTypes from "../../../hooks/trainingHooks/useFetchTrainingTypes";
import useUpdateTraining from "../../../hooks/trainingHooks/useUpdateTraining";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {toast} from "react-toastify";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {AddCircleOutlineOutlined} from "@mui/icons-material";

const styles = {
    modalStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
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
        },
        caption: {
            fontSize: '12px'
        }
    }
})

const TrainingModal = ({open, setOpen, isCreating, isUpdating, training}) => {

    const [trainingNameWordsRemaining, setTrainingNameWordsRemaining] = useState(isUpdating ? wordsLimit - training.trainingName.length : wordsLimit)
    const [trainingUrlWordsRemaining, setTrainingUrlWordsRemaining] = useState(isUpdating ? wordsLimit - training.trainingURL.length : wordsLimit)


    const [trainingName, setTrainingName] = useState(isUpdating ? training.trainingName : '')
    const [trainingType, setTrainingType] = useState(isUpdating ? training.trainingType : '')
    const [startDate, setStartDate] = useState(isUpdating ? training.startDate : '')
    const [endDate, setEndDate] = useState(isUpdating ? training.endDate : '')
    const [hoursCount, setHoursCount] = useState(isUpdating ? training.hoursCount : 1)
    const [trainingURL, setTrainingURL] = useState(isUpdating ? training.trainingURL : '')

    const traineeInitialData = {
        traineeEmail:'',
        traineeFirstName:'',
        traineeLastName:'',
    }
    const [trainee, setTrainee] = useState(traineeInitialData)
    const [traineeList, setTraineeList] = useState([])
    const {userName, userEmail, userRole} = useSelector(state => state.user)

    const {isLoading, data: trainingTypes}
        = useFetchTrainingTypes(['queryAllTrainingTypes'], '/training/trainingTypes')

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

    const trainingHoursHandler = e => {
        const { value } = e.target
        if(value <= 0){
            return
        }
        setHoursCount(value)
    }

    const fillTraineeInfo = e => {
        const { name, value } = e.target
        setTrainee({
            ...trainee,
            [name]: value.trim()
        })
    }

    const addTrainee = () =>{
        if(Object.keys(trainee).length !== Object.values(trainee).filter(item => item).length){
            toast.error('Please fill trainee info')
            return false
        }
        setTraineeList([...traineeList, trainee])
        setTrainee(traineeInitialised)
        return true
    }

    const deleteTraineeFromTraineeList = traineeEmail => {
        setTraineeList(traineeList.filter(trainee => trainee.traineeEmail !== traineeEmail))
    }

    // const addMyselfHandler = e => {
    //     const isChecked = e.target.checked
    //     setAddMyself(isChecked)
    //     if(isChecked){
    //         const myInfo = {
    //             traineeEmail: userEmail,
    //             traineeFirstName: userName,
    //             traineeLastName: userName,
    //         }
    //         setTraineeList([...traineeList, myInfo])
    //     }else{
    //         setTraineeList(traineeList.filter(trainee => trainee.traineeEmail !== userEmail))
    //     }
    // }

    const closeForm = () => {
        setTrainingName('')
        setTrainingType('')
        setStartDate('')
        setEndDate('')
        setHoursCount(1)
        setTrainingURL('')
        setTraineeList([])
        setTrainee(traineeInitialised)
        setTrainingNameWordsRemaining(wordsLimit)
        setTrainingUrlWordsRemaining(wordsLimit)
        setAddMyself(false)
        setOpen(false)
    }

    const createTraining = () => {
        const newTraining = {
            trainingName,
            trainingType,
            startDate,
            endDate,
            hoursCount: +hoursCount,
            trainingURL,
            traineeList: traineeList.length === 0 ? [trainee] : traineeList
        }

        addTraining(newTraining)
        closeForm()
    }

    const updateTrainingHandler = () => {
        const updatedTraining = {
            trainingId: training.id,
            trainingName,
            trainingType,
            startDate,
            endDate,
            hoursCount: +hoursCount,
            trainingURL,
            traineeList:[]
        }
        updateTraining(updatedTraining)
        closeForm()
    }

    const renderCreateOrUpdateButton = () => {
        return isUpdating ?
            (<Button variant="contained" onClick={() => updateTrainingHandler()}>Update</Button>)
            :
            (<Button variant="contained" onClick={() => createTraining()}>Create</Button>)
    }
    const renderTraineeListUI = () => {
        return <>
            <Grid item>
                {
                    traineeList.map((trainee, index) => (
                        // <Chip
                        //     key={index}
                        //     label={trainee.traineeEmail}
                        //     sx={{mr: 1, mb: 1}}
                        //     // onClick={()=>{}}
                        //     onDelete={()=>deleteTraineeFromTraineeList(trainee.traineeEmail)}
                        // />
                        <Grid container
                              direction='row'
                              alignItems='center'
                              justifyContent='space-between'
                              spacing={1}
                              pt={2}
                              pb={2}
                              pl={2}
                        >
                            <Grid item xs={12} md={5}>
                                <Typography variant='caption'>{trainee.traineeEmail}</Typography>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Typography variant='caption'>{trainee.traineeFirstName}</Typography>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Typography variant='caption'>{trainee.traineeLastName}</Typography>
                            </Grid>

                            <Grid item xs={1}>
                                <Tooltip title="Remove" placement="top">
                                    <IconButton onClick={()=>deleteTraineeFromTraineeList(trainee.traineeEmail)}>
                                        <RemoveCircleOutlineIcon color='error' />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    ))
                }
            </Grid>



            <Grid item>
                <Grid container
                      direction='row'
                      alignItems='center'
                      justifyContent='space-between'
                      spacing={1}
                >
                    <Grid item xs={12} md={6}>
                        <FormControl sx={commonStyles.fullWidth} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Trainee Email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type='text'
                                name='traineeEmail'
                                value={trainee.traineeEmail}
                                onChange={e => fillTraineeInfo(e)}
                                label="traineeList"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <FormControl sx={commonStyles.fullWidth} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Trainee First Name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type='text'
                                name='traineeFirstName'
                                value={trainee.traineeFirstName}
                                onChange={e => fillTraineeInfo(e)}
                                label="traineeList"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <FormControl sx={commonStyles.fullWidth} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Trainee Last Name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type='text'
                                name='traineeLastName'
                                value={trainee.traineeLastName}
                                onChange={e => fillTraineeInfo(e)}
                                label="traineeList"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item>
                <IconButton
                    variant="outlined" size="small"
                    onClick={() => addTrainee()}
                    sx={{ fontSize: "14px", border: "4px", borderRadius: 1, mb: 0.5 }}
                >
                    <AddCircleOutlineOutlined color='primary' mr={0.5}/>
                    Add More Trainee(s)
                </IconButton>

            </Grid>

            {/*<Grid item>*/}
            {/*    <Grid container*/}
            {/*          alignItems='center'*/}
            {/*          justifyContent='space-between'>*/}
            {/*        <Grid item>*/}
            {/*            <FormControlLabel*/}
            {/*                sx={commonStyles.fullWidth}*/}
            {/*                control={<Checkbox checked={addMyself} />}*/}
            {/*                onChange={e => addMyselfHandler(e)}*/}
            {/*                label="Add Myself"*/}
            {/*            />*/}
            {/*        </Grid>*/}
            {/*    </Grid>*/}
            {/*</Grid>*/}
        </>
    }

    const renderTraineeListUI = ()=> {
        return <>
            <Grid item>
                    {
                        traineeList.map((trainee, index) =>(
                            // <Chip
                            //     label={trainee.traineeEmail}
                            //     key={index}
                            //     variant="outlined"
                            //     sx={{m:1}}
                            //     // onClick={()=>{}}
                            //     onDelete={()=>deleteTrainee(trainee.traineeEmail)}
                            // />

                            <Grid container direction='row' justifyContent='space-between'spacing={1}>
                                <Grid item xs={5} md={5}>
                                    <FormControl sx={commonStyles.fullWidth} disabled variant="standard">
                                        {/*<InputLabel htmlFor="component-disabled">Name</InputLabel>*/}
                                        <Input id="component-disabled" defaultValue={trainee.traineeEmail} />
                                        <FormHelperText>Trainee Email</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3} md={3}>
                                    <FormControl sx={commonStyles.fullWidth} disabled variant="standard">
                                        <Input id="component-disabled" defaultValue={trainee.traineeFirstName} />
                                        <FormHelperText>Trainee First Name</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3} md={3}>
                                    <FormControl sx={commonStyles.fullWidth} disabled variant="standard">
                                        <Input id="component-disabled" defaultValue={trainee.traineeLastName} />
                                        <FormHelperText>Trainee Last Name</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={1} md={1}>
                                    <Chip
                                        onDelete={()=>deleteTrainee(trainee.traineeEmail)}>
                                    </Chip>
                                </Grid>
                            </Grid>
                        ))
                    }

            </Grid>

            <Grid item>
                <Grid container alignItems='center' justifyContent='space-between' spacing={1}>
                    <Grid item xs={12}>
                        <FormControl sx={commonStyles.fullWidth} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Trainee Email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type='text'
                                name='traineeEmail'
                                value={trainee.traineeEmail}
                                onChange={e => fillTraineeInfo(e)}
                                label="traineeEmail"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl sx={commonStyles.fullWidth} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Trainee First Name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type='text'
                                name='traineeFirstName'
                                value={trainee.traineeFirstName}
                                onChange={e => fillTraineeInfo(e)}
                                label="traineeList"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl sx={commonStyles.fullWidth} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Trainee Last Name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type='text'
                                name='traineeLastName'
                                value={trainee.traineeLastName}
                                onChange={e => fillTraineeInfo(e)}
                                label="traineeList"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid container alignItems='center' justifyContent='space-between' spacing={1}>
                    <Grid item sx={commonStyles.fullWidth}>
                        <IconButton
                            variant="outlined" size="small"
                            onClick={() => addTraineeHandler()}
                            sx={{ fontSize: "14px", border: "4px", borderRadius: 1, mb: 0.5 }}
                        >
                            <AddCircleOutlineOutlined color='primary' mr={0.5}/>
                             Add More Trainee(s)
                        </IconButton>
                    </Grid>

                    {/*<Grid item alignItems= 'left' >*/}
                    {/*    <FormControlLabel*/}
                    {/*        sx={commonStyles.fullWidth}*/}
                    {/*        control={<Checkbox  />}*/}
                    {/*        onChange={addMyselfHandler}*/}
                    {/*        label="Add Myself" />*/}
                    {/*</Grid>*/}
                </Grid>

            </Grid>
        </>
    }

    return (
        <ThemeProvider theme={theme}>
            <Modal
                open={open}
                onClose={() => {closeForm()}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={modalStyles.modalStyle}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="stretch"
                    >
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
                                        !isLoading && trainingTypes.map((trainingType, index) =>
                                            (<MenuItem key={index} value={trainingType}>{trainingType}</MenuItem>))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>

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
                            <Grid container alignItems='center' justifyContent='center' spacing={1}>
                                <Grid item xs = {6}>
                                    <TrainingDatePicker
                                        date={startDate}
                                        setDate={setStartDate}
                                        isStartDate={true}
                                        name='Start Date'
                                    />
                                </Grid>
                                <Grid item xs = {6}>
                                    <TrainingDatePicker
                                        date={endDate}
                                        setDate={setEndDate}
                                        isStartDate={false}
                                        name='End Date'
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <FormControl sx={commonStyles.fullWidth}>
                                <TextField
                                    value={+hoursCount}
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

                        {
                            !isUpdating && userRole === UserRole.SERVICER_COORDINATOR && renderTraineeListUI()
                        }

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
                                        onClick={() => closeForm()}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </ThemeProvider> )
}

export default TrainingModal
