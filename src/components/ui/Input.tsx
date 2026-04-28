import { Text, TextInput, useColorScheme, View } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
  multiline = false,
  numberOfLines = 1,
  className = '',
}: InputProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View className={`gap-1 ${className}`}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>
      )}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
        placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
        className={`rounded-xl border px-4 py-3 text-base text-gray-900 dark:text-white ${
          error
            ? 'border-red-500 bg-red-50 dark:bg-red-950'
            : 'border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900'
        } ${!editable ? 'opacity-60' : ''} ${multiline ? 'min-h-[80px] text-start' : ''}`}
      />
      {error && <Text className="text-xs text-red-500">{error}</Text>}
    </View>
  );
}
