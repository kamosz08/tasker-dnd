import React, { useState } from "react";
import { Task } from "./components/Task/Task";
import { Swimlane } from "./components/Swimlane/Swimlane";
import styles from "./styles.module.css";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { TaskEditModal } from "./components/TaskEditModal/TaskEditModal";
import { TaskStatus } from "../../types";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useBoardDetailsListener } from "./useBoardDetailsListener";
import {
  useBoardDetailsActions,
  useBoardDetailsSlice,
} from "../../redux/boardDetails/boardDetailsSlice";
import { useParams } from "react-router";

const BoardComponent: React.FC<{ openEditModal: (taskId: string) => void }> = ({
  openEditModal,
}) => {
  useBoardDetailsListener();
  const { id: boardId } = useParams<{ id: string }>();

  const board = useBoardDetailsSlice(boardId);
  const {
    changeOrderOfTasks,
    changeStatusOfTask,
    changeOrderAndStatusOfTask,
  } = useBoardDetailsActions();

  if (!board || board.status === "idle" || board.status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
        <Box marginLeft="8px">Loading...</Box>
      </Box>
    );
  }
  if (board.status === "error") {
    return <p>There was an error while fetching board</p>;
  }

  const boardData = board.data;
  const statuses = boardData.statuses || [];

  const changeOrderOfItems = (
    statusName: TaskStatus["name"],
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const itemsWithThisStatus = boardData.tasks.filter(
      (i) => i.status.name === statusName
    );

    changeOrderOfTasks({
      boardId,
      firstTaskId: itemsWithThisStatus[sourceIndex].id,
      secondTaskId: itemsWithThisStatus[destinationIndex].id,
    });
  };

  const changeOrderAndStatusOfItem = (
    initialStatusName: TaskStatus["name"],
    destinationStatusName: TaskStatus["name"],
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const itemsWithInitialStatus = (boardData.tasks || []).filter(
      (i) => i.status.name === initialStatusName
    );
    const itemsWithDestinationStatus = (boardData.tasks || []).filter(
      (i) => i.status.name === destinationStatusName
    );
    const destinationStatus = statuses.find(
      (s) => s.name === destinationStatusName
    )!;

    if (
      !itemsWithDestinationStatus[destinationIndex]?.id &&
      destinationIndex === 0
    ) {
      changeStatusOfTask({
        boardId,
        taskId: itemsWithInitialStatus[sourceIndex].id,
        newStatus: destinationStatus,
      });
      return;
    }
    if (
      !itemsWithDestinationStatus[destinationIndex]?.id &&
      destinationIndex > 0
    ) {
      changeOrderAndStatusOfTask({
        boardId,
        destinationStatus: destinationStatus,
        firstTaskId: itemsWithInitialStatus[sourceIndex].id,
        secondTaskId: itemsWithDestinationStatus[destinationIndex - 1].id,
        destinationIsLastOfType: true,
      });
      return;
    }
    changeOrderAndStatusOfTask({
      boardId,
      destinationStatus: destinationStatus,
      firstTaskId: itemsWithInitialStatus[sourceIndex].id,
      secondTaskId: itemsWithDestinationStatus[destinationIndex].id,
    });
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box marginLeft="auto" marginRight="auto" maxWidth="960px">
        <Box display="flex" marginTop="32px" marginBottom="32px">
          <Box marginRight="8px">
            <Typography color="textSecondary">Board name:</Typography>
          </Box>
          <Typography>{boardData.name}</Typography>
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
                  {boardData.tasks
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
    <>
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
    </>
  );
};
