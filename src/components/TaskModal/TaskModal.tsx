import React from "react";
import Modal from "react-modal";
import { CardItem } from "../../types";
import { Button } from "../../ui/Button/Button";
import { Textarea } from "../../ui/Textarea/Textarea";
import styles from "./styles.module.css";

type Props = {
  show: boolean;
  item: CardItem;
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

export const TaskModal: React.FC<Props> = ({ show, onClose, item }) => {
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
          <p className={styles.title}>{item.title}</p>
          <p className="description">{item.description}</p>
          <Textarea
            name="addComment"
            placeholder="Write a comment"
            rows={4}
            className={styles["add-comment"]}
          />
          <Button className={styles["add-comment-button"]}>Add comment</Button>
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
