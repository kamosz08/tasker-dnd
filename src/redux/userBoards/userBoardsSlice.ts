import {
  bindActionCreators,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { firestoreDB } from "../../firebase";
import { AsyncState, BoardType, AsyncStateError } from "../../types";
import { useAppDispatch, useAppSelector } from "../hooks";
import { AppDispatch, RootState } from "../store";
import firebase from "firebase/app";

type BoardTypeWithoutTaskPull = Omit<BoardType, "tasks"> & {
  tasks: string[];
};

export type UserBoard = Omit<
  BoardTypeWithoutTaskPull,
  "createdAt" | "lastUpdated"
> & {
  tasks: string[];
  createdAt: string;
  lastUpdated: string;
};

const initialState = {
  status: "idle",
  data: null,
  error: null,
} as AsyncState<UserBoard[]>;

const deleteBoard = createAsyncThunk<
  Promise<void>,
  { boardId: string; participantsIds: string[]; tasksIds: string[] },
  { dispatch: AppDispatch; state: RootState }
>("userBoards/deleteUserBoard", ({ boardId, participantsIds, tasksIds }) => {
  // Get a new write batch
  const removeBoardBatch = firestoreDB.batch();

  participantsIds.forEach((participantId) => {
    const parRef = firestoreDB.collection("users").doc(participantId);
    removeBoardBatch.update(parRef, {
      boards: firebase.firestore.FieldValue.arrayRemove(boardId),
    });
  });

  tasksIds.forEach((taskId) => {
    const taskRef = firestoreDB.collection("tasks").doc(taskId);
    removeBoardBatch.delete(taskRef);
  });

  const boardRef = firestoreDB.collection("boards").doc(boardId);
  removeBoardBatch.delete(boardRef);

  // Commit the batch
  return removeBoardBatch.commit();
});

export const userBoardsSlice = createSlice({
  name: "userBoards",
  initialState,
  reducers: {
    fetchRequest: (state) => {
      state.status = "loading";
    },
    fetchSuccess: (state, action: PayloadAction<{ boards: UserBoard[] }>) => {
      state.status = "success";
      state.data = action.payload.boards;
    },
    fetchError: (state, action: PayloadAction<{ error: AsyncStateError }>) => {
      state.status = "success";
      state.error = action.payload.error;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(fetchUserBoards.pending, (state, action) => {
  //     state.status = "loading";
  //   });
  // },
});

export const userBoardsReducer = {
  userBoards: userBoardsSlice.reducer,
};

export const useUserBoardsSlice = () => {
  const userBoardsSlice = useAppSelector((state) => state.userBoards);
  return userBoardsSlice;
};

export const useUserBoardsActions = () => {
  const dispatch = useAppDispatch();

  const actions = bindActionCreators(
    { ...userBoardsSlice.actions, deleteBoard },
    dispatch
  );

  return actions;
};
