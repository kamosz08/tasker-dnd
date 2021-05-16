import firebase from "firebase/app";

export type UserType = {
  id: string;
  email: string;
  displayName: string;
};

export type TaskType = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdBy: {
    userId: string;
    displayName: string;
  };
  createdAt: firebase.firestore.Timestamp;
  lastUpdated: firebase.firestore.Timestamp;
  updatedBy: {
    userId: string;
    displayName: string;
  };
  labels: string[];
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
  labels: { name: string; color: string }[];
};
