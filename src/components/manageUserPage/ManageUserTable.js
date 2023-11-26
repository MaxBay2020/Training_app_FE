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
import {ApproveOrReject, getManageUserTableHeaders, getTrainingTableHeaders} from "../../utils/consts";
import useUpdateTrainingStatus from "../../hooks/trainingHooks/useUpdateTrainingStatus";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {setCurrentUser} from "../../features/usersManagementSlice";
import TrainingWithdrawModal from "../TrainingPage/trainingWithdrawModal/TrainingWithdrawModal";
import UserDeleteModal from "./userDeleteModal/UserDeleteModal";
import EditOffOutlinedIcon from "@mui/icons-material/EditOffOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";


const ManageUserTable = ({userList, order, setOrder, orderBy, setOrderBy, openUserModal, setOpenUserModal}) => {

    const [openWithdrawModal, setOpenWithdrawModal] = useState(false)

    const [userSelected, setUserSelected] = useState(null)

    const dispatch = useDispatch()

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }

    const updateCurrentUserHandler = currentUser => {
        setOpenUserModal(true)
        dispatch(setCurrentUser({
            currentUser
        }))
    }

    const deleteCurrentUserHandler = (user) => {
        setUserSelected(user)
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
                                userList.map(user => {
                                    const {
                                        user_id: userId,
                                        user_firstName: firstName,
                                        user_lastName: lastName,
                                        user_email: email,
                                        user_isDelete: isDelete,
                                        userRole_userRoleName: userRoleName,
                                        sm_id: servicerId,
                                        sm_servicerMasterName: servicerName,
                                        user_createdAt: userCreatedAt,
                                        user_updatedAt: userUpdatedAt
                                    } = user

                                    return (
                                        <TableRow
                                            key={userId}
                                            sx={{
                                                backgroundColor: `${isDelete ? 'rgba(100,100,100,.1)' : ''}`
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {firstName}
                                            </TableCell>
                                            <TableCell>{lastName}</TableCell>
                                            <TableCell>{email}</TableCell>
                                            <TableCell>{userRoleName}</TableCell>
                                            <TableCell>{servicerId}</TableCell>
                                            <TableCell>{servicerName}</TableCell>
                                            <TableCell>{moment(userCreatedAt).format('MM-DD-YYYY')}</TableCell>
                                            <TableCell>{moment(userUpdatedAt).format('MM-DD-YYYY')}</TableCell>
                                            <TableCell>
                                                <Grid container>
                                                    <Grid item>
                                                        {
                                                            !!isDelete ?
                                                                <IconButton disabled={!!isDelete}>
                                                                    <EditOffOutlinedIcon color='default'/>
                                                                </IconButton>
                                                                :
                                                                <IconButton onClick={() => updateCurrentUserHandler(user)} >
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
                                                                <IconButton onClick={() => deleteCurrentUserHandler(user)}>
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

                <UserDeleteModal
                    open={openWithdrawModal}
                    setOpen={setOpenWithdrawModal}
                    currentUser={userSelected}
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
                {getManageUserTableHeaders.map((headCell) => (
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


export default ManageUserTable
