const formatToHoursMinutes = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

// Hàm đổi timestamp ra Giờ:Phút Ngày/Tháng/Năm
const formatToFullDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "Thời gian không hợp lệ";

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

// Hàm tính thời gian đã trôi qua từ một timestamp
const calculateElapsedTime = (timestamp: string | Date): string => {
  if (!timestamp) return "Thời gian không hợp lệ";

  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  if (isNaN(date.getTime())) return "Thời gian không hợp lệ";

  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInSeconds < 60) return `vài giây trước`;
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  if (diffInDays < 7) return `${diffInDays} ngày trước`;

  return formatToFullDate(date.toISOString());
};

// Hàm lấy khoảng thời gian từ một timestamp so với hiện tại
const getTimeDifferenceFromNow = (isoTime: string): string => {
  const targetTime = new Date(isoTime);
  if (isNaN(targetTime.getTime())) return "Thời gian không hợp lệ";

  return calculateElapsedTime(targetTime);
};

export { formatToHoursMinutes, formatToFullDate, getTimeDifferenceFromNow, calculateElapsedTime };
