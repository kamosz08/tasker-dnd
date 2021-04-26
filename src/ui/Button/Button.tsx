import React from "react";
import styles from "./styles.module.css";

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { children: React.ReactNode; buttonType: "primary" | "outlined" };

export const Button: React.FC<Props> = ({
  children,
  className,
  buttonType,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[buttonType]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
