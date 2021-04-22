import React from "react";
import { Board } from "./pages/board/Board";
import { SignUp } from "./pages/signup/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Login } from "./pages/login/Login";
import { Navbar } from "./shared/Navbar/Navbar";
import { AuthenticatedRoute } from "./shared/AuthenticatedRoute/AuthenticatedRoute";
import { ResetPassword } from "./pages/reset-password/ResetPassword";

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/reset-password" component={ResetPassword} />
        <AuthenticatedRoute exact path="/" component={Board} />
      </Switch>
    </BrowserRouter>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};
