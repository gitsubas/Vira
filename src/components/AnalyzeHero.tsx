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
        width: 160,
        height: 160,
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
    // Subtle outer glow
    outerGlow: {
        position: 'absolute',
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    // Main metallic ring
    metallicRing: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        // Outer shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    // Top-left light gradient simulation
    ringGradientLight: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: '50%',
        bottom: '50%',
        backgroundColor: 'rgba(100, 100, 100, 0.4)',
        borderTopLeftRadius: 75,
    },
    // Bottom-right dark gradient simulation
    ringGradientDark: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: '50%',
        top: '50%',
        backgroundColor: 'rgba(30, 30, 30, 0.6)',
        borderBottomRightRadius: 75,
    },
    // Inner highlight border
    ringInnerBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 75,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderTopColor: 'rgba(255, 255, 255, 0.3)',
        borderLeftColor: 'rgba(255, 255, 255, 0.25)',
    },
    // Inner white button
    innerButton: {
        width: 105,
        height: 105,
        borderRadius: 52.5,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        // Inner shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },
    label: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '500',
        marginTop: 20,
        letterSpacing: 0.3,
    },
});
