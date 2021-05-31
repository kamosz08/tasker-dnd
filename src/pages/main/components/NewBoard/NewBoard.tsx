import React, { useState } from "react";
import { Box, Button, Typography } from "@material-ui/core";
import { Formik, Form, Field, FormikHelpers, useFormikContext } from "formik";
import { FormikInput } from "../../../../shared/FormikInput/FormikInput";
import Alert from "@material-ui/lab/Alert";
import { useCreateBoard } from "./useCreateBoard";
import Modal from "react-modal";
import { TaskStatus } from "../../../../types";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { defaultStatuses } from "../../../../consts";
import { EditTaskStatusDialog } from "./EditTaskStatusDialog";
import EditIcon from "@material-ui/icons/Edit";
import styles from "./styles.module.css";

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

type TaskStatusComponentProps = {
  value: TaskStatus;
};

type FormValues = {
  name: string;
  description: string;
  statuses: TaskStatus[];
};

type Errors = Partial<FormValues>;

const TaskStatusComponent: React.FC<TaskStatusComponentProps> = ({ value }) => {
  const { setFieldValue, values } = useFormikContext<FormValues>();

  const { color, name } = value;
  const [isEdit, setEdit] = useState(false);

  const handleClose = () => {
    setEdit(false);
  };

  const handleEdit = () => {
    setEdit(true);
  };

  const handleSubmit = (newTaskStatus: TaskStatus) => {
    setFieldValue(
      "statuses",
      values.statuses.map((s) => (s.name === name ? newTaskStatus : s))
    );
  };

  return (
    <Box minWidth="100px">
      <Box marginTop="8px" display="flex" alignItems="center">
        <FiberManualRecordIcon style={{ color }} />
        <Typography>{name}</Typography>
        <EditIcon className={styles["edit-icon"]} onClick={handleEdit} />
      </Box>
      <EditTaskStatusDialog
        isDialogOpen={isEdit}
        onClose={handleClose}
        onSubmit={handleSubmit}
        value={value}
        existingStatuses={values.statuses}
      />
    </Box>
  );
};

const NewBoardForm: React.FC = () => {
  const { isSubmitting, values } = useFormikContext<FormValues>();

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
      <Box marginTop="16px">
        <Typography>Task statuses:</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        {values.statuses.map((status) => (
          <TaskStatusComponent key={status.name} value={status} />
        ))}
      </Box>
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
            initialValues={{
              name: "",
              description: "",
              statuses: defaultStatuses,
            }}
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
