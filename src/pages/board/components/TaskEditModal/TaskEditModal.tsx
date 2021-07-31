import {
  Box,
  Button,
  Chip,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers, useFormikContext } from "formik";
import React, { useRef, useState } from "react";
import Modal from "react-modal";
import styles from "./styles.module.css";
import LabelOutlinedIcon from "@material-ui/icons/LabelOutlined";
import LinkOutlinedIcon from "@material-ui/icons/LinkOutlined";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

import { FormikInput } from "../../../../shared/FormikInput/FormikInput";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { formatDistance, compareAsc } from "date-fns";
import { Notification } from "../../../../shared/Notification/Notification";
import { useUpdateTask } from "./useUpdateTask";
import { LabelsList } from "./LabelsList";
import { useBoard } from "../../../../contexts/BoardContext";

type Props = {
  show: boolean;
  itemId: string;
  onClose: () => void;
};

type EditFormProps = Pick<Props, "itemId" | "onClose">;

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
    minHeight: 400,
    maxHeight: 700,
    margin: "auto",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
};

const EditCardForm: React.FC<EditFormProps> = ({ itemId, onClose }) => {
  const {
    isSubmitting,
    handleReset,
    handleSubmit,
  } = useFormikContext<FormValues>();

  const { board } = useBoard();

  const { updateTask, removeTask } = useUpdateTask();
  const item = board!.tasks.find((t) => t.id === itemId)!;

  const { removeLabelFromTask } = useUpdateTask();
  const [isEditMode, setEditMode] = useState(false);
  const [isLabelpopoverOpen, setLabelPopover] = useState(false);
  const labelButtonRef = useRef<HTMLDivElement>(null);

  const hasBeenUpdated =
    item.lastUpdated &&
    compareAsc(item.createdAt.toDate(), item.lastUpdated.toDate()) !== 0;

  const boardLabels = board?.labels || [];
  const taskLabels = item?.labels || [];

  const labels = boardLabels.filter((l) => taskLabels.includes(l.name));

  const boardParticipants = board!.participants || [];
  const assignee = item.assignee;

  const boardStatuses = board!.statuses;

  const handleDeleteLabel = (label: string) => {
    removeLabelFromTask(item.id, label);
  };

  const handleAsigneeChange = (assigneeId: string | 1) => {
    const newAssignee =
      assigneeId === 1
        ? null
        : boardParticipants.find((user) => user.userId === assigneeId)!;

    updateTask(itemId, { assignee: newAssignee });
  };

  const handleStatusChange = (statusName: string) => {
    const newStatus = boardStatuses.find((s) => s.name === statusName)!;
    updateTask(itemId, { status: newStatus });
  };

  return (
    <Form>
      <Box display="flex" height="100%">
        <Box flex={3} paddingRight="16px" overflow="auto">
          <Box display="flex" marginBottom="16px">
            <LabelsList
              taskId={item.id}
              anchorEl={labelButtonRef.current}
              isOpen={isLabelpopoverOpen}
              onClose={() => setLabelPopover(false)}
            />
            <Tooltip title="Add tag" placement="top">
              <div
                className={styles["icon-button"]}
                ref={labelButtonRef}
                onClick={() => setLabelPopover(true)}
              >
                <LabelOutlinedIcon />
              </div>
            </Tooltip>
            <Tooltip title="Link another task" placement="top">
              <div className={styles["icon-button"]}>
                <LinkOutlinedIcon />
              </div>
            </Tooltip>
            <Tooltip title="Edit task" placement="top">
              <div
                className={styles["icon-button"]}
                onClick={() => setEditMode(true)}
              >
                <EditOutlinedIcon />
              </div>
            </Tooltip>
            <Tooltip title="Delete task" placement="top">
              <div
                className={styles["icon-button"]}
                onClick={() => {
                  removeTask(itemId);
                  onClose();
                }}
              >
                <DeleteOutline />
              </div>
            </Tooltip>
          </Box>
          {labels.length > 0 && (
            <Box display="flex" marginBottom="8px">
              {labels.map((label) => (
                <Box key={label.name} marginRight="4px">
                  <Chip
                    size="small"
                    style={{ backgroundColor: label.color }}
                    label={label.name}
                    onDelete={() => handleDeleteLabel(label.name)}
                  />
                </Box>
              ))}
            </Box>
          )}
          <Box display="flex" marginBottom="16px">
            <span className={styles.small}>
              Created by{" "}
              <span className={styles["name"]}>
                {item.createdBy.displayName}
              </span>{" "}
              {formatDistance(item.createdAt.toDate(), Date.now(), {
                addSuffix: true,
              })}
            </span>
            {hasBeenUpdated && (
              <span className={styles.small}>
                Updated by{" "}
                <span className={styles["name"]}>
                  {item.updatedBy.displayName}
                </span>{" "}
                {formatDistance(item.lastUpdated.toDate(), Date.now(), {
                  addSuffix: true,
                })}
              </span>
            )}
          </Box>
          {isEditMode ? (
            <Field name="title" placeholder="title" component={FormikInput} />
          ) : (
            <Box marginTop="16px" marginBottom="8px" minHeight="56px">
              <Typography variant="h5">{item.title}</Typography>
            </Box>
          )}
          {isEditMode ? (
            <Field
              name="description"
              placeholder="Description"
              multiline
              rows={4}
              component={FormikInput}
            />
          ) : (
            <Box minHeight="114px" whiteSpace="break-spaces">
              <Typography>{item.description}</Typography>
            </Box>
          )}
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
                  value={item.status.name}
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
                  value={assignee?.userId || 1}
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
      {isEditMode && (
        <Box
          width="100%"
          display="flex"
          justifyContent="flex-end"
          marginTop="32px"
        >
          <Box marginRight="8px">
            <Button
              type="button"
              onClick={() => {
                setEditMode(false);
                handleSubmit();
              }}
              variant="contained"
              color="primary"
              disableElevation
              disabled={isSubmitting}
            >
              Save
            </Button>
          </Box>
          <Button
            type="button"
            variant="contained"
            color="default"
            disableElevation
            disabled={isSubmitting}
            onClick={() => {
              setEditMode(false);
              handleReset();
            }}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Form>
  );
};

export const TaskEditModal: React.FC<Props> = ({ show, onClose, itemId }) => {
  const [error, setError] = useState("");
  const { updateTask } = useUpdateTask();
  const { board } = useBoard();
  const item = board!.tasks.find((t) => t.id === itemId)!;

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
      await updateTask(item.id, values);
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
          initialValues={{ title: item.title, description: item.description }}
          validate={validate}
          onSubmit={onSubmit}
          enableReinitialize
        >
          <EditCardForm itemId={itemId} onClose={onClose} />
        </Formik>
      </Modal>
    </>
  );
};
