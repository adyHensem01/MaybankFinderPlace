import httpClient from '../../services/httpClient';

const BASE = '/api/v1/favourites';

/** Paginated list (backend returns 10 per page). */
export const getFavourites = (page = 0) =>
  httpClient.get(BASE, { params: { page, sort: 'createdAt,desc' } }).then((res) => res.data);

/** Returns the favourite for a Google place, or null if it is not a favourite. */
export const findFavouriteByPlaceId = (googlePlaceId) =>
  httpClient
    .get(`${BASE}/by-place`, { params: { googlePlaceId } })
    .then((res) => res.data)
    .catch((error) => {
      if (error.status === 404) return null;
      throw error;
    });

export const addFavourite = (place) =>
  httpClient
    .post(BASE, {
      googlePlaceId: place.placeId,
      name: place.name,
      address: place.address,
      latitude: place.lat,
      longitude: place.lng,
    })
    .then((res) => res.data);

export const removeFavourite = (id) => httpClient.delete(`${BASE}/${id}`);

/** Nested call on the backend: our API -> Open-Meteo. */
export const getFavouriteWeather = (id) => httpClient.get(`${BASE}/${id}/weather`).then((res) => res.data);
