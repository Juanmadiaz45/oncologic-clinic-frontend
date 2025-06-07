import { AuthState } from '../types/state';

export const errorReducers = {
  clearError: (state: AuthState) => {
    state.error = null;
  },
  setError: (state: AuthState, action: { payload: string }) => {
    state.error = action.payload;
  },
};
