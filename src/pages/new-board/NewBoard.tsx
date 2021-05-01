import React, { useState } from "react";
import { useHistory } from "react-router";
import { Box, Button, Typography } from "@material-ui/core";
import { Formik, Form, Field, FormikHelpers, useFormikContext } from "formik";
import styles from "./styles.module.css";
import { firestoreDB } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import firebase from "firebase/app";
import { statuses } from "../../consts";
import { FormikInput } from "../../shared/FormikInput/FormikInput";
import Alert from "@material-ui/lab/Alert";

type FormValues = {
  name: string;
};

type Errors = Partial<FormValues>;
const NewBoardForm: React.FC = () => {
  const { isSubmitting } = useFormikContext<FormValues>();

  return (
    <Form>
      <Field name="name" placeholder="Board name" component={FormikInput} />
      <Box marginTop="16px" marginBottom="16px">
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={isSubmitting}
          className={styles.button}
        >
          Create
        </Button>
      </Box>
    </Form>
  );
};

export const NewBoard: React.FC = () => {
  const { push } = useHistory();
  const [error, setError] = useState("");
  const { user } = useAuth();

  const validate = (values: FormValues) => {
    const errors: Errors = {};
    if (!values.name) {
      errors.name = "Required";
    }
    if (values.name.length >= 24) {
      errors.name = "Maximum length is 24";
    }

    return errors;
  };

  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      setError("");
      await firestoreDB
        .collection("boards")
        .add({ tasks: [], statuses: statuses, ...values })
        .then((newBoardRef) =>
          firestoreDB
            .collection("users")
            .doc(user!.uid)
            .update({
              boards: firebase.firestore.FieldValue.arrayUnion(newBoardRef.id),
            })
        );
      push("/");
    } catch (error) {
      if (typeof error.message === "string") {
        setError(error.message);
      } else {
        setError("Failed to create a board");
      }
    }
    setSubmitting(false);
  };

  return (
    <Box width="100%" display="flex" justifyContent="center">
      <Box>
        <Box marginTop="16px" marginBottom="16px">
          <Typography align="center" variant="h5">
            Add new board
          </Typography>
        </Box>
        {!!error && <Alert severity="error">{error}</Alert>}
        <Formik
          initialValues={{ name: "" }}
          validate={validate}
          onSubmit={onSubmit}
        >
          <NewBoardForm />
        </Formik>
      </Box>
    </Box>
  );
};
