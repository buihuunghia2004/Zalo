import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Chỉ định root element cho React Modal

const LogoutModal = ({ isOpen, onRequestClose, onLogout }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
        <p className="mb-4">Bạn có muốn đăng xuất khỏi Zalo?</p>

        <label className="flex items-center mb-6 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-600"
          />
          <span className="ml-2 text-sm">
            Xóa lịch sử trò chuyện khi đăng xuất
          </span>
        </label>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Không
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
