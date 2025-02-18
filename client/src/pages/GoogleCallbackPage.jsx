import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMe } from '../redux/slices/userSlice';
import { setAuth } from '../redux/slices/authSlice';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    // Lấy token từ URL
    const queryParams = new URLSearchParams(window.location.search);
    
    const accessToken = queryParams.get('access_token');
    const refreshToken = queryParams.get('refresh_token');
    const id = queryParams.get('id');
    const expires = queryParams.get('expires');

    if (accessToken && refreshToken && id && expires) {
      dispatch(setAuth({
        accessToken,
        refreshToken,
        id,
        expires
      }))

      dispatch(getMe())

      // Điều hướng đến trang chính
      navigate('/');
    }
  }, [navigate]);

  return <p>Đang xử lý đăng nhập...</p>;
};

export default GoogleCallbackPage;
