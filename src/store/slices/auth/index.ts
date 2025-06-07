import authSlice from './slice';
import * as asyncActions from './actions';

export const { clearError, setError, updateUser } = authSlice.actions;
export { asyncActions as authAsyncActions };
export default authSlice.reducer;
