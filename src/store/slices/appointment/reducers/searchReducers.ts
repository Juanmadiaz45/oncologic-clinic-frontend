import { AppointmentState } from '../types/state';

export const searchReducers = {
  // Clear search results
  clearSearchResults: (state: AppointmentState) => {
    state.searchResults = [];
  },
};
