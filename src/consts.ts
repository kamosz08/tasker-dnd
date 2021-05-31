import { TaskStatus } from "./types";

export const CARD_TYPE = "CARD";

export const defaultStatuses: TaskStatus[] = [
  {
    name: "To do",
    color: "#EB5A46",
  },
  {
    name: "Open",
    color: "#00C2E0",
  },
  {
    name: "In progress",
    color: "#efd93b",
  },
  {
    name: "Done",
    color: "#74b132",
  },
];
