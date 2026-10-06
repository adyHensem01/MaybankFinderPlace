import { createSlice, nanoid } from '@reduxjs/toolkit';
import { loadJson } from '../../utils/storage';

export const HISTORY_STORAGE_KEY = 'placeFinder.searchHistory';
const MAX_HISTORY = 50;

const initialState = {
  query: '',
  suggestions: [],
  suggestionsStatus: 'idle', // idle | loading | succeeded | failed
  selectedPlace: null, // { placeId, name, address, lat, lng }
  placeStatus: 'idle',
  error: null,
  history: loadJson(HISTORY_STORAGE_KEY, []), // every place the user searched, newest first
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // user typed in the textbox -> saga (debounced) asks Google for suggestions
    queryChanged(state, action) {
      state.query = action.payload;
      state.suggestionsStatus = action.payload.trim() ? 'loading' : 'idle';
      if (!action.payload.trim()) state.suggestions = [];
    },
    suggestionsLoaded(state, action) {
      state.suggestions = action.payload;
      state.suggestionsStatus = 'succeeded';
    },
    suggestionsFailed(state, action) {
      state.suggestions = [];
      state.suggestionsStatus = 'failed';
      state.error = action.payload;
    },

    // user picked a suggestion -> saga fetches the place details (lat/lng)
    suggestionSelected: {
      reducer(state, action) {
        state.placeStatus = 'loading';
        state.query = action.payload.description;
        state.error = null;
      },
      prepare: (suggestion) => ({ payload: suggestion }),
    },
    placeResolved(state, action) {
      const { place, query } = action.payload;
      state.selectedPlace = place;
      state.placeStatus = 'succeeded';
      state.suggestions = [];
      state.history.unshift({ id: nanoid(), query, ...place, searchedAt: new Date().toISOString() });
      state.history = state.history.slice(0, MAX_HISTORY);
    },
    placeFailed(state, action) {
      state.placeStatus = 'failed';
      state.error = action.payload;
    },

    // show a known place on the map, from history or favourites (no new Google call needed)
    placeShown(state, action) {
      const { placeId, name, address, lat, lng } = action.payload;
      state.selectedPlace = { placeId, name, address, lat, lng };
      state.query = name;
    },
    historyItemRemoved(state, action) {
      state.history = state.history.filter((item) => item.id !== action.payload);
    },
    historyCleared(state) {
      state.history = [];
    },
  },
});

export const {
  queryChanged,
  suggestionsLoaded,
  suggestionsFailed,
  suggestionSelected,
  placeResolved,
  placeFailed,
  placeShown,
  historyItemRemoved,
  historyCleared,
} = searchSlice.actions;

export default searchSlice.reducer;
