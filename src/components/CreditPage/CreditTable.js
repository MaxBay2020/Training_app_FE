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

function createData(name, calories, fat, carbs, protein, price) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
        price,
        history: [
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



function Row({row}) {
    const [open, setOpen] = React.useState(false)
    const {
        smId,
        smName,
        ECLASS,
        LiveTraining,
        Webinar,
        credits,
        users
    } = row



    // userName,
    //     userEmail,
    //     ECLASS,
    //     LiveTraining,
    //     Webinar
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {smId}
                </TableCell>
                <TableCell align="right">{smName}</TableCell>
                <TableCell align="right">{ECLASS}</TableCell>
                <TableCell align="right">{Webinar}</TableCell>
                <TableCell align="right">{LiveTraining}</TableCell>
                <TableCell align="right">{credits}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            {/*<Typography variant="h6" gutterBottom component="div">*/}
                            {/*    Users*/}
                            {/*</Typography>*/}
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User Name</TableCell>
                                        <TableCell>User Email</TableCell>
                                        <TableCell align="right">#Appd.EClass</TableCell>
                                        <TableCell align="right">#Appd.Webinar</TableCell>
                                        <TableCell align="right">#Appd.LiveTraining</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => {
                                        const {
                                            userName,
                                            userEmail,
                                            ECLASS,
                                            LiveTraining,
                                            Webinar
                                        } = user

                                        return (
                                            <TableRow key={userEmail}>
                                                <TableCell component="th" scope="row">
                                                    {userName}
                                                </TableCell>
                                                <TableCell>{userEmail}</TableCell>
                                                <TableCell align="right">{ECLASS}</TableCell>
                                                <TableCell align="right">{LiveTraining}</TableCell>
                                                <TableCell align="right">{Webinar}</TableCell>
                                            </TableRow>
                                        )

                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}



const CreditTable = ({creditsStats}) => {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Servicer ID</TableCell>
                        <TableCell align="right">Servicer Name</TableCell>
                        <TableCell align="right">#Appd.EClass</TableCell>
                        <TableCell align="right">#Appd.Webinar</TableCell>
                        <TableCell align="right">#Appd.LiveTraining</TableCell>
                        <TableCell align="right">Credits</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {creditsStats.map((row) => (
                        <Row key={row.smId} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}


export default CreditTable

