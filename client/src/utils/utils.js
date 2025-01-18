import moment from 'moment-timezone';

const timeToMmSs = (isoString) => {
  return moment(isoString).tz('Asia/Ho_Chi_Minh').format('HH:mm');
}
function getTimeDifferenceFromNow(isoTime) {
  const targetTime = new Date(isoTime);
  const currentTime = new Date();
  const diffInMilliseconds = currentTime - targetTime;

  // Chuyển đổi sang phút, giờ, ngày
  const diffInSeconds = Math.floor(diffInMilliseconds / (1000));
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInSeconds < 60) return `vài giây trước`;
  if (diffInMinutes < 60) return `${diffInMinutes} phút`;
  if (diffInHours < 24) return `${diffInHours} giờ`;
  if (diffInDays < 7) return `${diffInDays} ngày`;
  const date = new Date(isoTime)
  return date.getDay() + ' / ' + date.getMonth();
}

function autoUpdateTimeDifference(isoTime, callback) {
  const update = () => callback(getTimeDifferenceFromNow(isoTime));
  update(); // Gọi lần đầu tiên để cập nhật ngay
  return setInterval(update, 60 * 1000); // Cập nhật mỗi phút
}

const Utils = {
  timeToMmSs,
  getTimeDifferenceFromNow,
  autoUpdateTimeDifference
}

export default Utils
