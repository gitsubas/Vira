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
                <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />

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
        marginRight: 14,
        // Outer shadow for glow effect - enhanced
        shadowColor: 'rgba(255, 255, 255, 0.25)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 6,
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.97 }],
    },
    glowWrapper: {
        width: 160,
        height: 120,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: 'rgba(30, 30, 30, 0.5)',
    },
    glassBase: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    borderOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.35)',
        // Top highlight - brighter
        borderTopColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 10,
    },
    thumbnail: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        opacity: 0.7,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 14,
        zIndex: 5,
    },
    score: {
        color: Colors.white,
        fontSize: 38,
        fontWeight: '700',
        lineHeight: 42,
        // Text shadow for depth
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    title: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontWeight: '500',
        marginTop: 3,
    },
});

