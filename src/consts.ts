import { TaskStatus, TaskType } from "./types";

export const CARD_TYPE = "CARD";

export const DUMMY_DATA: TaskType[] = [
  {
    id: 1,
    status: "open",
    title: "Human Interest Form",
    description: "Fill out human interest distribution form",
  },
  {
    id: 2,
    status: "open",
    title: "Purchase present",
    description: "Get an anniversary gift",
  },
  {
    id: 3,
    status: "open",
    title: "Invest in investments",
    description: "Call the bank to talk about investments",
  },
  {
    id: 4,
    status: "open",
    title: "Daily reading",
    description: "Finish reading Intro to UI/UX",
  },
];

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
