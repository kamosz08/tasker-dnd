import React, { useState } from "react";
import styles from "./styles.module.css";
import { Formik, Form, Field, FormikHelpers, useFormikContext } from "formik";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { Box, Typography, Button } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Alert from "@material-ui/lab/Alert";
import { FormikInput } from "../../shared/FormikInput/FormikInput";

type FormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
};

type Errors = Partial<FormValues & { differenceInPassword: string }>;

const SignupForm: React.FC = () => {
  const { isSubmitting } = useFormikContext<FormValues>();

  return (
    <Form>
      <Field
        type="email"
        name="email"
        placeholder="Email"
        component={FormikInput}
      />
      <Field
        type="password"
        name="password"
        placeholder="Password"
        component={FormikInput}
      />
      <Field
        type="password"
        name="passwordConfirm"
        placeholder="Confirm password"
        component={FormikInput}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disableElevation
        disabled={isSubmitting}
        className={styles.button}
      >
        Sign Up
      </Button>
    </Form>
  );
};

export const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const [error, setError] = useState("");
  const { push } = useHistory();

  const validate = (values: FormValues) => {
    setError("");
    const errors: Errors = {};
    if (!values.password) {
      errors.password = "Required";
    }
    if (!values.passwordConfirm) {
      errors.passwordConfirm = "Required";
    }

    if (!values.email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    if (values.password !== values.passwordConfirm) {
      setError("Passwords are not equal");
      return;
    }
    try {
      await signUp(values.email, values.password);
      push("/");
    } catch (error) {
      if (typeof error.message === "string") {
        setError(error.message);
      } else {
        setError("Failed to create an account");
      }
    }
    setSubmitting(false);
  };

  return (
    <Box
      width="100%"
      height="80%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card className={styles.card}>
        <Box marginTop="16px" marginBottom="16px">
          <Typography align="center" variant="h4">
            Sign Up
          </Typography>
        </Box>
        {!!error && <Alert severity="error">{error}</Alert>}
        <Formik
          initialValues={{ email: "", password: "", passwordConfirm: "" }}
          validate={validate}
          onSubmit={onSubmit}
        >
          <SignupForm />
        </Formik>
        <Typography align="center">
          Already have an account?{" "}
          <Button onClick={() => push("/login")} color="primary">
            Log In
          </Button>
        </Typography>
      </Card>
    </Box>
  );
};
