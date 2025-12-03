import { useEffect } from 'react';
import { useAppDispatch } from '../State/Store';

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const isTokenExpired = (token: string) => {
  try {
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/**
 * Hook tự động logout khi token hết hạn và không có refresh token
 */
export const useAuthChecker = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check mỗi 5 giây
    const interval = setInterval(() => {
      const jwt = localStorage.getItem('jwt');
      const refreshToken = localStorage.getItem('refreshToken');

      // Nếu có JWT nhưng hết hạn, và không có refresh token
      if (jwt && isTokenExpired(jwt) && !refreshToken) {
        console.log('🔴 Token expired without refresh token - Logging out');
        dispatch({ type: 'auth/logoutSync' });
        window.location.href = '/';
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [dispatch]);
};