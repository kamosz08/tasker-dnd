import React from "react";
import { Box, TextField } from "@material-ui/core";
import styles from "./styles.module.css";

export const FormikInput = ({ field, form, ...props }: any) => {
  return (
    <Box marginTop="8px">
      <TextField
        {...field}
        {...props}
        variant="outlined"
        label={props.placeholder}
        error={!!form.errors[field.name]}
        helperText={form.errors[field.name]}
        className={styles.input}
      />
    </Box>
  );
};
