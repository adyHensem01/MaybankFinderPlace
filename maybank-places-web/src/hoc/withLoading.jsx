import { Alert, Box, Button, CircularProgress } from '@mui/material';

/**
 * Higher-order component: shows a spinner while `loading`, an error with a retry button on `error`,
 * otherwise renders the wrapped component with the remaining props.
 */
export default function withLoading(WrappedComponent) {
  function WithLoading({ loading, error, onRetry, ...props }) {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      );
    }
    if (error) {
      return (
        <Alert
          severity="error"
          action={
            onRetry && (
              <Button color="inherit" size="small" onClick={onRetry}>
                Retry
              </Button>
            )
          }
        >
          {error}
        </Alert>
      );
    }
    return <WrappedComponent {...props} />;
  }

  WithLoading.displayName = `withLoading(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithLoading;
}
