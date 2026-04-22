import { Text } from 'react-native';

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function Label({ children, required = false, className = '' }: LabelProps) {
  return (
    <Text className={`text-sm font-medium text-gray-700 ${className}`}>
      {children}
      {required && <Text className="text-red-500"> *</Text>}
    </Text>
  );
}
