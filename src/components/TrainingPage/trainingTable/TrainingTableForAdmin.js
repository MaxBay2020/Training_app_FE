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
import {renderTableCellForTrainingStatus} from "./TrainingTableForApprover";
import {ApproveOrReject, getTrainingTableHeaders} from "../../../utils/consts";
import {useSelector} from "react-redux";
import {TableSortLabel} from "@mui/material";
import {visuallyHidden} from "@mui/utils";


const EnhancedTableHead = (props) => {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property)
    }
    const {userRole} = useSelector(state => state.user)


    return (
        <TableHead>
            <TableRow>
                {getTrainingTableHeaders(userRole).map((headCell) => (
                    <TableCell
                        key={headCell}
                        // align={headCell.numeric ? 'right' : 'left'}
                        // padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell}
                            direction={orderBy === headCell ? order : 'asc'}
                            onClick={createSortHandler(headCell)}
                        >
                            {headCell}
                            {orderBy === headCell ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

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
        trainingStatus,
        createdAt,
    } = training

    return (
        <>
            <TableRow
                hover
                sx={{
                    '& > *': {borderBottom: 'unset'},
                    backgroundColor: `${trainingStatus.toLowerCase() === ApproveOrReject.SUBMITTED.toLowerCase() ? 'rgba(100,100,100,.1)' : ''}`
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
                <TableCell align="right">{moment(startDate).format('MM-DD-YYYY')}</TableCell>
                <TableCell align="right">{moment(endDate).format('MM-DD-YYYY')}</TableCell>
                <TableCell align="right">{moment(createdAt).format('MM-DD-YYYY')}</TableCell>
                <TableCell align="right">{hoursCount}</TableCell>
                { renderTableCellForTrainingStatus(trainingStatus) }
            </TableRow>
        </>
    );
}

const TrainingTableForAdmin = ({trainingList, order, setOrder, orderBy, setOrderBy}) => {

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                />
                <TableBody>
                    {trainingList.map((training, index) => (
                        <Row key={index} training={training}/>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TrainingTableForAdmin
