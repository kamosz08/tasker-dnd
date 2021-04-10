import { CardItem } from "./types";

export const CARD_TYPE = "CARD";

export const DUMMY_DATA: CardItem[] = [
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

export const statuses = [
  {
    status: "open",
    color: "#EB5A46",
  },
  {
    status: "in progress",
    color: "#00C2E0",
  },
  {
    status: "in review",
    color: "#C377E0",
  },
  {
    status: "done",
    color: "#3981DE",
  },
];
