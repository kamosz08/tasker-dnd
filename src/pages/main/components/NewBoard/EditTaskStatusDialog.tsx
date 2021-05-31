import React from "react";
import {
  ErrorMessage,
  Field,
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
import { FormikInput } from "../../../../shared/FormikInput/FormikInput";
import { HuePicker } from "react-color";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { TaskStatus } from "../../../../types";

type Props = {
  isDialogOpen: boolean;
  onClose: () => void;
  onSubmit: (newTask: TaskStatus) => void;
  value: TaskStatus;
  existingStatuses: TaskStatus[];
};

type FormValues = {
  name: string;
  color: string;
};

type Errors = Partial<FormValues>;

const EditTaskStatusForm: React.FC<Props> = ({ onClose, isDialogOpen }) => {
  const {
    isSubmitting,
    setFieldValue,
    values,
    handleSubmit,
  } = useFormikContext<FormValues>();

  return (
    <Dialog open={isDialogOpen} onClose={onClose}>
      <DialogTitle>Edit task status</DialogTitle>
      <DialogContent>
        <Box minWidth="300px">
          <Field
            name="name"
            placeholder="Status name"
            component={FormikInput}
          />
          <Box marginTop="16px" display="flex" alignItems="center">
            <FiberManualRecordIcon style={{ color: values.color }} />
            <Box marginLeft="8px">
              <HuePicker
                color={values.color}
                onChangeComplete={(color) => setFieldValue("color", color.hex)}
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
          }}
          color="primary"
          disabled={isSubmitting}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const EditTaskStatusDialog: React.FC<Props> = (props) => {
  const validate = (values: FormValues) => {
    const errors: Errors = {};
    if (!values.name) {
      errors.name = "Required";
    } else if (values.name.length < 3) {
      errors.name = "Minimum title length is 3";
    } else if (values.name.length > 16) {
      errors.name = "Maximum title length is 16";
    } else if (
      props.existingStatuses.map((s) => s.name).includes(values.name)
    ) {
      errors.name = "Status name must be unique";
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
    props.onSubmit(values);
    resetForm();
    setSubmitting(false);
    props.onClose();
  };

  return (
    <>
      <Formik
        initialValues={{ name: props.value.name, color: props.value.color }}
        validate={validate}
        onSubmit={onSubmit}
        enableReinitialize
      >
        <EditTaskStatusForm {...props} />
      </Formik>
    </>
  );
};
