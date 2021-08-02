import React, { FunctionComponent } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  CircularProgress,
  createStyles,
  Fab,
  FormControlLabel,
  makeStyles,
  Switch,
  Typography,
  Box,
} from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import { ThingToBring, User } from "../types";

import { Delete } from "@material-ui/icons";
import { filter } from "lodash";
import ThingDialog from "./dialogs/ThingDialog";
import IsEmptyDisplay from "./IsEmptyDisplay";
import useApi from "hooks/useApi";

const useStyles = makeStyles((theme) =>
  createStyles({
    ul: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    fab: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    infoText: {
      marginRight: "1rem",
      alignSelf: "center",
    },
    flex: { display: "flex", flexDirection: "column" },
  })
);

const Group: FunctionComponent = () => {
  const { groupID } = useParams<{ groupID: string }>();
  const { push } = useHistory();
  const snackbar = useSnackbar();
  const classes = useStyles();

  const {
    addThingToBring,
    getCurrentUser,
    getThingsToBring,
    deleteThingToBring,
    saveGroup,
  } = useApi();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [thingsTobring, setThingsTobring] = useState<ThingToBring[]>([]);
  const [cachedUser, setCachedUser] = useState<User | undefined>(undefined);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };
  const handleClose = () => {
    setDialogOpen(false);
  };

  const loadThings = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getThingsToBring(groupID);
      if (data) {
        setThingsTobring(data);
        console.log(data);
      }

      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }, [groupID]);

  useEffect(() => {
    loadThings();
    getCurrentUser().then((res) => {
      setCachedUser(res.data);
      setTimeout(() => {
        if (!!groupID && !res.data.savedGroups?.includes(groupID)) {
          console.log("test");
          saveGroup(groupID);
        }
      }, 100);
    });
  }, [loadThings, push, snackbar]);

  const setSelfBringing = async (
    thingToBring: ThingToBring,
    bringing: boolean
  ) => {
    getCurrentUser().then(({ data: user }) => {
      thingToBring.usersBringing = bringing
        ? [...thingToBring.usersBringing, user.username as string]
        : filter(
            thingToBring.usersBringing,
            (username) => username !== user.username
          );
      const newThingsToBring = thingsTobring.map((ttb) =>
        ttb._id === thingToBring._id ? thingToBring : ttb
      );
      setThingsTobring(newThingsToBring);
    });
  };

  if (loading) return <CircularProgress />;
  return (
    <Box>
      {thingsTobring.length > 0 ? (
        thingsTobring.map((thingToBring) => (
          <Accordion key={thingToBring._id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions1-content"
              id="additional-actions1-header"
            >
              <Typography
                className={classes.infoText}
                variant="h5"
                style={{
                  color:
                    thingToBring.usersBringing.length <
                    thingToBring.minimumAmount
                      ? "red"
                      : "green",
                }}
              >
                {thingToBring.usersBringing.length}/{thingToBring.minimumAmount}
              </Typography>
              <Typography className={classes.infoText} variant="h6">
                {thingToBring.title}
              </Typography>

              <ul className={classes.ul}>
                {thingToBring.usersBringing.map((username: string) => (
                  <Chip
                    key={`${thingToBring._id}-${username}`}
                    label={username}
                    className={classes.chip}
                    onDelete={
                      username === cachedUser?.username
                        ? () => setSelfBringing(thingToBring, false)
                        : undefined
                    }
                  />
                ))}
              </ul>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.flex}>
                {thingToBring.description && (
                  <Typography gutterBottom color="textSecondary">
                    Description:
                    {thingToBring.description}
                  </Typography>
                )}

                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        !!cachedUser?.username &&
                        thingToBring.usersBringing.includes(
                          cachedUser?.username
                        )
                      }
                      onChange={async (ev) => {
                        setSelfBringing(thingToBring, ev.target.checked);
                      }}
                    />
                  }
                  label="I am bringing one"
                />
                {thingToBring.creatorId === cachedUser?._id && (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Delete />}
                    onClick={() => {
                      deleteThingToBring(thingToBring._id);
                      setThingsTobring(
                        filter(thingsTobring, (t) => t._id !== thingToBring._id)
                      );
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <IsEmptyDisplay
          text="This group is empty"
          buttonText="Add thing to bring"
          onClick={handleClickOpen}
        />
      )}
      <Fab color="secondary" className={classes.fab} onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <ThingDialog
        open={dialogOpen}
        handleClose={handleClose}
        handleSubmit={async ({ bringing, ...values }) => {
          getCurrentUser().then(async ({ data: { username } }) => {
            const thingToBring = {
              creatorId: username,
              usersBringing: bringing ? [username] : [],
              ...values,
            };

            await addThingToBring(thingToBring, groupID);
            handleClose();
            loadThings();
          });
        }}
      />
    </Box>
  );
};
export default Group;
