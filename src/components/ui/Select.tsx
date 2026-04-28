import { Check, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[] | string[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

function normalizeOptions(options: SelectOption[] | string[]): SelectOption[] {
  return options.map((opt) => (typeof opt === 'string' ? { label: opt, value: opt } : opt));
}

export function Select({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const isDark = useColorScheme() === 'dark';
  const normalized = normalizeOptions(options);
  const selected = normalized.find((o) => o.value === value);

  return (
    <View className={`gap-1 ${className}`}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>
      )}

      <Pressable
        onPress={() => !disabled && setOpen(true)}
        className={`flex-row items-center justify-between rounded-xl border px-4 py-3 ${
          error
            ? 'border-red-500 bg-red-50 dark:bg-red-950'
            : 'border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900'
        } ${disabled ? 'opacity-60' : ''}`}
      >
        <Text
          className={`text-base ${selected ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown size={18} color={isDark ? '#6b7280' : '#6b7280'} />
      </Pressable>

      {error && <Text className="text-xs text-red-500">{error}</Text>}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setOpen(false)} />
        <SafeAreaView className="rounded-t-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <View className="border-b border-gray-100 px-4 py-4 dark:border-gray-800">
            <Text className="text-center text-base font-semibold text-gray-900 dark:text-white">
              {label ?? 'Select'}
            </Text>
          </View>
          <FlatList
            data={normalized}
            keyExtractor={(item) => item.value}
            style={{ maxHeight: 360 }}
            contentContainerStyle={{ gap: 6, paddingHorizontal: 10, paddingVertical: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onChange?.(item.value);
                  setOpen(false);
                }}
                className="flex-row items-center justify-between rounded-xl bg-white px-4 py-4 shadow-md dark:bg-gray-700"
              >
                <Text
                  className={`text-base ${item.value === value ? 'font-semibold text-brand-600' : 'text-brand-800 dark:text-gray-300'}`}
                >
                  {item.label}
                </Text>
                {item.value === value && <Check size={18} color="#7f1616" />}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => (
              <View className="mx-4 h-px bg-gray-100 dark:bg-gray-700" />
            )}
          />
          <View className="px-4 py-4">
            <Pressable
              onPress={() => setOpen(false)}
              className="items-center rounded-xl bg-gray-200 py-3 dark:bg-gray-700/50"
            >
              <Text className="font-medium text-gray-700 dark:text-gray-300">Cancel</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
