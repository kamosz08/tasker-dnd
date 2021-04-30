import React from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { CARD_TYPE } from "../../../../consts";
import { DragableTaskType } from "../../../../types";

export type DropFunction = (
  item: DragableTaskType,
  monitor: DropTargetMonitor<unknown, unknown>,
  status: string
) => void;

type Props = {
  onDrop: DropFunction;
  status: string;
};

export const Swimlane: React.FC<Props> = ({ onDrop, children, status }) => {
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
    <div ref={drop} style={{ minHeight: 400 }}>
      <div
        style={{
          minHeight: 400,
          backgroundColor: isOver ? "yellow" : "",
        }}
      >
        {children}
      </div>
    </div>
  );
};
