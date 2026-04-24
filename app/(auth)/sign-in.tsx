'use client';

import { Button, Input } from '@/components/ui';
import { signInSchema, supabase, type SignInFormData } from '@/lib';
import { useAuthStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { version } from '../../package.json';

export default function SignInScreen() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: SignInFormData) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (authError) throw new Error(authError.message);
      if (!authData.session) throw new Error('No session returned');

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select(
          'id, auth_id, first_name, last_name, email, unit_id, position_id, user_type_id, user_type:user_types(name)'
        )
        .eq('auth_id', authData.session.user.id)
        .single();

      if (profileError || !profile) throw new Error('User profile not found');

      const userTypeName = (profile.user_type as unknown as { name: string })?.name ?? '';
      if (userTypeName !== 'ERT Member') {
        await supabase.auth.signOut();
        throw new Error('Your account does not have access to this resource.');
      }

      setUser({
        id: profile.id,
        auth_id: profile.auth_id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        unit_id: profile.unit_id,
        position_id: profile.position_id,
        user_type_id: profile.user_type_id,
        user_type_name: userTypeName,
      });

      router.replace('/(app)');
    } catch (err) {
      Alert.alert('Sign In Failed', err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-900" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 items-center justify-center px-6 py-12">
            {/* Logo area */}
            <View className="mb-10 items-center gap-3">
              <View className="h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
                <Text className="text-4xl font-bold text-white">IRS</Text>
              </View>
              <Text className="text-2xl font-bold text-white">DRRM-H IRS</Text>
              <Text className="text-sm text-blue-200">Incident Reporting System</Text>
            </View>

            {/* Sign in card */}
            <View className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
              <Text className="mb-6 text-xl font-bold text-gray-900">Sign In</Text>

              <View className="gap-4">
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      label="Email"
                      placeholder="you@example.com"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      label="Password"
                      placeholder="••••••••"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      error={errors.password?.message}
                    />
                  )}
                />

                <Button onPress={handleSubmit(onSubmit)} loading={loading} className="mt-2 w-full">
                  Sign In
                </Button>
              </View>

              {/* Divider */}
              <View className="my-5 flex-row items-center gap-3">
                <View className="h-px flex-1 bg-gray-200" />
                <Text className="text-xs text-gray-400">or</Text>
                <View className="h-px flex-1 bg-gray-200" />
              </View>

              {/* Bystander report button */}
              <Pressable
                onPress={() => router.push('/(public)/report-select')}
                className="w-full flex-row items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 active:bg-red-100"
              >
                <View className="h-2 w-2 rounded-full bg-red-500" />
                <Text className="text-sm font-medium text-red-700">Report an Incident</Text>
              </Pressable>

              <Text className="mt-2 text-center text-xs text-gray-400">No account needed</Text>
            </View>

            <Text className="mt-8 text-center text-xs text-gray-100">
              UP Manila — Disaster Risk Reduction &{'\n'}Management in Health
            </Text>
            <Text className="mt-8 text-center text-xs text-gray-50">Version {version}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
