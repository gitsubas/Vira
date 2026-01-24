// AnalyzeHero.tsx - Main Action Button
// Mockup-accurate: Metallic gradient ring with glow, white inner button, camera icon

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
import { Colors } from '../constants/Colors';

interface AnalyzeHeroProps {
    onPress: () => void;
    disabled?: boolean;
}

export function AnalyzeHero({ onPress, disabled }: AnalyzeHeroProps) {
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
                    <View style={styles.outerGlow} />

                    {/* Metallic ring - layered gradient effect */}
                    <View style={styles.metallicRing}>
                        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

                        {/* Gradient simulation layers */}
                        <View style={styles.ringGradientLight} />
                        <View style={styles.ringGradientDark} />

                        {/* Inner border highlight */}
                        <View style={styles.ringInnerBorder} />

                        {/* Inner white button */}
                        <View style={styles.innerButton}>
                            <Camera size={40} color={Colors.black} strokeWidth={1.5} />
                        </View>
                    </View>
                </Pressable>
            </Animated.View>
            <Text style={styles.label}>Analyze Video</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    outerContainer: {
        width: 180,
        height: 180,
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
    // Subtle outer glow - enhanced
    outerGlow: {
        position: 'absolute',
        width: 190,
        height: 190,
        borderRadius: 95,
        backgroundColor: 'transparent',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 30,
    },
    // Pure white ring - matching mockup
    metallicRing: {
        width: 170,
        height: 170,
        borderRadius: 85,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.9)',
        // Subtle shadow for depth
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 8,
    },
    // Removed gradient layers - keeping for backwards compatibility but transparent
    ringGradientLight: {
        display: 'none',
    },
    ringGradientDark: {
        display: 'none',
    },
    // Inner highlight border - subtle
    ringInnerBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 85,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    // Inner white button - larger
    innerButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        // Inner shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    label: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '600',
        marginTop: 24,
        letterSpacing: 0.5,
    },
});

