import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import withLoading from '../../../hoc/withLoading';
import WeatherBadge from './WeatherBadge';

/** Presentational list of favourites; all data and actions come in through props. */
export function FavouritesList({ items, weatherById, onSelect, onRemove, onLoadWeather }) {
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No favourites yet. Search a place and tap the ☆ to save it.
      </Typography>
    );
  }

  return (
    <List dense disablePadding>
      {items.map((item) => (
        <ListItem
          key={item.id}
          disablePadding
          secondaryAction={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WeatherBadge weather={weatherById[item.id]} onLoad={() => onLoadWeather(item.id)} />
              <Tooltip title="Remove from favourites">
                <IconButton edge="end" size="small" onClick={() => onRemove(item)} aria-label={`Remove ${item.name}`}>
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          }
          sx={{ pr: 15 }}
        >
          <ListItemButton onClick={() => onSelect(item)}>
            <ListItemText
              primary={item.name}
              secondary={item.address}
              slotProps={{ primary: { noWrap: true }, secondary: { noWrap: true } }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

const FavouritesListWithLoading = withLoading(FavouritesList);
export default FavouritesListWithLoading;
