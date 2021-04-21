import React, { useState } from "react";
import { Task } from "./components/Task/Task";
import { DropFunction, Swimlane } from "./components/Swimlane/Swimlane";
import { DUMMY_DATA, statuses } from "../../consts";
import styles from "./styles.module.css";

export const Main: React.FC = () => {
  const [items, setItems] = useState(DUMMY_DATA);

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

  return (
    <>
      <h3 className={styles["header"]}>Board name</h3>
      <div className={styles["main-wrapper"]}>
        {statuses.map((s) => {
          return (
            <div key={s.status} className={styles.column}>
              <p className={styles["column-header"]}>{s.status}</p>
              <Swimlane onDrop={onDrop} status={s.status}>
                {items
                  .filter((i) => i.status === s.status)
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
    </>
  );
};
