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

  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useRef<boolean>(false);
  const statusColor =
    board!.statuses.find((s) => s.name === item.status.name)?.color || "blue";

  const [, drop] = useDrop({
    accept: CARD_TYPE,
    // hover(draggedItem: DragableTaskType) {
    //   if (!ref.current) {
    //     return;
    //   }

    //   const dragIndex = draggedItem.index;
    //   const hoverIndex = index;

    //   if (dragIndex === hoverIndex) {
    //     return;
    //   }

    //   // const hoveredRect = ref.current.getBoundingClientRect();
    //   // const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
    //   // const mousePosition = monitor.getClientOffset();
    //   // const hoverClientY = mousePosition!.y - hoveredRect.top;

    //   // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    //   //   return;
    //   // }

    //   // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    //   //   return;
    //   // }
    //   isHovered.current = true;
    //   console.log(dragIndex, hoverIndex);

    //   changeOrderOfItems(dragIndex, hoverIndex);
    //   // draggedItem.index = hoverIndex;
    // },
    drop(itemIsBeingDroppedOn: DragableTaskType) {
      if (!ref.current) {
        return;
      }

      const dragIndex = itemIsBeingDroppedOn.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      // const hoveredRect = ref.current.getBoundingClientRect();
      // const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
      // const mousePosition = monitor.getClientOffset();
      // const hoverClientY = mousePosition!.y - hoveredRect.top;

      // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      //   return;
      // }

      // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      //   return;
      // }
      isHovered.current = true;
      console.log(dragIndex, hoverIndex);

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
  console.log(isHovered.current);

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
