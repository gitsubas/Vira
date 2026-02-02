// RecentScanCard.tsx - Glassmorphism Recent Scan Card
// Theme-aware: Adapts colors for Light/Dark modes

import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeColors } from '../hooks/useThemeColors';
import { Colors as StaticColors } from '../constants/Colors';

interface RecentScanCardProps {
    score: number;
    title: string;
    thumbnail?: ImageSourcePropType;
    onPress?: () => void;
}

export function RecentScanCard({ score, title, thumbnail, onPress }: RecentScanCardProps) {
    const { colors, isDark } = useThemeColors();

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
                { shadowColor: colors.glassBorder }
            ]}
        >
            {/* Shadow wrapper for glow effect */}
            <View style={[
                styles.glowWrapper,
                { backgroundColor: isDark ? 'rgba(20, 20, 20, 0.6)' : 'rgba(240, 240, 245, 0.8)' }
            ]}>
                {/* Blur background for glass effect */}
                <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />

                {/* Glass base */}
                <View style={[styles.glassBase, { backgroundColor: colors.glassLight }]} />

                {/* Thumbnail (if provided) */}
                {thumbnail && (
                    <Image source={thumbnail} style={styles.thumbnail} resizeMode="cover" />
                )}

                {/* Gradient overlay - Only visible if thumbnail exists or always?
           In original design: Always on.
           In Light mode: Should likely be lighter? 
           For readability of WHITE text over thumbnail, we need dark gradient.
           User requested: "white logo on dark theme, and black logo on light theme."
           But this is user content (thumbnail).
           Let's keep text interactions standard.
        */}
                <View style={[
                    styles.gradientOverlay,
                    { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.1)' }
                ]} />

                {/* Border with glow effect */}
                <View style={[styles.borderOverlay, {
                    borderColor: colors.glassBorder,
                    borderTopColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)'
                }]} />

                {/* Content */}
                <View style={styles.content}>
                    {/* Score Text */}
                    <Text style={[
                        styles.score,
                        {
                            color: colors.textPrimary,
                            textShadowColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'transparent'
                        }
                    ]}>{score}</Text>

                    {/* Title Text */}
                    <Text style={[
                        styles.title,
                        { color: colors.textSecondary }
                    ]} numberOfLines={1}>{title}</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 4,
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    glowWrapper: {
        width: 210,
        height: 150,
        borderRadius: 24,
        overflow: 'hidden',
    },
    glassBase: {
        ...StyleSheet.absoluteFillObject,
    },
    borderOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 24,
        borderWidth: 2,
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
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 18,
        zIndex: 5,
    },
    score: {
        fontSize: 48,
        fontWeight: '700',
        lineHeight: 54,
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    title: {
        fontSize: 16,
        marginTop: 4,
    },
});
