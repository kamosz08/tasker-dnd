import { Button, TextField } from "@material-ui/core";
import React from "react";
import Modal from "react-modal";
import styles from "./styles.module.css";

type Props = {
  show: boolean;
  onClose: () => void;
};

Modal.setAppElement("#root");

const customStyles = {
  content: {
    width: 960,
    height: "min-content",
    minHeight: 400,
    maxHeight: 700,
    margin: "auto",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
};

export const TaskAddModal: React.FC<Props> = ({ show, onClose }) => {
  return (
    <Modal isOpen={show} onRequestClose={onClose} style={customStyles}>
      <div className={styles.wrapper}>
        <section className={styles.main}>
          <div className={styles["flex-row"]}>
            <div className={styles["icon-button"]}>X</div>
            <div className={styles["icon-button"]}>X</div>
            <div className={styles["icon-button"]}>X</div>
            <div className={styles["icon-button"]}>X</div>
          </div>
          <div className={styles["flex-row"]}>
            <span className={styles.small}>
              <span className={styles["name"]}>BRD-3212</span>
            </span>
            <span className={styles.small}>
              Created by <span className={styles["name"]}>John Kaszubikx</span>{" "}
              a week ago
            </span>
            <span className={styles.small}>
              Updated by <span className={styles["name"]}>Mayouko</span> 2 hours
              ago
            </span>
          </div>
          <p className={styles.title}>Task title here</p>
          <p className="description">
            Task description here asdasd asdasd asd asdasd as dasdas dasd
          </p>
          <TextField
            name="addComment"
            multiline
            placeholder="Write a comment"
            rows={4}
            className={styles["add-comment"]}
          />
          <Button variant="outlined" color="primary">
            Add comment
          </Button>
          <p className="tabs">Tabs - style me</p>
          <div className="comment-list">Comment list </div>
        </section>
        <section className={styles["right-sidebar"]}>
          <div className={styles["info-card"]}>
            {[1, 2, 3, 4, 5].map((item) => (
              <React.Fragment key={item}>
                <div className="left">left</div>
                <div className="right">right</div>
              </React.Fragment>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
};
