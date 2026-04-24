import { Input } from '@/components/ui';
import { type ReportFormData } from '@/lib';
import { HEADCOUNT_FIELDS } from '@/types';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';

interface ReportFormFieldsProps {
  control: Control<ReportFormData>;
  errors: FieldErrors<ReportFormData>;
}

export function ReportFormFields({ control, errors }: ReportFormFieldsProps) {
  return (
    <>
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

      <View className="rounded-2xl border border-gray-300 bg-white p-4 shadow-sm">
        <Text className="mb-3 text-base font-semibold text-gray-900">Casualties & Missing</Text>
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
    </>
  );
}
