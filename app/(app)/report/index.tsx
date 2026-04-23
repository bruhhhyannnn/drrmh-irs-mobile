import { Button, Input, Select } from '@/components/ui';
import { resolveIds, useAllEvents, useCreateReport } from '@/hooks';
import { reportSchema, type ReportFormData } from '@/lib';
import { useOfflineStore } from '@/store';
import { CLUSTERS, HEADCOUNT_FIELDS, LOCATIONS, UNITS, type Cluster } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import NetInfo from '@react-native-community/netinfo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ event_id?: string }>();
  const { enqueue } = useOfflineStore();
  const createReport = useCreateReport();
  const { data: events } = useAllEvents();

  const [selectedCluster, setSelectedCluster] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      event_id: params.event_id ?? '',
      cluster_id: '',
      faculty_members: 0,
      admin_members: 0,
      reps_members: 0,
      ra_members: 0,
      students: 0,
      philcare_staff: 0,
      security_personnel: 0,
      construction_workers: 0,
      tenants: 0,
      health_workers: 0,
      non_academic_staff: 0,
      guests: 0,
      missing_count: 0,
      casualties_count: 0,
    },
  });

  const eventOptions = (events ?? []).map((e) => ({
    label: e.name,
    value: e.id,
  }));
  const unitOptions = selectedCluster ? (UNITS[selectedCluster as Cluster] ?? []) : [];
  const locationOptions = selectedCluster ? (LOCATIONS[selectedCluster as Cluster] ?? []) : [];

  const onSubmit = async (data: ReportFormData) => {
    setSubmitting(true);
    try {
      const net = await NetInfo.fetch();

      if (!net.isConnected) {
        // Save to offline queue — IDs already resolved via form
        enqueue(data);
        Alert.alert(
          'Saved Offline',
          'You are offline. Your report has been queued and will sync automatically when you reconnect.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
        return;
      }

      await createReport.mutateAsync(data);
      Alert.alert('Success', 'Report submitted successfully.', [
        { text: 'OK', onPress: () => router.push('/(app)/submitted') },
      ]);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  // Resolve cluster name → cluster_id and clear unit/location when cluster changes
  const handleClusterChange = async (clusterName: string) => {
    setSelectedCluster(clusterName);
    setSelectedUnit('');
    setSelectedLocation('');
    setValue('unit_id', undefined);
    setValue('location_id', undefined);

    try {
      const ids = await resolveIds({ clusterName });
      setValue('cluster_id', ids.cluster_id);
    } catch {
      Alert.alert('Error', `Cluster "${clusterName}" not found in database`);
    }
  };

  const handleUnitChange = async (unitName: string) => {
    setSelectedUnit(unitName);
    try {
      const ids = await resolveIds({ clusterName: selectedCluster, unitName });
      setValue('unit_id', ids.unit_id);
    } catch {
      console.warn('Unit resolve failed');
    }
  };

  const handleLocationChange = async (locationName: string) => {
    setSelectedLocation(locationName);
    try {
      const ids = await resolveIds({ clusterName: selectedCluster, locationName });
      setValue('location_id', ids.location_id);
    } catch {
      console.warn('Location resolve failed');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-25">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Header */}
          <View className="py-5">
            <Text className="text-xl font-bold text-gray-900">Submit Report</Text>
            <Text className="text-sm text-gray-500">Fill in all required fields</Text>
          </View>

          <View className="gap-4">
            {/* Event */}
            <Select
              label="Event *"
              placeholder="Select an event"
              options={eventOptions}
              value={watch('event_id')}
              onChange={(v) => setValue('event_id', v)}
              error={errors.event_id?.message}
            />

            {/* Cluster */}
            <Select
              label="Cluster *"
              placeholder="Select cluster"
              options={[...CLUSTERS]}
              value={selectedCluster}
              onChange={handleClusterChange}
              error={errors.cluster_id?.message}
            />

            {/* Unit */}
            <Select
              label="Unit"
              placeholder={selectedCluster ? 'Select unit' : 'Select cluster first'}
              options={unitOptions}
              value={selectedUnit || undefined}
              onChange={handleUnitChange}
              disabled={!selectedCluster}
            />

            {/* Location */}
            <Select
              label="Location"
              placeholder={selectedCluster ? 'Select location' : 'Select cluster first'}
              options={locationOptions}
              value={selectedLocation || undefined}
              onChange={handleLocationChange}
              disabled={!selectedCluster}
            />

            {/* Headcount */}
            <View className="rounded-2xl border border-gray-300 bg-white p-4 shadow-sm">
              <Text className="mb-3 text-base font-semibold text-gray-900">Headcount</Text>
              <View className="flex-row flex-wrap gap-3">
                {HEADCOUNT_FIELDS.map((field) => (
                  <Controller
                    key={field.key}
                    control={control}
                    name={field.key}
                    render={({ field: { value, onChange } }) => (
                      <View className="w-[48%] flex-row items-center justify-between gap-2">
                        <Text className="flex-1 text-sm text-gray-700">{field.label}</Text>
                        <Input
                          value={String(value ?? 0)}
                          onChangeText={(t) => onChange(parseInt(t, 10) || 0)}
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
            <View className="rounded-2xl border border-gray-300 bg-white p-4 shadow-sm">
              <Text className="mb-3 text-base font-semibold text-gray-900">
                Casualties & Missing
              </Text>
              <View className="flex-row flex-wrap gap-3">
                <Controller
                  control={control}
                  name="casualties_count"
                  render={({ field: { value, onChange } }) => (
                    <View className="w-[48%] flex-row items-center justify-between gap-2">
                      <Text className="flex-1 text-sm text-gray-700">Casualties</Text>
                      <Input
                        value={String(value ?? 0)}
                        onChangeText={(t) => onChange(parseInt(t, 10) || 0)}
                        keyboardType="numeric"
                        className="w-20"
                        error={errors.casualties_count?.message}
                      />
                    </View>
                  )}
                />
                <Controller
                  control={control}
                  name="missing_count"
                  render={({ field: { value, onChange } }) => (
                    <View className="w-[48%] flex-row items-center justify-between gap-2">
                      <Text className="flex-1 text-sm text-gray-700">Missing Persons</Text>
                      <Input
                        value={String(value ?? 0)}
                        onChangeText={(t) => onChange(parseInt(t, 10) || 0)}
                        keyboardType="numeric"
                        className="w-20"
                        error={errors.missing_count?.message}
                      />
                    </View>
                  )}
                />
              </View>
            </View>

            <Button
              onPress={handleSubmit(onSubmit)}
              loading={submitting || createReport.isPending}
              className="w-full"
              size="lg"
            >
              Submit Report
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
