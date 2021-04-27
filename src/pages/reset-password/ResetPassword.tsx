import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { Box } from "../../ui/Box/Box";
import { Button } from "../../ui/Button/Button";

type FormValues = {
  email: string;
};

type Errors = Partial<FormValues>;

export const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
      <div className={styles.card}>
        <h2 className={styles.title}>Sign Up</h2>
        {!!error && <div className={styles["server-error"]}>{error}</div>}
        {!!message && <div className={styles["server-error"]}>{message}</div>}
        <Formik
          initialValues={{ email: "" }}
          validate={validate}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field type="email" name="email" className={styles.input} />
              <ErrorMessage
                name="email"
                component="div"
                className={styles.error}
              />
              <Button
                className={styles.button}
                buttonType="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Reset Password
              </Button>
            </Form>
          )}
        </Formik>
        <p className={styles["text-center"]}>
          <Link className={styles["link"]} to="/login">
            Back to Log In
          </Link>
        </p>
      </div>
    </Box>
  );
};
