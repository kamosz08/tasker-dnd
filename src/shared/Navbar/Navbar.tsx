import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./styles.module.css";
import logo from "./logo_text.png";
import { Box, Button } from "@material-ui/core";

const PATHS_WITHOUT_NAVBAR = ["/signup", "/login", "/reset-password"];

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { push } = useHistory();
  const location = useLocation();
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      push("/login");
    } catch (error) {
      if (typeof error.message === "string") {
        setError(error.message);
      } else {
        setError("Failed to log out");
      }
    }
  };

  if (
    location?.pathname &&
    PATHS_WITHOUT_NAVBAR.some((path) => path === location.pathname)
  ) {
    return null;
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.navbar}>
        {!!error && <p>{error}</p>}
        <img
          src={logo}
          className={styles.logo}
          alt="Tasker DND"
          onClick={() => push("/")}
        />
        {!!user && (
          <Box display="flex" alignItems="center">
            <Box marginRight="12px" fontSize={14} color="rgb(35 42 95)">
              {user.email}
            </Box>
            <Button variant="outlined" color="primary" onClick={handleLogout}>
              Log out
            </Button>
          </Box>
        )}
      </div>
    </div>
  );
};
