import React, { FunctionComponent } from "react";
import * as yup from "yup";
import { Field, Form, Formik } from "formik";

import { Switch as FormikSwitch, TextField } from "formik-material-ui";
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Button,
} from "@material-ui/core";
import { ThingToBring } from "../../types";
interface Values extends Partial<ThingToBring> {
  bringing: boolean;
}
interface Props {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (values: Values) => void;
}

const ThingDialog: FunctionComponent<Props> = ({
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
          <DialogTitle id="responsive-dialog-title">
            Add thing to bring
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field component={TextField} name="title" label="Title" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  type="number"
                  name="minimumAmount"
                  label="Minimum Amount"
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
              <Grid item xs={12} sm={12}>
                <FormControlLabel
                  control={<Field component={FormikSwitch} name="bringing" />}
                  label="I am bringing one"
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

export default ThingDialog;
