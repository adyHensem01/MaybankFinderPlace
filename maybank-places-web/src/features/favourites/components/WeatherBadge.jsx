import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import { Chip, CircularProgress, IconButton, Tooltip } from '@mui/material';

/** Current weather via the backend's nested Open-Meteo call. Loaded on demand. */
export default function WeatherBadge({ weather, onLoad }) {
  if (weather?.status === 'loading') {
    return <CircularProgress size={18} sx={{ mx: 1 }} />;
  }
  if (weather?.status === 'succeeded') {
    const { temperature, temperatureUnit, description } = weather.data;
    return (
      <Tooltip title={description}>
        <Chip size="small" label={`${Math.round(temperature)}${temperatureUnit ?? '°C'}`} sx={{ mr: 0.5 }} />
      </Tooltip>
    );
  }
  return (
    <Tooltip title={weather?.status === 'failed' ? `Weather failed: ${weather.error}. Retry?` : 'Show current weather'}>
      <IconButton size="small" onClick={onLoad} color={weather?.status === 'failed' ? 'error' : 'default'}>
        <CloudOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
