const formatToHoursMinutes = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };
  
  
  // Hàm đổi timestamp ra Giờ:Phút Ngày/Tháng/Năm
  const formatToFullDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };


  function calculateElapsedTime(timestamp: string | Date): string {    
    if (!timestamp) {
        return "Thời gian không hợp lệ";
    }

    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;

    if (isNaN(date.getTime())) {
        return "Thời gian không hợp lệ";
    }

    const currentTime = new Date();
    const elapsedMilliseconds = currentTime.getTime() - date.getTime();

    const seconds = Math.floor(elapsedMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return `${seconds} giây trước`;
}

  
  
  export { formatToHoursMinutes, formatToFullDate, calculateElapsedTime };