// AnalyzeHero.tsx - Main Action Button
// Mockup-accurate: Metallic gradient ring with glow
// Theme-aware: Adapts colors for Light/Dark modes

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Camera } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
} from 'react-native-reanimated';
import { useThemeColors } from '../hooks/useThemeColors';
import { Colors as StaticColors } from '../constants/Colors'; // For static references if needed

interface AnalyzeHeroProps {
    onPress: () => void;
    disabled?: boolean;
}

export function AnalyzeHero({ onPress, disabled }: AnalyzeHeroProps) {
    const { colors, isDark } = useThemeColors();
    const pulseScale = useSharedValue(1);

    React.useEffect(() => {
        pulseScale.value = withRepeat(
            withSequence(
                withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    // Ring Style Logic
    // Dark: Dark metallic (#1a1a1a) + White inner button
    // Light: Light metallic (#E5E5E5) + Black inner button (or inverted?)
    // User asked for "white logo on dark theme, and black logo on light theme."
    // For the AnalyzeHero inner button, it's a solid circle.
    // Dark Theme: White Button with Black Icon
    // Light Theme: Black Button with White Icon (to invert effectively) OR White Button with Black Icon?
    // Let's go with:
    // Dark Theme: White Button, Black Icon
    // Light Theme: Black Button, White Icon

    const ringBackgroundColor = isDark ? '#1a1a1a' : '#E5E5E5';
    const innerButtonColor = isDark ? StaticColors.white : StaticColors.black;
    const iconColor = isDark ? StaticColors.black : StaticColors.white;

    return (
        <View style={styles.container}>
            <Animated.View style={animatedStyle}>
                <Pressable
                    onPress={onPress}
                    disabled={disabled}
                    style={({ pressed }) => [
                        styles.outerContainer,
                        pressed && styles.pressed,
                        disabled && styles.disabled,
                    ]}
                >
                    {/* Outer glow effect */}
                    <View style={[
                        styles.outerGlow,
                        { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' }
                    ]} />

                    {/* Metallic ring - layered gradient effect */}
                    <View style={[styles.metallicRing, { backgroundColor: ringBackgroundColor }]}>
                        <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />

                        {/* Gradient simulation layers */}
                        <View style={[
                            styles.ringGradientLight,
                            { backgroundColor: isDark ? 'rgba(100, 100, 100, 0.4)' : 'rgba(255, 255, 255, 0.6)' }
                        ]} />
                        <View style={[
                            styles.ringGradientDark,
                            { backgroundColor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(0, 0, 0, 0.1)' }
                        ]} />

                        {/* Inner border highlight */}
                        <View style={[styles.ringInnerBorder, { borderColor: colors.glassBorder }]} />

                        {/* Inner button */}
                        <View style={[styles.innerButton, { backgroundColor: innerButtonColor }]}>
                            <Camera size={60} color={iconColor} strokeWidth={1.5} />
                        </View>
                    </View>
                </Pressable>
            </Animated.View>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Analyze Video</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    outerContainer: {
        width: 240,
        height: 240,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    disabled: {
        opacity: 0.5,
    },
    outerGlow: {
        position: 'absolute',
        width: 255,
        height: 255,
        borderRadius: 127.5,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
    },
    metallicRing: {
        width: 225,
        height: 225,
        borderRadius: 112.5,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    ringGradientLight: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: '50%',
        bottom: '50%',
        borderTopLeftRadius: 112.5,
    },
    ringGradientDark: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: '50%',
        top: '50%',
        borderBottomRightRadius: 112.5,
    },
    ringInnerBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 112.5,
        borderWidth: 1.5,
    },
    innerButton: {
        width: 158,
        height: 158,
        borderRadius: 79,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 9,
        elevation: 6,
    },
    label: {
        fontSize: 27,
        fontWeight: '500',
        marginTop: 30,
        letterSpacing: 0.4,
    },
});
