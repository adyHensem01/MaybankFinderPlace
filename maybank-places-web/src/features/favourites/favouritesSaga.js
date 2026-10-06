import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { notify } from '../notifications/notificationsSlice';
import { placeShown, placeResolved } from '../search/searchSlice';
import {
  addFavourite,
  findFavouriteByPlaceId,
  getFavourites,
  getFavouriteWeather,
  removeFavourite,
} from './favouritesApi';
import {
  addFailed,
  addRequested,
  addSucceeded,
  favouriteStatusLoaded,
  fetchPageFailed,
  fetchPageRequested,
  fetchPageSucceeded,
  removeFailed,
  removeRequested,
  removeSucceeded,
  weatherFailed,
  weatherRequested,
  weatherSucceeded,
} from './favouritesSlice';
import { selectFavouriteItems, selectFavouritesPage } from './selectors';

function* fetchPage({ payload: page = 0 }) {
  try {
    const result = yield call(getFavourites, page);
    yield put(fetchPageSucceeded(result));
  } catch (error) {
    yield put(fetchPageFailed(error.message));
  }
}

/** When a place is shown on the map, ask the backend whether it is already a favourite. */
function* checkFavouriteStatus(action) {
  const placeId = action.type === placeResolved.type ? action.payload.place.placeId : action.payload.placeId;
  try {
    const favourite = yield call(findFavouriteByPlaceId, placeId);
    yield put(favouriteStatusLoaded({ googlePlaceId: placeId, favouriteId: favourite?.id ?? null }));
  } catch {
    // backend down: the star button stays clickable, the add call will report the error
  }
}

function* add({ payload: place }) {
  try {
    const saved = yield call(addFavourite, place);
    yield put(addSucceeded(saved));
    yield put(notify({ severity: 'success', message: `"${saved.name}" added to favourites` }));
    yield put(fetchPageRequested(0)); // newest first, so the new item is on page 0
  } catch (error) {
    yield put(addFailed(place.placeId));
    if (error.status === 409) {
      // already saved (e.g. from another tab): sync the star instead of showing an error
      const existing = yield call(findFavouriteByPlaceId, place.placeId);
      yield put(favouriteStatusLoaded({ googlePlaceId: place.placeId, favouriteId: existing?.id ?? null }));
      yield put(notify({ severity: 'info', message: `"${place.name}" is already a favourite` }));
    } else {
      yield put(notify({ severity: 'error', message: error.message }));
    }
  }
}

function* remove({ payload }) {
  const { id, googlePlaceId, name } = payload;
  try {
    yield call(removeFavourite, id);
    yield put(removeSucceeded({ id, googlePlaceId }));
    yield put(notify({ severity: 'success', message: `"${name}" removed from favourites` }));

    // reload the current page; step back if we just removed its last item
    const page = yield select(selectFavouritesPage);
    const items = yield select(selectFavouriteItems);
    const onlyItemOnPage = items.length === 1 && items[0].id === id;
    yield put(fetchPageRequested(onlyItemOnPage && page > 0 ? page - 1 : page));
  } catch (error) {
    yield put(removeFailed(googlePlaceId));
    yield put(notify({ severity: 'error', message: error.message }));
  }
}

function* loadWeather({ payload: id }) {
  try {
    const result = yield call(getFavouriteWeather, id);
    yield put(weatherSucceeded({ id, weather: result.weather }));
  } catch (error) {
    yield put(weatherFailed({ id, message: error.message }));
  }
}

export default function* favouritesSaga() {
  yield takeLatest(fetchPageRequested.type, fetchPage);
  yield takeLatest([placeResolved.type, placeShown.type], checkFavouriteStatus);
  yield takeEvery(addRequested.type, add);
  yield takeEvery(removeRequested.type, remove);
  yield takeEvery(weatherRequested.type, loadWeather);
}
