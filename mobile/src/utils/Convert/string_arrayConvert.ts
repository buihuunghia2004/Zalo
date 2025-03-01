// Hàm chuyển mảng thành chuỗi
const arrayToString = (arr?: string[]): string => {
  return arr && arr.length > 0 ? arr.join(',') : '';
};

// Hàm chuyển chuỗi thành mảng
const stringToArray = (str: string): string[] => {
  return str ? str.split(',') : [];
};

export {arrayToString, stringToArray};
