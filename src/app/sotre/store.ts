import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/app/slices/authSlice';
import problemReducer from '@/app/slices/problemSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    problem: problemReducer,
  },
});

