import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {useSelector} from "react-redux";
import moment from "moment";
import {trainingType} from "../../utils/consts";
import {Grid} from "@mui/material";
import Typography from "@mui/material/Typography";

const columns = [
    {
        field: 'id',
        sortable: true,
        headerName: '#',
        filterable: false,
        renderCell: params => params.api.getRowIndexRelativeToVisibleRows(params.row.code)
    },
    {
        field: 'trainingName',
        headerName: 'Training Name',
        type: 'string',
        width: 150,
        editable: true,
    },
    {
        field: 'trainingType',
        headerName: 'Training Type',
        type: 'singleSelect',
        valueOptions: Object.values(trainingType),
        width: 150,
        editable: true,
    },
    {
        field: 'startDate',
        headerName: 'Start Date',
        type: 'date',
        width: 150,
        editable: false,
    },
    {
        field: 'endDate',
        headerName: 'End Date',
        type: 'date',
        width: 150,
        editable: false,
    },
    {
        field: 'hoursCount',
        headerName: 'Hours Count',
        type: 'number',
        headerAlign:'left',
        align:'left',
        width: 100,
        editable: true,
        preProcessEditCellProps: (params) => {
            console.log(123)
            console.log(params)
            const hasError = params.props.value < 3;
            console.log(hasError)
            return { ...params.props, error: hasError };
        },
    },
    {
        field: 'trainingURL',
        headerName: 'Training URL',
        width: 150,
        editable: true,
    },
    {
        field: 'trainingStatus',
        headerName: 'Training Status',
        width: 150,
        editable: false,
    },
    {
        field: 'traineeEmail',
        headerName: 'Trainee Email',
        width: 250,
        editable: true,
    },
    {
        field: 'traineeFirstName',
        headerName: 'Trainee First Name',
        width: 150,
        editable: true,
    },
    {
        field: 'traineeLastName',
        headerName: 'Trainee Last Name',
        width: 150,
        editable: true,
    },
    {
        field: 'servicer',
        headerName: 'Servicer ID',
        width: 150,
        editable: true,
    }
]

const UploadedTrainingsTable = () => {
    const { uploadedTrainings } = useSelector(state => state.training)

    console.log(uploadedTrainings)
    // const trainingsList = uploadedTrainings

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Grid container direction='column'>
                <Grid item>
                    <Typography variant='subtitle1'>Total imported: <b>{uploadedTrainings.length}</b></Typography>
                </Grid>
                <Grid item>
                    <Typography variant='subtitle1'>Total valid: <b>15</b></Typography>
                </Grid>
                <Grid item>
                    <Typography variant='subtitle1'>Total invalid: <b>5</b></Typography>
                </Grid>
                <Grid item>
                    <Typography variant='subtitle1'>Total edited: <b>0</b></Typography>
                </Grid>
            </Grid>
            <DataGrid
                rows={uploadedTrainings.map((row, index) => (
                    { id: index + 1,
                        ...row,
                        startDate: moment(row.startDate).toDate(),
                        endDate: moment(row.endDate).toDate(),
                    }))}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}

export default UploadedTrainingsTable
