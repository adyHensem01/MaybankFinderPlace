import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import favouritesReducer from '../features/favourites/favouritesSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import searchReducer from '../features/search/searchSlice';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    search: searchReducer,
    favourites: favouritesReducer,
    notifications: notificationsReducer,
  },
  // Redux Saga handles all async work, so the built-in thunk middleware is turned off
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
