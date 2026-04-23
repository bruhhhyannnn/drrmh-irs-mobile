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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: event, isPending, error } = useEvent(id);

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-brand-25">
        <ActivityIndicator size="large" color="#7f1616" />
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-brand-25 px-6">
        <Text className="text-center text-sm text-red-500">
          {error?.message ?? 'Event not found'}
        </Text>
      </SafeAreaView>
    );
  }

  const statusName = event.status?.name ?? 'Unknown';
  const statusStyle =
    statusName === 'Ongoing'
      ? { bg: 'bg-green-100', text: 'text-green-700' }
      : statusName === 'Upcoming'
        ? { bg: 'bg-amber-100', text: 'text-amber-700' }
        : { bg: 'bg-gray-100', text: 'text-gray-600' };

  return (
    <SafeAreaView className="flex-1 bg-brand-25">
      {/* Header */}
      <View className="flex-row items-center gap-3 border-b border-gray-100 bg-white px-4 py-4">
        <Pressable onPress={() => router.back()} className="p-1">
          <ArrowLeft size={22} color="#1d2939" />
        </Pressable>
        <Text className="flex-1 text-lg font-bold text-gray-900" numberOfLines={1}>
          Event Details
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Main card */}
        <View className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <View className="mb-3 flex-row items-start justify-between gap-2">
            <Text className="flex-1 text-2xl font-bold text-gray-900">{event.name}</Text>
            <View className={`rounded-full px-3 py-1 ${statusStyle.bg}`}>
              <Text className={`text-xs font-semibold ${statusStyle.text}`}>{statusName}</Text>
            </View>
          </View>

          {event.description ? (
            <Text className="text-sm leading-relaxed text-gray-600">{event.description}</Text>
          ) : null}
        </View>

        {/* Details card */}
        <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          {event.location && (
            <View className="flex-row items-center gap-3 py-2">
              <MapPin size={16} color="#667085" />
              <View>
                <Text className="text-xs text-gray-400">Location</Text>
                <Text className="text-sm font-medium text-gray-900">{event.location.name}</Text>
              </View>
            </View>
          )}

          {event.started_at && (
            <View className="flex-row items-center gap-3 py-2">
              <Calendar size={16} color="#667085" />
              <View>
                <Text className="text-xs text-gray-400">Started</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {format(new Date(event.started_at), 'MMM d, yyyy h:mm a')}
                </Text>
              </View>
            </View>
          )}

          {event.ended_at && (
            <View className="flex-row items-center gap-3 py-2">
              <Calendar size={16} color="#667085" />
              <View>
                <Text className="text-xs text-gray-400">Ended</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {format(new Date(event.ended_at), 'MMM d, yyyy h:mm a')}
                </Text>
              </View>
            </View>
          )}

          {event.quarter && (
            <View className="flex-row items-center gap-3 py-2">
              <FileText size={16} color="#667085" />
              <View>
                <Text className="text-xs text-gray-400">Quarter</Text>
                <Text className="text-sm font-medium text-gray-900">{event.quarter}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Submit Report button — only shown for ongoing events */}
      {statusName === 'Ongoing' && (
        <View className="border-t border-gray-100 bg-white px-4 py-4">
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
