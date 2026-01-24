// GlassView.tsx - Frosted Glass Container
// Core UI primitive for "Obsidian & Glass" aesthetic

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';

interface GlassViewProps {
    children: React.ReactNode;
    intensity?: number;
    style?: ViewStyle;
    className?: string;
}

export function GlassView({
    children,
    intensity = 40,
    style,
    className,
}: GlassViewProps) {
    return (
        <View style={[styles.container, style]} className={className}>
            <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.border} />
            <View style={styles.content}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 24,
        backgroundColor: Colors.glassLight,
    },
    border: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    content: {
        position: 'relative',
        zIndex: 1,
    },
});
