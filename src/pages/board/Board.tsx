import React, { useState } from "react";
import { Task } from "./components/Task/Task";
import { Swimlane } from "./components/Swimlane/Swimlane";
import styles from "./styles.module.css";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { BoardProvider, useBoard } from "../../contexts/BoardContext";
import { TaskEditModal } from "./components/TaskEditModal/TaskEditModal";
import { TaskStatus } from "../../types";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

const BoardComponent: React.FC<{ openEditModal: (taskId: string) => void }> = ({
  openEditModal,
}) => {
  const {
    board,
    status,
    changeOrderOfTasks,
    changeStatusOfTask,
    changeOrderAndStatusOfTask,
  } = useBoard();
  const statuses = board?.statuses || [];

  const changeOrderOfItems = (
    statusName: TaskStatus["name"],
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const itemsWithThisStatus = (board?.tasks || []).filter(
      (i) => i.status.name === statusName
    );

    changeOrderOfTasks(
      itemsWithThisStatus[sourceIndex].id,
      itemsWithThisStatus[destinationIndex].id
    );
  };

  const changeOrderAndStatusOfItem = (
    initialStatusName: TaskStatus["name"],
    destinationStatusName: TaskStatus["name"],
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const itemsWithInitialStatus = (board?.tasks || []).filter(
      (i) => i.status.name === initialStatusName
    );
    const itemsWithDestinationStatus = (board?.tasks || []).filter(
      (i) => i.status.name === destinationStatusName
    );
    const destinationStatus = statuses.find(
      (s) => s.name === destinationStatusName
    )!;

    if (
      !itemsWithDestinationStatus[destinationIndex]?.id &&
      destinationIndex === 0
    ) {
      changeStatusOfTask(
        destinationStatus,
        itemsWithInitialStatus[sourceIndex].id
      );
      return;
    }
    if (
      !itemsWithDestinationStatus[destinationIndex]?.id &&
      destinationIndex > 0
    ) {
      changeOrderAndStatusOfTask(
        destinationStatus,
        itemsWithInitialStatus[sourceIndex].id,
        itemsWithDestinationStatus[destinationIndex - 1].id,
        true
      );
      return;
    }
    changeOrderAndStatusOfTask(
      destinationStatus,
      itemsWithInitialStatus[sourceIndex].id,
      itemsWithDestinationStatus[destinationIndex].id
    );
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      changeOrderOfItems(
        destination.droppableId,
        source.index,
        destination.index
      );
      return;
    }

    changeOrderAndStatusOfItem(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  if (status === "idle" || status === "loading")
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
        <Box marginLeft="8px">Loading...</Box>
      </Box>
    );
  if (status === "error" || !board)
    return <p>There was an error while fetching board</p>;
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box marginLeft="auto" marginRight="auto" maxWidth="960px">
        <Box display="flex" marginTop="32px" marginBottom="32px">
          <Typography color="textSecondary">Board name:</Typography>
          <Typography>{board.name}</Typography>
        </Box>
        <div className={styles["main-wrapper"]}>
          {statuses.map((s) => {
            return (
              <div key={s.name} className={styles.column}>
                <Box
                  display="flex"
                  justifyContent="center"
                  className={styles["column-header"]}
                >
                  <FiberManualRecordIcon style={{ color: s.color }} />
                  <Typography>{s.name}</Typography>
                </Box>

                <Swimlane status={s}>
                  {board?.tasks
                    .filter((i) => i.status.name === s.name)
                    .map((i, idx) => (
                      <Task
                        key={i.id}
                        item={i}
                        index={idx}
                        openEditModal={() => openEditModal(i.id)}
                      />
                    ))}
                </Swimlane>
              </div>
            );
          })}
        </div>
      </Box>
    </DragDropContext>
  );
};

export const Board: React.FC = () => {
  const [editedTaskId, setEditedTaskId] = useState<string | null>(null);

  return (
    <BoardProvider>
      <BoardComponent
        openEditModal={(taskId: string) => setEditedTaskId(taskId)}
      />
      {!!editedTaskId && (
        <TaskEditModal
          itemId={editedTaskId!}
          onClose={() => setEditedTaskId(null)}
          show={!!editedTaskId}
        />
      )}
    </BoardProvider>
  );
};
