import { Button, Input } from '@/components/ui';
import { useReport, useUpdateReport } from '@/hooks';
import { reportSchema, type ReportFormData } from '@/lib';
import { HEADCOUNT_FIELDS } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: report, isPending, error } = useReport(id);
  const updateReport = useUpdateReport(id);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    values: report
      ? {
          event_id: report.event_id,
          cluster_id: report.cluster_id,
          unit_id: report.unit_id ?? undefined,
          location_id: report.location_id ?? undefined,
          faculty_members: report.faculty_members,
          admin_members: report.admin_members,
          reps_members: report.reps_members,
          ra_members: report.ra_members,
          students: report.students,
          philcare_staff: report.philcare_staff,
          security_personnel: report.security_personnel,
          construction_workers: report.construction_workers,
          tenants: report.tenants,
          health_workers: report.health_workers,
          non_academic_staff: report.non_academic_staff,
          guests: report.guests,
          missing_count: report.missing_count,
          casualties_count: report.casualties_count,
        }
      : undefined,
  });

  const onSubmit = async (data: ReportFormData) => {
    try {
      await updateReport.mutateAsync(data);
      Alert.alert('Updated', 'Report updated successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update report');
    }
  };

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        {/* TODO: add the Spinner component here from the web app */}
        <ActivityIndicator size="large" color="#7f1616" />
      </SafeAreaView>
    );
  }

  if (error || !report) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Text className="text-center text-sm text-red-500">
          {error?.message ?? 'Report not found'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
          <View className="py-5">
            <Text className="text-xl font-bold text-gray-900">Edit Report</Text>
            <Text className="text-sm text-gray-500">{report.event.name}</Text>
          </View>

          {/* Read-only info */}
          <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-500">Cluster</Text>
              <Text className="text-sm font-medium text-gray-900">{report.cluster.name}</Text>
            </View>
            {report.unit && (
              <View className="mt-2 flex-row justify-between">
                <Text className="text-sm text-gray-500">Unit</Text>
                <Text className="text-sm font-medium text-gray-900">{report.unit.name}</Text>
              </View>
            )}
            {report.location && (
              <View className="mt-2 flex-row justify-between">
                <Text className="text-sm text-gray-500">Location</Text>
                <Text className="text-sm font-medium text-gray-900">{report.location.name}</Text>
              </View>
            )}
          </View>

          {/* Headcount */}
          <View className="rounded-2xl bg-white p-4 shadow-sm">
            <Text className="mb-3 text-base font-semibold text-gray-900">Headcount</Text>
            <View className="gap-3">
              {HEADCOUNT_FIELDS.map((field) => (
                <Controller
                  key={field.key}
                  control={control}
                  name={field.key}
                  render={({ field: { value, onChange } }) => (
                    <View className="flex-row items-center justify-between">
                      <Text className="flex-1 text-sm text-gray-700">{field.label}</Text>
                      <Input
                        value={String(value ?? 0)}
                        onChangeText={(t) => onChange(Number(t) || 0)}
                        keyboardType="numeric"
                        className="w-20"
                        error={errors[field.key]?.message}
                      />
                    </View>
                  )}
                />
              ))}
            </View>
          </View>

          {/* Casualties & Missing */}
          <View className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <Text className="mb-3 text-base font-semibold text-gray-900">Casualties & Missing</Text>
            <View className="gap-3">
              <Controller
                control={control}
                name="casualties_count"
                render={({ field: { value, onChange } }) => (
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 text-sm text-gray-700">Casualties</Text>
                    <Input
                      value={String(value ?? 0)}
                      onChangeText={(t) => onChange(Number(t) || 0)}
                      keyboardType="numeric"
                      className="w-20"
                    />
                  </View>
                )}
              />
              <Controller
                control={control}
                name="missing_count"
                render={({ field: { value, onChange } }) => (
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 text-sm text-gray-700">Missing Persons</Text>
                    <Input
                      value={String(value ?? 0)}
                      onChangeText={(t) => onChange(Number(t) || 0)}
                      keyboardType="numeric"
                      className="w-20"
                    />
                  </View>
                )}
              />
            </View>
          </View>

          <View className="mt-6 flex-row gap-3">
            <Button variant="secondary" onPress={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button
              onPress={handleSubmit(onSubmit)}
              loading={updateReport.isPending}
              className="flex-1"
            >
              Save Changes
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
