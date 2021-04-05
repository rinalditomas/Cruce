import React, { useEffect, useState } from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../state/user";
import useStyles from "../utils/stylesNavbar";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { red, blue, yellow } from "@material-ui/core/colors";

const Navbar = () => {
  const classes = useStyles();
  const history = useHistory();

  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.cadete);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(clearUser());
    history.push("/");
  };

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: user && user.admin ? yellow[800] : blue[800],

        /* main: yellow[800],
        main: blue[900]  */
      },
    },
  });

  return (
    <ThemeProvider>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              News
            </Typography>
            {!token ? (
              <>
                <Link to="/login" style={{ color: "inherit" }}>
                  <Button color="inherit">Login</Button>
                </Link>
                <Link to="/register" style={{ color: "inherit" }}>
                  <Button color="inherit">Register</Button>
                </Link>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </>
            )}

            <Link to="/home" style={{ color: "inherit" }}>
              <Button color="inherit">Home</Button>
            </Link>
          </Toolbar>
        </AppBar>
      </div>
    </ThemeProvider>
  );
};
export default Navbar;
