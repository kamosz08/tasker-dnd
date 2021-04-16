import React from "react";
import styles from "./styles.module.css";

type Props = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export const Textarea: React.FC<Props> = ({ className, ...props }) => {
  return <textarea className={`${styles.textarea} ${className}`} {...props} />;
};
