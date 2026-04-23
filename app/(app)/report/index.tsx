import { ReportFormFields } from '@/components/reports/report-form-fields';
import { Button, Input, Select } from '@/components/ui';
import { useClusters, useCreateReport, useLocations, useOngoingEvents, useUnits } from '@/hooks';
import { reportSchema, type ReportFormData } from '@/lib';
import { useAuthStore, useOfflineStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import NetInfo from '@react-native-community/netinfo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ event_id?: string }>();
  const { user } = useAuthStore();
  const { enqueue } = useOfflineStore();
  const createReport = useCreateReport();
  const { data: events } = useOngoingEvents();
  const { data: clusters = [] } = useClusters();

  const [selectedClusterId, setSelectedClusterId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: units = [] } = useUnits(selectedClusterId || undefined);
  const { data: locations = [] } = useLocations(selectedClusterId || undefined);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
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

  useEffect(() => {
    if (params.event_id) {
      setValue('event_id', params.event_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.event_id]);

  const eventOptions = (events ?? []).map((e) => ({ label: e.name, value: e.id }));
  const clusterOptions = clusters.map((c) => ({ label: c.name, value: c.id }));
  const unitOptions = units.map((u) => ({ label: u.name, value: u.id }));
  const locationOptions = locations.map((l) => ({ label: l.name, value: l.id }));

  const onSubmit = async (data: ReportFormData) => {
    setSubmitting(true);
    try {
      const net = await NetInfo.fetch();

      if (!net.isConnected) {
        enqueue(data);
        Alert.alert(
          'Saved Offline',
          'You are offline. Your report has been queued and will sync automatically when you reconnect.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
        return;
      }

      await createReport.mutateAsync(data);
      reset();
      setSelectedClusterId('');
      setSelectedUnitId('');
      setSelectedLocationId('');
      Alert.alert('Success', 'Report submitted successfully.', [
        { text: 'OK', onPress: () => router.push('/(app)/my-reports') },
      ]);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClusterChange = (clusterId: string) => {
    setSelectedClusterId(clusterId);
    setSelectedUnitId('');
    setSelectedLocationId('');
    setValue('cluster_id', clusterId);
    setValue('unit_id', undefined);
    setValue('location_id', undefined);
  };

  const handleUnitChange = (unitId: string) => {
    setSelectedUnitId(unitId);
    setValue('unit_id', unitId);
  };

  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId);
    setValue('location_id', locationId);
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
            <Text className="text-2xl font-bold text-gray-900">Submit Status Report</Text>
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

            {/* Full Name */}
            <Input
              label="Full Name"
              value={`${user?.first_name ?? ''} ${user?.last_name ?? ''}`}
              className="w-full"
              editable={false}
            />

            {/* Cluster */}
            <Select
              label="Cluster *"
              placeholder="Select cluster"
              options={clusterOptions}
              value={selectedClusterId || undefined}
              onChange={handleClusterChange}
              error={errors.cluster_id?.message}
            />

            {/* Unit */}
            <Select
              label="Unit"
              placeholder={selectedClusterId ? 'Select unit' : 'Select cluster first'}
              options={unitOptions}
              value={selectedUnitId || undefined}
              onChange={handleUnitChange}
              disabled={!selectedClusterId}
            />

            {/* Location */}
            <Select
              label="Location"
              placeholder={selectedClusterId ? 'Select location' : 'Select cluster first'}
              options={locationOptions}
              value={selectedLocationId || undefined}
              onChange={handleLocationChange}
              disabled={!selectedClusterId}
            />

            <ReportFormFields control={control} errors={errors} />

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
