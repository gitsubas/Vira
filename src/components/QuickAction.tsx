// QuickAction.tsx - Glassmorphism Quick Action Buttons
// Theme-aware: Adapts colors for Light/Dark modes

import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LucideIcon } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';

interface QuickActionProps {
    icon: LucideIcon;
    label: string;
    onPress: () => void;
}

export function QuickAction({ icon: Icon, label, onPress }: QuickActionProps) {
    const { colors, isDark } = useThemeColors();

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
            ]}
        >
            <View style={[styles.iconContainer, { backgroundColor: colors.glassLight }]}>
                <BlurView intensity={35} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />

                {/* Border Overlay */}
                <View style={[styles.borderOverlay, { borderColor: colors.glassBorder }]} />

                {/* Inner Glow/Highlight */}
                <View style={[styles.innerGlow, { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]} />

                {/* Icon Color - Dynamic */}
                <Icon size={30} color={colors.textPrimary} strokeWidth={2} />
            </View>
            <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    pressed: {
        opacity: 0.7,
    },
    iconContainer: {
        width: 78,
        height: 78,
        borderRadius: 39,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    borderOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 39,
        borderWidth: 2,
    },
    innerGlow: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 39,
        borderWidth: 1.5,
        margin: 3,
    },
    label: {
        fontSize: 18,
        marginTop: 15,
        fontWeight: '400',
    },
});
