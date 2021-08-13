import { firestoreDB } from "../../../../firebase";
import { TaskSnapshot, TaskType } from "../../../../types";
import firebase from "firebase/app";
import { useAuth } from "../../../../contexts/AuthContext";
import { useParams } from "react-router";

type FormValues = Partial<
  Pick<TaskType, "description" | "title" | "status" | "assignee">
>;

export const useUpdateTask = () => {
  const { user } = useAuth();
  const { id: boardId } = useParams<{ id: string }>();

  const updateTask = (taskId: string, values: FormValues) => {
    const updateTaskBatch = firestoreDB.batch();

    const updatedValues: Partial<TaskSnapshot> = {
      ...values,
      updatedBy: { userId: user!.id, displayName: user!.displayName },
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    };

    const taskRef = firestoreDB.collection("tasks").doc(taskId);
    updateTaskBatch.update(taskRef, updatedValues);

    const boardRef = firestoreDB.collection("boards").doc(boardId);
    updateTaskBatch.update(boardRef, {
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
    });

    return updateTaskBatch.commit();
  };

  const removeTask = async (taskId: string) => {
    await firestoreDB
      .collection("boards")
      .doc(boardId)
      .update({
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
        tasks: firebase.firestore.FieldValue.arrayRemove(taskId),
      });
    // .then(() => firestoreDB.collection("tasks").doc(taskId).delete());
  };

  const addLabelToTask = async (taskId: string, label: string) => {
    const updatedValues: Partial<TaskSnapshot> = {
      labels: firebase.firestore.FieldValue.arrayUnion(label) as any,
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
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
          })
      );
  };

  const removeLabelFromTask = async (taskId: string, label: string) => {
    const updatedValues: Partial<TaskSnapshot> = {
      labels: firebase.firestore.FieldValue.arrayRemove(label) as any,
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
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
          })
      );
  };

  return { updateTask, addLabelToTask, removeLabelFromTask, removeTask };
};
