import { Box, Button } from "@material-ui/core";
import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { TaskStatus } from "../../../../types";
import { TaskAddModal } from "../TaskAddModal/TaskAddModal";
import styles from "./styles.module.css";

type Props = {
  status: TaskStatus;
};

export const Swimlane: React.FC<Props> = ({ children, status }) => {
  const [show, setShow] = useState(false);
  const onOpen = () => setShow(true);
  const onClose = () => setShow(false);

  return (
    <>
      <Droppable droppableId={status.name}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ minHeight: 400, height: "100%", width: 240 }}
          >
            <Box
              className={styles.column}
              style={{
                backgroundColor: snapshot.isDraggingOver ? "#8d8faa52" : "",
                height: "calc(100% - 48px)",
              }}
              height="100%"
            >
              {children}
              {!snapshot.isDraggingOver && (
                <Button
                  variant="text"
                  className={styles.button}
                  onClick={onOpen}
                >
                  + Add item
                </Button>
              )}
            </Box>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <TaskAddModal onClose={onClose} show={show} taskStatus={status} />
    </>
  );
};
