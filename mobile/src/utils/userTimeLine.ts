import localStorage from '~/utils/localStorage';

// Khai báo key để lưu trữ
const LAST_ONLINE_KEY = 'lastOnline';
const LAST_OFFLINE_KEY = 'lastOffline';

// Hàm set thời gian bắt đầu online
const setLastOnline = async (): Promise<void> => {
  const timestamp = Date.now();
  await localStorage.setItem(LAST_ONLINE_KEY, JSON.stringify(timestamp));
  console.log('Saved lastOnline:', timestamp);
};

// Hàm set thời gian bắt đầu offline
const setLastOffline = async (): Promise<void> => {
  const timestamp = Date.now();
  await localStorage.setItem(LAST_OFFLINE_KEY, JSON.stringify(timestamp));
  console.log('Saved lastOffline:', timestamp);
};

// Hàm get thời gian bắt đầu online
const getLastOnline = async (): Promise<number | null> => {
  const value = await localStorage.getItem(LAST_ONLINE_KEY);
  return value ? JSON.parse(value) : null;
};

// Hàm get thời gian bắt đầu offline
const getLastOffline = async (): Promise<number | null> => {
  const value = await localStorage.getItem(LAST_OFFLINE_KEY);
  return value ? JSON.parse(value) : null;
};

// Hàm xóa trạng thái (tuỳ chọn)
const clearStatus = async (): Promise<void> => {
  await localStorage.removeItem(LAST_ONLINE_KEY);
  await localStorage.removeItem(LAST_OFFLINE_KEY);
  console.log('Cleared online/offline status');
};

const userStatusService = { setLastOnline, setLastOffline, getLastOnline, getLastOffline, clearStatus };

export default userStatusService;
