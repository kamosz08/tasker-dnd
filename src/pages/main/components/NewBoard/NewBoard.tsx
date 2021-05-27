import React, { useState } from "react";
import { Box, Button, Typography } from "@material-ui/core";
import { Formik, Form, Field, FormikHelpers, useFormikContext } from "formik";
import { FormikInput } from "../../../../shared/FormikInput/FormikInput";
import Alert from "@material-ui/lab/Alert";
import { useCreateBoard } from "./useCreateBoard";
import Modal from "react-modal";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    width: 530,
    height: "min-content",
    minHeight: 300,
    maxHeight: 600,
    margin: "auto",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
};

type ContainerProps = {
  show: boolean;
  onClose: () => void;
};

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
      <Box
        marginTop="16px"
        marginBottom="16px"
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={isSubmitting}
        >
          Create
        </Button>
      </Box>
    </Form>
  );
};

export const NewBoard: React.FC<ContainerProps> = ({ show, onClose }) => {
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
    onClose();
  };

  return (
    <Modal isOpen={show} onRequestClose={onClose} style={customStyles}>
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
    </Modal>
  );
};
