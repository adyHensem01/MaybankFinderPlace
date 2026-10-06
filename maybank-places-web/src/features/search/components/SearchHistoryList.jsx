import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import HistoryIcon from '@mui/icons-material/History';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { historyCleared, historyItemRemoved, placeShown } from '../searchSlice';
import { selectHistory, selectSelectedPlace } from '../selectors';

const timeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' });

/** Every place the user has searched, newest first (kept in Redux, persisted to localStorage). */
export default function SearchHistoryList() {
  const dispatch = useDispatch();
  const history = useSelector(selectHistory);
  const selectedPlace = useSelector(selectSelectedPlace);

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={<HistoryIcon color="action" />}
        title={`Search history (${history.length})`}
        slotProps={{ title: { variant: 'subtitle1', fontWeight: 600 } }}
        action={
          history.length > 0 && (
            <Button size="small" onClick={() => dispatch(historyCleared())}>
              Clear
            </Button>
          )
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {history.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Places you search will appear here.
          </Typography>
        ) : (
          <List dense disablePadding sx={{ maxHeight: 260, overflowY: 'auto' }}>
            {history.map((item) => (
              <ListItem
                key={item.id}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    aria-label={`Remove ${item.name} from history`}
                    onClick={() => dispatch(historyItemRemoved(item.id))}
                  >
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={selectedPlace?.placeId === item.placeId}
                  onClick={() => dispatch(placeShown(item))}
                >
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.address ?? ''} · ${timeFormat.format(new Date(item.searchedAt))}`}
                    slotProps={{ primary: { noWrap: true }, secondary: { noWrap: true } }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
