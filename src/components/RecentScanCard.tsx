// RecentScanCard.tsx - Glassmorphism Recent Scan Card
// Mockup-accurate: Stronger glass effect, visible border glow, clear thumbnail

import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';

interface RecentScanCardProps {
    score: number;
    title: string;
    thumbnail?: ImageSourcePropType;
    onPress?: () => void;
}

export function RecentScanCard({ score, title, thumbnail, onPress }: RecentScanCardProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
            ]}
        >
            {/* Shadow wrapper for glow effect */}
            <View style={styles.glowWrapper}>
                {/* Blur background for glass effect */}
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />

                {/* Glass base */}
                <View style={styles.glassBase} />

                {/* Thumbnail (if provided) */}
                {thumbnail && (
                    <Image source={thumbnail} style={styles.thumbnail} resizeMode="cover" />
                )}

                {/* Gradient overlay for text readability */}
                <View style={styles.gradientOverlay} />

                {/* Border with glow effect */}
                <View style={styles.borderOverlay} />

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.score}>{score}</Text>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginRight: 12,
        // Outer shadow for glow effect
        shadowColor: 'rgba(255, 255, 255, 0.15)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    glowWrapper: {
        width: 140,
        height: 100,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(20, 20, 20, 0.6)',
    },
    glassBase: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    borderOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        // Top highlight
        borderTopColor: 'rgba(255, 255, 255, 0.3)',
        zIndex: 10,
    },
    thumbnail: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        opacity: 0.5,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 12,
        zIndex: 5,
    },
    score: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 36,
        // Text shadow for depth
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    title: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 11,
        marginTop: 2,
    },
});
