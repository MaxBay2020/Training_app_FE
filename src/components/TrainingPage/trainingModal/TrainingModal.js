import Box from "@mui/material/Box";
import {
    Alert,
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
    Tooltip
} from "@mui/material";
import {useEffect, useState} from "react";
import 'react-day-picker/dist/style.css';
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {UserRole, wordsLimit} from "../../../utils/consts";
import {ThemeProvider} from "@emotion/react";
import {commonStyles} from "../../../styles/commontStyles";
import Button from "@mui/material/Button";
import useCreateTraining from "../../../hooks/trainingHooks/useCreateTraining";
import useFetchTrainingTypes from "../../../hooks/trainingHooks/useFetchTrainingTypes";
import {useSelector} from "react-redux";
import useUpdateTraining from "../../../hooks/trainingHooks/useUpdateTraining";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {AddCircleOutlineOutlined} from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup";
import {getTrainingSchema, traineeSchema} from "../../../utils/schema";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useCommonQuery from "../../../hooks/trainingHooks/useCommonQuery";
import moment from "moment";

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

    const [trainingNameWordsRemaining, setTrainingNameWordsRemaining] = useState(wordsLimit)
    const [trainingUrlWordsRemaining, setTrainingUrlWordsRemaining] = useState(wordsLimit)


    // const [startDate, setStartDate] = useState(isUpdating ? dayjs(training.startDate) : '')
    // const [endDate, setEndDate] = useState(isUpdating ? dayjs(training.endDate) : '')

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(startDate)

    const traineeInitialised = {
        traineeEmail: '',
        traineeFirstName: '',
        traineeLastName: '',
    }
    const [trainee, setTrainee] = useState(traineeInitialised)
    const [traineeList, setTraineeList] = useState([])
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

    const { userRole } = useSelector(state => state.user)
    const {isLoading, data: trainingTypes}
        = useFetchTrainingTypes(['queryAllTrainingTypes'], '/training/trainingTypes')

    const { mutate: addTraining } = useCreateTraining()
    const { mutate: updateTraining } = useUpdateTraining()

    const {data: trainingTimePeriod} = useCommonQuery(['queryFiscalYear'], '/training/currentFiscalYear')



    const {
        handleSubmit,
        control,
        reset,
        setValue,
        getValues,
        formState: { errors }
    }  = useForm({
        resolver: yupResolver(getTrainingSchema(trainingTimePeriod)),
    })

    const {
        handleSubmit: traineeHandleSubmit,
        control: traineeControl,
        reset: traineeReset,
        formState: { errors: traineeErrors },
        trigger,
        getValues: getTraineeValues
    } = useForm({
        resolver: yupResolver(traineeSchema),
    })

    useEffect(() => {
        if(isUpdating){
            setValue('trainingType', training.trainingType)
            setValue('trainingName', training.trainingName)
            setValue('trainingHours', training.hoursCount)
            setValue('trainingUrl', training.trainingURL)
        }
    }, [isUpdating])


    useEffect(() => {
        setValue('endDate', endDate)
    }, [startDate])

    useEffect(() => {
        if(!!training){
            setValue('endDate', dayjs(training.endDate))
            setStartDate(dayjs(training.startDate))
            setEndDate(dayjs(training.endDate))
        }

    }, [training])





    const addTrainee = (trainee) =>{
        const hasReplicate = traineeList.find(item => item.traineeEmail === trainee.traineeEmail)
        if(hasReplicate){
            setDisplayErrorMessage(true)
            return
        }
        setDisplayErrorMessage(false)
        setTraineeList([...traineeList, trainee])
        setTrainee(traineeInitialised)
        traineeReset({
            traineeEmail: '',
            traineeFirstName: '',
            traineeLastName: ''
        })
    }

    const deleteTraineeFromTraineeList = traineeEmail => {
        setTraineeList(traineeList.filter(trainee => trainee.traineeEmail !== traineeEmail))
    }

    const closeForm = () => {
        reset({
            trainingName: '',
            trainingType: '',
            trainingHours: 1,
            trainingUrl: '',
        })

        traineeReset({
            traineeEmail: '',
            traineeFirstName: '',
            traineeLastName: ''
        })

        setStartDate(null)
        setEndDate(null)

        setTraineeList([])
        setTrainingNameWordsRemaining(wordsLimit)
        setTrainingUrlWordsRemaining(wordsLimit)
        setDisplayErrorMessage(false)
        setOpen(false)
    }


    const createTraining = async (data) => {
        const {
            trainingType,
            trainingName,
            trainingUrl,
            trainingHours : hoursCount,
            startDate,
            endDate
        } = data
        if(userRole === UserRole.SERVICER_COORDINATOR){
            // if(Object.keys(trainee).length !== Object.values(trainee).filter(item => item).length && traineeList.length === 0){
            //     setDisplayErrorMessage(true)
            //     return
            // }
            if(traineeList.length === 0){
                const hasValidTrainee = await trigger()
                if(!hasValidTrainee)
                    return
                const trainee = {
                    traineeEmail: getTraineeValues('traineeEmail'),
                    traineeFirstName: getTraineeValues('traineeFirstName'),
                    traineeLastName: getTraineeValues('traineeLastName'),
                }
                traineeList.push(trainee)
            }
        }


        const newTraining = {
            trainingName,
            trainingType,
            startDate: moment(startDate).format('YYYY-MM-DD'),
            endDate: moment(endDate).format('YYYY-MM-DD'),
            hoursCount,
            trainingURL: trainingUrl || '',
            traineeList
        }

        addTraining(newTraining)
        closeForm()
    }

    const updateTrainingHandler = (data) => {
        const {
            trainingType,
            trainingName,
            trainingUrl: trainingURL,
            trainingHours : hoursCount,
            startDate,
            endDate
        } = data

        const updatedTraining = {
            trainingId: training.id,
            trainingName,
            trainingType,
            startDate: moment(startDate).format('YYYY-MM-DD'),
            endDate: moment(endDate).format('YYYY-MM-DD'),
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
                        <Grid container
                              direction='row'
                              alignItems='center'
                              justifyContent='space-between'
                              spacing={1}
                              pt={2}
                              pb={2}
                              pl={2}
                        >
                            <Grid item xs={5}>
                                <Typography variant='caption'>{trainee.traineeEmail}</Typography>
                            </Grid>

                            <Grid item xs={3}>
                                <Typography variant='caption'>{trainee.traineeFirstName}</Typography>
                            </Grid>

                            <Grid item xs={3}>
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
                        <Controller
                            control={traineeControl}
                            name='traineeEmail'
                            render={({ field }) => (
                                <FormControl
                                    sx={commonStyles.fullWidth}
                                    variant="outlined"
                                    error={!!traineeErrors.traineeEmail}
                                >
                                    <InputLabel htmlFor="outlined-adornment-password">Trainee Email</InputLabel>
                                    <OutlinedInput
                                        {...field}
                                        id="outlined-adornment-password"
                                        type='text'
                                        label="trainee email"
                                    />
                                    {
                                        traineeErrors.traineeEmail && <FormHelperText id="my-helper-text">{traineeErrors.traineeEmail.message}</FormHelperText>
                                    }
                                </FormControl>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            control={traineeControl}
                            name='traineeFirstName'
                            render={({ field }) => (
                                <FormControl
                                    sx={commonStyles.fullWidth}
                                    variant="outlined"
                                    error={!!traineeErrors.traineeFirstName}
                                >
                                    <InputLabel htmlFor="outlined-adornment-password">Trainee First Name</InputLabel>
                                    <OutlinedInput
                                        {...field}
                                        id="outlined-adornment-password"
                                        type='text'
                                        label="trainee first name"
                                    />
                                    {
                                        traineeErrors.traineeFirstName && <FormHelperText id="my-helper-text">{traineeErrors.traineeFirstName.message}</FormHelperText>
                                    }
                                </FormControl>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            control={traineeControl}
                            name='traineeLastName'
                            render={({ field }) => (
                                <FormControl
                                    sx={commonStyles.fullWidth}
                                    variant="outlined"
                                    error={!!traineeErrors.traineeLastName}
                                >
                                    <InputLabel htmlFor="outlined-adornment-password">Trainee Last Name</InputLabel>
                                    <OutlinedInput
                                        {...field}
                                        id="outlined-adornment-password"
                                        type='text'
                                        label="trainee last name"
                                    />
                                    {
                                        traineeErrors.traineeLastName && <FormHelperText id="my-helper-text">{traineeErrors.traineeLastName.message}</FormHelperText>
                                    }
                                </FormControl>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        {
                            displayErrorMessage
                            &&
                            <Alert severity="error">
                                You have already added this email
                            </Alert>
                        }

                    </Grid>
                </Grid>
            </Grid>

            <Grid item>
                <IconButton
                    variant="outlined" size="small"
                    onClick={traineeHandleSubmit(addTrainee)}
                    sx={{ fontSize: "14px", border: "4px", borderRadius: 1, mb: 0.5 }}
                >
                    <AddCircleOutlineOutlined color='primary' mr={0.5}/>
                    Add More Trainee(s)
                </IconButton>
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

                <Box sx={styles.modalStyle}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={1}
                    >
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
                                                    <Typography variant='span'>
                                                        {
                                                            field.value ?
                                                                trainingNameWordsRemaining - field.value?.length
                                                                :
                                                                trainingNameWordsRemaining
                                                        }&nbsp;remaining
                                                    </Typography>
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
                                    <Controller
                                        name="startDate"
                                        defaultValue={training ? dayjs(training.startDate) : null}
                                        control={control}
                                        render={
                                            ({
                                                 field: { onChange, value  },
                                                 fieldState: { error }
                                            }) =>
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
                                                            value={training ? dayjs(training.startDate) : value}
                                                            control={control}
                                                            onChange={date => {
                                                                onChange(date)
                                                                setStartDate(dayjs(date))
                                                                setEndDate(dayjs(date))
                                                            }}
                                                            slotProps={{
                                                                textField: {
                                                                    error: !!error,
                                                                    helperText: error?.message,
                                                                    readOnly: true,
                                                                },
                                                            }}
                                                            disableFuture
                                                            label='Start Date'
                                                            minDate={dayjs(trainingTimePeriod?.currentFiscalStartTime)}
                                                        />
                                                    </DemoContainer>
                                                </LocalizationProvider>
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} md={5.5}>
                                    <Controller
                                        name="endDate"
                                        control={control}
                                        render={
                                            ({
                                                 field: { onChange, value },
                                                 fieldState: { error }
                                             }) =>
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
                                                            control={control}
                                                            onChange={date => {
                                                                onChange(date)
                                                                setEndDate(dayjs(date))
                                                            }}
                                                            slotProps={{
                                                                textField: {
                                                                    error: !!error,
                                                                    helperText: error?.message,
                                                                    readOnly: true,
                                                                },
                                                            }}
                                                            disableFuture
                                                            label='End Date'
                                                            minDate={startDate}
                                                        />
                                                    </DemoContainer>
                                                </LocalizationProvider>
                                        }
                                    />
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
                                                    <Typography variant='span'>
                                                        {
                                                            field.value ?
                                                                trainingUrlWordsRemaining - field.value?.length
                                                                :
                                                                trainingUrlWordsRemaining
                                                        }&nbsp;remaining
                                                    </Typography>
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
