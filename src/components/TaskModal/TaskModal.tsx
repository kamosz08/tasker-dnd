import React from "react";
import Modal from "react-modal";
import { CardItem } from "../../types";

type Props = {
  show: boolean;
  item: CardItem;
  onClose: () => void;
};

Modal.setAppElement("#root");

export const TaskModal: React.FC<Props> = ({ show, onClose, item }) => {
  return (
    <Modal isOpen={show} onRequestClose={onClose}>
      <div>
        Some header
        <button onClick={onClose}>X</button>
      </div>
      <div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </Modal>
  );
};
