import React from "react";
import { Main } from "./pages/main/Main";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SignUp } from "./pages/login/SignUp";
import { AuthProvider } from "./contexts/AuthContext";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        {/* <Main /> */}
        <SignUp />
      </DndProvider>
    </AuthProvider>
  );
};
