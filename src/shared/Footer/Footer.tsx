import React from "react";
import { Box, Typography } from "@material-ui/core";
import styles from "./styles.module.css";

type Props = {
  version: string;
};

export const Footer: React.FC<Props> = ({ version }) => {
  return (
    <div className={styles.wrapper}>
      <Box className={styles.footer}>
        <Typography color="textSecondary">v.{version}</Typography>
      </Box>
    </div>
  );
};
