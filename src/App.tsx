import React from "react";
import { Main } from "./pages/main/Main";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Main />
    </DndProvider>
  );
};
