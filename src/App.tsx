import React from "react";
import { Board } from "./pages/board/Board";
import { SignUp } from "./pages/signup/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter, Switch } from "react-router-dom";
import { Login } from "./pages/login/Login";
import { Navbar } from "./shared/Navbar/Navbar";
import { Footer } from "./shared/Footer/Footer";
import { AuthenticatedRoute } from "./shared/AuthenticatedRoute/AuthenticatedRoute";
import { ResetPassword } from "./pages/reset-password/ResetPassword";
import { Main } from "./pages/main/Main";
import { NotAuthenticatedRoute } from "./shared/NotAuthenticatedRoute/NotAuthenticatedRoute";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import packageJson from "../package.json";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#4aa0d9",
    },
  },
});

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <NotAuthenticatedRoute path="/signup" component={SignUp} />
        <NotAuthenticatedRoute path="/login" component={Login} />
        <NotAuthenticatedRoute
          path="/reset-password"
          component={ResetPassword}
        />
        <AuthenticatedRoute path="/boards/:id" component={Board} />
        <AuthenticatedRoute exact path="/" component={Main} />
      </Switch>
      <Footer version={packageJson.version} />
    </BrowserRouter>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
};
