import firebase from "firebase/app";

export type UserType = {
  id: string;
  email: string;
  displayName: string;
};

export type TaskType = {
  id: number;
  title: string;
  description: string;
  status: string;
};

export type TaskStatus = {
  name: string;
  color: string;
};

export type DragableTaskType = TaskType & {
  index: number;
};

export type DataStatus = "idle" | "loading" | "success" | "error";

export type BoardType = {
  id: string;
  name: string;
  description: string;
  tasks: TaskType[];
  statuses: TaskStatus[];
  createdAt: firebase.firestore.Timestamp;
  lastUpdated: firebase.firestore.Timestamp;
  createdBy: {
    userId: string;
    displayName: string;
  };
  participants: {
    userId: string;
    displayName: string;
  }[];
};
