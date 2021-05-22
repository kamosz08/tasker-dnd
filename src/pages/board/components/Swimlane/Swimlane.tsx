import { Box, Button } from "@material-ui/core";
import React, { useState } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { CARD_TYPE } from "../../../../consts";
import { DragableTaskType, TaskStatus } from "../../../../types";
import { TaskAddModal } from "../TaskAddModal/TaskAddModal";
import styles from "./styles.module.css";

export type DropFunction = (
  item: DragableTaskType,
  monitor: DropTargetMonitor<unknown, unknown>,
  status: TaskStatus
) => void;

type Props = {
  onDrop: DropFunction;
  status: TaskStatus;
};

export const Swimlane: React.FC<Props> = ({ onDrop, children, status }) => {
  const [show, setShow] = useState(false);
  const onOpen = () => setShow(true);
  const onClose = () => setShow(false);

  const [{ isOver }, drop] = useDrop({
    accept: CARD_TYPE,
    drop: (item: DragableTaskType, monitor) => {
      onDrop(item, monitor, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <>
      <div ref={drop} style={{ minHeight: 400, width: 240 }}>
        <Box
          className={styles.column}
          style={{ backgroundColor: isOver ? "#8d8faa52" : "" }}
        >
          {children}
          <Button variant="text" className={styles.button} onClick={onOpen}>
            + Add item
          </Button>
        </Box>
      </div>
      <TaskAddModal onClose={onClose} show={show} taskStatus={status} />
    </>
  );
};
