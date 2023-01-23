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
import TrainingModal from "../trainingModal/TrainingModal";
import TrainingWithdrawModal from "../trainingWithdrawModal/TrainingWithdrawModal"

const Row = ({training}) => {

    const {trainingName, trainingType, startDate, endDate, hoursCount, trainingStatus} = training
    const [openTrainingFormModal, setOpenTrainingFormModal] = useState(false)
    const [openWithdrawModal, setOpenWithdrawModal] = useState(false)

    return (
        <>
            <TableRow
                hover
                sx={{
                    '& > *': {borderBottom: 'unset'},
                    backgroundColor: `${trainingStatus.toLowerCase() === 'withdrawn' ? 'rgba(100,100,100,.1)' : ''}`
                }}
            >
                <TableCell component="th" scope="row">
                    {trainingName}
                </TableCell>
                <TableCell align="right">{trainingType}</TableCell>
                <TableCell align="right">{moment(startDate).format('YYYY-MM-DD')}</TableCell>
                <TableCell align="right">{moment(endDate).format('YYYY-MM-DD')}</TableCell>
                <TableCell align="right">{hoursCount}</TableCell>
                <TableCell align="right">{trainingStatus}</TableCell>
            </TableRow>
        </>
    );
}

const TrainingTableForAdmin = ({trainingList}) => {

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

export default TrainingTableForAdmin
