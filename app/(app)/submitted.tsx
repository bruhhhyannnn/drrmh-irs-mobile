import type { Report } from '@/hooks';
import { useMyReports } from '@/hooks';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { ChevronRight, Clock, MapPin } from 'lucide-react-native';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubmittedScreen() {
  const { data: reports, isPending, isFetching, error, refetch } = useMyReports();

  return (
    <SafeAreaView className="flex-1 bg-brand-25">
      <View className="border-b border-gray-100 bg-white px-5 pb-4 pt-5">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">My Reports</Text>
          {/* TODO: add the Spinner component here from the web app */}
          {isFetching && <ActivityIndicator size="small" color="#7f1616" />}
        </View>
        <Text className="text-sm text-gray-500">{reports?.length ?? 0} submitted</Text>
      </View>

      {isPending && (
        <View className="flex-1 items-center justify-center">
          {/* TODO: add the Spinner component here from the web app */}
          <ActivityIndicator size="large" color="#7f1616" />
        </View>
      )}

      {error && (
        <Pressable
          onPress={() => refetch()}
          className="mx-4 mt-4 items-center rounded-xl bg-red-50 py-8"
        >
          <Text className="text-sm text-red-600">{error.message}</Text>
          <Text className="mt-1 text-xs text-red-400">Tap to retry</Text>
        </Pressable>
      )}

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReportCard report={item} />}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          !isPending && !error ? (
            <View className="items-center rounded-2xl border border-dashed border-gray-300 bg-white py-12 shadow-xl">
              <Text className="text-sm text-gray-400">No reports submitted yet</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

function ReportCard({ report }: { report: Report }) {
  const router = useRouter();

  const totalHeadcount =
    report.faculty_members +
    report.admin_members +
    report.reps_members +
    report.ra_members +
    report.students +
    report.philcare_staff +
    report.security_personnel +
    report.construction_workers +
    report.tenants +
    report.health_workers +
    report.non_academic_staff +
    report.guests;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(app)/report/[id]',
          params: { id: report.id },
        })
      }
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm active:opacity-80"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
            {report.event.name}
          </Text>
          <View className="mt-1 flex-row items-center gap-1">
            <MapPin size={13} color="#6b7280" />
            <Text className="text-xs text-gray-500">{report.cluster.name}</Text>
            {report.unit && <Text className="text-xs text-gray-400"> · {report.unit.name}</Text>}
          </View>
          <View className="mt-1 flex-row items-center gap-1">
            <Clock size={13} color="#6b7280" />
            <Text className="text-xs text-gray-500">
              {format(new Date(report.submitted_at), 'MMM d, yyyy h:mm a')}
            </Text>
          </View>
        </View>
        <View className="ml-3 flex-row items-center gap-2">
          <View className="items-end">
            <Text className="text-base font-bold text-brand-800">{totalHeadcount}</Text>
            <Text className="text-xs text-gray-400">headcount</Text>
          </View>
          <ChevronRight size={16} color="#9ca3af" />
        </View>
      </View>

      {(report.casualties_count > 0 || report.missing_count > 0) && (
        <View className="mt-3 flex-row gap-3 border-t border-gray-100 pt-3">
          {report.casualties_count > 0 && (
            <View className="rounded-lg bg-red-50 px-3 py-1">
              <Text className="text-xs font-medium text-red-700">
                {report.casualties_count} casualties
              </Text>
            </View>
          )}
          {report.missing_count > 0 && (
            <View className="rounded-lg bg-amber-50 px-3 py-1">
              <Text className="text-xs font-medium text-amber-700">
                {report.missing_count} missing
              </Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}
