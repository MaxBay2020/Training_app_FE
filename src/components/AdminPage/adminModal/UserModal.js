import Box from "@mui/material/Box";
import {
    Alert,
    AlertTitle,
    createTheme,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Modal, OutlinedInput,
    Select,
    TextField,
} from "@mui/material";
import React, { useState } from "react";
import "react-day-picker/dist/style.css";
import { ThemeProvider } from "@emotion/react";
import { commonStyles } from "../../../styles/commontStyles";
import Button from "@mui/material/Button";
import useCreateUser from "../../../hooks/adminHooks/userMaintenance/useCreateUser";
import useUpdateUser from "../../../hooks/adminHooks/userMaintenance/useUpdateUser";
import useFetchUserRoles from "../../../hooks/adminHooks/userMaintenance/useFetchUserRoles";
import { useQueryClient } from "@tanstack/react-query";
import useFetchAllServicers from "../../../hooks/adminHooks/servicerMaintenance/useFetchAllServicers";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup";
import {userSchema} from "../../../utils/schema";

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




const UserModal = ({open, setOpen, isUpdating, user}) => {

    const [email, setEmail] = useState(isUpdating? user.email : '')
    const [firstName, setFirstName] = useState(isUpdating? user.firstName : '');
    const [lastName, setLastName] = useState(isUpdating? user.lastName : '');
    const [userRole, setUserRole] = useState();

    const traineeInitialised = {
        traineeEmail: '',
        traineeFirstName: '',
        traineeLastName: '',
    }
    const [trainee, setTrainee] = useState(traineeInitialised)
    const [traineeList, setTraineeList] = useState([])
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

    const [addMyself, setAddMyself] = useState(isUpdating)
    const [error, setError] = useState(null)

    const { userName, userEmail, userRole } = useSelector(state => state.user)
    const {isLoading, data: trainingTypes}
        = useFetchTrainingTypes(['queryAllTrainingTypes'], '/training/trainingTypes')

    const { mutate: addTraining } = useCreateUser()
    const { mutate: updateTraining } = useUpdateUser()

    const { handleSubmit, control, reset, setValue, formState: { errors } }  = useForm({
        resolver: yupResolver(getTrainingSchema(userRole)),
    })

    useEffect(() => {
        if(isUpdating){
            setValue('trainingType', training.trainingType)
            setValue('trainingName', training.trainingName)
            setValue('trainingHours', training.hoursCount)
            setValue('trainingUrl', training.trainingURL)
        }
    }, [isUpdating])


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
            // toast.error('Please fill trainee info')
            setDisplayErrorMessage(true)
            return
        }

        setDisplayErrorMessage(false)
        setTraineeList([...traineeList, trainee])
        setTrainee(traineeInitialised)
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
        reset()
        // setTrainingName('')
        // setTrainingType('')
        setStartDate(dayjs(new Date()))
        setEndDate(dayjs(new Date()))
        // setHoursCount(1)
        // setTrainingURL('')
        setTraineeList([])
        setTrainee(traineeInitialised)
        setDisplayErrorMessage(false)
        // setTrainingNameWordsRemaining(wordsLimit)
        // setTrainingUrlWordsRemaining(wordsLimit)
        // setAddMyself(false)
        setOpen(false)
    }

    // const validateForm = async () => {
    //     await trigger()
    //     if(traineeList.length === 0){
    //         const isValid = await trigger(['traineeEmail', 'traineeFirstName', 'traineeLastName'])
    //         if(!isValid)
    //             return
    //     }else{
    //         console.log('asdf')
    //         unregister(['traineeEmail', 'traineeFirstName', 'traineeLastName'])
    //     }
    //
    //     await handleSubmit(createTraining)()
    // }

    const createUser = (data) => {
        const {
            trainingType,
            trainingName,
            trainingUrl,
            trainingHours : hoursCount
        } = data


        const newUser = {
            trainingName,
            trainingType,
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            hoursCount,
            trainingURL: trainingUrl || '',
            traineeList: traineeList.length === 0 ? [trainee] : traineeList
        }

        addTraining(newTraining)
        closeForm()
    }

    const updateTrainingHandler = (data) => {
        const {
            trainingType,
            trainingName,
            trainingUrl: trainingURL,
            trainingHours : hoursCount
        } = data

        const updatedTraining = {
            trainingId: training.id,
            trainingName,
            trainingType,
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            hoursCount,
            trainingURL,
            traineeList:[]
        }
        updateTraining(updatedTraining)
        closeForm()
    }

    const renderCreateOrUpdateButton = () => {
        return isUpdating ?
            (<Button variant="contained" onClick={handleSubmit(updateTrainingHandler)}>Update</Button>)
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
                        <FormControl
                            sx={commonStyles.fullWidth}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-adornment-password">Trainee Email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type='text'
                                label="trainee email"
                                name='traineeEmail'
                                value={trainee.traineeEmail}
                                onChange={e=>fillTraineeInfo(e)}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <FormControl
                            sx={commonStyles.fullWidth}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-adornment-password">Trainee First Name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type='text'
                                label="traineeList"
                                name='traineeFirstName'
                                value={trainee.traineeFirstName}
                                onChange={e=>fillTraineeInfo(e)}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <FormControl
                            sx={commonStyles.fullWidth}
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-adornment-password">Trainee Last Name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type='text'
                                label="traineeList"
                                name='traineeLastName'
                                value={trainee.traineeLastName}
                                onChange={e=>fillTraineeInfo(e)}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        {
                            displayErrorMessage
                            &&
                            <Alert severity="error">
                                All trainee fields are required
                            </Alert>
                        }

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
                            <Controller
                                control={control}
                                name='trainingType'
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
                                            disabled={isUpdating}
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
                                name='trainingName'
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        variant="outlined"
                                        error={!!errors.trainingName}
                                    >
                                        <InputLabel htmlFor="outlined-adornment-password">Training Name</InputLabel>
                                        <OutlinedInput
                                            {...field}
                                            id="outlined-adornment-password"
                                            type='text'
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
                            <Controller
                                control={control}
                                name='trainingHours'
                                render={({field}) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        error={!!errors.trainingHours}
                                    >
                                        {/*<TextField*/}
                                        {/*    {...field}*/}
                                        {/*    id="standard-basic"*/}
                                        {/*    label="Hours"*/}
                                        {/*    variant="outlined"*/}
                                        {/*    type="number"*/}
                                        {/*/>*/}

                                        <InputLabel htmlFor="outlined-adornment-password">Training Hours</InputLabel>
                                        <OutlinedInput
                                            {...field}
                                            id="outlined-adornment-password"
                                            type='number'
                                            label="trainingName"
                                        />

                                        {
                                            errors.trainingHours && <FormHelperText id="my-helper-text">{errors.trainingHours.message}</FormHelperText>
                                        }
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item>
                            <Controller
                                control={control}
                                name='trainingUrl'
                                render={({field}) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        variant="outlined"
                                        error={!!errors.trainingUrl}
                                    >
                                        <InputLabel htmlFor="outlined-adornment-password">URL</InputLabel>
                                        <OutlinedInput
                                            {...field}
                                            id="outlined-adornment-password"
                                            type='text'
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

export default UserModal
