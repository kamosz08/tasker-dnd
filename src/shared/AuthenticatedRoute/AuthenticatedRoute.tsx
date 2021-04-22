import React, { ComponentProps } from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

type Props = ComponentProps<typeof Route>;

export const AuthenticatedRoute: React.FC<Props> = (props) => {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Route {...props} />;
};
