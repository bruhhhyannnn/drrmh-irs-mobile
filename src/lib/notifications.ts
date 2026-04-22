import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Show alert + play sound for foreground notifications
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('[Notifications] Push notifications only work on physical devices.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[Notifications] Permission not granted.');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7f1616',
    });
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync();
  return token;
}

// Saves or updates the device token in the device_tokens table.
// NOTE: Requires a `device_tokens` table:
//   id uuid PK, user_id uuid FK users, token text, platform text, created_at timestamptz
export async function saveDeviceToken(userId: string, token: string): Promise<void> {
  const platform = Platform.OS as 'ios' | 'android';
  const { error } = await supabase
    .from('device_tokens')
    .upsert({ user_id: userId, token, platform }, { onConflict: 'user_id,token' });

  if (error) console.error('[Notifications] Failed to save device token:', error.message);
}
