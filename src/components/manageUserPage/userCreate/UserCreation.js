import Button from "@mui/material/Button";
import {useState} from "react";
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
import {useSelector} from "react-redux";
import useCommonGetQuery from "../../../hooks/useCommonGetQuery";


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

const UserCreation = () => {
    const [open, setOpen] = useState(false)

    const { currentUser } = useSelector(state => state.usersManagement)

    const {
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(userSchema)
    })

    const {
        data: userRoleData,
        isSuccess: isSuccessUserRole
    } = useCommonGetQuery(['query', 'userRole'], 'userRole', {})

    const {
        data: servicerData,
        isSuccess: isSuccessServicer
    } = useCommonGetQuery(['query', 'servicer'], 'servicer', {})

    const renderCreateOrUpdateButton = () => {
        return currentUser ?
            (<Button variant="contained">Update</Button>)
            :
            (<Button variant="contained">Create</Button>)
    }

    const closeForm = () => {
        reset()
        setOpen()
    }

    return (
        <ThemeProvider theme={theme}>
            <Button
                variant="contained"
                disableElevation
                onClick={() => setOpen(true)}
                sx={{width: '100%'}}
            >
                Add User
            </Button>

            <Modal
                open={open}
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
                                name='email'
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        variant="outlined"
                                        error={!!errors.email}
                                    >
                                        <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
                                        <OutlinedInput
                                            {...field}
                                            id="outlined-adornment-password"
                                            type='text'
                                            label="email"
                                        />
                                        {
                                            errors.email && <FormHelperText id="my-helper-text">{errors.email.message}</FormHelperText>
                                        }
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item>
                            <Controller
                                control={control}
                                name='userRole'
                                render={({ field }) => (
                                    <FormControl
                                        sx={commonStyles.fullWidth}
                                        error={!!errors.userRole}
                                    >
                                        <InputLabel id="demo-simple-select-label">User role</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="userRole"
                                        >
                                            {
                                                isSuccessUserRole
                                                &&
                                                userRoleData.userRoleList.map((userRole, index) => (
                                                    <MenuItem key={index} value={userRole.id}>
                                                        {userRole.userRoleName}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>

                                        {
                                            errors.userRole && <FormHelperText id="my-helper-text">{errors.userRole.message}</FormHelperText>
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
                                        error={!!errors.userRole}
                                    >
                                        <InputLabel id="demo-simple-select-label">Servicer</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="servicerName"
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
                                            errors.servicerName && <FormHelperText id="my-helper-text">{errors.servicerName.message}</FormHelperText>
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
