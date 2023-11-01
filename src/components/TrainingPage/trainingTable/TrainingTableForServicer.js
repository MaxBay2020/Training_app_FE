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
import {Grid, TableSortLabel, Tooltip} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import TrainingModal from "../trainingModal/TrainingModal";
import TrainingWithdrawModal from "../trainingWithdrawModal/TrainingWithdrawModal"
import {renderTableCellForTrainingStatus} from "./TrainingTableForApprover";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentTraining, switchOpenModal} from "../../../features/trainingSlice";
import {ApproveOrReject, getTrainingTableHeaders} from "../../../utils/consts";
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
                <TableCell align="center">Actions</TableCell>
            </TableRow>
        </TableHead>
    );
}

const Row = ({training}) => {

    const {trainingName, trainingType, startDate, endDate, createdAt, hoursCount, trainingStatus} = training
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
                <TableCell align="right">{moment(startDate).format('MM-DD-YYYY')}</TableCell>
                <TableCell align="right">{moment(endDate).format('MM-DD-YYYY')}</TableCell>
                <TableCell align="right">{moment(createdAt).format('MM-DD-YYYY')}</TableCell>
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

            <TrainingWithdrawModal
                open={openWithdrawModal}
                setOpen={setOpenWithdrawModal}
                training={training}
            />
        </>
    );
}

const TrainingTableForServicer = ({trainingList, order, setOrder, orderBy, setOrderBy}) => {


    const dispatch = useDispatch()
    const { openModal, currentTraining } = useSelector(state => state.training)

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }

    return (
        <>
            {
                currentTraining
                &&
                <TrainingModal
                    open={openModal}
                    setOpen={() => dispatch(switchOpenModal())}
                    isCreating={!currentTraining}
                    isUpdating={!!currentTraining}
                    training={currentTraining}
                />
            }

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
        </>
    );
}

export default TrainingTableForServicer
