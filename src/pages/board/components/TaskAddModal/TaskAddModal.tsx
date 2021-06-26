import { Box, Button, MenuItem, Select } from "@material-ui/core";
import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./styles.module.css";
import { Field, Form, Formik, useFormikContext } from "formik";
import { FormikInput } from "../../../../shared/FormikInput/FormikInput";
import { Notification } from "../../../../shared/Notification/Notification";
import { useCreateTask } from "./useCreateTask";
import { SimpleUserType, TaskStatus } from "../../../../types";
import { useBoard } from "../../../../contexts/BoardContext";

type Props = {
  show: boolean;
  onClose: () => void;
  taskStatus: TaskStatus;
};

type FormValues = {
  title: string;
  description: string;
  status: TaskStatus;
  assignee: SimpleUserType | null;
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
  const {
    isSubmitting,
    setFieldValue,
    values,
  } = useFormikContext<FormValues>();
  const { board } = useBoard();

  const boardStatuses = board!.statuses;
  const boardParticipants = board!.participants || [];

  const handleStatusChange = (statusName: string) => {
    const newStatus = boardStatuses.find((s) => s.name === statusName)!;
    setFieldValue("status", newStatus);
  };
  const handleAsigneeChange = (assigneeId: string | 1) => {
    const newAssignee =
      assigneeId === 1
        ? null
        : boardParticipants.find((user) => user.userId === assigneeId)!;

    setFieldValue("assignee", newAssignee);
  };

  return (
    <Form>
      <Box display="flex" height="100%">
        <Box flex={3} paddingRight="16px">
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
            <>
              <Box display="flex" alignItems="center" marginRight="32px">
                status
              </Box>
              <div className="right">
                <Select
                  label={null}
                  className={styles["link-select"]}
                  value={values.status.name}
                  onChange={(e) => handleStatusChange(e.target.value as string)}
                >
                  {boardStatuses.map((status) => (
                    <MenuItem key={status.name} value={status.name}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </>
            <>
              <Box display="flex" alignItems="center" marginRight="32px">
                assignee
              </Box>
              <div className="right">
                <Select
                  label={null}
                  className={styles["link-select"]}
                  value={values.assignee?.userId || 1}
                  onChange={(e) =>
                    handleAsigneeChange(e.target.value as string)
                  }
                >
                  <MenuItem value={1}>Unassigned</MenuItem>
                  {boardParticipants.map((user) => (
                    <MenuItem key={user.userId} value={user.userId}>
                      {user.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </>
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

  const onSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      setError("");
      createTask({ ...values });
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
          initialValues={{
            title: "",
            description: "",
            status: taskStatus,
            assignee: null,
          }}
          validate={validate}
          onSubmit={onSubmit}
        >
          <AddTaskForm />
        </Formik>
      </Modal>
    </>
  );
};
