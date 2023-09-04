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
import {alpha, Checkbox, Chip, Grid, TableSortLabel, Tooltip} from "@mui/material";
import {useState} from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useUpdateTrainingStatus from "../../../hooks/trainingHooks/useUpdateTrainingStatus";
import {ApproveOrReject, getTrainingTableHeaders} from "../../../utils/consts";
import {visuallyHidden} from "@mui/utils";
import {useSelector} from "react-redux";


export const renderTableCellForTrainingStatus = trainingStatus => {
    const chipStyle = {
        variant: 'outlined',
        color: 'default'
    }

    if(trainingStatus === ApproveOrReject.APPROVE){
        chipStyle.color = 'success'
    }else if(trainingStatus === ApproveOrReject.REJECT){
        chipStyle.color = 'error'
    }else if(trainingStatus === ApproveOrReject.SUBMITTED){
        chipStyle.variant = 'filled'
        chipStyle.color = 'primary'
    }else if(trainingStatus === ApproveOrReject.CANCELED){
        chipStyle.variant = 'filled'
    }
    return (
        <TableCell align="right">
            <Chip sx={{width: '112px'}} variant={chipStyle.variant} color={chipStyle.color} label={trainingStatus} />
        </TableCell>
    )
}

const TrainingTableForApprover = ({trainingList, order, setOrder, orderBy, setOrderBy}) => {

    const [trainingsSelected, setTrainingsSelected] = useState([])

    // TODO: bug need to be fixed
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = trainingList.map((training) => training.id)

            setTrainingsSelected(newSelected.filter( item => !!item))
            return;
        }
        setTrainingsSelected([])
    }



    const handleClick = (event, name, trainingStatus) => {

        // if(trainingStatus.toLowerCase() !== 'pending')
        //     return

        const selectedIndex = trainingsSelected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(trainingsSelected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(trainingsSelected.slice(1));
        } else if (selectedIndex === trainingsSelected.length - 1) {
            newSelected = newSelected.concat(trainingsSelected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                trainingsSelected.slice(0, selectedIndex),
                trainingsSelected.slice(selectedIndex + 1),
            );
        }

        setTrainingsSelected(newSelected);
    }

    const isSelected = (name) => trainingsSelected.indexOf(name) !== -1

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar
                    numSelected={trainingsSelected.length}
                    trainingsSelected={trainingsSelected}
                    setTrainingsSelected={setTrainingsSelected}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                    >
                        <EnhancedTableHead
                            numSelected={trainingsSelected.length}
                            onSelectAllClick={e => handleSelectAllClick(e)}
                            rowCount={trainingList.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {
                                trainingList.map((training, index) => {
                                    const {
                                        id: trainingId,
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
                                    const isItemSelected = isSelected(trainingId);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, trainingId, trainingStatus)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={trainingId}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    // disabled={trainingStatus.toLowerCase() !== 'pending'}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
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
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}


function EnhancedTableHead({ onSelectAllClick, numSelected, rowCount, order, orderBy, onRequestSort }) {

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property)
    }
    const {userRole} = useSelector(state => state.user)

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
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
    )
}

function EnhancedTableToolbar({ numSelected, trainingsSelected, setTrainingsSelected }) {

    const { mutate: updateTrainingStatus } = useUpdateTrainingStatus(setTrainingsSelected)

    const approveTrainings = () => {
        updateTrainingStatus({
            trainingIds: trainingsSelected,
            approveOrReject: ApproveOrReject.APPROVE
        })
    }
    const rejectTrainings = () => {
        updateTrainingStatus({
            trainingIds: trainingsSelected,
            approveOrReject: ApproveOrReject.REJECT
        })
    }

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {
                numSelected > 0
                &&
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            }

            {
                numSelected > 0
                &&
                <Grid container alignItems='center' justifyContent='flex-end' spacing={1}>
                    <Grid item>
                        <Tooltip title="Approve">
                            <Button variant="contained" disableElevation size='small' onClick={() => approveTrainings()}>
                                Approve
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title="Reject">
                            <Button variant="contained" disableElevation color='error' size='small' onClick={() => rejectTrainings()}>
                                Reject
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            }
        </Toolbar>
    );
}

export default TrainingTableForApprover
