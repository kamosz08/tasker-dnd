import React, { useState } from "react";
import styles from "./styles.module.css";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useAuth } from "../../contexts/AuthContext";

type FormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
};

type Errors = Partial<FormValues & { differenceInPassword: string }>;

export const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const [error, setError] = useState("");

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
    <>
      <h3>Sign Up</h3>
      <Formik
        initialValues={{ email: "", password: "", passwordConfirm: "" }}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
            <Field type="password" name="passwordConfirm" />
            <ErrorMessage name="passwordConfirm" component="div" />
            {!!error && <div>{error}</div>}
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};
