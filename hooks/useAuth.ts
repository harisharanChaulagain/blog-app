import {  useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setCredentials, logout, setLoading, setError } from '@/store/authSlice';
import { RootState } from '@/store/store';
import { authService } from '@/services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      try {
        const response = await authService.login(email, password);
        dispatch(setCredentials({
          user: response.user,
          token: response.token,
        }));
        router.push('/dashboard');
        return { success: true };
      } catch (err: any) {
        dispatch(setError(err.message || 'Login failed'));
        return { success: false, error: err.message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      try {
        const response = await authService.register(name, email, password);
        dispatch(setCredentials({
          user: response.user,
          token: response.token,
        }));
        router.push('/dashboard');
        return { success: true };
      } catch (err: any) {
        dispatch(setError(err.message || 'Registration failed'));
        return { success: false, error: err.message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, router]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
    router.push('/login');
  }, [dispatch, router]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout: logoutUser,
  };
};