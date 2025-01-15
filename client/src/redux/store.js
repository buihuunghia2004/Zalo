import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Sử dụng localStorage
import userSlice from './slices/userSlice'
import roomSlice from './slices/roomSlice'
// Cấu hình redux-persist
const persistConfig = {
  key: 'root', // Tên key trong localStorage
  storage,     // Lưu trữ state trong localStorage
  whitelist: ['me'],
};

const rootReducer = combineReducers({
  me: userSlice,
  rooms: roomSlice
});

// Tạo persistedReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Bỏ qua kiểm tra tuần tự hóa của redux-persist
    }),
});

// Tạo persistor
export const persistor = persistStore(store);

export default store;
