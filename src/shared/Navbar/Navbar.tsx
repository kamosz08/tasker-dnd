import React, { useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./styles.module.css";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { push } = useHistory();
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

  return (
    <div className={styles.wrapper}>
      {!!error && <p>{error}</p>}
      Tasker DND
      {!!user && <button onClick={handleLogout}>Log out</button>}
    </div>
  );
};
