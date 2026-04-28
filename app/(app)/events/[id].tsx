import { useEvent } from '@/hooks';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, FileText, MapPin } from 'lucide-react-native';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: event, isPending, error } = useEvent(id);

  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#9ca3af' : '#667085';

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-brand-25 dark:bg-gray-950">
        <ActivityIndicator size="large" color="#7f1616" />
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-brand-25 px-6 dark:bg-gray-950">
        <Text className="text-center text-sm text-red-500">
          {error?.message ?? 'Event not found'}
        </Text>
      </SafeAreaView>
    );
  }

  const statusName = event.status?.name ?? 'Unknown';
  const statusStyle =
    statusName === 'Ongoing'
      ? { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-300' }
      : statusName === 'Upcoming'
        ? { bg: 'bg-amber-100 dark:bg-amber-900', text: 'text-amber-700 dark:text-amber-300' }
        : { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' };

  return (
    <SafeAreaView className="flex-1 bg-brand-25 dark:bg-gray-950">
      {/* Header */}
      <View className="flex-row items-center gap-3 border-b border-gray-100 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
        <Pressable onPress={() => router.back()} className="p-1">
          <ArrowLeft size={22} color={isDark ? '#f9fafb' : '#1d2939'} />
        </Pressable>
        <Text className="flex-1 text-lg font-bold text-gray-900 dark:text-white" numberOfLines={1}>
          Event Details
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Main card */}
        <View className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <View className="mb-3 flex-row items-start justify-between gap-2">
            <Text className="flex-1 text-2xl font-bold text-gray-900 dark:text-white">{event.name}</Text>
            <View className={`rounded-full px-3 py-1 ${statusStyle.bg}`}>
              <Text className={`text-xs font-semibold ${statusStyle.text}`}>{statusName}</Text>
            </View>
          </View>

          {event.description ? (
            <Text className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{event.description}</Text>
          ) : null}
        </View>

        {/* Details card */}
        <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {event.location && (
            <View className="flex-row items-center gap-3 py-2">
              <MapPin size={16} color={iconColor} />
              <View>
                <Text className="text-xs text-gray-400 dark:text-gray-500">Location</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-white">{event.location.name}</Text>
              </View>
            </View>
          )}

          {event.started_at && (
            <View className="flex-row items-center gap-3 py-2">
              <Calendar size={16} color={iconColor} />
              <View>
                <Text className="text-xs text-gray-400 dark:text-gray-500">Started</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-white">
                  {format(new Date(event.started_at), 'MMM d, yyyy h:mm a')}
                </Text>
              </View>
            </View>
          )}

          {event.ended_at && (
            <View className="flex-row items-center gap-3 py-2">
              <Calendar size={16} color={iconColor} />
              <View>
                <Text className="text-xs text-gray-400 dark:text-gray-500">Ended</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-white">
                  {format(new Date(event.ended_at), 'MMM d, yyyy h:mm a')}
                </Text>
              </View>
            </View>
          )}

          {event.quarter && (
            <View className="flex-row items-center gap-3 py-2">
              <FileText size={16} color={iconColor} />
              <View>
                <Text className="text-xs text-gray-400 dark:text-gray-500">Quarter</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-white">{event.quarter}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Submit Report button — only shown for ongoing events */}
      {statusName === 'Ongoing' && (
        <View className="border-t border-gray-100 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(app)/report',
                params: { event_id: event.id },
              })
            }
            className="items-center rounded-2xl bg-brand-600 py-4"
          >
            <Text className="text-base font-semibold text-white">Submit a Report</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
