import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import useApi from "hooks/useApi";
import useScrollTop from "hooks/useScrollTop";
import React, { useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { Link, useHistory } from "react-router-dom";
import { User } from "types";

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
  const classes = useStyles();

  const { logOut } = useApi();

  useScrollTop();

  const { getCurrentUser } = useApi();

  const [cachedUser, setCachedUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    getCurrentUser()
      .then(({ data }) => setCachedUser(data))
      .catch(() => push("/login"));
  }, []);
  return (
    <Box margin="1rem">
      <Typography variant="h5" className={classes.center}>
        Username:{cachedUser?.username}
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Button className={classes.btn} component={Link} to="/">
          Go to groups
        </Button>
        <Button
          className={classes.btn}
          onClick={() => {
            logOut().then(() => {
              push("/login");
              setCachedUser(undefined);
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
