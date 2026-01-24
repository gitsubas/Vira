// (tabs)/index.tsx - Home Screen / Dashboard
// Obsidian & Glass aesthetic: white logo, glassmorphism components

import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Link, Upload } from 'lucide-react-native';
import { AnalyzeHero } from '../../src/components/AnalyzeHero';
import { QuickAction } from '../../src/components/QuickAction';
import { RecentScanCard } from '../../src/components/RecentScanCard';
import { Colors } from '../../src/constants/Colors';
import { pickMediaFromGallery, MediaAsset } from '../../src/services/MediaService';
import { useAnalysisStore, useAnalysisHistory } from '../../src/store/useAnalysisStore';
import { useSubscriptionStore } from '../../src/store/useSubscriptionStore';
import { AnalysisInput } from '../../src/types/analysis';

export default function HomeScreen() {
    const router = useRouter();
    const startAnalysis = useAnalysisStore((state) => state.startAnalysis);
    const { canPerformAnalysis, incrementUsage } = useSubscriptionStore();

    // Navigate to capture/upload screen
    const handleAnalyze = () => {
        router.push('/analysis');
    };

    // Quick action: Paste video URL
    const handlePasteLink = () => {
        Alert.alert('Paste Link', 'URL analysis feature coming soon');
    };

    // Handle media selected -> check limits, start analysis, navigate
    const handleMediaSelected = async (asset: MediaAsset) => {
        // Check subscription limits before proceeding
        const videoDuration = asset.type === 'video' ? asset.duration : undefined;
        const { allowed, reason } = canPerformAnalysis(videoDuration);

        if (!allowed) {
            Alert.alert(
                'Upgrade Required',
                reason,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Upgrade Now', onPress: () => router.push('/paywall') },
                ]
            );
            return;
        }

        // Convert to AnalysisInput
        const input: AnalysisInput = {
            uri: asset.uri,
            type: asset.type,
            mimeType: asset.mimeType,
            fileName: asset.fileName,
            duration: asset.duration,
            thumbnailUri: asset.thumbnailUri,
        };

        // Start analysis (runs in background)
        startAnalysis(input)
            .then(() => {
                incrementUsage();
            })
            .catch((error) => {
                console.error('Analysis failed:', error);
            });

        // Navigate to processing screen
        router.push('/analysis/processing');
    };

    // Quick action: Upload from gallery directly
    const handleUpload = async () => {
        const result = await pickMediaFromGallery();
        if (result.success && result.asset) {
            await handleMediaSelected(result.asset);
        } else if (result.error && result.error !== 'Selection cancelled') {
            Alert.alert('Error', result.error);
        }
    };

    // View past analysis result
    const handleViewResult = (id: string, title: string) => {
        router.push(`/analysis/${id}`);
    };

    const history = useAnalysisHistory();
    const recentScans = history.slice(0, 5);
    const hasRecentScans = recentScans.length > 0;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header with Logo - white logo on black background */}
            <View style={styles.header}>
                <Image
                    source={require('../../assets/images/viro_logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Hero Section - Centered */}
                <View style={styles.heroSection}>
                    <AnalyzeHero onPress={handleAnalyze} />

                    {/* Quick Actions Row */}
                    <View style={styles.quickActions}>
                        <QuickAction icon={Link} label="Link" onPress={handlePasteLink} />
                        <QuickAction icon={Upload} label="Upload" onPress={handleUpload} />
                    </View>
                </View>

                {/* Recent Scans Section */}
                <View style={styles.recentSection}>
                    <Text style={styles.sectionTitle}>Recent Scans</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.recentList}
                    >
                        {hasRecentScans ? (
                            recentScans.map((scan) => (
                                <RecentScanCard
                                    key={scan.id}
                                    score={scan.score}
                                    title={scan.seo?.titles?.[0] || scan.input.fileName || 'Untitled Scan'}
                                    thumbnail={scan.input.thumbnailUri ? { uri: scan.input.thumbnailUri } : (scan.input.type === 'image' ? { uri: scan.input.uri } : undefined)}
                                    onPress={() => handleViewResult(scan.id, scan.seo?.titles?.[0] || scan.input.fileName || 'Scan Result')}
                                />
                            ))
                        ) : (
                            <View style={styles.emptyCard}>
                                <Text style={styles.emptyText}>No scans yet</Text>
                                <Text style={styles.emptySubtext}>
                                    Tap "Analyze Video" to get started
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
    },
    logo: {
        width: 36,
        height: 36,
        tintColor: 'white',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    heroSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 60,
    },
    quickActions: {
        flexDirection: 'row',
        marginTop: 44,
        gap: 16,
    },
    recentSection: {
        paddingBottom: 24,
    },
    sectionTitle: {
        color: Colors.white,
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 14,
    },
    recentList: {
        paddingRight: 20,
    },
    emptyCard: {
        width: 200,
        height: 100,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
    emptySubtext: {
        color: Colors.textMuted,
        fontSize: 12,
        marginTop: 6,
        textAlign: 'center',
    },
});
