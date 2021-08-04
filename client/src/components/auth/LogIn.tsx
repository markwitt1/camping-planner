import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import { Field, Form, Formik } from "formik";

import * as yup from "yup";

import { TextField } from "formik-material-ui";
import { FunctionComponent } from "react";
import { Box } from "@material-ui/core";
import useApi from "hooks/useApi";
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

const LogIn: FunctionComponent = () => {
  const classes = useStyles();
  const { push } = useHistory();

  const { logIn } = useApi();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  return (
    <Box>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={yup.object().shape({
          username: yup.string().required(`Please enter your username`),
          password: yup
            .string()
            .required(`Please enter your password`)
            .min(6, "Your password should have at least 8 characters"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);

          logIn(values).then((res) => {
            if (res?.status === 200) {
              if (queryParams.has("redirect"))
                push(queryParams.get("redirect") as string);
              else push("/profile");
            }
          });

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
              Log In
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
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Log In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    component={RouterLink}
                    to={`/signup${search}`}
                    variant="body2"
                  >
                    Don't have an account? Sign Up
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

export default LogIn;
