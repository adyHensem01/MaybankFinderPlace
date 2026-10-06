export const selectQuery = (state) => state.search.query;
export const selectSuggestions = (state) => state.search.suggestions;
export const selectSuggestionsStatus = (state) => state.search.suggestionsStatus;
export const selectSelectedPlace = (state) => state.search.selectedPlace;
export const selectPlaceStatus = (state) => state.search.placeStatus;
export const selectSearchError = (state) => state.search.error;
export const selectHistory = (state) => state.search.history;
