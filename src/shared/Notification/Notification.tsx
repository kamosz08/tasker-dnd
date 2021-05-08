import { Snackbar } from "@material-ui/core";
import Alert, { AlertProps } from "@material-ui/lab/Alert";
import React from "react";

type Props = {
  handleClose: () => void;
  severity: AlertProps["severity"];
  message: string;
};

export const Notification: React.FC<Props> = ({
  handleClose,
  severity,
  message,
}) => {
  return (
    <Snackbar
      open={!!message}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};
