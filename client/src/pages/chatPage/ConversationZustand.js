import { create } from "zustand";

// Tạo store
const useCounterStore = create((set) => ({
  count: 0, // Giá trị state ban đầu
  increase: () => set((state) => ({ count: state.count + 1 })), // Hàm tăng count
  decrease: () => set((state) => ({ count: state.count - 1 })), // Hàm giảm count
}));

export default useCounterStore;
