import medicalHistorySlice from './slice';
import * as asyncActions from './actions';

export const { clearError, clearMedicalHistory, setCurrentPatient } = medicalHistorySlice.actions;
export { asyncActions };
export default medicalHistorySlice.reducer;