import {
  bindActionCreators,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { firestoreDB } from "../../firebase";
import { AsyncState, BoardType, TaskType, TaskStatus } from "../../types";
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppDispatch, RootState } from "../store";

const initialState = {} as Record<string, AsyncState<BoardType>>;

const changeOrderOfTasks = createAsyncThunk<
  Promise<void>,
  { boardId: string; firstTaskId: string; secondTaskId: string },
  { dispatch: AppDispatch; state: RootState }
>(
  "boardDetails/changeOrderOfTasks",
  ({ boardId, firstTaskId, secondTaskId }, { dispatch, getState }) => {
    const state = getState();
    const boardData = state.boardDetails[boardId]?.data;
    if (!boardData) {
      throw new Error(
        "Change Order of tasks called before board data is loaded"
      );
    }
    const currentTasksIds = boardData!.tasks.map((t) => t.id);

    const firstIndex = currentTasksIds.indexOf(firstTaskId);
    const secondIndex = currentTasksIds.indexOf(secondTaskId);

    currentTasksIds.splice(firstIndex, 1);
    currentTasksIds.splice(secondIndex, 0, firstTaskId);

    dispatch(
      boardDetailsSlice.actions.changeOrderOfTasksOptimisticUpdate({
        boardId,
        firstIndex,
        secondIndex,
      })
    );
    return firestoreDB
      .collection("boards")
      .doc(boardId)
      .update({ tasks: currentTasksIds });
  }
);

const changeStatusOfTask = createAsyncThunk<
  Promise<void>,
  { boardId: string; taskId: string; newStatus: TaskStatus },
  { dispatch: AppDispatch; state: RootState }
>(
  "boardDetails/changeStatusOfTask",
  ({ boardId, taskId, newStatus }, { dispatch, getState }) => {
    const state = getState();
    const boardData = state.boardDetails[boardId]?.data;
    if (!boardData) {
      throw new Error(
        "Change status of tasks called before board data is loaded"
      );
    }
    dispatch(
      boardDetailsSlice.actions.changeStatusOfTaskOptimisticUpdate({
        boardId,
        taskId,
        newStatus,
      })
    );
    return firestoreDB
      .collection("tasks")
      .doc(taskId)
      .update({ status: newStatus });
  }
);

const changeOrderAndStatusOfTask = createAsyncThunk<
  Promise<void>,
  {
    boardId: string;
    destinationStatus: TaskStatus;
    firstTaskId: string;
    secondTaskId: string;
    destinationIsLastOfType?: boolean | undefined;
  },
  { dispatch: AppDispatch; state: RootState }
>(
  "boardDetails/changeOrderAndStatusOfTask",
  (
    {
      boardId,
      destinationStatus,
      firstTaskId,
      secondTaskId,
      destinationIsLastOfType,
    },
    { dispatch, getState }
  ) => {
    const state = getState();
    const boardData = state.boardDetails[boardId]?.data;
    if (!boardData) {
      throw new Error(
        "Change order and status of tasks called before board data is loaded"
      );
    }
    const currentTasksIds = boardData!.tasks.map((t) => t.id);

    const firstIndex = currentTasksIds.indexOf(firstTaskId);
    const secondIndex = currentTasksIds.indexOf(secondTaskId);

    dispatch(
      boardDetailsSlice.actions.changeOrderAndStatusOfTaskOptimisticUpdate({
        boardId,
        firstIndex,
        secondIndex,
        destinationStatus,
        destinationIsLastOfType: destinationIsLastOfType || false,
      })
    );

    let destinationIndex = secondIndex - 1 >= 0 ? secondIndex - 1 : 0;
    if (destinationIsLastOfType) destinationIndex = secondIndex;
    else if (firstIndex > secondIndex) destinationIndex = secondIndex;

    currentTasksIds.splice(firstIndex, 1);
    currentTasksIds.splice(destinationIndex, 0, firstTaskId);

    const updateTaskBatch = firestoreDB.batch();

    const updatedValues: Partial<TaskType> = {
      status: destinationStatus,
    };

    const taskRef = firestoreDB.collection("tasks").doc(firstTaskId);
    updateTaskBatch.update(taskRef, updatedValues);

    const boardRef = firestoreDB.collection("boards").doc(boardId);
    updateTaskBatch.update(boardRef, {
      tasks: currentTasksIds,
    });

    return updateTaskBatch.commit();
  }
);

export const boardDetailsSlice = createSlice({
  name: "boardDetails",
  initialState,
  reducers: {
    fetchRequest: (state, action: PayloadAction<{ boardId: string }>) => {
      if (state[action.payload.boardId]?.status !== "success")
        state[action.payload.boardId] = {
          status: "loading",
          data: null,
          error: null,
        };
    },
    fetchSuccess: (
      state,
      action: PayloadAction<{ boardId: string; data: BoardType }>
    ) => {
      state[action.payload.boardId].status = "success";
      state[action.payload.boardId].data = action.payload.data;
    },
    fetchError: (
      state,
      action: PayloadAction<{ boardId: string; error: string }>
    ) => {
      state[action.payload.boardId].status = "error";
      state[action.payload.boardId].error = action.payload.error;
    },
    updateTask: (
      state,
      action: PayloadAction<{ boardId: string; taskId: string; data: TaskType }>
    ) => {
      const { taskId, boardId, data } = action.payload;
      if (!state[boardId] || !state[boardId]?.data) {
        throw new Error("Update task called before board data is loaded");
      }
      const isNew = !state[boardId].data?.tasks.find((t) => t.id === taskId);
      if (isNew) {
        state[boardId].data!.tasks = [...state[boardId].data!.tasks, data];
      } else {
        state[boardId].data!.tasks = state[boardId].data!.tasks.map((task) =>
          task.id === data.id ? data : task
        );
      }
    },
    deleteTasks: (
      state,
      action: PayloadAction<{ boardId: string; deleteTasksIds: string[] }>
    ) => {
      const { boardId, deleteTasksIds } = action.payload;
      if (!state[boardId] || !state[boardId]?.data) {
        throw new Error("Delete task called before board data is loaded");
      }
      state[boardId].data!.tasks = state[boardId].data!.tasks.filter(
        (item) => !deleteTasksIds.includes(item.id)
      );
    },
    changeOrderOfTasksOptimisticUpdate: (
      state,
      action: PayloadAction<{
        boardId: string;
        firstIndex: number;
        secondIndex: number;
      }>
    ) => {
      const { boardId, firstIndex, secondIndex } = action.payload;
      if (!state[boardId] || !state[boardId]?.data) {
        throw new Error(
          "Change Order of tasks called before board data is loaded"
        );
      }
      const currentTasks = state[boardId].data!.tasks;

      const tasksWithNewOrder = [...currentTasks];
      const temp = tasksWithNewOrder[firstIndex];
      tasksWithNewOrder.splice(firstIndex, 1);
      tasksWithNewOrder.splice(secondIndex, 0, temp);

      state[boardId].data!.tasks = tasksWithNewOrder;
    },
    changeStatusOfTaskOptimisticUpdate: (
      state,
      action: PayloadAction<{
        boardId: string;
        newStatus: TaskStatus;
        taskId: string;
      }>
    ) => {
      const { boardId, taskId, newStatus } = action.payload;
      if (!state[boardId] || !state[boardId]?.data) {
        throw new Error(
          "Change status of task called before board data is loaded"
        );
      }
      const currentTasks = state[boardId].data!.tasks;
      const currentTasksIds = currentTasks.map((t) => t.id);

      const taskIndex = currentTasksIds.indexOf(taskId);

      const updatedTasks = [...currentTasks].map((t, idx) =>
        idx === taskIndex ? { ...t, status: newStatus } : t
      );

      state[boardId].data!.tasks = updatedTasks;
    },
    changeOrderAndStatusOfTaskOptimisticUpdate: (
      state,
      action: PayloadAction<{
        boardId: string;
        firstIndex: number;
        secondIndex: number;
        destinationStatus: TaskStatus;
        destinationIsLastOfType: boolean;
      }>
    ) => {
      const {
        boardId,
        firstIndex,
        secondIndex,
        destinationStatus,
        destinationIsLastOfType,
      } = action.payload;
      if (!state[boardId] || !state[boardId]?.data) {
        throw new Error(
          "Change order and status of task called before board data is loaded"
        );
      }
      const currentTasks = state[boardId].data!.tasks;

      let destinationIndex = secondIndex - 1 >= 0 ? secondIndex - 1 : 0;
      if (destinationIsLastOfType) destinationIndex = secondIndex;
      else if (firstIndex > secondIndex) destinationIndex = secondIndex;

      let tasksWithNewOrder = [...currentTasks];
      const temp = tasksWithNewOrder[firstIndex];
      tasksWithNewOrder.splice(firstIndex, 1);
      tasksWithNewOrder.splice(destinationIndex, 0, temp);
      tasksWithNewOrder = tasksWithNewOrder.map((t) =>
        t.id === temp.id ? { ...t, status: destinationStatus } : t
      );

      state[boardId].data!.tasks = tasksWithNewOrder;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(fetchBoardDetails.pending, (state, action) => {
  //     state.status = "loading";
  //   });
  // },
});

export const boardDetailsReducer = {
  boardDetails: boardDetailsSlice.reducer,
};

export const useBoardDetailsSlice = (boardId: string) => {
  const boardDetailsSlice = useAppSelector(
    (state) => state.boardDetails[boardId]
  );
  return boardDetailsSlice;
};

export const useBoardDetailsActions = () => {
  const dispatch = useAppDispatch();

  const actions = bindActionCreators(
    {
      ...boardDetailsSlice.actions,
      changeOrderOfTasks,
      changeStatusOfTask,
      changeOrderAndStatusOfTask,
    },
    dispatch
  );

  return actions;
};
