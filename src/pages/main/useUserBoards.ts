import { useEffect, useState } from "react";
import { firestoreDB } from "../../firebase";
import { DataStatus } from "../../types";

type DataType = {
  id: string;
  name: string;
};

export const useUserBoards = () => {
  const [status, setStatus] = useState<DataStatus>("idle");
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    setStatus("loading");
    const unsubscribe = firestoreDB.collection("boards").onSnapshot(
      (snapshot) => {
        setStatus("success");
        if (!snapshot.empty) {
          const snaphotData: DataType[] = [];
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
