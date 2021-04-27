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
  passwordConfirm: string;
};

type Errors = Partial<FormValues & { differenceInPassword: string }>;

const SignupForm: React.FC = () => {
  const { isSubmitting } = useFormikContext<FormValues>();

  return (
    <Form>
      <Field type="email" name="email" className={styles.input} />
      <ErrorMessage name="email" component="div" className={styles.error} />
      <Field type="password" name="password" className={styles.input} />
      <ErrorMessage name="password" component="div" className={styles.error} />
      <Field type="password" name="passwordConfirm" className={styles.input} />
      <ErrorMessage
        name="passwordConfirm"
        component="div"
        className={styles.error}
      />
      <Button
        className={styles.button}
        buttonType="primary"
        type="submit"
        disabled={isSubmitting}
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
      <div className={styles.card}>
        <h2 className={styles.title}>Sign Up</h2>
        {!!error && <div className={styles["server-error"]}>{error}</div>}
        <Formik
          initialValues={{ email: "", password: "", passwordConfirm: "" }}
          validate={validate}
          onSubmit={onSubmit}
        >
          <SignupForm />
        </Formik>
        <p className={styles["text-center"]}>
          Already have an account?{" "}
          <Link to="/login" className={styles["link"]}>
            Log In
          </Link>
        </p>
      </div>
    </Box>
  );
};
