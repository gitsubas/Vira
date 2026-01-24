// QuickAction.tsx - Glassmorphism Quick Action Buttons
// Mockup-accurate: Stronger glass effect, more visible border

import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LucideIcon } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

interface QuickActionProps {
    icon: LucideIcon;
    label: string;
    onPress: () => void;
}

export function QuickAction({ icon: Icon, label, onPress }: QuickActionProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
            ]}
        >
            <View style={styles.iconContainer}>
                <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
                {/* Stronger border with subtle glow */}
                <View style={styles.borderOverlay} />
                <View style={styles.innerGlow} />
                <Icon size={20} color={Colors.white} strokeWidth={1.5} />
            </View>
            <Text style={styles.label}>{label}</Text>
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
        width: 52,
        height: 52,
        borderRadius: 26,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.08)', // Slightly more visible glass
        justifyContent: 'center',
        alignItems: 'center',
        // Subtle shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    borderOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 26,
        borderWidth: 1.5, // Thicker border
        borderColor: 'rgba(255, 255, 255, 0.25)', // More visible border
    },
    innerGlow: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 26,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        margin: 2,
    },
    label: {
        color: Colors.textMuted,
        fontSize: 12,
        marginTop: 10,
        fontWeight: '400',
    },
});
