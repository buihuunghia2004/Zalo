import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Chỉ định root element cho React Modal

const MessageModal = ({ isOpen, onRequestClose, message }) => {
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed opacity-90 inset-0 flex items-center justify-center outline-none pointer-events-none"
      overlayClassName="fixed inset-0 bg-transparen pointer-events-none"
    >
      <div className="bg-dark-2 text-white p-6 rounded-lg shadow-lg">
        <p className="text-lg text-white">{message}</p>
      </div>
    </Modal>
  );
};

export default MessageModal;
