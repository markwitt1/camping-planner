import React, { FunctionComponent } from "react";
import * as yup from "yup";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import { useSnackbar } from "material-ui-snackbar-provider";
import { TextField } from "formik-material-ui";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";

import logInUser from "../../logInUser";
import api from "../../api";

interface Values {
  username: string;
  password: string;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignUp: FunctionComponent = () => {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const { push } = useHistory();

  const signUp = async ({ username, password }: Values) => {
    try {
      const res = await api.post("/users/signup", { username, password });
      if (res.data.err) {
        snackbar.showMessage("error signing up: " + res.data.err);
      } else {
        logInUser({ username, password }).then(() => push("/profile"));
      }
    } catch (error) {
      console.log(JSON.stringify(error));
      snackbar.showMessage("error signing up: " + error.message);
      console.log("error signing up: ", error);
    }
  };

  return (
    <Box>
      <Formik
        initialValues={{ username: "", password: "", confirmPassword: "" }}
        validationSchema={yup.object().shape({
          username: yup.string().required(`Please enter your desired username`),
          password: yup
            .string()
            .required(`Please enter a strong password`)
            .min(6, "Your password should have at least 8 characters"),
          confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          console.log("submit");
          setSubmitting(true);
          await signUp(values);
          setSubmitting(false);
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    variant="outlined"
                    fullWidth
                    label="Username"
                    name="username"
                    autoComplete="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    variant="outlined"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    variant="outlined"
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    autoComplete="current-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    /* onClick={() => setErrors({})} */
                  >
                    Already have an account? Log in
                  </Link>
                </Grid>
              </Grid>
            </Form>
          </div>
        </Container>
      </Formik>
    </Box>
  );
};

export default SignUp;