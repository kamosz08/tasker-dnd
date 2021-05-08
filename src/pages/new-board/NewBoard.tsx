import React, { useState } from "react";
import { Box, Button, Typography } from "@material-ui/core";
import { Formik, Form, Field, FormikHelpers, useFormikContext } from "formik";
import styles from "./styles.module.css";
import { FormikInput } from "../../shared/FormikInput/FormikInput";
import Alert from "@material-ui/lab/Alert";
import { useCreateBoard } from "./useCreateBoard";

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
  const [error, setError] = useState("");
  const { createBoard } = useCreateBoard();

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
      await createBoard(values);
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
