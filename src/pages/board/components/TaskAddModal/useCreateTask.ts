import { firestoreDB } from "../../../../firebase";
import { TaskType } from "../../../../types";
import firebase from "firebase/app";
import { useAuth } from "../../../../contexts/AuthContext";
import { useBoard } from "../../../../contexts/BoardContext";

type FormValues = Pick<TaskType, "description" | "title" | "status">;

export const useCreateTask = () => {
  const { user } = useAuth();
  const { board } = useBoard();

  const createTask = async (values: FormValues) => {
    const newTaskRef = firestoreDB.collection("tasks").doc();

    const newTask: TaskType = {
      id: newTaskRef.id,
      title: values.title,
      description: values.description,
      status: values.status,
      createdBy: { userId: user!.id, displayName: user!.displayName },
      createdAt: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
      updatedBy: { userId: user!.id, displayName: user!.displayName },
      labels: [],
      assignee: null,
    };

    await newTaskRef.set(newTask).then(() =>
      firestoreDB
        .collection("boards")
        .doc(board!.id)
        .update({
          tasks: firebase.firestore.FieldValue.arrayUnion(newTask.id),
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
        })
    );
  };

  return { createTask };
};
