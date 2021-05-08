import React, { useEffect, useState } from "react";
import { Task } from "./components/Task/Task";
import { DropFunction, Swimlane } from "./components/Swimlane/Swimlane";
import styles from "./styles.module.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Box, CircularProgress } from "@material-ui/core";
import { BoardProvider, useBoard } from "../../contexts/BoardContext";

const BoardComponent: React.FC = () => {
  const { board, status } = useBoard();
  const statuses = board?.statuses || [];
  const [items, setItems] = useState(board?.tasks || []);

  useEffect(() => {
    if (board?.tasks) setItems(board?.tasks);
  }, [JSON.stringify(board?.tasks)]);

  const onDrop: DropFunction = (item, monitor, taskStatus) => {
    setItems((prevState) => {
      const newItems = prevState
        .filter((i) => i.id !== item.id)
        .concat({ ...item, status: taskStatus });
      return [...newItems];
    });
  };

  const changeOrderOfItems = (dragIndex: number, hoverIndex: number) => {
    const item = items[dragIndex];
    setItems((prevState) => {
      const newItems = prevState.filter((i, idx) => idx !== dragIndex);
      newItems.splice(hoverIndex, 0, item);
      return [...newItems];
    });
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
    <DndProvider backend={HTML5Backend}>
      <h3 className={styles["header"]}>{board.name}</h3>
      <div className={styles["main-wrapper"]}>
        {statuses.map((s) => {
          return (
            <div key={s.name} className={styles.column}>
              <p className={styles["column-header"]}>{s.name}</p>
              <Swimlane onDrop={onDrop} status={s}>
                {items
                  .filter((i) => i.status.name === s.name)
                  .map((i, idx) => (
                    <Task
                      key={i.id}
                      item={i}
                      index={idx}
                      changeOrderOfItems={changeOrderOfItems}
                    />
                  ))}
              </Swimlane>
            </div>
          );
        })}
      </div>
    </DndProvider>
  );
};

export const Board: React.FC = () => {
  return (
    <BoardProvider>
      <BoardComponent />
    </BoardProvider>
  );
};
