import { useEffect, useState } from "react";
import { firestoreDB } from "../../firebase";
import { DataStatus, TaskStatus, TaskType } from "../../types";

type BoardType = {
  id: string;
  name: string;
  statuses: TaskStatus[];
  tasks: TaskType[];
};

export const useBoard = (boardId: string) => {
  const [status, setStatus] = useState<DataStatus>("idle");
  const [data, setData] = useState<BoardType | null>(null);

  useEffect(() => {
    setStatus("loading");
    const unsubscribe = firestoreDB
      .collection("boards")
      .doc(boardId)
      .onSnapshot(
        (snapshot) => {
          const snaphotData = snapshot.data();
          if (snaphotData) {
            setData({
              id: snapshot.id,
              name: snaphotData.name,
              statuses: snaphotData.statuses,
              tasks: snaphotData.tasks,
            });
            setStatus("success");
          } else {
            console.error("Empty board document");
            setStatus("error");
          }
        },
        (error) => {
          console.error(error);
          setStatus("error");
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    status,
    board: data,
  };
};
