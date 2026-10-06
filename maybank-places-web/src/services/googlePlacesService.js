/**
 * Thin wrapper around Google Places API (New) in the Maps JavaScript API.
 * Google objects are not serialisable, so they stay here and only plain data goes into Redux.
 *
 * Docs: https://developers.google.com/maps/documentation/javascript/place-autocomplete-data
 */

let placesLibrary = null;
let sessionToken = null; // groups keystrokes + the final details call into one billing session
const predictionsById = new Map();

async function loadPlacesLibrary() {
  if (!window.google?.maps?.importLibrary) {
    throw new Error('Google Maps is not loaded yet');
  }
  if (!placesLibrary) {
    placesLibrary = await window.google.maps.importLibrary('places');
  }
  return placesLibrary;
}

/** Returns [{ placeId, description, mainText, secondaryText }] for the typed text. */
export async function fetchSuggestions(input) {
  const { AutocompleteSuggestion, AutocompleteSessionToken } = await loadPlacesLibrary();
  if (!sessionToken) {
    sessionToken = new AutocompleteSessionToken();
  }

  const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({ input, sessionToken });

  predictionsById.clear();
  return suggestions
    .filter((suggestion) => suggestion.placePrediction)
    .map(({ placePrediction }) => {
      predictionsById.set(placePrediction.placeId, placePrediction);
      const description = placePrediction.text.toString();
      return {
        placeId: placePrediction.placeId,
        description,
        mainText: placePrediction.mainText?.toString() ?? description,
        secondaryText: placePrediction.secondaryText?.toString() ?? '',
      };
    });
}

/** Returns { placeId, name, address, lat, lng } for a selected suggestion. */
export async function fetchPlaceDetails(placeId) {
  const { Place } = await loadPlacesLibrary();
  const prediction = predictionsById.get(placeId);
  const place = prediction ? prediction.toPlace() : new Place({ id: placeId });

  await place.fetchFields({ fields: ['id', 'displayName', 'formattedAddress', 'location'] });
  sessionToken = null; // the session ends once details are fetched

  return {
    placeId: place.id,
    name: place.displayName,
    address: place.formattedAddress,
    lat: place.location.lat(),
    lng: place.location.lng(),
  };
}
