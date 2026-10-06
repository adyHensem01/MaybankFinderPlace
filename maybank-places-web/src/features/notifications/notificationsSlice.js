import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { current: null }, // { severity: 'success' | 'info' | 'error', message }
  reducers: {
    notify(state, action) {
      state.current = { ...action.payload, key: Date.now() };
    },
    notificationDismissed(state) {
      state.current = null;
    },
  },
});

export const { notify, notificationDismissed } = notificationsSlice.actions;
export const selectNotification = (state) => state.notifications.current;
export default notificationsSlice.reducer;
