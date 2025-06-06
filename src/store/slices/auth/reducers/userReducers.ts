import { AuthState } from '../types/state';
import { USER_KEY } from '@/constants';
import { User } from '@/types';

export const userReducers = {
  // For cases where we need to update the user manually
  updateUser: (state: AuthState, action: { payload: Partial<User> }) => {
    if (state.user) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem(USER_KEY, JSON.stringify(state.user));
    }
  },
};
