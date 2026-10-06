import { call, debounce, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { fetchPlaceDetails, fetchSuggestions } from '../../services/googlePlacesService';
import { saveJson } from '../../utils/storage';
import { notify } from '../notifications/notificationsSlice';
import {
  HISTORY_STORAGE_KEY,
  historyCleared,
  historyItemRemoved,
  placeFailed,
  placeResolved,
  queryChanged,
  suggestionSelected,
  suggestionsFailed,
  suggestionsLoaded,
} from './searchSlice';
import { selectHistory } from './selectors';

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

function* loadSuggestions({ payload: query }) {
  if (query.trim().length < MIN_QUERY_LENGTH) {
    yield put(suggestionsLoaded([]));
    return;
  }
  try {
    const suggestions = yield call(fetchSuggestions, query);
    yield put(suggestionsLoaded(suggestions));
  } catch (error) {
    yield put(suggestionsFailed(error.message));
  }
}

function* resolvePlace({ payload: suggestion }) {
  try {
    const place = yield call(fetchPlaceDetails, suggestion.placeId);
    yield put(placeResolved({ place, query: suggestion.description }));
  } catch (error) {
    yield put(placeFailed(error.message));
    yield put(notify({ severity: 'error', message: `Could not load place: ${error.message}` }));
  }
}

function* persistHistory() {
  const history = yield select(selectHistory);
  yield call(saveJson, HISTORY_STORAGE_KEY, history);
}

export default function* searchSaga() {
  // wait until the user stops typing, then call Google once (older requests are dropped)
  yield debounce(DEBOUNCE_MS, queryChanged.type, loadSuggestions);
  // if the user picks another place quickly, only the latest selection wins
  yield takeLatest(suggestionSelected.type, resolvePlace);
  yield takeEvery([placeResolved.type, historyItemRemoved.type, historyCleared.type], persistHistory);
}
