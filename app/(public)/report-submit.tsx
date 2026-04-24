import { ReportFormFields } from '@/components/reports/report-form-fields';
import { Button, Select } from '@/components/ui';
import {
  useClusters,
  useCreateBystanderReport,
  useLocations,
  useOngoingEvents,
  useUnits,
} from '@/hooks';
import { BystanderReportFormData, bystanderReportSchema } from '@/lib';
import { HEADCOUNT_FIELDS } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportSubmitScreen() {
  const { title } = useLocalSearchParams<{ type: string; title: string }>();
  const router = useRouter();
  const createBystanderReport = useCreateBystanderReport();

  const { data: events } = useOngoingEvents();
  const { data: clusters = [] } = useClusters();

const [selectedClusterId, setSelectedClusterId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');

  const { data: units = [] } = useUnits(selectedClusterId || undefined);
  const { data: locations = [] } = useLocations(selectedClusterId || undefined);

  const headcountDefaults = Object.fromEntries(HEADCOUNT_FIELDS.map((f) => [f.key, 0]));

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BystanderReportFormData>({
    resolver: zodResolver(bystanderReportSchema),
    defaultValues: {
      event_id: undefined,
      cluster_id: '',
      unit_id: undefined,
      location_id: undefined,
      casualties_count: 0,
      missing_count: 0,
      damage_condition_id: undefined,
      casualties: [],
      missing_persons: [],
      ...headcountDefaults,
    },
  });

  const eventOptions = (events ?? []).map((e) => ({ label: e.name, value: e.id }));
  const clusterOptions = clusters.map((c) => ({ label: c.name, value: c.id }));
  const unitOptions = units.map((u) => ({ label: u.name, value: u.id }));
  const locationOptions = locations.map((l) => ({ label: l.name, value: l.id }));

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

  const onSubmit = async (values: BystanderReportFormData) => {
    try {
      await createBystanderReport.mutateAsync(values);
      Alert.alert(
        'Report Submitted',
        'Thank you. Your report has been received and will be reviewed by the emergency response team.',
        [{ text: 'OK', onPress: () => router.replace('/(public)/report-select') }]
      );
    } catch (err) {
      Alert.alert(
        'Submission Failed',
        err instanceof Error ? err.message : 'Could not submit report. Please try again.'
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="border-b border-gray-200 bg-white px-4 pb-4 pt-4 dark:border-gray-800 dark:bg-gray-950">
          <Pressable
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="mb-3 flex-row items-center gap-2 self-start"
          >
            <ArrowLeft size={16} color="#6b7280" />
            <Text className="text-sm text-gray-400 dark:text-gray-500">Back</Text>
          </Pressable>

          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">{title}</Text>
            <Text className="text-sm text-gray-400 dark:text-gray-500">
              Anonymous bystander submission
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 12 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Event & Assignment */}
          <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/20 dark:bg-white/10">
            <Text className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
              Event & Assignment
            </Text>

            <View className="gap-3">
              <Select
                label="Event"
                placeholder="Select an event"
                options={eventOptions}
                value={watch('event_id')}
                onChange={(v) => setValue('event_id', v)}
                error={errors.event_id?.message}
              />

              <Select
                label="Cluster"
                placeholder="Select cluster"
                options={clusterOptions}
                value={selectedClusterId || undefined}
                onChange={handleClusterChange}
                error={errors.cluster_id?.message}
              />

              <Select
                label="Unit"
                placeholder={selectedClusterId ? 'Select unit' : 'Select cluster first'}
                options={unitOptions}
                value={selectedUnitId || undefined}
                onChange={handleUnitChange}
                disabled={!selectedClusterId}
              />

              <Select
                label="Location"
                placeholder={selectedClusterId ? 'Select location' : 'Select cluster first'}
                options={locationOptions}
                value={selectedLocationId || undefined}
                onChange={handleLocationChange}
                disabled={!selectedClusterId}
              />
            </View>
          </View>

          {/* Headcount + Casualties */}
          <ReportFormFields control={control as any} errors={errors as any} />

          {/* Disclaimer */}
          <View className="rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-950">
            <Text className="text-sm leading-relaxed text-amber-700 dark:text-amber-300">
              <Text className="font-semibold">Anonymous submission.</Text> Your identity will not be
              stored. This report will be reviewed by the DRRM-H Emergency Response Team. For
              life-threatening emergencies, call <Text className="font-semibold">911</Text>{' '}
              immediately.
            </Text>
          </View>

          <Button
            onPress={handleSubmit(onSubmit, (errors) =>
              console.log('validation errors', JSON.stringify(errors, null, 2))
            )}
            loading={createBystanderReport.isPending}
            className="mt-2 w-full"
          >
            Submit Anonymous Report
          </Button>

          <View className="h-4" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
