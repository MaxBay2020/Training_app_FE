import {CircularProgress, Grid, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import {blue} from "@mui/material/colors";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {useState} from "react";
import {UserRole} from "../../utils/consts";
import useDownload from "../../hooks/downloadHooks/useDownload";

const PageHeader = (props) => {

    const {
        userName,
        userRole,
        servicerId,
        servicerMasterName,
        currentPage,
        searchKeyword,
        orderBy,
        order,
    } = props

    const [fileType, setFileType] = useState(1)
    const [anchorEl, setAnchorEl] = useState(null)

    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
        handleDownload(1)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleDownload = fileType => {
        setFileType(fileType)
        downloadFile()
        handleClose()
    }


    const {
        isFetching,
        refetch: downloadFile
    } = useDownload(
        ['download', currentPage, searchKeyword, order, orderBy, servicerId],
        currentPage,
        fileType,
        searchKeyword,
        order,
        orderBy
    )


    const renderUserInfo = userRole => {
        if (userRole === UserRole.SERVICER || userRole === UserRole.SERVICER_COORDINATOR) {
            return (
                <>
                    <Grid item><Typography
                        variant='subtitle'>{servicerId && `Servicer ID:    ${servicerId}`}</Typography></Grid>
                    <Grid item><Typography
                        variant='subtitle'>{servicerMasterName && `Servicer Name:    ${servicerMasterName}`}</Typography></Grid>
                </>
            )
        }
    }

    return (
        <>
            <Grid container alignItems='center' justifyContent='space-between'>
                <Grid item>
                    <Grid container direction='column' alignItems='flex-start' sx={{mb: 5}} spacing={1}>
                        <Grid item><Typography variant='subtitle'>{`User Name:   ${userName}`}</Typography></Grid>
                        <Grid item><Typography variant='subtitle'>{`User Role:   ${userRole}`}</Typography></Grid>
                        { renderUserInfo(userRole) }
                    </Grid>
                </Grid>
                <Grid item>
                    <Tooltip title="download" placement="top">
                        <Box>
                            <IconButton
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                disabled={isFetching}
                            >
                                <CloudDownloadOutlinedIcon />
                                {
                                    isFetching && (
                                        <CircularProgress
                                            size={40}
                                            sx={{
                                                color: blue[500],
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                zIndex: 1,
                                            }}
                                        />
                                    )}
                            </IconButton>

                            {/*<Menu*/}
                            {/*    id="basic-menu"*/}
                            {/*    anchorEl={anchorEl}*/}
                            {/*    open={open}*/}
                            {/*    onClose={handleClose}*/}
                            {/*    MenuListProps={{*/}
                            {/*        'aria-labelledby': 'basic-button',*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    <MenuItem onClick={() => handleDownload(1)}>Download Excel</MenuItem>*/}
                            {/*    <MenuItem onClick={() => handleDownload(2)}>Download PDF</MenuItem>*/}
                            {/*</Menu>*/}
                        </Box>
                    </Tooltip>
                </Grid>
            </Grid>
        </>
    )
}

export default PageHeader
