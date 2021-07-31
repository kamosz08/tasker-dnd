import React, { useContext, useEffect, useState } from "react";
import { firestoreDB } from "../firebase";
import { BoardType, DataStatus, TaskType } from "../types";
import { useParams } from "react-router";

type Context = {
  board: BoardType | null;
  status: DataStatus;
  changeOrderOfTasks: (
    firstTaskId: string,
    secondTaskId: string
  ) => Promise<void>;
};

type BoardSnapshotData = Omit<BoardType, "id" | "tasks"> & { tasks: string[] };

const BoardContext = React.createContext<Context | undefined>(undefined);

export const BoardProvider: React.FC = ({ children }) => {
  const [status, setStatus] = useState<DataStatus>("idle");
  const [data, setData] = useState<BoardType | null>(null);
  const { id: boardId } = useParams<{ id: string }>();

  useEffect(() => {
    let subscribedTasks: { id: string; unsubscribe: () => void }[] = [];
    let isFirstRun = true;
    setStatus("loading");

    const addTaskSubscription = (taskId: string) => {
      const unsubscribe = firestoreDB
        .collection("tasks")
        .doc(taskId)
        .onSnapshot((snapshot) => {
          const snaphotData = snapshot.data() as TaskType;

          setData((oldData) => {
            const isNew = !oldData?.tasks.find((t) => t.id === taskId);
            return {
              ...oldData!,
              tasks: isNew
                ? [...oldData!.tasks, snaphotData]
                : oldData!.tasks.map((task) =>
                    task.id === snaphotData.id ? snaphotData : task
                  ),
            };
          });

          isFirstRun = false;
        });
      subscribedTasks.push({ id: taskId, unsubscribe });
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

      setData((oldData) => ({
        ...oldData!,
        ...snaphotData,
        tasks: oldData!.tasks.filter((item) => !removedTasks.includes(item.id)),
      }));

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
      subscribedTasks.forEach((subscribedTask) => {
        subscribedTask.unsubscribe();
      });
      unsubscribeBoard();
    };
  }, [boardId]);

  const changeOrderOfTasks = (firstTaskId: string, secondTaskId: string) => {
    const currentTasksIds = data!.tasks.map((t) => t.id);

    const firstIndex = currentTasksIds.indexOf(firstTaskId);
    const secondIndex = currentTasksIds.indexOf(secondTaskId);

    currentTasksIds.splice(firstIndex, 1);
    currentTasksIds.splice(secondIndex, 0, firstTaskId);

    const tasksWithNewOrder = data!.tasks;
    const temp = tasksWithNewOrder[firstIndex];
    tasksWithNewOrder.splice(firstIndex, 1);
    tasksWithNewOrder.splice(secondIndex, 0, temp);

    setData((oldData) => ({ ...oldData!, tasks: tasksWithNewOrder }));
    return firestoreDB
      .collection("boards")
      .doc(boardId)
      .update({ tasks: currentTasksIds });
  };

  const contextValue = {
    board: data,
    status,
    changeOrderOfTasks,
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
