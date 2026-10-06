import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { notificationDismissed, selectNotification } from './notificationsSlice';

export default function NotificationSnackbar() {
  const dispatch = useDispatch();
  const notification = useSelector(selectNotification);

  const handleClose = (_event, reason) => {
    if (reason !== 'clickaway') dispatch(notificationDismissed());
  };

  return (
    <Snackbar
      key={notification?.key}
      open={Boolean(notification)}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      {notification ? (
        <Alert onClose={handleClose} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
