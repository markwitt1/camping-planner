import React, { FunctionComponent } from "react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Button,
} from "@material-ui/core";
import * as yup from "yup";

import { TextField } from "formik-material-ui";
import { Field, Form, Formik } from "formik";

interface Values {
  title: string;
  description: string;
}

interface Props {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (values: Values) => void;
}

const GroupDialog: FunctionComponent<Props> = ({
  open,
  handleClose,
  handleSubmit,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <Formik
        initialValues={{
          title: "",
          description: "",
          minimumAmount: 1,
          bringing: false,
        }}
        validationSchema={yup.object().shape({
          title: yup.string().required("You must provide a title"),
          minimumAmount: yup.number().positive("Must be 1 or more"),
        })}
        onSubmit={handleSubmit}
      >
        <Form>
          <DialogTitle>Create Group</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <Field
                  fullWidth
                  component={TextField}
                  name="title"
                  label="Title"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Field
                  fullWidth
                  component={TextField}
                  multiline
                  name="description"
                  label="Description"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary" autoFocus>
              Submit
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default GroupDialog;
