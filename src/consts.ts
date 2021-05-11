import { TaskStatus } from "./types";

export const CARD_TYPE = "CARD";

export const statuses: TaskStatus[] = [
  {
    name: "to do",
    color: "#EB5A46",
  },
  {
    name: "open",
    color: "#00C2E0",
  },
  {
    name: "in progress",
    color: "#efd93b",
  },
  {
    name: "done",
    color: "#74b132",
  },
];
