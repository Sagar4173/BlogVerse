import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import { Person, Dashboard, ExitToApp, Create } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import Logo from "./Logo";

const Header = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Logo />
        <Box sx={{ flexGrow: 1 }} />

        {user ? (
          <>
            <IconButton color="inherit" component={RouterLink} to="/create">
              <Create />
            </IconButton>

            <IconButton color="inherit" onClick={handleMenuOpen}>
              <Avatar src={user.profilePicture} alt={user.name} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={RouterLink} to="/me">
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                My Profile
              </MenuItem>

              <MenuItem component={RouterLink} to="/dashboard">
                <ListItemIcon>
                  <Dashboard fontSize="small" />
                </ListItemIcon>
                Dashboard
              </MenuItem>

              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <ExitToApp fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
