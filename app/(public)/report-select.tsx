import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { REPORT_TYPES, ReportType } from './constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const CARD_GAP = 10;

function CardIcon({ shape, color }: { shape: ReportType['iconShape']; color: string }) {
  if (shape === 'triangle') {
    return (
      <View
        className="opacity-90"
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 14,
          borderRightWidth: 14,
          borderBottomWidth: 28,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
    );
  }

  return (
    <View
      className={[
        'h-7 w-7 opacity-90',
        shape === 'circle' && 'rounded-full',
        shape === 'diamond' && 'rotate-45 rounded-sm',
        shape === 'square' && 'rounded-sm',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ borderWidth: 2.5, borderColor: color }}
    />
  );
}

export default function ReportSelectScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const carouselAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(80, [
      Animated.spring(headerAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 120,
      }),
      Animated.spring(carouselAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 100,
      }),
      Animated.spring(dotsAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 120,
      }),
    ]).start();
  }, [carouselAnim, dotsAnim, headerAnim]);

  const headerStyle = {
    opacity: headerAnim,
    transform: [
      {
        translateY: headerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  };

  const carouselStyle = {
    opacity: carouselAnim,
    transform: [
      {
        translateY: carouselAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [32, 0],
        }),
      },
    ],
  };

  const dotsStyle = {
    opacity: dotsAnim,
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950" edges={['top', 'bottom']}>
      {/* Header */}
      <Animated.View style={headerStyle} className="px-6 pb-2 pt-4">
        <Pressable
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="mb-6 self-start"
        >
          <Text className="text-sm text-gray-400 dark:text-gray-500">← Back to sign in</Text>
        </Pressable>
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
          What are you{'\n'}reporting?
        </Text>
        <Text className="mt-2 text-sm text-gray-400 dark:text-gray-500">
          Swipe to browse · No account needed
        </Text>
      </Animated.View>

      {/* Carousel */}
      <Animated.View style={[carouselStyle, { flex: 1, marginTop: 32, justifyContent: 'center' }]}>
        <Animated.FlatList
          data={REPORT_TYPES}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_GAP}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
            gap: CARD_GAP,
            alignItems: 'center',
          }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: true,
          })}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP));
            setActiveIndex(index);
          }}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * (CARD_WIDTH + CARD_GAP),
              index * (CARD_WIDTH + CARD_GAP),
              (index + 1) * (CARD_WIDTH + CARD_GAP),
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.88, 1, 0.88],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.45, 1, 0.45],
              extrapolate: 'clamp',
            });

            const isActive = index === activeIndex;

            return (
              <Animated.View
                style={{ width: CARD_WIDTH, height: '85%', transform: [{ scale }], opacity }}
              >
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/(public)/report-submit',
                      params: { type: item.id, title: item.title },
                    })
                  }
                  style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1, flex: 1 })}
                >
                  <View
                    className="h-full rounded-3xl border p-7"
                    style={{
                      backgroundColor: isActive
                        ? isDark
                          ? '#1f2937'
                          : '#f9fafb'
                        : isDark
                          ? '#111827'
                          : '#f3f4f6',
                      borderColor: isActive
                        ? item.accentColor + '55'
                        : isDark
                          ? 'rgba(255,255,255,0.07)'
                          : 'rgba(0,0,0,0.07)',
                    }}
                  >
                    {/* Icon */}
                    <View
                      className="mb-6 h-16 w-16 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: item.dimColor }}
                    >
                      <CardIcon shape={item.iconShape} color={item.accentColor} />
                    </View>

                    {/* Subtitle */}
                    <Text
                      className="mb-2 text-xs font-semibold uppercase tracking-widest"
                      style={{ color: item.accentColor }}
                    >
                      {item.subtitle}
                    </Text>

                    {/* Title */}
                    <Text className="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white">
                      {item.title}
                    </Text>

                    {/* Description */}
                    <Text className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                      {item.description}
                    </Text>

                    {/* CTA Button */}
                    <View
                      className="mt-auto items-center rounded-xl border py-3.5"
                      style={{
                        backgroundColor: item.accentColor + '18',
                        borderColor: item.accentColor + '40',
                      }}
                    >
                      <Text className="text-sm font-semibold" style={{ color: item.accentColor }}>
                        Select & Continue →
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            );
          }}
        />
      </Animated.View>

      {/* Dot indicators */}
      <Animated.View style={dotsStyle} className="mb-8 flex-row items-center justify-center gap-2">
        {REPORT_TYPES.map((item, i) => (
          <View
            key={item.id}
            className={`h-1.5 rounded-full ${i === activeIndex ? 'w-5' : 'w-1.5'}`}
            style={{
              backgroundColor:
                i === activeIndex
                  ? REPORT_TYPES[activeIndex].accentColor
                  : isDark
                    ? '#4b5563'
                    : '#d1d5db',
            }}
          />
        ))}
      </Animated.View>
    </SafeAreaView>
  );
}
