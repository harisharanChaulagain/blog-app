'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, setLoading } from '@/store/authSlice';

export const useInitializeAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token) {
      dispatch(
        setCredentials({
          token,
          user: user ? JSON.parse(user) : null,
        })
      );
    } else {
      dispatch(setLoading(false));
    }
  }, [dispatch]);
};
