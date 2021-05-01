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
};
