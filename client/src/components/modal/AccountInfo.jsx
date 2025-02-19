// import React from "react";
// import Modal from "react-modal";

// Modal.setAppElement("#root");

// export const AccountInfoModal = ({
//   isOpen, setIsOpen
// }) => {
//   const closeModal = () => setIsOpen(false);

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={closeModal}
//       overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//       className="fixed inset-0 flex items-center justify-center p-4"
//     >
//       <div className="bg-gray-800 text-white rounded-lg w-full max-w-md relative">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center p-4 border-b border-gray-700">
//           <h2 className="text-lg font-semibold">Thông tin tài khoản</h2>
//           <button
//             onClick={closeModal}
//             className="text-2xl font-bold hover:text-gray-400"
//           >
//             &times;
//           </button>
//         </div>

//         {/* Profile Image */}
//         <div className="flex justify-center mt-4">
//           <img
//             src="https://via.placeholder.com/300"
//             alt="Avatar"
//             className="w-32 h-32 rounded-full object-cover"
//           />
//         </div>

//         {/* User Name */}
//         <div className="text-center mt-4">
//           <h3 className="text-xl font-semibold">Nhân</h3>
//           <div className="flex justify-center space-x-2 mt-2">
//             {/* <button disabled className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md">
//               Gọi điện
//             </button> */}
//             <button onClick={()=>{
              
//             }} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
//               Nhắn tin
//             </button>
//           </div>
//         </div>

//         {/* User Information */}
//         <div className="p-4 space-y-2">
//           <div className="flex justify-between border-b border-gray-700 pb-2">
//             <span className="text-gray-400">Giới tính</span>
//             <span>Nam</span>
//           </div>
//           <div className="flex justify-between border-b border-gray-700 pb-2">
//             <span className="text-gray-400">Ngày sinh</span>
//             <span>23 tháng 12, 2003</span>
//           </div>
//           <div className="flex justify-between pb-2">
//             <span className="text-gray-400">Điện thoại</span>
//             <span>********</span>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-4 bg-gray-700 text-center rounded-b-lg">
//           <p className="text-gray-400">Chưa có ảnh nào được chia sẻ</p>
//         </div>
//       </div>
//     </Modal>
//   );
// };

import React from "react";
import Modal from "react-modal";
import { FaPhone, FaCommentDots, FaTimes } from "react-icons/fa";

Modal.setAppElement("#root");

export const AccountInfoModal = ({ isOpen, setIsOpen }) => {
  const closeModal = () => setIsOpen(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      className="outline-none"
    >
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-lg overflow-hidden">
        {/* Header */}
        <div className="relative bg-blue-600 p-4 text-center text-white">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-lg"
          >
            <FaTimes />
          </button>
          <h2 className="text-lg font-semibold">Thông tin tài khoản2</h2>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mt-4">
          <img
            src="https://via.placeholder.com/300"
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
          <h3 className="mt-2 text-lg font-semibold">Nhân</h3>
          <p className="text-gray-500">Hoạt động 10 phút trước</p>
        </div>

        {/* Hành động */}
        <div className="flex justify-center mt-4 space-x-4">
          <button className="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-lg">
            <FaPhone className="text-blue-600" />
            <span className="text-blue-600">Gọi điện</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
            <FaCommentDots />
            <span className="text-white">Nhắn tin</span>
          </button>
        </div>

        {/* Thông tin chi tiết */}
        <div className="mt-4 px-6 py-4 bg-gray-100 rounded-lg mx-4">
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-500">Giới tính</span>
            <span>Nam</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-500">Ngày sinh</span>
            <span>23 tháng 12, 2003</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Điện thoại</span>
            <span>********</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-gray-400">
          <p>Chưa có ảnh nào được chia sẻ</p>
        </div>
      </div>
    </Modal>
  );
};
