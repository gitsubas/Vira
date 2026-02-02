// GlassView.tsx - Reusable Glassmorphism Container
// Supports dynamic theming via useThemeColors hook

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeColors } from '../hooks/useThemeColors';

interface GlassViewProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
}

export function GlassView({ children, style, intensity = 20 }: GlassViewProps) {
    const { colors, isDark } = useThemeColors();

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.glassLight,
                borderColor: colors.glassBorder
            },
            style
        ]}>
            <BlurView
                intensity={intensity}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
            />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 24,
        borderWidth: 1,
    },
});
