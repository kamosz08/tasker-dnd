import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

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
    <>
      <h3>Sign Up</h3>
      <Formik
        initialValues={{ email: "" }}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
            {!!error && <div>{error}</div>}
            {!!message && <div>{message}</div>}
            <button type="submit" disabled={isSubmitting}>
              Reset Password
            </button>
          </Form>
        )}
      </Formik>
      <p>
        <Link to="/login">Back to Log In</Link>
      </p>
    </>
  );
};
