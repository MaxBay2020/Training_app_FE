import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useState} from "react";
import moment from "moment";
import {Grid, Tooltip} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import UserModal from "../adminModal/UserModal.js";
import UserDeleteModal from "../adminWithdrawModal/UserDeleteModal"
import {renderTableCellForTrainingStatus} from "./TrainingTableForApprover";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentTraining, switchOpenModal} from "../../../features/trainingSlice";
import {ApproveOrReject} from "../../../utils/consts";

const Row = ({training}) => {

    const {trainingName, trainingType, startDate, endDate, hoursCount, trainingStatus} = training
    const [openWithdrawModal, setOpenWithdrawModal] = useState(false)

    const dispatch = useDispatch()

    const renderActions = (trainingStatus) => {
        const isSubmitted = trainingStatus.toLowerCase() === ApproveOrReject.SUBMITTED.toLowerCase()


        const showUpdateTraining = () => {
            dispatch(switchOpenModal())
            dispatch(setCurrentTraining({ training }))
        }

        return (<TableCell align="right">
            <Grid container alignItems='center' justifyContent='center' spacing={1}>
                <Grid item>
                        {
                            isSubmitted ?
                                <IconButton onClick={() => showUpdateTraining()}>
                                    <Tooltip title="Edit" placement="top">
                                        <EditOutlinedIcon color='success' />
                                    </Tooltip>
                                </IconButton>
                                :
                                <IconButton>
                                        <EditOffOutlinedIcon color='default' />
                                </IconButton>

                        }
                </Grid>
                <Grid item>
                        {
                            isSubmitted ?
                                <IconButton onClick={() => setOpenWithdrawModal(true)}>
                                    <Tooltip title="Withdraw" placement="top">
                                        <DeleteOutlineOutlinedIcon color='error' />
                                    </Tooltip>
                                </IconButton>
                                :
                                <IconButton>
                                    <DeleteForeverOutlinedIcon color='default' />
                                </IconButton>
                        }
                </Grid>
            </Grid>
        </TableCell>)
    }

    return (
        <>
            <TableRow hover sx={{'& > *': {borderBottom: 'unset'}, backgroundColor: `${trainingStatus.toLowerCase() === ApproveOrReject.CANCELED.toLowerCase() ? 'rgba(100,100,100,.1)' : ''}`}}>
                <TableCell component="th" scope="row">
                    {trainingName}
                </TableCell>
                <TableCell align="right">{trainingType}</TableCell>
                <TableCell align="right">{moment(startDate).format('YYYY-MM-DD')}</TableCell>
                <TableCell align="right">{moment(endDate).format('YYYY-MM-DD')}</TableCell>
                <TableCell align="right">{hoursCount}</TableCell>
                { renderTableCellForTrainingStatus(trainingStatus) }
                { renderActions(trainingStatus) }
            </TableRow>

            {/*<UserModal*/}
            {/*    open={openModal}*/}
            {/*    setOpen={() => dispatch(switchOpenModal())}*/}
            {/*    isCreating={false}*/}
            {/*    isUpdating={true}*/}
            {/*/>*/}

            <UserDeleteModal
                open={openWithdrawModal}
                setOpen={setOpenWithdrawModal}
                training={training}
            />
        </>
    );
}

const ServicerTable = ({trainingList}) => {


    const dispatch = useDispatch()
    const { openModal, currentTraining } = useSelector(state => state.training)


    return (
        <>
            {
                currentTraining
                &&
                <UserModal
                    open={openModal}
                    setOpen={() => dispatch(switchOpenModal())}
                    isCreating={!currentTraining}
                    isUpdating={!!currentTraining}
                    training={currentTraining}
                />
            }

            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Training Name</TableCell>
                            <TableCell align="right">Training Type</TableCell>
                            <TableCell align="right">Start Date</TableCell>
                            <TableCell align="right">End Date</TableCell>
                            <TableCell align="right">Hours</TableCell>
                            <TableCell align="right">Training Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trainingList.map((training, index) => (
                            <Row key={index} training={training}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

// Row.propTypes = {
//     row: PropTypes.shape({
//         calories: PropTypes.number.isRequired,
//         carbs: PropTypes.number.isRequired,
//         fat: PropTypes.number.isRequired,
//         activities: PropTypes.arrayOf(
//             PropTypes.shape({
//                 amount: PropTypes.number.isRequired,
//                 customerId: PropTypes.string.isRequired,
//                 date: PropTypes.string.isRequired,
//             }),
//         ).isRequired,
//         name: PropTypes.string.isRequired,
//         price: PropTypes.number.isRequired,
//         protein: PropTypes.number.isRequired,
//     }).isRequired,
// }

export default ServicerTable
