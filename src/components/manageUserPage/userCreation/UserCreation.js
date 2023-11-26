import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {userSchema} from "../../../utils/schema";
import {
    createTheme,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    InputLabel,
    Modal,
    OutlinedInput,
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

const UserCreation = ({ openUserModal, setOpenUserModal }) => {

    const { currentUser } = useSelector(state => state.usersManagement)

    const dispatch = useDispatch()

    const {
        control,
        formState: { errors },
        setValue,
        reset,
        handleSubmit,
    } = useForm({
        resolver: yupResolver(userSchema)
    })

    useEffect(() => {
        if(currentUser){
            const {
                user_firstName,
                user_lastName,
                user_email,
                userRole_id,
                sm_id
            } = currentUser
            setValue('firstName', user_firstName)
            setValue('lastName', user_lastName)
            setValue('newUserEmail', user_email)
            setValue('userRoleId', userRole_id)
            setValue('servicerId', sm_id)
        }
    }, [currentUser])


    const {
        data: userRoleData,
        isSuccess: isSuccessFetchUserRoles
    } = useCommonGetQuery(['query', 'userRoles'], 'userRole', {})

    const {
        data: servicerData,
        isSuccess: isSuccessServicer
    } = useCommonGetQuery(['query', 'servicers'], 'servicer', {})

    const {
        mutate: createUser
    } = useCommonMutate(['queryAllUsers'], createOrUpdateEnum.create, 'admin/user')

    const {
        mutate: updateUser
    } = useCommonMutate(['queryAllUsers'], createOrUpdateEnum.update, 'admin/user')


    const createUserHandler = newUser => {
        createUser(newUser)
        closeForm()
    }

    const updateUserHandler = userToUpdate => {
        updateUser({
            id: currentUser.user_id,
            ...userToUpdate,
            updateUserEmail: userToUpdate.newUserEmail
        })
        closeForm()
    }

    const closeForm = () => {
        reset()
        setOpenUserModal(false)
        dispatch(resetCurrentUser())
    }


    const renderCreateOrUpdateButton = () => {
        return currentUser ?
            (<Button variant="contained" onClick={handleSubmit(updateUserHandler)}>Update</Button>)
            :
            (<Button variant="contained" onClick={handleSubmit(createUserHandler)}>Create</Button>)
    }

    return (
        <ThemeProvider theme={theme}>
            <Button
                variant="contained"
                disableElevation
                onClick={() => setOpenUserModal(true)}
                sx={{width: '100%'}}
            >
                Add User
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
                                name='firstName'
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        variant="outlined"
                                        error={!!errors.firstName}
                                    >
                                        <InputLabel htmlFor="outlined-adornment-password">First Name</InputLabel>
                                        <OutlinedInput
                                            {...field}
                                            id="outlined-adornment-password"
                                            type='text'
                                            label="firstName"
                                        />
                                        {
                                            errors.firstName && <FormHelperText id="my-helper-text">{errors.firstName.message}</FormHelperText>
                                        }
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item>
                            <Controller
                                control={control}
                                name='lastName'
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        variant="outlined"
                                        error={!!errors.lastName}
                                    >
                                        <InputLabel htmlFor="outlined-adornment-password">Last Name</InputLabel>
                                        <OutlinedInput
                                            {...field}
                                            id="outlined-adornment-password"
                                            type='text'
                                            label="lastName"
                                        />
                                        {
                                            errors.lastName && <FormHelperText id="my-helper-text">{errors.lastName.message}</FormHelperText>
                                        }
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item>
                            <Controller
                                control={control}
                                name='newUserEmail'
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        variant="outlined"
                                        error={!!errors.newUserEmail}
                                    >
                                        <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
                                        <OutlinedInput
                                            {...field}
                                            id="outlined-adornment-password"
                                            type='text'
                                            label="newUserEmail"
                                        />
                                        {
                                            errors.newUserEmail && <FormHelperText id="my-helper-text">{errors.newUserEmail.message}</FormHelperText>
                                        }
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item>
                            <Controller
                                control={control}
                                name='userRoleId'
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        error={!!errors.userRoleId}
                                    >
                                        <InputLabel id="demo-simple-select-label">User role</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="userRoleId"
                                        >
                                            {
                                                isSuccessFetchUserRoles
                                                &&
                                                userRoleData.userRoleList.map((userRole, index) => (
                                                    <MenuItem key={index} value={userRole.id}>
                                                        {userRole.userRoleName}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>

                                        {
                                            errors.userRoleId && <FormHelperText id="my-helper-text">{errors.userRoleId.message}</FormHelperText>
                                        }
                                    </FormControl>
                                )}
                            />
                        </Grid>



                        <Grid item>
                            <Controller
                                control={control}
                                name='servicerId'
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        error={!!errors.servicerId}
                                    >
                                        <InputLabel id="demo-simple-select-label">Servicer</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="servicerId"
                                        >
                                            {
                                                isSuccessServicer
                                                &&
                                                servicerData.servicerList.map((servicer, index) => (
                                                    <MenuItem key={index} value={servicer.id}>
                                                        {servicer.servicerMasterName}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>

                                        {
                                            errors.servicerId && <FormHelperText id="my-helper-text">{errors.servicerId.message}</FormHelperText>
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

export default UserCreation
