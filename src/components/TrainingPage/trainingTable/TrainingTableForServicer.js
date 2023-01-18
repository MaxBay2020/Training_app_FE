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
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {useState} from "react";
import useFetchData from "../../../hooks/useFetchData";
import moment from "moment";
import {Grid} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import TrainingModal from "../trainingModal/TrainingModal";
import TrainingWithdrawModal from "../trainingWithdrawModal/TrainingWithdrawModal";

const createData = (trainingName, trainingType, startDate, endDate, trainingStatus, hoursCount, points = 0) => {
    return {
        trainingName,
        trainingType,
        startDate,
        endDate,
        trainingStatus,
        hoursCount,
        points,
        serviceMaster: [
            {
                date: '2020-01-05',
                customerId: '11091700',
                amount: 3,
            },
            {
                date: '2020-01-02',
                customerId: 'Anonymous',
                amount: 1,
            },
        ],
    };
}

const Row = ({training}) => {

    const {trainingName, trainingType, startDate, endDate, hoursCount, trainingStatus} = training
    const [openTrainingFormModal, setOpenTrainingFormModal] = useState(false)
    const [openWithdrawModal, setOpenWithdrawModal] = useState(false)

    const renderActions = (trainingStatus) => {
        const isPending = trainingStatus.toLowerCase() === 'pending'
        return (<TableCell align="right">
            <Grid container alignItems='center' justifyContent='center' spacing={1}>
                <Grid item>

                        {
                            isPending ?
                                <IconButton onClick={() => setOpenTrainingFormModal(true)}>
                                    <EditOutlinedIcon color='success' />
                                </IconButton>
                                :
                                <IconButton>
                                    <EditOffOutlinedIcon color='default' />
                                </IconButton>

                        }
                </Grid>
                <Grid item>
                        {
                            isPending ?
                                <IconButton onClick={() => setOpenWithdrawModal(true)}>
                                    <DeleteOutlineOutlinedIcon color='error' />
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
            <TableRow sx={{'& > *': {borderBottom: 'unset'}, backgroundColor: `${trainingStatus.toLowerCase() === 'withdrawn' ? 'rgba(100,100,100,.1)' : ''}`}}>
                <TableCell component="th" scope="row">
                    {trainingName}
                </TableCell>
                <TableCell align="right">{trainingType}</TableCell>
                <TableCell align="right">{moment(startDate).format('YYYY-MM-DD')}</TableCell>
                <TableCell align="right">{moment(endDate).format('YYYY-MM-DD')}</TableCell>
                <TableCell align="right">{hoursCount}</TableCell>
                <TableCell align="right">{trainingStatus}</TableCell>
                { renderActions(trainingStatus) }
            </TableRow>

            <TrainingModal
                open={openTrainingFormModal}
                setOpen={setOpenTrainingFormModal}
                isCreating={false}
                isUpdating={true}
                training={training}
            />

            <TrainingWithdrawModal
                open={openWithdrawModal}
                setOpen={setOpenWithdrawModal}
                training={training}
            />
        </>
    );
}

const TrainingTableForServicer = ({trainingList}) => {


    return (
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

export default TrainingTableForServicer
