import firebase from "firebase/app";

export type UserType = {
  id: string;
  email: string;
  displayName: string;
};

export type SimpleUserType = { userId: string; displayName: string };

export type TaskType = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdBy: SimpleUserType;
  createdAt: string;
  lastUpdated: string;
  updatedBy: SimpleUserType;
  labels: string[];
  assignee: SimpleUserType | null;
};

export type TaskSnapshot = Omit<TaskType, "createdAt" | "lastUpdated"> & {
  createdAt: firebase.firestore.Timestamp;
  lastUpdated: firebase.firestore.Timestamp;
};

export type TaskStatus = {
  name: string;
  color: string;
};

export type BoardType = {
  id: string;
  name: string;
  description: string;
  tasks: TaskType[];
  statuses: TaskStatus[];
  createdAt: string;
  lastUpdated: string;
  createdBy: SimpleUserType;
  participants: SimpleUserType[];
  labels: { name: string; color: string }[];
};

export type BoardSnapshot = Omit<
  BoardType,
  "tasks" | "createdAt" | "lastUpdated"
> & {
  tasks: string[];
  createdAt: firebase.firestore.Timestamp;
  lastUpdated: firebase.firestore.Timestamp;
};

export type AsyncStateError = string;

export type AsyncState<T> =
  | {
      status: "idle";
      data: null;
      error: null;
    }
  | {
      status: "loading";
      data: null;
      error: null;
    }
  | {
      status: "success";
      data: T;
      error: null;
    }
  | {
      status: "error";
      data: T | null;
      error: AsyncStateError;
    };
