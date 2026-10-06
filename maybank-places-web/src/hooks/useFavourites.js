import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addRequested,
  fetchPageRequested,
  removeRequested,
  weatherRequested,
} from '../features/favourites/favouritesSlice';
import {
  selectFavouriteIdForPlace,
  selectFavouritesState,
  selectIsSaving,
} from '../features/favourites/selectors';

/** Paginated favourites list from the Spring Boot API. Loads page 0 on first use. */
export function useFavouritesList() {
  const dispatch = useDispatch();
  const { items, page, totalPages, totalElements, listStatus, listError, weatherById } =
    useSelector(selectFavouritesState);

  useEffect(() => {
    dispatch(fetchPageRequested(0));
  }, [dispatch]);

  return {
    items,
    page,
    totalPages,
    totalElements,
    loading: listStatus === 'loading' && items.length === 0,
    refreshing: listStatus === 'loading',
    error: listError,
    weatherById,
    goToPage: useCallback((nextPage) => dispatch(fetchPageRequested(nextPage)), [dispatch]),
    retry: useCallback(() => dispatch(fetchPageRequested(page)), [dispatch, page]),
    remove: useCallback((item) => dispatch(removeRequested(item)), [dispatch]),
    loadWeather: useCallback((id) => dispatch(weatherRequested(id)), [dispatch]),
  };
}

/** Favourite state + toggle for one Google place (used by the star button). */
export function usePlaceFavourite(place) {
  const dispatch = useDispatch();
  const favouriteId = useSelector(selectFavouriteIdForPlace(place?.placeId));
  const saving = useSelector(selectIsSaving(place?.placeId));
  const isFavourite = favouriteId != null;

  const toggle = useCallback(() => {
    if (!place) return;
    if (isFavourite) {
      dispatch(removeRequested({ id: favouriteId, googlePlaceId: place.placeId, name: place.name }));
    } else {
      dispatch(addRequested(place));
    }
  }, [dispatch, place, isFavourite, favouriteId]);

  return { isFavourite, saving, toggle };
}
