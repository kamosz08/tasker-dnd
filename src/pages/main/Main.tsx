import React from "react";
import { Box, Divider } from "@material-ui/core";
import { Boards } from "./components/Boards/Boards";

export const Main: React.FC = () => {
  const hasNotification = false;

  return (
    <Box width="100%" display="flex" justifyContent="center">
      <Box display="flex" flexWrap="wrap" width={960} padding="8px 32px">
        <Box width="100%">
          {hasNotification && (
            <Box marginBottom="16px">
              <Divider variant="fullWidth" />
            </Box>
          )}
          <Boards />
        </Box>
      </Box>
    </Box>
  );
};
