import React, { ComponentProps } from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

type Props = ComponentProps<typeof Route>;

export const AuthenticatedRoute: React.FC<Props> = (props) => {
  const { user, loaded } = useAuth();

  if (!loaded) return <>Loading...</>;
  if (loaded && !user) {
    return <Redirect to="/login" />;
  }

  return <Route {...props} />;
};
