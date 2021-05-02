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
import { BoardType } from "../../types";

type FormValues = {
  name: string;
  description: string;
};

type Errors = Partial<FormValues>;
const NewBoardForm: React.FC = () => {
  const { isSubmitting } = useFormikContext<FormValues>();

  return (
    <Form>
      <Field name="name" placeholder="Board name" component={FormikInput} />
      <Field
        name="description"
        placeholder="Description"
        multiline
        rows={3}
        component={FormikInput}
      />
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
    } else if (values.name.length > 24) {
      errors.name = "Maximum length is 24";
    } else if (values.name.length < 4) {
      errors.name = "Minimum length is 4";
    }

    if (!values.description) {
      errors.description = "Required";
    } else if (values.description.length > 180) {
      errors.description = "Maximum length is 180";
    } else if (values.description.length < 20) {
      errors.description = "Minimum length is 20";
    }

    return errors;
  };

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      setError("");

      const newBoardRef = firestoreDB.collection("boards").doc();
      const newBoard: BoardType = {
        id: newBoardRef.id,
        tasks: [],
        statuses: statuses,
        name: values.name,
        description: values.description,
        createdAt: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
        createdBy: { userId: user!.id, displayName: user!.displayName },
        participants: [{ userId: user!.id, displayName: user!.displayName }],
      };
      await newBoardRef.set(newBoard).then(() =>
        firestoreDB
          .collection("users")
          .doc(user!.id)
          .update({
            boards: firebase.firestore.FieldValue.arrayUnion(newBoardRef.id),
          })
      );
      resetForm();
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
      <Box width="450px">
        <Box marginTop="16px" marginBottom="16px">
          <Typography align="center" variant="h5">
            Add new board
          </Typography>
        </Box>
        {!!error && <Alert severity="error">{error}</Alert>}
        <Formik
          initialValues={{ name: "", description: "" }}
          validate={validate}
          onSubmit={onSubmit}
        >
          <NewBoardForm />
        </Formik>
      </Box>
    </Box>
  );
};
