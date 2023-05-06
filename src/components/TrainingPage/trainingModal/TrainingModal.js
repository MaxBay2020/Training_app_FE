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
import Typography from "@mui/material/Typography";
import {UserRole, wordsLimit} from "../../../utils/consts";
import {ThemeProvider} from "@emotion/react";
import {commonStyles, commontStyles} from "../../../styles/commontStyles";
import Button from "@mui/material/Button";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import api from "../../../api/api";
import useCreateTraining from "../../../hooks/trainingHooks/useCreateTraining";
import useFetchTrainingTypes from "../../../hooks/trainingHooks/useFetchTrainingTypes";
import {useSelector} from "react-redux";
import useUpdateTraining from "../../../hooks/trainingHooks/useUpdateTraining";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {toast} from "react-toastify";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {AddCircleOutlineOutlined} from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup";
import {trainingSchema} from "../../../utils/schema";
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

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
    const [startDate, setStartDate] = useState(isUpdating ? dayjs(training.startDate) : dayjs(new Date()))
    const [endDate, setEndDate] = useState(isUpdating ? dayjs(training.endDate) : dayjs(new Date()))
    const [hoursCount, setHoursCount] = useState(isUpdating ? training.hoursCount : 1)
    const [trainingURL, setTrainingURL] = useState(isUpdating ? training.trainingURL : '')
    const traineeInitialised = {
        traineeEmail: '',
        traineeFirstName: '',
        traineeLastName: '',
    }
    const [trainee, setTrainee] = useState(traineeInitialised)
    const [traineeList, setTraineeList] = useState([])
    const [addMyself, setAddMyself] = useState(isUpdating)
    const [error, setError] = useState(null)


    const { userName, userEmail, userRole } = useSelector(state => state.user)
    const {isLoading, data: trainingTypes}
        = useFetchTrainingTypes(['queryAllTrainingTypes'], '/training/trainingTypes')

    const { mutate: addTraining } = useCreateTraining()
    const { mutate: updateTraining } = useUpdateTraining()

    const { handleSubmit, control, formState: { errors } }  = useForm({
        resolver: yupResolver(trainingSchema)
    })

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

    const createTraining = (data) => {
        const { trainingType, trainingName, trainingUrl } = data

        const newTraining = {
            trainingName,
            trainingType,
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
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
            (<Button variant="contained" onClick={handleSubmit(createTraining)}>Create</Button>)
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

    return (
        <ThemeProvider theme={theme}>
            <Modal
                open={open}
                onClose={() => {closeForm()}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={styles.modalStyle}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={1}
                    >

                        {/*<Controller*/}
                        {/*    control={control}*/}
                        {/*    name={'test'}*/}
                        {/*    render={({ field }) => (*/}
                        {/*        <TextField*/}
                        {/*            {...field}*/}
                        {/*            variant='outlined'*/}
                        {/*            error={!!errors['test']}*/}
                        {/*            helperText={*/}
                        {/*                errors['test'] ? 'error!' : ''*/}
                        {/*            }*/}
                        {/*        />*/}
                        {/*    )}*/}
                        {/*/>*/}

                        {/*<div onClick={handleSubmit(submitForm)}>click</div>*/}

                        <Grid item>
                            {/*<FormControl>*/}
                            {/*    <InputLabel htmlFor="trinity-select">*/}
                            {/*        Choose one Person of trinity*/}
                            {/*    </InputLabel>*/}
                            {/*    <Controller*/}
                            {/*        control={control}*/}
                            {/*        name="trainingType"*/}
                            {/*        render={({field}) =>(*/}
                            {/*            <Select*/}
                            {/*                id="trinity-select"*/}
                            {/*                {...field}*/}
                            {/*                value={trainingType}*/}
                            {/*                onChange={e => setTrainingType(e.target.value)}*/}
                            {/*            >*/}
                            {/*                <MenuItem>1</MenuItem>*/}
                            {/*                <MenuItem>2</MenuItem>*/}
                            {/*            </Select>*/}
                            {/*        )}*/}
                            {/*    />*/}
                            {/*</FormControl>*/}
                            <Controller
                                control={control}
                                name={'trainingType'}
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        error={!!errors.trainingType}
                                    >
                                        <InputLabel id="demo-simple-select-label">Training Type</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="trainingType"
                                            value={field.value}
                                            onChange={field.onChange}
                                            // vale={trainingType}
                                            // onChange={e => setTrainingType(e.target.value)}
                                        >
                                            {
                                                !isLoading && trainingTypes.map((trainingType, index) => (<MenuItem key={index} value={trainingType}>{trainingType}</MenuItem>))
                                            }
                                        </Select>

                                        {
                                            errors.trainingType && <FormHelperText id="my-helper-text">{errors.trainingType.message}</FormHelperText>
                                        }
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item>
                            <Controller
                                control={control}
                                name={'trainingName'}
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        variant="outlined"
                                        {...field}
                                        error={!!errors.trainingName}
                                    >
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
                                        {
                                            errors.trainingName && <FormHelperText id="my-helper-text">{errors.trainingName.message}</FormHelperText>
                                        }
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item>
                            <Grid container
                                alignItems='center'
                                justifyContent='space-between'
                            >
                                <Grid item xs={12} md={5.5}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer
                                            components={[
                                                'DatePicker',
                                                'MobileDatePicker',
                                                'DesktopDatePicker',
                                                'StaticDatePicker',
                                            ]}
                                        >
                                            <DatePicker
                                                value={startDate}
                                                onChange={value => setStartDate(value)}
                                                disableFuture
                                                // defaultValue={}
                                                label='Start Date'
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    {/*<TrainingDatePicker*/}
                                    {/*    date={startDate}*/}
                                    {/*    setDate={setStartDate}*/}
                                    {/*    name='Start Date'*/}
                                    {/*    control={control}*/}
                                    {/*    errors={errors}*/}
                                    {/*/>*/}
                                </Grid>
                                <Grid item xs={12} md={5.5}>
                                    {/*<TrainingDatePicker*/}
                                    {/*    date={endDate}*/}
                                    {/*    setDate={setEndDate}*/}
                                    {/*    name='End Date'*/}
                                    {/*    control={control}*/}
                                    {/*    errors={errors}*/}
                                    {/*/>*/}
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer
                                            components={[
                                                'DatePicker',
                                                'MobileDatePicker',
                                                'DesktopDatePicker',
                                                'StaticDatePicker',
                                            ]}
                                        >
                                            <DatePicker
                                                value={endDate}
                                                onChange={value => setEndDate(value)}
                                                disableFuture
                                                minDate={startDate}
                                                // defaultValue={}
                                                label='End Date'
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
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
                            <Controller
                                control={control}
                                name='trainingUrl'
                                render={({field}) => (
                                    <FormControl
                                        {...field}
                                        sx={commonStyles.fullWidth}
                                        variant="outlined"
                                        error={!!errors.trainingUrl}
                                    >
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
                                            label="Training URL"
                                        />
                                        {
                                            errors.trainingUrl && <FormHelperText id="my-helper-text">{errors.trainingUrl.message}</FormHelperText>
                                        }
                                    </FormControl>
                                )}
                            >

                            </Controller>
                        </Grid>

                        {
                            !isUpdating &&  userRole === UserRole.SERVICER_COORDINATOR && renderTraineeListUI()
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
        </ThemeProvider>
    )
}

export default TrainingModal
