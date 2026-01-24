// analysis/[id].tsx - Analysis Result Screen
// Displays full analysis results from Gemini

import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { ArrowLeft, Share2, Check, Copy, ChevronRight } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../../src/constants/Colors';
import { useAnalysisStore } from '../../src/store/useAnalysisStore';

export default function AnalysisResultScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Get result from store
    const { currentResult, getResultById } = useAnalysisStore();

    // Try to get from current result or history
    const result = currentResult?.id === id ? currentResult : getResultById(id || '');

    const handleBack = () => {
        router.replace('/(tabs)');
    };

    const handleShare = () => {
        // TODO: Implement share functionality
        Alert.alert('Share', 'Share feature coming soon');
    };

    const handleCopy = async (text: string, label: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied!', `${label} copied to clipboard`);
    };

    const handleViewSEO = () => {
        // Could navigate to a dedicated SEO screen
        if (result?.seo) {
            Alert.alert(
                'SEO Content',
                `Titles:\n${result.seo.titles.join('\n')}\n\nCaption:\n${result.seo.caption}\n\nHashtags:\n#${result.seo.hashtags.join(' #')}`
            );
        }
    };

    // Handle missing result
    if (!result) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Result not found</Text>
                    <Pressable style={styles.backButtonFull} onPress={handleBack}>
                        <Text style={styles.backButtonText}>Go Home</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // Pure white for mockup accuracy - no color coding on gauge
    const ringColor = 'rgba(255, 255, 255, 0.85)';
    const scoreColor = Colors.white;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <ArrowLeft size={24} color={Colors.white} />
                </Pressable>
                <Text style={styles.headerTitle}>Analysis Result</Text>
                <Pressable onPress={handleShare} style={styles.shareButton}>
                    <Share2 size={20} color={Colors.white} />
                </Pressable>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Score Gauge - Pure white ring per mockup */}
                <View style={styles.scoreContainer}>
                    <View style={[styles.scoreRing, { borderColor: ringColor }]}>
                        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                        <Text style={[styles.scoreValue, { color: scoreColor }]}>
                            {result.score}
                        </Text>
                    </View>
                    <Text style={styles.verdict}>{result.viralPotential}</Text>
                    <Text style={styles.fileName}>{result.input.fileName}</Text>
                </View>

                {/* Insights */}
                <View style={styles.insightsContainer}>
                    <InsightCard
                        title="Hook Strength"
                        value={result.hookStrength}
                        isGood={result.hookStrength === 'Strong'}
                    />
                    <InsightCard
                        title="Pacing"
                        value={result.pacing}
                        isGood={!result.pacing.toLowerCase().includes('slow')}
                    />
                </View>

                {/* Keywords */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Keywords</Text>
                    <View style={styles.keywordsGrid}>
                        {result.keywords.map((keyword, index) => (
                            <Pressable
                                key={index}
                                style={styles.keywordTag}
                                onPress={() => handleCopy(keyword, 'Keyword')}
                            >
                                <Text style={styles.keywordText}>{keyword}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Improvements */}
                {result.improvements.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Improvements</Text>
                        <View style={styles.improvementsList}>
                            {result.improvements.map((tip, index) => (
                                <View key={index} style={styles.improvementItem}>
                                    <Text style={styles.improvementBullet}>•</Text>
                                    <Text style={styles.improvementText}>{tip}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* SEO Section */}
                <Pressable style={styles.seoCard} onPress={handleViewSEO}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={styles.seoCardBorder} />
                    <View style={styles.seoCardContent}>
                        <View>
                            <Text style={styles.seoTitle}>SEO Content</Text>
                            <Text style={styles.seoSubtitle}>
                                {result.seo.titles.length} titles, {result.seo.hashtags.length} hashtags
                            </Text>
                        </View>
                        <ChevronRight size={20} color={Colors.textMuted} />
                    </View>
                </Pressable>

                {/* Quick Copy Buttons */}
                <View style={styles.copyButtonsRow}>
                    <Pressable
                        style={styles.copyButton}
                        onPress={() => handleCopy(result.seo.caption, 'Caption')}
                    >
                        <Copy size={16} color={Colors.white} />
                        <Text style={styles.copyButtonText}>Copy Caption</Text>
                    </Pressable>
                    <Pressable
                        style={styles.copyButton}
                        onPress={() => handleCopy('#' + result.seo.hashtags.join(' #'), 'Hashtags')}
                    >
                        <Copy size={16} color={Colors.white} />
                        <Text style={styles.copyButtonText}>Copy Hashtags</Text>
                    </Pressable>
                </View>

                {/* Action Button */}
                <Pressable style={styles.primaryButton} onPress={handleBack}>
                    <Text style={styles.primaryButtonText}>Analyze Another</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

// Insight card component - white checkmarks per mockup
function InsightCard({ title, value, isGood }: { title: string; value: string; isGood: boolean }) {
    return (
        <View style={styles.insightCard}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.insightCardBorder} />
            <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{title}: {value}</Text>
                <Check size={20} color={Colors.white} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    shareButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    scoreContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    scoreRing: {
        width: 180,
        height: 180,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 2,
    },
    scoreValue: {
        fontSize: 64,
        fontWeight: '700',
        zIndex: 1,
    },
    verdict: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: '600',
        marginTop: 20,
        letterSpacing: 0.5,
    },
    fileName: {
        color: Colors.textMuted,
        fontSize: 14,
        marginTop: 6,
    },
    insightsContainer: {
        gap: 12,
        marginBottom: 24,
    },
    insightCard: {
        height: 60,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
    },
    insightCardBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    insightContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 1,
    },
    insightTitle: {
        color: Colors.white,
        fontSize: 17,
        fontWeight: '500',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    keywordsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    keywordTag: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    keywordText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
    improvementsList: {
        gap: 8,
    },
    improvementItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    improvementBullet: {
        color: Colors.textMuted,
        fontSize: 14,
        marginRight: 8,
        marginTop: 2,
    },
    improvementText: {
        color: Colors.textMuted,
        fontSize: 14,
        flex: 1,
        lineHeight: 20,
    },
    seoCard: {
        height: 76,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        marginBottom: 20,
    },
    seoCardBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    seoCardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 1,
    },
    seoTitle: {
        color: Colors.white,
        fontSize: 17,
        fontWeight: '600',
    },
    seoSubtitle: {
        color: Colors.textMuted,
        fontSize: 14,
        marginTop: 3,
    },
    copyButtonsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    copyButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        gap: 8,
    },
    copyButtonText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
    primaryButton: {
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: Colors.black,
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    // Error state
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorText: {
        color: Colors.textMuted,
        fontSize: 18,
        marginBottom: 24,
    },
    backButtonFull: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        backgroundColor: Colors.white,
        borderRadius: 25,
    },
    backButtonText: {
        color: Colors.black,
        fontSize: 16,
        fontWeight: '600',
    },
});
