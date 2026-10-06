# Place Finder (React)

Search places with Google Places Autocomplete, show them on a map, keep a history of every search, and save favourites to MSSQL through the Spring Boot API in `../maybankAssestment`.

## Tech

| Need | Choice |
|---|---|
| Build | Vite + React 19 (JavaScript, functional components, hooks) |
| State | Redux Toolkit |
| Middleware | **Redux Saga** (debounced search, API calls, persistence) |
| UI | Material UI |
| Maps | `@vis.gl/react-google-maps` + Places API (New) |
| HTTP | axios |

## Run

1. Copy `.env.example` to `.env` and fill it in:
   ```
   VITE_GOOGLE_MAPS_API_KEY=<key with Maps JavaScript API + Places API (New) enabled>
   VITE_API_BASE_URL=http://localhost:8080
   ```
2. Start the Spring Boot API (see `../maybankAssestment`).
3. Start the app:
   ```
   npm install
   npm run dev
   ```
   Open http://localhost:5173

Without a Google key the page still loads and shows the favourites list, with a warning in place of the search and map.

## Structure (feature-first)

```
src/
├── app/                 store.js (RTK + saga middleware), rootSaga.js
├── features/
│   ├── search/          searchSlice, searchSaga, selectors, PlaceAutocomplete, SearchHistoryList
│   ├── map/             PlaceMap (marker + info window, follows the selected place)
│   ├── favourites/      favouritesSlice, favouritesSaga, favouritesApi, FavouriteButton, FavouritesPanel, FavouritesList, WeatherBadge
│   └── notifications/   snackbar messages raised by sagas
├── hooks/               usePlaceSearch, useFavourites (custom hooks)
├── hoc/                 withLoading (higher-order component)
├── services/            httpClient (axios), googlePlacesService (Google SDK wrapper)
├── theme/               MUI theme
└── utils/               localStorage helpers
```

## How it flows

```
type "klcc" ─► queryChanged ─► searchSaga (debounce 300ms) ─► Google AutocompleteSuggestion ─► suggestionsLoaded
pick one    ─► suggestionSelected ─► searchSaga ─► Google Place.fetchFields ─► placeResolved
                                                     ├─► map pans + marker, history entry added (saved to localStorage)
                                                     └─► favouritesSaga ─► GET /api/v1/favourites/by-place (star state)
tap ☆       ─► addRequested ─► favouritesSaga ─► POST /api/v1/favourites ─► addSucceeded ─► reload page 0 + snackbar
tap ☁       ─► weatherRequested ─► GET /api/v1/favourites/{id}/weather (backend calls Open-Meteo)
```

Google objects are not serialisable, so they stay inside `googlePlacesService.js`. Redux only stores plain data.
