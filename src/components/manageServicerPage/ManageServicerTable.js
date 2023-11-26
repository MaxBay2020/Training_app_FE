import * as React from 'react';
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
import {alpha, Checkbox, Chip, Grid, TableSortLabel, Tooltip} from "@mui/material";
import {useState} from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {visuallyHidden} from "@mui/utils";
import {useDispatch, useSelector} from "react-redux";
import {
    ApproveOrReject,
    getManageServicerTableHeaders,
    getManageUserTableHeaders,
    getTrainingTableHeaders
} from "../../utils/consts";
import useUpdateTrainingStatus from "../../hooks/trainingHooks/useUpdateTrainingStatus";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {setCurrentUser} from "../../features/usersManagementSlice";
import TrainingWithdrawModal from "../TrainingPage/trainingWithdrawModal/TrainingWithdrawModal";
import ServicerDeleteModal from "./servicerDeleteModal/ServicerDeleteModal";
import EditOffOutlinedIcon from "@mui/icons-material/EditOffOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import {setCurrentServicer} from "../../features/servicersManagementSlice";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';


const ManageServicerTable = ({servicerList, order, setOrder, orderBy, setOrderBy, openUserModal, setOpenUserModal}) => {
    const [openWithdrawModal, setOpenWithdrawModal] = useState(false)

    const [servicerSelected, setServicerSelected] = useState(null)

    const dispatch = useDispatch()

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }

    const updateCurrentServicerHandler = currentServicer => {
        setOpenUserModal(true)
        dispatch(setCurrentServicer({
            currentServicer
        }))
    }

    const deleteCurrentServicerHandler = servicer => {
        setServicerSelected(servicer)
        setOpenWithdrawModal(true)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {
                                servicerList.map(servicer => {
                                    const {
                                        sm_id: servicerId,
                                        sm_servicerMasterName: servicerName,
                                        sm_optOutFlag: servicerOptOutFlag,
                                        sm_trsiiOptIn: servicerTrsiiOptIn,
                                        sm_isDelete: isDelete,
                                    } = servicer

                                    return (
                                        <TableRow
                                            key={servicerId}
                                            sx={{
                                                backgroundColor: `${isDelete ? 'rgba(100,100,100,.1)' : ''}`
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {servicerId}
                                            </TableCell>
                                            <TableCell>{servicerName}</TableCell>
                                            <TableCell>
                                                {
                                                    !! servicerTrsiiOptIn && <CheckOutlinedIcon color='success' />
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    !! servicerOptOutFlag && <CheckOutlinedIcon color='success' />
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Grid container>
                                                    <Grid item>
                                                        {
                                                            !!isDelete ?
                                                                <IconButton disabled={!!isDelete}>
                                                                    <EditOffOutlinedIcon color='default' />
                                                                </IconButton>
                                                                :
                                                                <IconButton onClick={() => updateCurrentServicerHandler(servicer)}>
                                                                    <Tooltip title="Edit" placement="top">
                                                                        <EditOutlinedIcon color='success' />
                                                                    </Tooltip>
                                                                </IconButton>
                                                        }
                                                    </Grid>
                                                    <Grid item>
                                                        {
                                                            !!isDelete ?
                                                                <IconButton disabled={!!isDelete}>
                                                                    <DeleteForeverOutlinedIcon color='default' />
                                                                </IconButton>
                                                                :
                                                                <IconButton onClick={() => deleteCurrentServicerHandler(servicer)}>
                                                                    <Tooltip title="Delete" placement="top">
                                                                        <DeleteOutlineOutlinedIcon color='error' />
                                                                    </Tooltip>
                                                                </IconButton>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <ServicerDeleteModal
                    open={openWithdrawModal}
                    setOpen={setOpenWithdrawModal}
                    currentServicer={servicerSelected}
                />
            </Paper>
        </Box>
    );
}


function EnhancedTableHead({ order, orderBy, onRequestSort }) {

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                {getManageServicerTableHeaders.map((headCell) => (
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
                <TableCell>Actions</TableCell>
            </TableRow>
        </TableHead>
    )
}


export default ManageServicerTable
