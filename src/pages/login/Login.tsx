import React, { useState } from "react";
import styles from "./styles.module.css";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

type FormValues = {
  email: string;
  password: string;
};

type Errors = Partial<FormValues>;

export const Login: React.FC = () => {
  const { logIn } = useAuth();
  const [error, setError] = useState("");
  const { push } = useHistory();

  const validate = (values: FormValues) => {
    setError("");
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
    <>
      <h3>Log In</h3>
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
            {!!error && <div>{error}</div>}
            <button type="submit" disabled={isSubmitting}>
              Log In
            </button>
          </Form>
        )}
      </Formik>
      <p>
        Forgot password? <Link to="/reset-password">Reset password</Link>
      </p>
      <p>
        Need an account? <Link to="/signup">Sign Up</Link>
      </p>
    </>
  );
};
