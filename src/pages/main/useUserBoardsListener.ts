import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { firestoreDB } from "../../firebase";
import {
  UserBoard,
  useUserBoardsActions,
} from "../../redux/userBoards/userBoardsSlice";
import { BoardSnapshot } from "../../types";

export const useUserBoardsListener = () => {
  const { user } = useAuth();

  const userBoardsActions = useUserBoardsActions();

  const createUserBoardsSubscription = () => {
    userBoardsActions.fetchRequest();

    const unsubscribe = firestoreDB
      .collection("boards")
      .where("participants", "array-contains", {
        userId: user!.id,
        displayName: user!.displayName,
      })
      .onSnapshot(
        (snapshot) => {
          if (!snapshot.empty) {
            const snaphotData: UserBoard[] = [];
            snapshot.forEach((doc) => {
              const singleBoard = doc.data() as BoardSnapshot;

              snaphotData.push({
                ...singleBoard,
                createdAt: singleBoard.createdAt?.toDate().toISOString(),
                lastUpdated: singleBoard.lastUpdated?.toDate().toISOString(),
              });
            });
            userBoardsActions.fetchSuccess({ boards: snaphotData });
          } else {
            userBoardsActions.fetchSuccess({ boards: [] });
          }
        },
        (error) => {
          console.error(error);
          userBoardsActions.fetchError({ error: error.message });
        }
      );

    return unsubscribe;
  };

  useEffect(() => {
    let unsubscribeUserBoards: (() => void) | null = null;
    if (user?.id && user?.displayName) {
      unsubscribeUserBoards = createUserBoardsSubscription();
    }

    return () => {
      if (unsubscribeUserBoards) unsubscribeUserBoards();
    };
  }, [user?.id, user?.displayName]);
};
