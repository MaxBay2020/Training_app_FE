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
import moment from "moment";

const Row = ({training}) => {

    const {
        servicerId,
        servicerName,
        userEmail,
        userFirstName,
        userLastName,
        trainingName,
        trainingType,
        startDate,
        endDate,
        hoursCount,
        trainingStatus
    } = training

    return (
        <>
            <TableRow
                hover
                sx={{
                    '& > *': {borderBottom: 'unset'},
                    backgroundColor: `${trainingStatus.toLowerCase() === 'withdrawn' ? 'rgba(100,100,100,.1)' : ''}`
                }}
            >
                <TableCell component="th" scope="row" align="right">
                    {servicerId}
                </TableCell>
                <TableCell align="right">{servicerName}</TableCell>
                <TableCell align="right">{userEmail}</TableCell>
                <TableCell align="right">{`${userFirstName} ${userLastName}`}</TableCell>
                <TableCell align="right">{trainingName}</TableCell>
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
                        <TableCell align="right" sx={{pr: '0px'}}>Servicer ID</TableCell>
                        <TableCell align="right" sx={{pr: '0px'}}>Servicer Name</TableCell>
                        <TableCell align="right" sx={{pr: '0px'}}>User Email</TableCell>
                        <TableCell align="right" sx={{pr: '0px'}}>User Name</TableCell>
                        <TableCell align="right" sx={{pr: '0px'}}>Training Name</TableCell>
                        <TableCell align="right" sx={{pr: '0px'}}>Training Type</TableCell>
                        <TableCell align="right" sx={{pr: '0px'}}>Start Date</TableCell>
                        <TableCell align="right" sx={{pr: '0px'}}>End Date</TableCell>
                        <TableCell align="right" sx={{pr: '0px'}}>Hours</TableCell>
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
