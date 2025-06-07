import adminDashboardSlice from './slice';
import * as asyncActions from './actions';

export const { clearError, resetStats } = adminDashboardSlice.actions;
export { asyncActions };
export default adminDashboardSlice.reducer;