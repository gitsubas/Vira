// index.tsx - Splash Screen
// Entry point that shows logo and redirects to Home after delay

import { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';

const ONBOARDING_KEY = '@viro_onboarding_complete';

export default function SplashScreen() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const logoOpacity = useSharedValue(0);
    const logoScale = useSharedValue(0.8);
    const taglineOpacity = useSharedValue(0);

    useEffect(() => {
        // Animate logo in
        logoOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
        logoScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.5)) });

        // Animate tagline with delay
        taglineOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));

        // Check onboarding status and navigate
        const checkOnboardingAndNavigate = async () => {
            try {
                const onboardingComplete = await AsyncStorage.getItem(ONBOARDING_KEY);

                // Wait for splash animation
                await new Promise(resolve => setTimeout(resolve, 2500));

                if (onboardingComplete === 'true') {
                    router.replace('/(tabs)');
                } else {
                    router.replace('/onboarding');
                }
            } catch (error) {
                console.error('Error checking onboarding:', error);
                router.replace('/(tabs)');
            }
        };

        checkOnboardingAndNavigate();
    }, []);

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }],
    }));

    const taglineAnimatedStyle = useAnimatedStyle(() => ({
        opacity: taglineOpacity.value,
    }));

    return (
        <View style={{ flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' }}>
            {/* Logo */}
            <Animated.View style={logoAnimatedStyle}>
                <Image
                    source={require('../assets/images/viro_logo_white.png')}
                    style={{ width: 120, height: 120 }}
                    resizeMode="contain"
                />
            </Animated.View>

            {/* Tagline */}
            <Animated.Text
                style={taglineAnimatedStyle}
                className="text-zinc-500 text-sm mt-8 tracking-wide"
            >
                Powered by Gemini AI
            </Animated.Text>
        </View>
    );
}
