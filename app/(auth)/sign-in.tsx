'use client';

import { Button, Input } from '@/components/ui';
import { signInSchema, supabase, type SignInFormData } from '@/lib';
import { useAuthStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Animated,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
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

      router.replace('/(app)/(home)');
    } catch (err) {
      Alert.alert('Sign In Failed', err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top', 'bottom']}>
      <AnimatedBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 items-center justify-center px-6 py-12">
            {/* Logo area */}
            <View className="mb-10 items-center gap-3">
              <View className="flex flex-row gap-4">
                <Image
                  source={require('@assets/images/up-logo.png')}
                  style={{ width: 64, height: 64 }}
                  resizeMode="contain"
                  accessible={true}
                  accessibilityLabel="App logo"
                />
                <Image
                  source={require('@assets/images/upm-drrmh-logo.png')}
                  style={{ width: 64, height: 64 }}
                  resizeMode="contain"
                  accessible={true}
                  accessibilityLabel="App logo"
                />
                <Image
                  source={require('@assets/images/irs-favicon.png')}
                  style={{ width: 64, height: 64 }}
                  resizeMode="contain"
                  accessible={true}
                  accessibilityLabel="App logo"
                />
              </View>
              <View className="flex items-center gap-1">
                <Text className="text-2xl font-bold text-gray-50">DRRM-H IRS</Text>
                <Text className="text-sm text-gray-200">Incident Reporting System</Text>
              </View>
            </View>

            {/* Sign in card */}
            <View className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <Text className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-25">
                Sign In
              </Text>

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
                <View className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                <Text className="text-xs text-gray-400 dark:text-gray-500">or</Text>
                <View className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              </View>

              {/* Bystander report button */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/(public)/report-select')}
                className="w-full flex-row items-center justify-center gap-2 rounded-xl border border-brand-100 bg-brand-50 py-3 dark:border-brand-800 dark:bg-brand-900"
              >
                <View className="h-2 w-2 rounded-full bg-brand-500" />
                <Text className="text-sm font-medium text-brand-700 dark:text-brand-400">
                  Report an Incident
                </Text>
              </TouchableOpacity>

              <Text className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
                No account needed
              </Text>
            </View>

            <Text className="mt-8 text-center text-sm text-gray-50">
              UP Manila — Disaster Risk Reduction &{'\n'}Management in Health
            </Text>
            <Text className="mt-8 text-center text-xs text-gray-300">Version {version}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AnimatedBackground() {
  const BG_IMAGES = [
    require('@assets/images/upm-drrmh-background-1.jpg'),
    require('@assets/images/upm-drrmh-background-2.jpg'),
    require('@assets/images/upm-drrmh-background-3.jpg'),
    require('@assets/images/upm-drrmh-background-4.jpg'),
  ];
  const [current, setCurrent] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      // Fade out
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        // Swap image then fade in
        setCurrent((prev) => (prev + 1) % BG_IMAGES.length);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => clearInterval(timer);
  });

  return (
    <Animated.View style={{ opacity }} className="absolute inset-0">
      <ImageBackground source={BG_IMAGES[current]} className="absolute inset-0" resizeMode="cover">
        {/* dark overlay like your bg-brand-900/60 */}
        <View className="absolute inset-0 bg-black/60" />
      </ImageBackground>
    </Animated.View>
  );
}
