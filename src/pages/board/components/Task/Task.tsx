import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { TaskType } from "../../../../types";
import styles from "./styles.module.css";
import styled from "@emotion/styled";
import { useBoardDetailsSlice } from "../../../../redux/boardDetails/boardDetailsSlice";
import { useParams } from "react-router";

type Props = {
  item: TaskType;
  index: number;
  openEditModal: () => void;
};

const StyledTask = styled.div<{ leftBorderColor: string }>((props) => ({
  borderLeft: `3px solid ${props.leftBorderColor}`,
}));

export const Task: React.FC<Props> = ({ item, index, openEditModal }) => {
  const { id: boardId } = useParams<{ id: string }>();

  const board = useBoardDetailsSlice(boardId);

  if (!board || !board.data) return null;

  const statusColor =
    board.data.statuses.find((s) => s.name === item.status.name)?.color ||
    "blue";

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => (
        <StyledTask
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.card}
          leftBorderColor={statusColor}
          onDoubleClick={() => openEditModal()}
        >
          <p className={styles.title}>{item.title}</p>
          <p className={styles.description}>{item.description}</p>
        </StyledTask>
      )}
    </Draggable>
  );
};
