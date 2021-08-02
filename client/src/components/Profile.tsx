import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";
import React, { useEffect } from "react";
import { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import api from "../api";
import useLocalStorage from "../hooks/useLocalStorage";

import { User } from "../types";

const useStyles = makeStyles({
  center: {
    textAlign: "center",
  },
  btn: {
    marginTop: "1rem",
  },
});

const Profile: FunctionComponent = () => {
  const { push } = useHistory();
  const snackbar = useSnackbar();
  const classes = useStyles();

  const [user, setUser] = useLocalStorage<User | undefined>("user", undefined);

  useEffect(() => {
    if (!user) {
      snackbar.showMessage("You have to be signed in to use this app");
      push("/login");
    }
  }, [user]);
  return (
    <Box margin="1rem">
      <Typography variant="h5" className={classes.center}>
        Username:{user?.username}
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Button className={classes.btn} component="a" href="/">
          Go to groups
        </Button>
        <Button
          className={classes.btn}
          onClick={() => {
            api.get("/users/logout").then(() => {
              push("/login");
              setUser(undefined);
            });
          }}
        >
          Sign out
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
