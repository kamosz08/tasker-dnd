import firebase from "firebase/app";
import { BoardType } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { statuses } from "../../consts";
import { firestoreDB } from "../../firebase";

type FormValues = {
  name: string;
  description: string;
};

export const useCreateBoard = () => {
  const { user } = useAuth();

  const createBoard = async (values: FormValues) => {
    const newBoardRef = firestoreDB.collection("boards").doc();
    const newBoard: BoardType = {
      id: newBoardRef.id,
      tasks: [],
      statuses: statuses,
      name: values.name,
      description: values.description,
      createdAt: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
      createdBy: { userId: user!.id, displayName: user!.displayName },
      participants: [{ userId: user!.id, displayName: user!.displayName }],
    };
    await newBoardRef.set(newBoard).then(() =>
      firestoreDB
        .collection("users")
        .doc(user!.id)
        .update({
          boards: firebase.firestore.FieldValue.arrayUnion(newBoardRef.id),
        })
    );
  };

  return { createBoard };
};
