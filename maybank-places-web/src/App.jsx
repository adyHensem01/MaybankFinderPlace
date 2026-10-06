import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { Alert, AppBar, Box, Container, Paper, Stack, Toolbar, Typography } from '@mui/material';
import { APIProvider } from '@vis.gl/react-google-maps';
import { useSelector } from 'react-redux';
import FavouriteButton from './features/favourites/components/FavouriteButton';
import FavouritesPanel from './features/favourites/components/FavouritesPanel';
import PlaceMap from './features/map/components/PlaceMap';
import NotificationSnackbar from './features/notifications/NotificationSnackbar';
import PlaceAutocomplete from './features/search/components/PlaceAutocomplete';
import SearchHistoryList from './features/search/components/SearchHistoryList';
import { selectSelectedPlace } from './features/search/selectors';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <TravelExploreIcon sx={{ mr: 1.5, color: 'secondary.main' }} />
          <Typography variant="h6" component="h1" fontWeight={600}>
            Place Finder
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {GOOGLE_MAPS_API_KEY ? (
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <MainLayout />
          </APIProvider>
        ) : (
          <MissingKeyLayout />
        )}
      </Container>

      <NotificationSnackbar />
    </Box>
  );
}

function MainLayout() {
  const selectedPlace = useSelector(selectSelectedPlace);

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 2fr) minmax(320px, 1fr)' },
      }}
    >
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        <Paper variant="outlined" sx={{ p: 2, pb: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
            <PlaceAutocomplete />
            <FavouriteButton place={selectedPlace} />
          </Stack>
        </Paper>
        <Paper variant="outlined" sx={{ height: { xs: 380, md: '68vh' }, overflow: 'hidden' }}>
          <PlaceMap />
        </Paper>
      </Stack>

      <Stack spacing={2} sx={{ minWidth: 0 }}>
        <SearchHistoryList />
        <FavouritesPanel />
      </Stack>
    </Box>
  );
}

/** Without a Google key the search/map can't work, but favourites (Spring Boot) still can. */
function MissingKeyLayout() {
  return (
    <Stack spacing={3}>
      <Alert severity="warning">
        Google Maps API key is missing. Copy <code>.env.example</code> to <code>.env</code>, set{' '}
        <code>VITE_GOOGLE_MAPS_API_KEY</code>, then restart <code>npm run dev</code>.
      </Alert>
      <FavouritesPanel />
    </Stack>
  );
}
