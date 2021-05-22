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
  createdAt: firebase.firestore.Timestamp;
  lastUpdated: firebase.firestore.Timestamp;
  updatedBy: SimpleUserType;
  labels: string[];
  assignee: SimpleUserType | null;
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
  createdBy: SimpleUserType;
  participants: SimpleUserType[];
  labels: { name: string; color: string }[];
};
