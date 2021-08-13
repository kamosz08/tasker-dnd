import { firestoreDB } from "../../../../firebase";
import { TaskSnapshot } from "../../../../types";
import firebase from "firebase/app";
import { useAuth } from "../../../../contexts/AuthContext";
import { useParams } from "react-router";

type FormValues = { name: string; color: string };

export const useCreateLabel = () => {
  const { user } = useAuth();
  const { id: boardId } = useParams<{ id: string }>();

  const createLabel = async (taskId: string, values: FormValues) => {
    const updatedValues: Partial<TaskSnapshot> = {
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
          .doc(boardId)
          .update({
            labels: firebase.firestore.FieldValue.arrayUnion(values),
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
          })
      );
  };

  return { createLabel };
};
