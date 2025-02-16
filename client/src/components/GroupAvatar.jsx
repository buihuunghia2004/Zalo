// import React from "react";

// const GroupAvatar = ({ members }) => {
//   // Giới hạn số lượng avatar hiển thị
//   const maxAvatars = 3;

//   return (
//     <div className="flex items-center">
//       <div className="relative flex -space-x-4">
//         {members.slice(0, maxAvatars).map((member, index) => (
//           <img
//             key={index}
//             src={member.avatarUrl}
//             alt={`Avatar ${index}`}
//             className="h-10 w-10 rounded-full border-2 border-gray-900"
//             style={{
//               position: "relative",
//               zIndex: maxAvatars - index, // Để ảnh sau chồng lên ảnh trước
//             }}
//           />
//         ))}
//         {members.length > maxAvatars && (
//           <div className="h-10 w-10 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-medium border-2 border-gray-900">
//             +{members.length - maxAvatars}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GroupAvatar;

// import React from "react";

// const GroupAvatar = ({ members }) => {
//   // Giới hạn số lượng avatar hiển thị
//   const maxAvatars = 4;

//   return (
//     <div className="relative grid grid-cols-2 grid-rows-2 gap-1 w-12 h-12">
//       {members.slice(0, maxAvatars).map((member, index) => (
//         <img
//           key={index}
//           src={member.avatarUrl}
//           alt={`Avatar ${index}`}
//           className="w-full h-full rounded-full object-cover"
//           style={{
//             gridColumn: index % 2 + 1,
//             gridRow: Math.floor(index / 2) + 1,
//           }}
//         />
//       ))}
//       {members.length > maxAvatars && (
//         <div className="w-full h-full rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-medium">
//           +{members.length - maxAvatars}
//         </div>
//       )}
//     </div>
//   );
// };

// export default GroupAvatar;

// import React from "react";

// const GroupAvatar = ({ members }) => {
//   const maxAvatars = 4; // Giới hạn số lượng avatar hiển thị

//   return (
//     <div className="relative grid grid-cols-2 grid-rows-2 gap-1 w-12 h-12">
//       {members.slice(0, maxAvatars).map((member, index) => (
//         <img
//           key={index}
//           src={member.avatarUrl}
//           alt={`Avatar ${index}`}
//           className="absolute w-8 h-8 rounded-full object-cover border-2 border-gray-900"
//           style={{
//             top: `${Math.floor(index / 2) * 16 - index * 4}%`, // Điều chỉnh chồng lấn theo chiều dọc
//             left: `${(index % 2) * 16 - index * 4}%`, // Điều chỉnh chồng lấn theo chiều ngang
//           }}
//         />
//       ))}
//       {members.length > maxAvatars && (
//         <div className="absolute w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-medium border-2 border-gray-900" 
//              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
//           +{members.length - maxAvatars}
//         </div>
//       )}
//     </div>
//   );
// };

// export default GroupAvatar;

// import React from "react";

// const GroupAvatar = ({ members }) => {
//   const maxAvatars = 4; // Giới hạn số avatar hiển thị

//   return (
//     <div className="relative flex items-center">
//       {members.slice(0, maxAvatars).map((member, index) => (
//         <img
//           key={index}
//           src={member.avatarUrl}
//           alt={`Avatar ${index}`}
//           className="w-8 h-8 rounded-full object-cover border-2 border-gray-900"
//           style={{
//             marginLeft: index === 0 ? 0 : '-8px', // Chồng nhẹ bằng margin âm
//             zIndex: maxAvatars - index, // Đảm bảo thứ tự đè lên
//           }}
//         />
//       ))}
//       {members.length > maxAvatars && (
//         <div
//           className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-medium border-2 border-gray-900"
//           style={{ marginLeft: '-8px', zIndex: 0 }}
//         >
//           +{members.length - maxAvatars}
//         </div>
//       )}
//     </div>
//   );
// };

// export default GroupAvatar;

import React from "react";

const GroupAvatar = ({ roomAvatarUrls }) => {  
  const maxAvatars = 4; 

  return (
    <div className="relative grid grid-cols-2 grid-rows-2 w-12 h-12">
      {roomAvatarUrls.slice(0, maxAvatars).map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Avatar ${index}`}
          className="absolute w-6 h-6 rounded-full object-cover border-2 border-gray-900"
          style={{
            top: `${Math.floor(index / 2) * 50 - index * 1}%`, // Điều chỉnh vị trí chồng nhẹ theo chiều dọc
            left: `${(index % 2) * 50 - index * 1}%`, // Điều chỉnh vị trí chồng nhẹ theo chiều ngang
            zIndex: maxAvatars - index, // Kiểm soát thứ tự hiển thị
          }}
        />
      ))}
    </div>
  );
};

export default GroupAvatar;
