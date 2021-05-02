import React from "react";
import { Box, TextField } from "@material-ui/core";
import styles from "./styles.module.css";

export const FormikInput = ({ field, form, ...props }: any) => {
  const showError = !!form.errors[field.name] && !!form.touched[field.name];

  return (
    <Box marginTop="8px">
      <TextField
        {...field}
        {...props}
        variant="outlined"
        label={props.placeholder}
        error={showError}
        helperText={showError && form.errors[field.name]}
        className={styles.input}
      />
    </Box>
  );
};
