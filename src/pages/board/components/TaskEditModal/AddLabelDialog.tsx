import React, { useState } from "react";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  useFormikContext,
} from "formik";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@material-ui/core";
import { Notification } from "../../../../shared/Notification/Notification";
import { FormikInput } from "../../../../shared/FormikInput/FormikInput";
import { HuePicker } from "react-color";
import LabelIcon from "@material-ui/icons/Label";
import { useCreateLabel } from "./useCreateLabel";

type Props = {
  isDialogOpen: boolean;
  onClose: () => void;
  taskId: string;
};

type FormValues = {
  name: string;
  color: string;
};

type Errors = Partial<FormValues>;

const AddLabelForm: React.FC<Props> = ({ onClose, isDialogOpen }) => {
  const {
    isSubmitting,
    setFieldValue,
    values,
    handleSubmit,
  } = useFormikContext<FormValues>();

  return (
    <Form>
      <Dialog open={isDialogOpen} onClose={onClose}>
        <DialogTitle>Add label</DialogTitle>
        <DialogContent>
          <Box minWidth="300px">
            <Field
              name="name"
              placeholder="Label name"
              component={FormikInput}
            />
            <Box marginTop="16px" display="flex" alignItems="center">
              <LabelIcon style={{ color: values.color }} />
              <Box marginLeft="8px">
                <HuePicker
                  color={values.color}
                  onChangeComplete={(color) =>
                    setFieldValue("color", color.hex)
                  }
                />
              </Box>
              <ErrorMessage name="color" />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="default" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSubmit();
              onClose();
            }}
            color="primary"
            disabled={isSubmitting}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Form>
  );
};

export const AddLabelDialog: React.FC<Props> = (props) => {
  const [error, setError] = useState("");
  const { createLabel } = useCreateLabel();

  const validate = (values: FormValues) => {
    const errors: Errors = {};
    if (!values.name) {
      errors.name = "Required";
    } else if (values.name.length < 3) {
      errors.name = "Minimum title length is 3";
    } else if (values.name.length > 16) {
      errors.name = "Maximum title length is 16";
    }

    if (!values.color) {
      errors.color = "Required";
    }
    return errors;
  };

  const onSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      setError("");
      createLabel(props.taskId, values);
      resetForm();
    } catch (error) {
      if (typeof error.message === "string") {
        setError(error.message);
      } else {
        setError("Failed to create a label");
      }
    }
    setSubmitting(false);
  };

  return (
    <>
      <Notification
        handleClose={() => setError("")}
        severity="error"
        message={error}
      />
      <Formik
        initialValues={{ name: "", color: "#008cffa" }}
        validate={validate}
        onSubmit={onSubmit}
      >
        <AddLabelForm {...props} />
      </Formik>
    </>
  );
};
