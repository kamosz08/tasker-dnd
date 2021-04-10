import React, { useState } from "react";
import { Card } from "../../components/Card/Card";
import { DropFunction, Swimlane } from "../../components/Swimlane/Swimlane";
import { DUMMY_DATA, statuses } from "../../consts";

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
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      {statuses.map((s) => {
        return (
          <div
            key={s.status}
            style={{ backgroundColor: "azure", marginLeft: 8, marginRight: 8 }}
          >
            <h2>{s.status.toUpperCase()}</h2>
            <Swimlane onDrop={onDrop} status={s.status}>
              {items
                .filter((i) => i.status === s.status)
                .map((i, idx) => (
                  <Card
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
  );
};
