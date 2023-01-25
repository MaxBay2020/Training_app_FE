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
import {userLogout} from "../../features/loginSlice";
import {useQueryClient} from "@tanstack/react-query";
import LightOrNightSwitch from "../lightOrNightSwitch/LightOrNightSwitch";

const pages = [
    {
        label: 'Training',
        link: '/training'
    }
];
const settings = [
    {
        label: 'Training',
        link: '/training'
    }
];

const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const { name } = useSelector(state => state.login)

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
                                pages.map((page) => (
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
                        {pages.map((page) => (
                            <Button
                                key={page.label}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                <Link to={page.link}>{page.label}</Link>
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0, mr: 2 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                {
                                    name && <Avatar>{name[0].toUpperCase()}</Avatar>
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
                                settings.map((setting) => (
                                <Link to={setting.link} key={setting.label}>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting.label}</Typography>
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
