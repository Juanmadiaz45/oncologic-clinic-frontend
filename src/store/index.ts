// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import appointmentReducer from './slices/appointment'; // Import from index.ts
import authReducer from './slices/auth';
import adminDashboardReducer from './slices/adminDashboard';
import medicalHistoryReducer from './slices/medicalHistory';
import { setReduxStore } from '@/services/api/client';

export const store = configureStore({
  reducer: {
    appointment: appointmentReducer, // Use the imported reducer
    auth: authReducer,
    adminDashboard: adminDashboardReducer,
    medicalHistory: medicalHistoryReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Set the store in API client for interceptors
setReduxStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
