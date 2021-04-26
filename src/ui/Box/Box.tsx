import React from "react";

type Props = React.CSSProperties & { children: React.ReactNode };

export const Box: React.FC<Props> = ({ children, ...props }) => {
  return <div style={props}>{children}</div>;
};
