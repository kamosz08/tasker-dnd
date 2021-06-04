import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./styles.module.css";
import logo from "./logo_text_2.png";
import { Box, Button } from "@material-ui/core";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import { Notification } from "../Notification/Notification";
const PATHS_WITHOUT_NAVBAR = ["/signup", "/login", "/reset-password"];

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { push } = useHistory();
  const location = useLocation();
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
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
      <Notification
        handleClose={() => setError("")}
        severity="error"
        message={error}
      />
      <div className={styles.navbar}>
        <Box display="flex" alignItems="center">
          <img
            src={logo}
            className={styles.logo}
            alt="Tasker DND"
            onClick={() => push("/")}
          />
          <Box marginLeft="32px">
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                push("/");
              }}
            >
              Boards
            </Button>
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                push("/");
              }}
            >
              Invitations
            </Button>
          </Box>
        </Box>
        {!!user && (
          <Box display="flex" alignItems="center">
            <Box marginRight="12px" fontSize={14} color="rgb(35 42 95)">
              {user.displayName} ({user.email})
            </Box>
            <Button
              startIcon={<MeetingRoomIcon />}
              variant="text"
              color="primary"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </Box>
        )}
      </div>
    </div>
  );
};
