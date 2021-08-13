import { firestoreDB } from "../../../../firebase";
import { TaskSnapshot, TaskType } from "../../../../types";
import firebase from "firebase/app";
import { useAuth } from "../../../../contexts/AuthContext";
import { useParams } from "react-router";

type FormValues = Pick<
  TaskType,
  "description" | "title" | "status" | "assignee"
>;

export const useCreateTask = () => {
  const { user } = useAuth();
  const { id: boardId } = useParams<{ id: string }>();

  const createTask = async (values: FormValues) => {
    const newTaskRef = firestoreDB.collection("tasks").doc();

    const newTask: TaskSnapshot = {
      id: newTaskRef.id,
      title: values.title,
      description: values.description,
      status: values.status,
      createdBy: { userId: user!.id, displayName: user!.displayName },
      createdAt: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
      updatedBy: { userId: user!.id, displayName: user!.displayName },
      labels: [],
      assignee: values.assignee || null,
    };

    await newTaskRef.set(newTask).then(() =>
      firestoreDB
        .collection("boards")
        .doc(boardId)
        .update({
          tasks: firebase.firestore.FieldValue.arrayUnion(newTask.id),
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
        })
    );
  };

  return { createTask };
};
