import { Box, Button, Tooltip } from "@material-ui/core";
import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./styles.module.css";
import LabelOutlinedIcon from "@material-ui/icons/LabelOutlined";
import LinkOutlinedIcon from "@material-ui/icons/LinkOutlined";
import { Field, Form, Formik, FormikHelpers, useFormikContext } from "formik";
import { useHistory } from "react-router";
import { FormikInput } from "../../../../shared/FormikInput/FormikInput";
import { Notification } from "../../../../shared/Notification/Notification";
import { useCreateTask } from "./useCreateTask";
import { TaskStatus } from "../../../../types";

type Props = {
  show: boolean;
  onClose: () => void;
  taskStatus: TaskStatus;
};

type FormValues = {
  title: string;
  description: string;
};

type Errors = Partial<FormValues>;

Modal.setAppElement("#root");

const customStyles = {
  content: {
    width: 960,
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

const AddTaskForm: React.FC = () => {
  const { isSubmitting } = useFormikContext<FormValues>();

  return (
    <Form>
      <Box display="flex" height="100%">
        <Box flex={3} paddingRight="16px">
          <Box display="flex" marginBottom="16px">
            <Tooltip title="Add tag" placement="top">
              <div className={styles["icon-button"]}>
                <LabelOutlinedIcon />
              </div>
            </Tooltip>
            <Tooltip title="Link another task" placement="top">
              <div className={styles["icon-button"]}>
                <LinkOutlinedIcon />
              </div>
            </Tooltip>
          </Box>
          <Field name="title" placeholder="title" component={FormikInput} />
          <Field
            name="description"
            placeholder="Description"
            multiline
            rows={4}
            component={FormikInput}
          />
        </Box>
        <Box flex={1}>
          <div className={styles["info-card"]}>
            {[1, 2, 3, 4, 5].map((item) => (
              <React.Fragment key={item}>
                <div className="left">left</div>
                <div className="right">right</div>
              </React.Fragment>
            ))}
          </div>
        </Box>
      </Box>
      <Box
        width="100%"
        display="flex"
        justifyContent="flex-end"
        marginTop="32px"
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disableElevation
          disabled={isSubmitting}
        >
          Save
        </Button>
      </Box>
    </Form>
  );
};

export const TaskAddModal: React.FC<Props> = ({
  show,
  onClose,
  taskStatus,
}) => {
  const [error, setError] = useState("");
  const { push } = useHistory();
  const { createTask } = useCreateTask();

  const validate = (values: FormValues) => {
    const errors: Errors = {};
    if (!values.title) {
      errors.title = "Required";
    } else if (values.title.length < 4) {
      errors.title = "Minimum title length is 4";
    } else if (values.title.length > 80) {
      errors.title = "Maximum title length is 80";
    }

    return errors;
  };

  const onSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      setError("");
      await createTask({ ...values, status: taskStatus });
      onClose();
    } catch (error) {
      if (typeof error.message === "string") {
        setError(error.message);
      } else {
        setError("Failed to create a task");
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
      <Modal isOpen={show} onRequestClose={onClose} style={customStyles}>
        <Formik
          initialValues={{ title: "", description: "" }}
          validate={validate}
          onSubmit={onSubmit}
        >
          <AddTaskForm />
        </Formik>
      </Modal>
    </>
  );
};
