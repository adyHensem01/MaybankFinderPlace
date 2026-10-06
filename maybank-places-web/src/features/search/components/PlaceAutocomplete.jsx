import PlaceIcon from '@mui/icons-material/Place';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { useApiIsLoaded } from '@vis.gl/react-google-maps';
import usePlaceSearch from '../../../hooks/usePlaceSearch';

/**
 * Autocomplete textbox. Suggestions come from Google Places (via searchSaga) and live in Redux.
 */
export default function PlaceAutocomplete() {
  const googleLoaded = useApiIsLoaded();
  const {
    query,
    suggestions,
    isLoadingSuggestions,
    suggestionsFailed,
    isResolvingPlace,
    changeQuery,
    selectSuggestion,
  } = usePlaceSearch();

  return (
    <Autocomplete
      fullWidth
      options={suggestions}
      value={null}
      inputValue={query}
      onInputChange={(_event, text, reason) => {
        // only react to typing; MUI also fires this when an option is picked or the box resets
        if (reason === 'input' || reason === 'clear') changeQuery(text);
      }}
      onChange={(_event, suggestion) => {
        if (suggestion) selectSuggestion(suggestion);
      }}
      filterOptions={(options) => options} // Google already filtered them
      getOptionLabel={(option) => option.description}
      isOptionEqualToValue={(option, value) => option.placeId === value.placeId}
      loading={isLoadingSuggestions}
      disabled={!googleLoaded}
      noOptionsText={
        suggestionsFailed ? 'Could not load suggestions' : query.trim().length < 2 ? 'Type at least 2 letters' : 'No places found'
      }
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box component="li" key={key} {...optionProps} sx={{ display: 'flex', gap: 1.5 }}>
            <PlaceIcon color="action" fontSize="small" />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                {option.mainText}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap component="div">
                {option.secondaryText}
              </Typography>
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={googleLoaded ? 'Search a place' : 'Loading Google Maps...'}
          placeholder="e.g. Petronas Twin Towers"
          helperText={isResolvingPlace ? 'Loading place details...' : ' '}
        />
      )}
    />
  );
}
