import StarIcon from '@mui/icons-material/Star';
import { Box, Card, CardContent, CardHeader, LinearProgress, Pagination } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useFavouritesList } from '../../../hooks/useFavourites';
import { placeShown } from '../../search/searchSlice';
import FavouritesList from './FavouritesList';

/** Favourites saved in MSSQL, 10 per page (pagination done by the Spring Boot API). */
export default function FavouritesPanel() {
  const dispatch = useDispatch();
  const {
    items,
    page,
    totalPages,
    totalElements,
    loading,
    refreshing,
    error,
    weatherById,
    goToPage,
    retry,
    remove,
    loadWeather,
  } = useFavouritesList();

  const showOnMap = (item) =>
    dispatch(
      placeShown({
        placeId: item.googlePlaceId,
        name: item.name,
        address: item.address,
        lat: Number(item.latitude),
        lng: Number(item.longitude),
      }),
    );

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={<StarIcon sx={{ color: 'warning.main' }} />}
        title={`Favourites (${totalElements})`}
        slotProps={{ title: { variant: 'subtitle1', fontWeight: 600 } }}
      />
      {refreshing && !loading ? <LinearProgress /> : <Box sx={{ height: 4 }} />}
      <CardContent sx={{ pt: 1 }}>
        <FavouritesList
          loading={loading}
          error={error}
          onRetry={retry}
          items={items}
          weatherById={weatherById}
          onSelect={showOnMap}
          onRemove={remove}
          onLoadWeather={loadWeather}
        />
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              size="small"
              count={totalPages}
              page={page + 1} // MUI is 1-based, Spring Data is 0-based
              onChange={(_event, value) => goToPage(value - 1)}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
