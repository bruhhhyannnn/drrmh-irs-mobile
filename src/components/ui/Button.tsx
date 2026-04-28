import { ActivityIndicator, Pressable, Text, useColorScheme, View } from 'react-native';

interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const baseStyles = 'flex-row items-center justify-center gap-2 rounded-xl';

const variantStyles = {
  primary: 'bg-brand-500 active:bg-brand-600 shadow-md',
  secondary: 'bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:active:bg-gray-600',
  outline: 'bg-white border border-gray-300 active:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:active:bg-gray-800',
  ghost: 'bg-transparent active:bg-gray-100 dark:active:bg-gray-800',
  danger: 'bg-error-500 active:bg-error-600 shadow-md',
};

const textStyles = {
  primary: 'text-white',
  secondary: 'text-gray-800 dark:text-gray-200',
  outline: 'text-gray-700 dark:text-gray-300',
  ghost: 'text-gray-600 dark:text-gray-400',
  danger: 'text-white',
};

const sizeStyles = {
  sm: 'px-4 py-2',
  md: 'px-6 py-3',
  lg: 'px-8 py-3.5',
};

const textSizeStyles = {
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
};

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  startIcon,
  endIcon,
  disabled = false,
  className = '',
}: ButtonProps) {
  const isDark = useColorScheme() === 'dark';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={` ${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${isDisabled ? 'opacity-50' : ''} ${className} `}
    >
      {loading ? (
        <>
          <ActivityIndicator
            size="small"
            color={variant === 'primary' || variant === 'danger' ? '#fff' : isDark ? '#e5e7eb' : '#344054'}
          />
          <Text className={`font-medium ${textStyles[variant]} ${textSizeStyles[size]}`}>
            {loadingText ?? children}
          </Text>
        </>
      ) : (
        <>
          {startIcon && <View>{startIcon}</View>}
          <Text className={`font-medium ${textStyles[variant]} ${textSizeStyles[size]}`}>
            {children}
          </Text>
          {endIcon && <View>{endIcon}</View>}
        </>
      )}
    </Pressable>
  );
}
