import { Input, Select } from '@/components/ui';
import { useCasualtyConditions, useDamageConditions } from '@/hooks';
import { type ReportFormData } from '@/lib';
import { HEADCOUNT_FIELDS } from '@/types';
import { useEffect } from 'react';
import {
  Controller,
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
} from 'react-hook-form';
import { Text, View } from 'react-native';

interface ReportFormFieldsProps {
  control: Control<ReportFormData>;
  errors: FieldErrors<ReportFormData>;
}

export function ReportFormFields({ control, errors }: ReportFormFieldsProps) {
  const { data: casualtyConditions = [] } = useCasualtyConditions();
  const { data: damageConditions = [] } = useDamageConditions();

  const casualtyOptions = casualtyConditions.map((c) => ({ label: c.name, value: c.id }));
  const damageOptions = damageConditions.map((d) => ({ label: d.name, value: d.id }));

  // ── Casualties field array ───────────────────────────────────────────────────
  const {
    fields: casualtyFields,
    append: appendCasualty,
    remove: removeCasualty,
  } = useFieldArray({ control, name: 'casualties' });

  const casualtiesCount = useWatch({ control, name: 'casualties_count' });

  useEffect(() => {
    const count = casualtiesCount ?? 0;
    const diff = count - casualtyFields.length;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        appendCasualty({ condition_id: undefined, names: undefined });
      }
    } else if (diff < 0) {
      for (let i = casualtyFields.length - 1; i >= count; i--) {
        removeCasualty(i);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [casualtiesCount]);

  // ── Missing persons field array ──────────────────────────────────────────────
  const {
    fields: missingFields,
    append: appendMissing,
    remove: removeMissing,
  } = useFieldArray({ control, name: 'missing_persons' });

  const missingCount = useWatch({ control, name: 'missing_count' });

  useEffect(() => {
    const count = missingCount ?? 0;
    const diff = count - missingFields.length;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        appendMissing({ name: '' });
      }
    } else if (diff < 0) {
      for (let i = missingFields.length - 1; i >= count; i--) {
        removeMissing(i);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingCount]);

  return (
    <>
      {/* ── Headcount ─────────────────────────────────────────────────────────── */}
      <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Text className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
          Headcount
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {HEADCOUNT_FIELDS.map((field) => (
            <Controller
              key={field.key}
              control={control}
              name={field.key}
              render={({ field: { value, onChange } }) => (
                <View className="w-[48%] flex-row items-center justify-between gap-2">
                  <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                    {field.label}
                  </Text>
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

      {/* ── Casualties ────────────────────────────────────────────────────────── */}
      <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Text className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
          Casualties
        </Text>
        <View className="gap-3">
          <Controller
            control={control}
            name="casualties_count"
            render={({ field: { value, onChange } }) => (
              <View className="flex-row items-center justify-between gap-2">
                <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                  Number of casualties
                </Text>
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

          {casualtyFields.map((field, index) => (
            <View
              key={field.id}
              className="gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900"
            >
              <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Casualty {index + 1}
              </Text>

              <Controller
                control={control}
                name={`casualties.${index}.condition_id`}
                render={({ field: { value, onChange } }) => (
                  <Select
                    label="Condition"
                    placeholder="Select condition"
                    options={casualtyOptions}
                    value={value}
                    onChange={onChange}
                    error={errors.casualties?.[index]?.condition_id?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name={`casualties.${index}.names`}
                render={({ field: { value, onChange } }) => (
                  <Input
                    label="Names (optional)"
                    placeholder="e.g. Juan dela Cruz, Maria Santos"
                    value={value ?? ''}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          ))}
        </View>
      </View>

      {/* ── Missing Persons ───────────────────────────────────────────────────── */}
      <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Text className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
          Missing Persons
        </Text>
        <View className="gap-3">
          <Controller
            control={control}
            name="missing_count"
            render={({ field: { value, onChange } }) => (
              <View className="flex-row items-center justify-between gap-2">
                <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                  Number of missing persons
                </Text>
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

          {missingFields.map((field, index) => (
            <Controller
              key={field.id}
              control={control}
              name={`missing_persons.${index}.name`}
              render={({ field: { value, onChange } }) => (
                <Input
                  label={`Person ${index + 1}`}
                  placeholder="Full name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.missing_persons?.[index]?.name?.message}
                />
              )}
            />
          ))}
        </View>
      </View>

      {/* ── Damage Report ─────────────────────────────────────────────────────── */}
      <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Text className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
          Damage Report
        </Text>
        <Controller
          control={control}
          name="damage_condition_id"
          render={({ field: { value, onChange } }) => (
            <Select
              label="Damage Condition"
              placeholder="Select damage condition"
              options={damageOptions}
              value={value}
              onChange={onChange}
              error={errors.damage_condition_id?.message}
            />
          )}
        />
      </View>
    </>
  );
}
