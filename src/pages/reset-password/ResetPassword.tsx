import React, { useState } from "react";
import { Formik, Form, Field, FormikHelpers, useFormikContext } from "formik";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./styles.module.css";
import { Box, Typography, Button } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Alert from "@material-ui/lab/Alert";
import { FormikInput } from "../../shared/FormikInput/FormikInput";
import { useHistory } from "react-router";

type FormValues = {
  email: string;
};

type Errors = Partial<FormValues>;

const ResetPasswordForm: React.FC = () => {
  const { isSubmitting } = useFormikContext<FormValues>();

  return (
    <Form>
      <Field
        type="email"
        name="email"
        placeholder="Email"
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
        Reset Password
      </Button>
    </Form>
  );
};

export const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { push } = useHistory();

  const validate = (values: FormValues) => {
    setError("");
    const errors: Errors = {};

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
    try {
      await resetPassword(values.email);
      setMessage("Visit Your email to complete process");
    } catch (error) {
      if (typeof error.message === "string") {
        setError(error.message);
      } else {
        setError("Failed to reset password");
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
            Reset password
          </Typography>
        </Box>
        {!!error && <Alert severity="error">{error}</Alert>}
        {!!message && <Alert severity="info">{message}</Alert>}
        <Formik
          initialValues={{ email: "" }}
          validate={validate}
          onSubmit={onSubmit}
        >
          <ResetPasswordForm />
        </Formik>
        <Typography align="center">
          <Button onClick={() => push("/login")} color="primary">
            Back to Log In
          </Button>
        </Typography>
      </Card>
    </Box>
  );
};
