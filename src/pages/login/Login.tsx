import React, { useState } from "react";
import styles from "./styles.module.css";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  useFormikContext,
} from "formik";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { Box } from "../../ui/Box/Box";
import { Button } from "../../ui/Button/Button";

type FormValues = {
  email: string;
  password: string;
};

type Errors = Partial<FormValues>;

const LoginForm: React.FC = () => {
  const { isSubmitting } = useFormikContext<FormValues>();

  return (
    <Form>
      <Field
        type="email"
        name="email"
        placeholder="Email"
        className={styles.input}
      />
      <ErrorMessage name="email" component="div" className={styles.error} />
      <Field
        type="password"
        name="password"
        placeholder="Password"
        className={styles.input}
      />
      <ErrorMessage name="password" component="div" className={styles.error} />
      <Button
        type="submit"
        buttonType="primary"
        disabled={isSubmitting}
        className={styles.button}
      >
        Log In
      </Button>
    </Form>
  );
};

export const Login: React.FC = () => {
  const { logIn } = useAuth();
  const [error, setError] = useState("");
  const { push } = useHistory();

  const validate = (values: FormValues) => {
    const errors: Errors = {};
    if (!values.password) {
      errors.password = "Required";
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
    try {
      setError("");
      await logIn(values.email, values.password);
      push("/");
    } catch (error) {
      if (typeof error.message === "string") {
        setError(error.message);
      } else {
        setError("Failed to log in");
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
        <h2 className={styles.title}>Log In</h2>
        {!!error && <div className={styles["server-error"]}>{error}</div>}
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={validate}
          onSubmit={onSubmit}
        >
          <LoginForm />
        </Formik>
        <p className={styles["text-center"]}>
          Forgot password?{" "}
          <Link className={styles["link"]} to="/reset-password">
            Reset password
          </Link>
        </p>
        <p className={styles["text-center"]}>
          Need an account?{" "}
          <Link className={styles["link"]} to="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </Box>
  );
};
