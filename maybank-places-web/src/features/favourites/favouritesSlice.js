import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  page: 0,
  totalPages: 0,
  totalElements: 0,
  listStatus: 'idle', // idle | loading | succeeded | failed
  listError: null,
  favouriteIdByPlaceId: {}, // googlePlaceId -> favourite id (null = known not favourite)
  savingPlaceIds: {}, // googlePlaceId -> true while add/remove is in flight
  weatherById: {}, // favourite id -> { status, data, error }
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    fetchPageRequested(state, action) {
      state.page = action.payload ?? state.page;
      state.listStatus = 'loading';
      state.listError = null;
    },
    fetchPageSucceeded(state, action) {
      const { content, page, totalPages, totalElements } = action.payload;
      state.items = content;
      state.page = page;
      state.totalPages = totalPages;
      state.totalElements = totalElements;
      state.listStatus = 'succeeded';
      content.forEach((item) => {
        state.favouriteIdByPlaceId[item.googlePlaceId] = item.id;
      });
    },
    fetchPageFailed(state, action) {
      state.listStatus = 'failed';
      state.listError = action.payload;
    },

    favouriteStatusLoaded(state, action) {
      const { googlePlaceId, favouriteId } = action.payload;
      state.favouriteIdByPlaceId[googlePlaceId] = favouriteId;
    },

    addRequested(state, action) {
      state.savingPlaceIds[action.payload.placeId] = true;
    },
    addSucceeded(state, action) {
      const saved = action.payload;
      delete state.savingPlaceIds[saved.googlePlaceId];
      state.favouriteIdByPlaceId[saved.googlePlaceId] = saved.id;
    },
    addFailed(state, action) {
      delete state.savingPlaceIds[action.payload];
    },

    removeRequested(state, action) {
      state.savingPlaceIds[action.payload.googlePlaceId] = true;
    },
    removeSucceeded(state, action) {
      const { id, googlePlaceId } = action.payload;
      delete state.savingPlaceIds[googlePlaceId];
      state.favouriteIdByPlaceId[googlePlaceId] = null;
      delete state.weatherById[id];
    },
    removeFailed(state, action) {
      delete state.savingPlaceIds[action.payload];
    },

    weatherRequested(state, action) {
      state.weatherById[action.payload] = { status: 'loading', data: null, error: null };
    },
    weatherSucceeded(state, action) {
      const { id, weather } = action.payload;
      state.weatherById[id] = { status: 'succeeded', data: weather, error: null };
    },
    weatherFailed(state, action) {
      const { id, message } = action.payload;
      state.weatherById[id] = { status: 'failed', data: null, error: message };
    },
  },
});

export const {
  fetchPageRequested,
  fetchPageSucceeded,
  fetchPageFailed,
  favouriteStatusLoaded,
  addRequested,
  addSucceeded,
  addFailed,
  removeRequested,
  removeSucceeded,
  removeFailed,
  weatherRequested,
  weatherSucceeded,
  weatherFailed,
} = favouritesSlice.actions;

export default favouritesSlice.reducer;
