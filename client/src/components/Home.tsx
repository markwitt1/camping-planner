import React, { FunctionComponent } from "react";
import {
  Box,
  CircularProgress,
  createStyles,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import { Group, User } from "../types";
import { filter } from "lodash";
import useLocalStorage from "../hooks/useLocalStorage";
import IsEmptyDisplay from "./IsEmptyDisplay";
import GroupDialog from "./dialogs/GroupDialog";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "material-ui-snackbar-provider";
import { Share as ShareIcon } from "@material-ui/icons";

import api from "../api";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {},
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

const Home: FunctionComponent = () => {
  const classes = useStyles();
  const { push } = useHistory();
  const snackbar = useSnackbar();

  const [savedGroups, setSavedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClose = () => setDialogOpen(false);
  const handleClickOpen = () => setDialogOpen(true);

  const [user] = useLocalStorage<User | undefined>("user", undefined);
  const loadSavedGroups = useCallback(async () => {
    setLoading(true);

    if (user) {
      const res = await api.get(`/users/${user?.username}/getSavedGroups`);
      console.log(res.data);
      if (res.data) setSavedGroups(res.data);
    } else {
      push("/signup");
      snackbar.showMessage("You have to be signed in to use this app");
    }
    setLoading(false);
  }, [user]);
  useEffect(() => {
    loadSavedGroups();
  }, [loadSavedGroups]);

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : savedGroups.length > 0 ? (
        <List>
          {savedGroups.map((savedGroup) => (
            <ListItem
              button
              component="a"
              href={`/group/${savedGroup._id}`}
              divider
              key={savedGroup._id}
            >
              <ListItemText
                primary={savedGroup.title}
                secondary={savedGroup.description}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="share"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    snackbar.showMessage(
                      "Group link has been copied to clipboard"
                    );
                  }}
                >
                  <ShareIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    api.delete(`/groups/${savedGroup._id}`);
                    setSavedGroups(
                      filter(savedGroups, (g) => g._id !== savedGroup._id)
                    );
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : (
        <IsEmptyDisplay
          text="You don't have any groups saved. Create one or open a friend's link"
          buttonText="Create a group"
          onClick={handleClickOpen}
        />
      )}
      <Fab
        color="secondary"
        className={classes.fab}
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      <GroupDialog
        open={dialogOpen}
        handleClose={handleClose}
        handleSubmit={async ({ title, description }) => {
          await api.post("/groups", {
            title,
            description,
          });

          handleClose();
          loadSavedGroups();
        }}
      />
    </Box>
  );
};

export default Home;
