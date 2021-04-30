import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { CARD_TYPE, statuses } from "../../../../consts";
import { TaskType, DragableTaskType } from "../../../../types";
import { TaskModal } from "../TaskModal/TaskModal";
import styles from "./styles.module.css";

type Props = {
  item: TaskType;
  index: number;
  changeOrderOfItems: (dragIndex: number, hoverIndex: number) => void;
};

export const Task: React.FC<Props> = ({ item, index, changeOrderOfItems }) => {
  const ref = useRef<HTMLDivElement>(null);
  const statusColor =
    statuses.find((s) => s.name === item.status)?.color || "blue";

  const [, drop] = useDrop({
    accept: CARD_TYPE,
    hover(item: DragableTaskType, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoveredRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
      const mousePosition = monitor.getClientOffset();
      const hoverClientY = mousePosition!.y - hoveredRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      changeOrderOfItems(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { ...item, index },
    type: CARD_TYPE,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [show, setShow] = useState(false);
  const onOpen = () => setShow(true);
  const onClose = () => setShow(false);

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
        onDoubleClick={onOpen}
      >
        <p>{item.title}</p>
        <p>{item.description}</p>
      </div>
      <TaskModal item={item} onClose={onClose} show={show} />
    </>
  );
};
