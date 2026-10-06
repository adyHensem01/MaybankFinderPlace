import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { queryChanged, suggestionSelected } from '../features/search/searchSlice';
import {
  selectPlaceStatus,
  selectQuery,
  selectSuggestions,
  selectSuggestionsStatus,
} from '../features/search/selectors';

/** Everything the autocomplete textbox needs, without the component knowing about Redux. */
export default function usePlaceSearch() {
  const dispatch = useDispatch();
  const query = useSelector(selectQuery);
  const suggestions = useSelector(selectSuggestions);
  const suggestionsStatus = useSelector(selectSuggestionsStatus);
  const placeStatus = useSelector(selectPlaceStatus);

  const changeQuery = useCallback((text) => dispatch(queryChanged(text)), [dispatch]);
  const selectSuggestion = useCallback((suggestion) => dispatch(suggestionSelected(suggestion)), [dispatch]);

  return {
    query,
    suggestions,
    isLoadingSuggestions: suggestionsStatus === 'loading',
    suggestionsFailed: suggestionsStatus === 'failed',
    isResolvingPlace: placeStatus === 'loading',
    changeQuery,
    selectSuggestion,
  };
}
