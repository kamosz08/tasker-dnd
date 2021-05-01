import { useEffect, useState } from "react";
import { firestoreDB } from "../../firebase";
import { BoardType, DataStatus } from "../../types";

export const useUserBoards = () => {
  const [status, setStatus] = useState<DataStatus>("idle");
  const [data, setData] = useState<BoardType[]>([]);

  useEffect(() => {
    setStatus("loading");
    const unsubscribe = firestoreDB.collection("boards").onSnapshot(
      (snapshot) => {
        setStatus("success");
        if (!snapshot.empty) {
          const snaphotData: BoardType[] = [];
          snapshot.forEach((doc) =>
            snaphotData.push({ id: doc.id, name: doc.data().name })
          );
          setData(snaphotData);
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
    data,
  };
};
