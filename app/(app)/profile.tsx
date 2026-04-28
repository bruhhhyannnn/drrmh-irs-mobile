import { supabase } from '@/lib';
import { useAuthStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { LogOut, Mail, Shield, Tag, User } from 'lucide-react-native';
import { Alert, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const { data: unitName } = useQuery({
    queryKey: ['unit-name', user?.unit_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('units')
        .select('name')
        .eq('id', user!.unit_id!)
        .single();
      return data?.name ?? null;
    },
    enabled: !!user?.unit_id,
    staleTime: Infinity,
  });

  const { data: positionName } = useQuery({
    queryKey: ['position-name', user?.position_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('positions')
        .select('name')
        .eq('id', user!.position_id!)
        .single();
      return data?.name ?? null;
    },
    enabled: !!user?.position_id,
    staleTime: Infinity,
  });

  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#9ca3af' : '#667085';

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          clearUser();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-25 dark:bg-gray-950">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View className="bg-brand-700 px-5 pb-8 pt-5">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <Text className="text-2xl font-bold text-white">
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </Text>
          </View>
          <Text className="mt-3 text-2xl font-bold text-white">
            {user?.first_name} {user?.last_name}
          </Text>
          <Text className="text-sm text-blue-200">{user?.user_type_name}</Text>
        </View>

        {/* Info card */}
        <View className="mx-4 mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <ProfileRow icon={<Mail size={18} color={iconColor} />} label="Email" value={user?.email} />
          <Divider />
          <ProfileRow
            icon={<Tag size={18} color={iconColor} />}
            label="Position"
            value={positionName ?? (user?.position_id ? '—' : 'Not assigned')}
          />
          <Divider />
          <ProfileRow
            icon={<Shield size={18} color={iconColor} />}
            label="Unit"
            value={unitName ?? (user?.unit_id ? '—' : 'Not assigned')}
          />
          <Divider />
          <ProfileRow
            icon={<User size={18} color={iconColor} />}
            label="Role"
            value={user?.user_type_name}
          />
        </View>

        {/* Sign out */}
        <View className="mx-4 mt-4">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-4 dark:border-red-900 dark:bg-red-950"
          >
            <LogOut size={18} color="#d92d20" />
            <Text className="text-base font-semibold text-red-600 dark:text-red-400">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <View className="flex-row items-center gap-3 px-4 py-4">
      {icon}
      <View className="flex-1">
        <Text className="text-xs text-gray-400 dark:text-gray-500">{label}</Text>
        <Text className="text-sm font-medium text-gray-900 dark:text-white">{value ?? '—'}</Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View className="mx-4 h-px bg-gray-100 dark:bg-gray-800" />;
}
