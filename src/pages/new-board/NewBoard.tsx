import React, { useState } from "react";
import { useHistory } from "react-router";
import { Box } from "../../ui/Box/Box";
import { Button } from "../../ui/Button/Button";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  useFormikContext,
} from "formik";
import styles from "./styles.module.css";
import { firestoreDB } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import firebase from "firebase/app";
import { statuses } from "../../consts";

type FormValues = {
  name: string;
};

type Errors = Partial<FormValues>;
const NewBoardForm: React.FC = () => {
  const { isSubmitting } = useFormikContext<FormValues>();

  return (
    <Form>
      <Field name="name" placeholder="Board name" className={styles.input} />
      <ErrorMessage name="name" component="div" className={styles.error} />
      <Button
        type="submit"
        buttonType="primary"
        disabled={isSubmitting}
        className={styles.button}
      >
        Create
      </Button>
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
        <h2 className={styles.title}>Add new board</h2>
        {!!error && <div className={styles["server-error"]}>{error}</div>}
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
