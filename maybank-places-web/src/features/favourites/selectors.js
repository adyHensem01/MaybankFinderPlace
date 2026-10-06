export const selectFavouritesState = (state) => state.favourites;
export const selectFavouriteItems = (state) => state.favourites.items;
export const selectFavouritesPage = (state) => state.favourites.page;
export const selectWeatherById = (state) => state.favourites.weatherById;

/** undefined = not checked yet, null = not a favourite, number = favourite id */
export const selectFavouriteIdForPlace = (placeId) => (state) =>
  placeId ? state.favourites.favouriteIdByPlaceId[placeId] : undefined;

export const selectIsSaving = (placeId) => (state) => Boolean(placeId && state.favourites.savingPlaceIds[placeId]);
