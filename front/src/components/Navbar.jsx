import React from "react";

import { useLocation } from "react-router-dom";

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

import { useSnackbar } from "notistack";
import messagesHandler from "../utils/messagesHandler";

const Navbar = () => {
  
  const location = useLocation().pathname.split("/");

  const classes = useStyles();
  const history = useHistory();

  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.cadete);

  const messages = messagesHandler(useSnackbar());

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser()) && messages.info();
    history.push("/");
  };

  const userTypeColor = (color = "") => {
    if (location.includes("admin")) return "admin";
    if (location.includes("cadeteria")) return "cadeteria";
    if (location.includes("cadete")) return "cadete";
    return "base";
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes[`${userTypeColor()}`]}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}></Typography>
          {!token ? (
            <>
              <Link to="/selectLogin" style={{ color: "inherit" }}>
                <Button color="inherit">Login</Button>
              </Link>
              <Link to="/select" style={{ color: "inherit" }}>
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
          <Link to="/" style={{ color: "inherit" }}>
            <Button color="inherit">Home</Button>
          </Link>
          {user && user.admin ? (
            <>
              <Link to="/admin" style={{ color: "inherit" }}>
                <Button color="inherit">admin panel</Button>
              </Link>
            </>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default Navbar;
