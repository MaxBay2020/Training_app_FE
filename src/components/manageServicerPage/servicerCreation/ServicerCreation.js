import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {servicerSchema, userSchema} from "../../../utils/schema";
import {
    Checkbox,
    createTheme,
    FormControl, FormControlLabel,
    FormHelperText, FormLabel,
    Grid,
    InputAdornment,
    InputLabel,
    Modal,
    OutlinedInput, Radio, RadioGroup,
    Select
} from "@mui/material";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import {ThemeProvider} from "@emotion/react";
import {commonStyles} from "../../../styles/commontStyles";
import Typography from "@mui/material/Typography";
import {useDispatch, useSelector} from "react-redux";
import useCommonGetQuery from "../../../hooks/useCommonGetQuery";
import useCommonMutate from "../../../hooks/useCommonMutate";
import {createOrUpdateEnum} from "../../../utils/consts";
import {resetCurrentUser} from "../../../features/usersManagementSlice";
import {resetCurrentServicer} from "../../../features/servicersManagementSlice";



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

const ServicerCreation = ({ openUserModal, setOpenUserModal }) => {

    const { currentServicer } = useSelector(state => state.servicersManagement)

    const dispatch = useDispatch()

    const {
        control,
        formState: { errors },
        setValue,
        reset,
        handleSubmit,
    } = useForm({
        resolver: yupResolver(servicerSchema),
        defaultValues: {
            servicerTrsiiOptIn: 'false',
            servicerOptOutFlag: 'false'
        }
    })

    useEffect(() => {
        if(currentServicer){
            const {
                sm_id,
                sm_servicerMasterName,
                sm_trsiiOptIn,
                sm_optOutFlag
            } = currentServicer

            setValue('servicerId', sm_id)
            setValue('servicerName', sm_servicerMasterName)
            setValue('servicerTrsiiOptIn', sm_trsiiOptIn === 1)
            setValue('servicerOptOutFlag', sm_optOutFlag === 1)
        }
    }, [currentServicer])



    const {
        mutate: createServicer
    } = useCommonMutate(['queryAllServicers'], createOrUpdateEnum.create, 'admin/servicer')

    const {
        mutate: updateServicer
    } = useCommonMutate(['queryAllServicers'], createOrUpdateEnum.update, 'admin/servicer')


    const createServicerHandler = newServicer => {
        createServicer(newServicer)
        closeForm()
    }

    const updateServicerHandler = servicerToUpdate => {
        updateServicer({
            id: currentServicer.sm_id,
            ...servicerToUpdate,
        })
        // closeForm()
    }

    const closeForm = () => {
        reset()
        setOpenUserModal(false)
        dispatch(resetCurrentServicer())
    }


    const renderCreateOrUpdateButton = () => {
        return currentServicer ?
            (<Button variant="contained" onClick={handleSubmit(updateServicerHandler)}>Update</Button>)
            :
            (<Button variant="contained" onClick={handleSubmit(createServicerHandler)}>Create</Button>)
    }

    return (
        <ThemeProvider theme={theme}>
            <Button
                variant="contained"
                disableElevation
                onClick={() => setOpenUserModal(true)}
                sx={{width: '100%'}}
            >
                Add Servicer
            </Button>

            <Modal
                open={openUserModal}
                onClose={() => closeForm()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styles.modalStyle}>
                    <Grid
                        container
                        direction='column'
                        gap='10px'
                    >
                        <Grid item>
                            <Controller
                                control={control}
                                name='servicerId'
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        variant="outlined"
                                        error={!!errors.servicerId}
                                    >
                                        <InputLabel htmlFor="outlined-adornment-password">Servicer ID</InputLabel>
                                        <OutlinedInput
                                            {...field}
                                            id="outlined-adornment-password"
                                            type='text'
                                            label="servicerId"
                                        />
                                        {
                                            errors.servicerId && <FormHelperText id="my-helper-text">{errors.servicerId.message}</FormHelperText>
                                        }
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item>
                            <Controller
                                control={control}
                                name='servicerName'
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        variant="outlined"
                                        error={!!errors.servicerName}
                                    >
                                        <InputLabel htmlFor="outlined-adornment-password">Servicer Name</InputLabel>
                                        <OutlinedInput
                                            {...field}
                                            id="outlined-adornment-password"
                                            type='text'
                                            label="servicerName"
                                        />
                                        {
                                            errors.servicerName && <FormHelperText id="my-helper-text">{errors.servicerName.message}</FormHelperText>
                                        }
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item>
                            <Controller
                                control={control}
                                name='servicerTrsiiOptIn'
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        error={!!errors.servicerTrsiiOptIn}
                                    >
                                        <FormLabel id="demo-radio-buttons-group-label">trsiiOptIn</FormLabel>
                                        <RadioGroup
                                            {...field}
                                            row
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            name="radio-buttons-group"
                                        >
                                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="false" control={<Radio />} label="No" />
                                        </RadioGroup>
                                        {
                                            errors.servicerTrsiiOptIn && <FormHelperText id="my-helper-text">{errors.servicerTrsiiOptIn.message}</FormHelperText>
                                        }
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item>
                            <Controller
                                control={control}
                                name='servicerOptOutFlag'
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        error={!!errors.servicerOptOutFlag}
                                    >
                                        <FormLabel id="demo-radio-buttons-group-label">optOutFlag</FormLabel>
                                        <RadioGroup
                                            {...field}
                                            row
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            name="radio-buttons-group"
                                        >
                                            <FormControlLabel value='true' control={<Radio />} label="Yes" />
                                            <FormControlLabel value='false' control={<Radio />} label="No" />
                                        </RadioGroup>
                                        {
                                            errors.servicerOptOutFlag && <FormHelperText id="my-helper-text">{errors.servicerOptOutFlag.message}</FormHelperText>
                                        }
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item sx={{ alignSelf: 'flex-end' }}>
                            <Grid
                                container
                                gap='10px'
                            >
                                <Grid item>
                                    { renderCreateOrUpdateButton() }
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

export default ServicerCreation
