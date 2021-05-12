import { firestoreDB } from "../../../../firebase";
import { TaskType } from "../../../../types";
import firebase from "firebase/app";
import { useAuth } from "../../../../contexts/AuthContext";
import { useBoard } from "../../../../contexts/BoardContext";

type FormValues = Partial<Pick<TaskType, "description" | "title" | "status">>;

export const useUpdateTask = () => {
  const { user } = useAuth();
  const { board } = useBoard();

  const updateTask = async (taskId: string, values: FormValues) => {
    const updatedValues: Partial<TaskType> = {
      ...values,
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
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
          })
      );
  };

  return { updateTask };
};
