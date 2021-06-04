import { Box, CircularProgress } from "@material-ui/core";
import React, { ComponentProps } from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

type Props = ComponentProps<typeof Route>;

export const NotAuthenticatedRoute: React.FC<Props> = (props) => {
  const { user, loaded } = useAuth();

  if (!loaded)
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
        <Box marginLeft="8px">Loading ...</Box>
      </Box>
    );
  if (loaded && !!user) {
    return <Redirect to="/" />;
  }

  return <Route {...props} />;
};
