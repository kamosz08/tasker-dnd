import React, { useContext, useEffect, useState } from "react";
import { firestoreDB } from "../firebase";
import { BoardType, DataStatus, TaskType } from "../types";
import { useParams } from "react-router";

type Context = {
  board: BoardType | null;
  status: DataStatus;
  updateTask: (
    taskId: string,
    valuesToUpdate: Partial<TaskType>
  ) => Promise<void>;
};

type BoardSnapshotData = Omit<BoardType, "id" | "tasks"> & { tasks: string[] };

const BoardContext = React.createContext<Context | undefined>(undefined);

export const BoardProvider: React.FC = ({ children }) => {
  const [status, setStatus] = useState<DataStatus>("idle");
  const [data, setData] = useState<BoardType | null>(null);
  const { id: boardId } = useParams<{ id: string }>();

  useEffect(() => {
    const unsubscribeTasks: { id: string; unsubscribe: () => void }[] = [];
    let isFirstRun = true;
    setStatus("loading");

    const addTaskSubscription = (taskId: string) => {
      const unsubscribe = firestoreDB
        .collection("tasks")
        .doc(taskId)
        .onSnapshot((snapshot) => {
          const snaphotData = snapshot.data() as TaskType;
          setData((oldData) => ({
            ...oldData!,
            tasks: oldData!.tasks.map((task) =>
              task.id === snaphotData.id ? snaphotData : task
            ),
          }));
        });
      unsubscribeTasks.push({ id: taskId, unsubscribe });
    };

    const initialFetchAndSubscribe = async (
      id: string,
      snaphotData: BoardSnapshotData
    ) => {
      const promises = snaphotData.tasks.map((t) =>
        firestoreDB
          .collection("tasks")
          .doc(t)
          .get()
          .then((doc) => doc.data())
      );
      const tasks = (await Promise.all(promises)) as TaskType[];
      setData({
        id: id,
        ...snaphotData,
        tasks,
      });
      setStatus("success");
      snaphotData.tasks.forEach((taskId) => {
        addTaskSubscription(taskId);
      });
      isFirstRun = false;
    };

    const manageTasksSubscriptions = async (snaphotData: BoardSnapshotData) => {
      const snapshotTasks = snaphotData.tasks;
      const subscribedTasks = unsubscribeTasks.map((item) => item.id);

      //find new tasks and subscribe
      const addedTasks = snapshotTasks.filter(
        (t) => !subscribedTasks.includes(t)
      );
      addedTasks.forEach((taskId) => {
        addTaskSubscription(taskId);
      });

      //find removed tasks and unsubscribe
      const removedTasks = subscribedTasks.filter(
        (t) => !snapshotTasks.includes(t)
      );
      unsubscribeTasks
        .filter((item) => removedTasks.includes(item.id))
        .forEach((subscribedTask) => {
          subscribedTask.unsubscribe();
        });
    };

    const unsubscribeBoard = firestoreDB
      .collection("boards")
      .doc(boardId)
      .onSnapshot(
        (snapshot) => {
          const snaphotData = snapshot.data() as BoardSnapshotData;
          if (isFirstRun) {
            initialFetchAndSubscribe(snapshot.id, snaphotData);
          } else {
            manageTasksSubscriptions(snaphotData);
          }
        },
        (error) => {
          console.error(error);
          setStatus("error");
        }
      );

    return () => {
      unsubscribeBoard();
    };
  }, [boardId]);

  const updateTask = (taskId: string, valuesToUpdate: Partial<TaskType>) => {
    return firestoreDB.collection("tasks").doc(taskId).update(valuesToUpdate);
  };

  const contextValue = {
    board: data,
    status,
    updateTask,
  };

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a CountProvider");
  }
  return context;
};
