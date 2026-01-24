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

    // Determine score color based on value
    const getScoreColor = (score: number) => {
        if (score >= 80) return '#22C55E'; // Green
        if (score >= 60) return '#EAB308'; // Yellow
        return '#EF4444'; // Red
    };

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
                {/* Score Gauge */}
                <View style={styles.scoreContainer}>
                    <View style={[styles.scoreRing, { borderColor: getScoreColor(result.score) }]}>
                        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                        <Text style={[styles.scoreValue, { color: getScoreColor(result.score) }]}>
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

// Insight card component
function InsightCard({ title, value, isGood }: { title: string; value: string; isGood: boolean }) {
    return (
        <View style={styles.insightCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.insightCardBorder} />
            <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{title}: {value}</Text>
                <Check size={18} color={isGood ? '#22C55E' : '#EAB308'} />
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
        paddingVertical: 32,
    },
    scoreRing: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 3,
    },
    scoreValue: {
        fontSize: 56,
        fontWeight: '700',
        zIndex: 1,
    },
    verdict: {
        color: Colors.white,
        fontSize: 22,
        fontWeight: '600',
        marginTop: 16,
    },
    fileName: {
        color: Colors.textMuted,
        fontSize: 13,
        marginTop: 4,
    },
    insightsContainer: {
        gap: 12,
        marginBottom: 24,
    },
    insightCard: {
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    insightCardBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
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
        fontSize: 16,
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
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    keywordText: {
        color: Colors.white,
        fontSize: 13,
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
        height: 72,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: 16,
    },
    seoCardBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
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
        fontSize: 16,
        fontWeight: '600',
    },
    seoSubtitle: {
        color: Colors.textMuted,
        fontSize: 13,
        marginTop: 2,
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
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: Colors.black,
        fontSize: 17,
        fontWeight: '600',
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
