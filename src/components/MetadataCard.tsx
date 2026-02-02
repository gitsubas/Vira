import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Sparkles, Hash } from 'lucide-react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { Colors as StaticColors } from '../constants/Colors';

interface MetadataCardProps {
    score?: number;
    title: string;
    onPress?: () => void;
}

export function MetadataCard({ score = 100, title, onPress }: MetadataCardProps) {
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
            <View style={[
                styles.glowWrapper,
                { backgroundColor: isDark ? 'rgba(20, 20, 20, 0.6)' : 'rgba(240, 240, 245, 0.8)' }
            ]}>
                <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />

                {/* Glass base */}
                <View style={[styles.glassBase, { backgroundColor: colors.glassLight }]} />

                {/* Specific Metadata Decoration */}
                <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                    <Sparkles size={24} color={StaticColors.viroPink} />
                </View>

                {/* Border */}
                <View style={[styles.borderOverlay, {
                    borderColor: colors.glassBorder,
                    borderTopColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)'
                }]} />

                {/* Content */}
                <View style={styles.content}>
                    {/* Tags Decoration */}
                    <View style={styles.tagsHint}>
                        <Hash size={12} color={colors.textMuted} />
                        <Text style={[styles.tagText, { color: colors.textMuted }]}>Metadata</Text>
                    </View>

                    {/* Title Text */}
                    <Text style={[
                        styles.title,
                        { color: colors.textPrimary }
                    ]} numberOfLines={2}>{title}</Text>
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
        width: 160,
        height: 150,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
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
    iconContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 16,
        zIndex: 5,
    },
    tagsHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '500',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    },
});
