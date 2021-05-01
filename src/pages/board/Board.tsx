import React, { useState } from "react";
import { Task } from "./components/Task/Task";
import { DropFunction, Swimlane } from "./components/Swimlane/Swimlane";
import styles from "./styles.module.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useBoard } from "./useBoard";
import { useParams } from "react-router";
import { Box, CircularProgress } from "@material-ui/core";

export const Board: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { board, status } = useBoard(id);
  const statuses = board?.statuses || [];
  const [items, setItems] = useState(board?.tasks || []);

  const onDrop: DropFunction = (item, monitor, status) => {
    setItems((prevState) => {
      const newItems = prevState
        .filter((i) => i.id !== item.id)
        .concat({ ...item, status });
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
              <Swimlane onDrop={onDrop} status={s.name}>
                {items
                  .filter((i) => i.status === s.name)
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
