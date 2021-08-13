import { configureStore } from "@reduxjs/toolkit";
import { boardDetailsReducer } from "./boardDetails/boardDetailsSlice";
import { userBoardsReducer } from "./userBoards/userBoardsSlice";

export const store = configureStore({
  reducer: { ...userBoardsReducer, ...boardDetailsReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
