import { useAllEvents, type AppEvent } from '@/hooks';
import { useAuthStore, useOfflineStore } from '@/store';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { AlertCircle, Calendar, ChevronRight, MapPin } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { queue } = useOfflineStore();
  const { data: events, isPending, isFetching, error, refetch } = useAllEvents();

  return (
    <SafeAreaView className="flex-1 bg-brand-25">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View className="bg-brand-700 px-5 py-6">
          <Text className="text-2xl font-bold text-white">
            Hello, {user?.first_name} {user?.last_name}
          </Text>
          <Text className="text-sm text-blue-200">DRRM-H Incident Reporting System</Text>
        </View>

        {/* Offline queue banner */}
        {queue.length > 0 && (
          <View className="mx-4 mt-4 flex-row items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertCircle size={18} color="#d97706" />
            <Text className="flex-1 text-sm text-amber-800">
              {queue.length} report{queue.length > 1 ? 's' : ''} queued — will sync when online
            </Text>
          </View>
        )}

        {/* Active Events */}
        <View className="px-4 pt-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-bold text-gray-900">Active Events</Text>
            {/* TODO: add the Spinner component here from the web app */}
            {isFetching && <ActivityIndicator size="small" color="#7f1616" />}
          </View>

          {error && (
            <Pressable onPress={() => refetch()} className="items-center rounded-xl bg-red-50 py-8">
              <Text className="text-sm text-red-600">{error.message}</Text>
              <Text className="mt-1 text-xs text-red-400">Tap to retry</Text>
            </Pressable>
          )}

          {isPending && !error && (
            <View className="items-center py-12">
              {/* TODO: add the Spinner component here from the web app */}
              <ActivityIndicator size="large" color="#7f1616" />
            </View>
          )}

          {!isPending && !error && events?.length === 0 && (
            <View className="items-center rounded-2xl border border-dashed border-gray-300 bg-white py-12 shadow-xl">
              <Text className="text-sm text-gray-400">No active events at this time</Text>
            </View>
          )}

          <View className="gap-3">
            {events?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function EventCard({ event }: { event: AppEvent }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(app)/events/[id]',
          params: { id: event.id },
        })
      }
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xl active:opacity-80"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900" numberOfLines={2}>
            {event.name}
          </Text>
          {event.location && (
            <View className="mt-1 flex-row items-center gap-1">
              <MapPin size={13} color="#6b7280" />
              <Text className="text-sm text-gray-500">{event.location.name}</Text>
            </View>
          )}
          {event.started_at && (
            <View className="mt-1 flex-row items-center gap-1">
              <Calendar size={13} color="#6b7280" />
              <Text className="text-sm text-gray-500">
                {format(new Date(event.started_at), 'MMM d, yyyy h:mm a')}
              </Text>
            </View>
          )}
        </View>
        <View className="ml-3 flex-row items-center gap-1">
          <View className="rounded-full bg-green-100 px-2.5 py-0.5">
            <Text className="text-xs font-medium text-green-700">{event.status.name}</Text>
          </View>
          <ChevronRight size={16} color="#9ca3af" />
        </View>
      </View>
    </Pressable>
  );
}
