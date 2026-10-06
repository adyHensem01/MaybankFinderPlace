import { all, fork } from 'redux-saga/effects';
import favouritesSaga from '../features/favourites/favouritesSaga';
import searchSaga from '../features/search/searchSaga';

export default function* rootSaga() {
  yield all([fork(searchSaga), fork(favouritesSaga)]);
}
