import { firestoreDB } from "../../../../firebase";
import { TaskType } from "../../../../types";
import firebase from "firebase/app";
import { useAuth } from "../../../../contexts/AuthContext";
import { useBoard } from "../../../../contexts/BoardContext";

type FormValues = { name: string; color: string };

export const useCreateLabel = () => {
  const { user } = useAuth();
  const { board } = useBoard();

  const createLabel = async (taskId: string, values: FormValues) => {
    const updatedValues: Partial<TaskType> = {
      labels: firebase.firestore.FieldValue.arrayUnion(values.name) as any,
      updatedBy: { userId: user!.id, displayName: user!.displayName },
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    };

    await firestoreDB
      .collection("tasks")
      .doc(taskId)
      .update(updatedValues)
      .then(() =>
        firestoreDB
          .collection("boards")
          .doc(board!.id)
          .update({
            labels: firebase.firestore.FieldValue.arrayUnion(values),
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
          })
      );
  };

  return { createLabel };
};
