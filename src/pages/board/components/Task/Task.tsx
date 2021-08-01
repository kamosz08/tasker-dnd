import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useBoard } from "../../../../contexts/BoardContext";
import { TaskType } from "../../../../types";
import styles from "./styles.module.css";
import styled from "@emotion/styled";

type Props = {
  item: TaskType;
  index: number;
  openEditModal: () => void;
};

const StyledTask = styled.div<{ leftBorderColor: string }>((props) => ({
  borderLeft: `3px solid ${props.leftBorderColor}`,
}));

export const Task: React.FC<Props> = ({ item, index, openEditModal }) => {
  const { board } = useBoard();

  const statusColor =
    board!.statuses.find((s) => s.name === item.status.name)?.color || "blue";

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
