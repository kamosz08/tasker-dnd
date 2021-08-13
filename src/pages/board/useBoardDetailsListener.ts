import { useEffect } from "react";
import { useParams } from "react-router";
import { firestoreDB } from "../../firebase";
import { useBoardDetailsActions } from "../../redux/boardDetails/boardDetailsSlice";
import { BoardSnapshot, TaskSnapshot } from "../../types";

export const useBoardDetailsListener = () => {
  const { id: boardId } = useParams<{ id: string }>();

  const boardDetailsActions = useBoardDetailsActions();

  const createBoardDetailsSubscription = (boardId: string) => {
    let subscribedTasks: { id: string; unsubscribe: () => void }[] = [];
    let isFirstRun = true;
    boardDetailsActions.fetchRequest({ boardId });

    const addTaskSubscription = (taskId: string) => {
      const unsubscribe = firestoreDB
        .collection("tasks")
        .doc(taskId)
        .onSnapshot((snapshot) => {
          const snaphotData = snapshot.data() as TaskSnapshot;

          boardDetailsActions.updateTask({
            boardId,
            taskId,
            data: {
              ...snaphotData,
              createdAt: snaphotData.createdAt.toDate().toISOString(),
              lastUpdated: snaphotData.lastUpdated.toDate().toISOString(),
            },
          });

          isFirstRun = false;
        });
      subscribedTasks.push({ id: taskId, unsubscribe });
    };

    const initialFetchAndSubscribe = async (
      id: string,
      snaphotData: BoardSnapshot
    ) => {
      const promises = snaphotData.tasks.map((t) =>
        firestoreDB
          .collection("tasks")
          .doc(t)
          .get()
          .then((doc) => doc.data())
      );
      const tasks = (await Promise.all(promises)) as TaskSnapshot[];

      boardDetailsActions.fetchSuccess({
        boardId,
        data: {
          ...snaphotData,
          createdAt: snaphotData.createdAt.toDate().toISOString(),
          lastUpdated: snaphotData.lastUpdated.toDate().toISOString(),
          tasks: tasks.map((t) => ({
            ...t,
            createdAt: t.createdAt.toDate().toISOString(),
            lastUpdated: t.lastUpdated.toDate().toISOString(),
          })),
        },
      });

      snaphotData.tasks.forEach((taskId) => {
        addTaskSubscription(taskId);
      });
      isFirstRun = false;
    };

    const manageTasksSubscriptions = async (snaphotData: BoardSnapshot) => {
      const snapshotTasks = snaphotData.tasks;
      const subscribedTasksIds = subscribedTasks.map((item) => item.id);

      //find new tasks and subscribe
      const addedTasks = snapshotTasks.filter(
        (t) => !subscribedTasksIds.includes(t)
      );
      addedTasks.forEach((taskId) => {
        addTaskSubscription(taskId);
      });

      //find removed tasks and unsubscribe
      const removedTasks = subscribedTasksIds.filter(
        (t) => !snapshotTasks.includes(t)
      );

      boardDetailsActions.deleteTasks({
        boardId,
        deleteTasksIds: removedTasks,
      });

      subscribedTasks
        .filter((item) => removedTasks.includes(item.id))
        .forEach((subscribedTask) => {
          subscribedTask.unsubscribe();
          firestoreDB.collection("tasks").doc(subscribedTask.id).delete();
        });

      subscribedTasks = subscribedTasks.filter(
        (item) => !removedTasks.includes(item.id)
      );
    };

    const unsubscribeBoard = firestoreDB
      .collection("boards")
      .doc(boardId)
      .onSnapshot(
        (snapshot) => {
          const snaphotData = snapshot.data() as BoardSnapshot;

          if (isFirstRun) {
            initialFetchAndSubscribe(snapshot.id, snaphotData);
          } else {
            manageTasksSubscriptions(snaphotData);
          }
        },
        (error) => {
          console.error(error);
          boardDetailsActions.fetchError({ error: error.message, boardId });
        }
      );

    return () => {
      subscribedTasks.forEach((subscribedTask) => {
        subscribedTask.unsubscribe();
      });
      unsubscribeBoard();
    };
  };

  useEffect(() => {
    let unsubscribeBoardDetails: (() => void) | null = null;
    if (boardId) {
      unsubscribeBoardDetails = createBoardDetailsSubscription(boardId);
    }

    return () => {
      if (unsubscribeBoardDetails) unsubscribeBoardDetails();
    };
  }, [boardId]);
};
