import { Box } from "@material-ui/core";
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { CARD_TYPE } from "../../../../consts";
import { useBoard } from "../../../../contexts/BoardContext";
import { TaskType, DragableTaskType } from "../../../../types";
import styles from "./styles.module.css";

type Props = {
  item: TaskType;
  index: number;
  changeOrderOfItems: (dragIndex: number, hoverIndex: number) => void;
  openEditModal: () => void;
};

export const Task: React.FC<Props> = ({
  item,
  index,
  changeOrderOfItems,
  openEditModal,
}) => {
  const { board } = useBoard();

  const topBorder = document.createElement("div");
  topBorder.className = styles.topBorder;
  topBorder.id = "topBorder";
  const bottomBorder = document.createElement("div");
  bottomBorder.className = styles.bottomBorder;
  bottomBorder.id = "bottomBorder";

  const ref = useRef<HTMLDivElement>(null);

  const statusColor =
    board!.statuses.find((s) => s.name === item.status.name)?.color || "blue";

  const [, drop] = useDrop({
    accept: CARD_TYPE,
    hover(draggedItem: any, monitor: any) {
      if (!ref.current) {
        return;
      }

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      if (dragIndex > hoverIndex) {
        ref.current.appendChild(topBorder);
        return;
      }

      if (dragIndex < hoverIndex) {
        ref.current.appendChild(bottomBorder);
        return;
      }
    },
    drop(itemIsBeingDroppedOn: DragableTaskType) {
      if (!ref.current) {
        return;
      }
      const top = document.querySelector("#topBorder");
      if (top) {
        top.parentNode!.removeChild(top);
      }
      const bot = document.querySelector("#bottomBorder");
      if (bot) {
        bot.parentNode!.removeChild(bot);
      }
      const dragIndex = itemIsBeingDroppedOn.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      changeOrderOfItems(dragIndex, hoverIndex);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { ...item, index },
    type: CARD_TYPE,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const attachRef = () => {
    drag(ref);
    drop(ref);
  };

  attachRef();

  return (
    <>
      <div
        ref={ref}
        style={{
          opacity: isDragging ? 0 : 1,
          borderLeft: `3px solid ${statusColor}`,
        }}
        className={styles.card}
        onDoubleClick={() => openEditModal()}
      >
        <p className={styles.title}>{item.title}</p>
        <p className={styles.description}>{item.description}</p>
      </div>
    </>
  );
};
