import { useEffect, useState } from "react";
import { firestoreDB } from "../../firebase";
import { BoardType, DataStatus } from "../../types";
import firebase from "firebase/app";
import { useAuth } from "../../contexts/AuthContext";

export type BoardTypeWithoutTaskPull = Omit<BoardType, "tasks"> & {
  tasks: string[];
};

export const useUserBoards = () => {
  const [status, setStatus] = useState<DataStatus>("idle");
  const [data, setData] = useState<BoardTypeWithoutTaskPull[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    setStatus("loading");
    const unsubscribe = firestoreDB
      .collection("boards")
      .where("participants", "array-contains", {
        userId: user!.id,
        displayName: user!.displayName,
      })
      .onSnapshot(
        (snapshot) => {
          setStatus("success");
          if (!snapshot.empty) {
            const snaphotData: BoardTypeWithoutTaskPull[] = [];
            snapshot.forEach((doc) =>
              snaphotData.push({ ...(doc.data() as BoardTypeWithoutTaskPull) })
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

  const deleteBoard = (
    boardId: string,
    participantsIds: string[],
    tasksIds: string[]
  ) => {
    // Get a new write batch
    const removeBoardBatch = firestoreDB.batch();

    participantsIds.forEach((participantId) => {
      const parRef = firestoreDB.collection("users").doc(participantId);
      removeBoardBatch.update(parRef, {
        boards: firebase.firestore.FieldValue.arrayRemove(boardId),
      });
    });

    tasksIds.forEach((taskId) => {
      const taskRef = firestoreDB.collection("tasks").doc(taskId);
      removeBoardBatch.delete(taskRef);
    });

    const boardRef = firestoreDB.collection("boards").doc(boardId);
    removeBoardBatch.delete(boardRef);

    // Commit the batch
    return removeBoardBatch.commit();
  };

  return {
    status,
    data,
    deleteBoard,
  };
};
