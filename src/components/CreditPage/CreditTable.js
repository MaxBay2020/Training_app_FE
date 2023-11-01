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
import {useSelector} from "react-redux";
import {ApproveOrReject, getCreditTableHeaders, getTrainingTableHeaders} from "../../utils/consts";
import {TableSortLabel} from "@mui/material";
import {visuallyHidden} from "@mui/utils";
import {convertToPercentage} from "../../utils/helper";


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
                {getCreditTableHeaders.map((headCell) => (
                    <TableCell
                        key={headCell}
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


const Row = ({credit}) => {

    const {
        fiscal_year,
        sm_id,
        sm_servicerMasterName,
        live_trng_cnt,
        live_trng_score,
        eclass_trng_cnt,
        eclass_mand_trng_cnt,
        eclass_trng_score,
        webinar_trng_cnt,
        webinar_trng_score,
        training_credit,
    } = credit

    return (
        <>
            <TableRow>
                <TableCell component="th" scope="row" align="right">{fiscal_year}</TableCell>
                <TableCell align="right">{sm_id}</TableCell>
                <TableCell align="right">{sm_servicerMasterName}</TableCell>
                <TableCell align="right">{live_trng_cnt}</TableCell>
                <TableCell align="right">{live_trng_score}</TableCell>
                <TableCell align="right">{eclass_trng_cnt}</TableCell>
                <TableCell align="right">{eclass_mand_trng_cnt}</TableCell>
                <TableCell align="right">{eclass_trng_score}</TableCell>
                <TableCell align="right">{webinar_trng_cnt}</TableCell>
                <TableCell align="right">{webinar_trng_score}</TableCell>
                <TableCell align="right">{convertToPercentage(training_credit)}</TableCell>
            </TableRow>
        </>
    );
}


const CreditTable = ({creditList, order, setOrder, orderBy, setOrderBy}) => {

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
                    {creditList.map((credit, index) => (
                        <Row key={index} credit={credit}/>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


export default CreditTable

