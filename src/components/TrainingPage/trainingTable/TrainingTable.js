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
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

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

    const [open, setOpen] = useState(false)

    return (
        <>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {trainingName}
                </TableCell>
                <TableCell align="right">{trainingType}</TableCell>
                <TableCell align="right">{moment(startDate).format('YYYY-MM-DD')}</TableCell>
                <TableCell align="right">{moment(endDate).format('YYYY-MM-DD')}</TableCell>
                <TableCell align="right">{hoursCount}</TableCell>
                <TableCell align="right">{trainingStatus}</TableCell>
                <TableCell align="right">
                    <Grid container alignItems='center' justifyContent='center' spacing={1}>
                        <Grid item>
                            <IconButton><EditOutlinedIcon color='success' /></IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton><DeleteForeverOutlinedIcon color='error' /></IconButton>
                        </Grid>
                    </Grid>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div">
                                Activities
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Total price ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        training.serviceMaster?.map((sm) => (
                                            <TableRow key={sm.date}>
                                                <TableCell component="th" scope="row">
                                                    {sm.date}
                                                </TableCell>
                                                <TableCell>{sm.customerId}</TableCell>
                                                <TableCell align="right">{sm.amount}</TableCell>
                                                <TableCell align="right">
                                                    {Math.round(sm.amount * training.points * 100) / 100}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}


const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99, 0),
    // createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
    // createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
    // createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
    // createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];

const TrainingTable = () => {

    const {isLoading, data: trainingList, error, isError} = useFetchData('http://localhost:8000/training')


    if(isLoading){
        return <>Loading...</>
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell/>
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

export default TrainingTable
