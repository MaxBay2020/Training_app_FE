import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {userLogout} from "../../features/userSlice";
import {useQueryClient} from "@tanstack/react-query";
import LightOrNightSwitch from "../lightOrNightSwitch/LightOrNightSwitch";
import {UserRole} from "../../utils/consts";

const pagesForServicer = [
    {
        label: 'Training',
        link: '/training'
    }
]

const pagesForApprover = [
    {
        label: 'Training',
        link: '/training'
    },
    {
        label: 'Credit',
        link: '/credit'
    }
]

const pagesForAdmin = [
    {
        label: 'Training',
        link: '/training'
    },
    {
        label: 'Credit',
        link: '/credit'
    },
    {
        label: 'Admin',
        link: '/admin'
    },
]


const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const { userName, userRole } = useSelector(state => state.user)

    const dispatch = useDispatch()

    const queryClient = useQueryClient()


    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    }

    const logoutUser = () => {
        dispatch(userLogout())
        queryClient.clear()
    }


    const renderAppBarMenu = userRole => {
        if(userRole === UserRole.ADMIN){
            return pagesForAdmin
        }else if(userRole === UserRole.APPROVER){
            return pagesForApprover
        }else if(userRole === UserRole.SERVICER || userRole === UserRole.SERVICER_COORDINATOR ){
            return pagesForServicer
        }else{
            return []
        }
    }

    return (
        <AppBar position="static" sx={{marginBottom: '100px'}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Avatar
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Seal_of_the_United_States_Department_of_Housing_and_Urban_Development.svg/800px-Seal_of_the_United_States_Department_of_Housing_and_Urban_Development.svg.png"
                        alt="logo"/>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {
                                renderAppBarMenu(userRole).map((page) => (
                                    <Link to={page.link} key={page.label}>
                                        <MenuItem>
                                            <Typography textAlign="center">{page.label}</Typography>
                                        </MenuItem>
                                    </Link>
                                ))
                            }
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {
                            renderAppBarMenu(userRole).map((page) => (
                                <Link to={page.link} key={page.label}>
                                    <Button
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        {page.label}
                                    </Button>
                                </Link>
                            ))
                        }
                    </Box>

                    <Box sx={{ flexGrow: 0, mr: 2 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                {
                                    userName && <Avatar>{userName[0].toUpperCase()}</Avatar>
                                }
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {
                                renderAppBarMenu(userRole).map((menu) => (
                                <Link to={menu.link} key={menu.label}>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{menu.label}</Typography>
                                    </MenuItem>
                                </Link>
                                ))
                            }
                            <MenuItem onClick={() => logoutUser()}>Logout</MenuItem>
                        </Menu>
                    </Box>

                    {/*<Box>*/}
                    {/*    <LightOrNightSwitch />*/}
                    {/*</Box>*/}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Navbar;
