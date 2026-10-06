import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { usePlaceFavourite } from '../../../hooks/useFavourites';

/** Star toggle: saves / removes the place through the Spring Boot API. */
export default function FavouriteButton({ place }) {
  const { isFavourite, saving, toggle } = usePlaceFavourite(place);

  const label = !place ? 'Search a place first' : isFavourite ? 'Remove from favourites' : 'Add to favourites';

  return (
    <Tooltip title={label}>
      {/* span keeps the tooltip working while the button is disabled */}
      <span>
        <IconButton onClick={toggle} disabled={!place || saving} aria-label={label} size="large">
          {saving ? (
            <CircularProgress size={24} />
          ) : isFavourite ? (
            <StarIcon sx={{ color: 'warning.main' }} fontSize="inherit" />
          ) : (
            <StarBorderIcon fontSize="inherit" />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}
