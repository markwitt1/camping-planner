import React, { FunctionComponent } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CheckboxListIcon from "@material-ui/icons/AssignmentTurnedIn";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Group from "./components/Group";
import Profile from "./components/Profile";
import LogIn from "./components/auth/LogIn";
import SignUp from "./components/auth/SignUp";
import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@material-ui/core";
import Home from "./components/Home";
import useLocalStorage from "./hooks/useLocalStorage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100vh",
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    icon: {
      color: "white",
    },
  })
);

const App: FunctionComponent = () => {
  const classes = useStyles();
  const [darkMode, setDarkMode] = useLocalStorage<boolean>(
    "darkMode",
    window.matchMedia("(prefers-color-scheme: dark)").matches || false
  );

  const theme = createTheme({
    palette: { type: darkMode ? "dark" : "light" },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Box className={classes.root}>
          <Router>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" className={classes.title}>
                  CampingPlanner
                </Typography>
                <IconButton component={Link} to="/">
                  <CheckboxListIcon className={classes.icon} />
                </IconButton>
                <IconButton component={Link} to="/profile">
                  <AccountCircleIcon className={classes.icon} />
                </IconButton>
                <IconButton onClick={() => setDarkMode(!darkMode)}>
                  <Brightness7Icon className={classes.icon} />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Switch>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/login">
                <LogIn />
              </Route>
              <Route path="/signup">
                <SignUp />
              </Route>
              <Route path="/group/:groupID">
                <Group />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </Router>
        </Box>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default App;
