import type { Report } from '@/hooks';
import { useMyReports } from '@/hooks';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { ChevronRight, Clock, MapPin } from 'lucide-react-native';
import { ActivityIndicator, FlatList, Pressable, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyReportsScreen() {
  const { data: reports, isPending, error, refetch } = useMyReports();

  return (
    <SafeAreaView className="flex-1 bg-brand-25 dark:bg-gray-950">
      {/* Header */}
      <View className="bg-brand-700 px-5 py-6">
        <Text className="text-2xl font-bold text-white">My Reports</Text>
        <Text className="text-sm text-gray-200">{reports?.length ?? 0} submitted</Text>
      </View>

      {isPending && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7f1616" />
        </View>
      )}

      {error && (
        <Pressable
          onPress={() => refetch()}
          className="mx-4 mt-4 items-center rounded-xl bg-red-50 py-8 dark:bg-red-950"
        >
          <Text className="text-sm text-red-600 dark:text-red-400">{error.message}</Text>
          <Text className="mt-1 text-xs text-red-400 dark:text-red-500">Tap to retry</Text>
        </Pressable>
      )}

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReportCard report={item} />}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          !isPending && !error ? (
            <View className="items-center rounded-2xl border border-dashed border-gray-300 bg-white py-12 dark:border-gray-700 dark:bg-gray-900">
              <Text className="text-sm text-gray-400 dark:text-gray-500">
                No reports submitted yet
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

function ReportCard({ report }: { report: Report }) {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#9ca3af' : '#6b7280';

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
      className="rounded-2xl border border-gray-100 bg-white p-4 active:opacity-80 dark:border-gray-800 dark:bg-gray-900"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white" numberOfLines={1}>
            {report.event.name}
          </Text>
          <View className="mt-2 flex-row items-center gap-1">
            <MapPin size={16} color={iconColor} />
            <Text className="text-xs text-gray-500 dark:text-gray-400">{report.cluster.name}</Text>
            {report.unit && (
              <Text className="flex-1 text-xs text-gray-400 dark:text-gray-500">
                {' '}
                · {report.unit.name}
              </Text>
            )}
          </View>
          <View className="mt-2 flex-row items-center gap-1">
            <Clock size={16} color={iconColor} />
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(report.submitted_at), 'MMM d, yyyy h:mm a')}
            </Text>
          </View>
        </View>
        <View className="ml-3 flex-row items-center gap-2 ">
          <View className="items-end">
            <Text className="text-lg font-bold text-brand-800 dark:text-brand-400">
              {totalHeadcount}
            </Text>
            <Text className="text-xs text-gray-400 dark:text-gray-500">headcount</Text>
          </View>
          <ChevronRight size={16} color={isDark ? '#6b7280' : '#9ca3af'} />
        </View>
      </View>

      {(report.casualties_count > 0 || report.missing_count > 0) && (
        <View className="mt-3 flex-row gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
          {report.casualties_count > 0 && (
            <View className="rounded-lg bg-red-50 px-3 py-1 dark:bg-red-950">
              <Text className="text-xs font-medium text-red-700 dark:text-red-400">
                {report.casualties_count} casualties
              </Text>
            </View>
          )}
          {report.missing_count > 0 && (
            <View className="rounded-lg bg-amber-50 px-3 py-1 dark:bg-amber-950">
              <Text className="text-xs font-medium text-amber-700 dark:text-amber-400">
                {report.missing_count} missing
              </Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}
