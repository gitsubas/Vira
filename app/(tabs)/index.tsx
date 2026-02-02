// (tabs)/index.tsx - Home Screen
// Updated for Theme Support

import { AnalysisInput } from '../../src/types/analysis';

import { View, Image, Text, ScrollView, Platform, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Link, Image as ImageIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { GlassView } from '../../src/components/GlassView';
import { AnalyzeHero } from '../../src/components/AnalyzeHero';
import { QuickAction } from '../../src/components/QuickAction';
import { RecentScanCard } from '../../src/components/RecentScanCard';
import { useAnalysisStore } from '../../src/store/useAnalysisStore';
import { useThemeColors } from '../../src/hooks/useThemeColors';
import { Colors } from '../../src/constants/Colors';
import { MetadataInput } from '../../src/components/MetadataInput';
import { MetadataCard } from '../../src/components/MetadataCard';

export default function HomeScreen() {
    const router = useRouter();
    // Map history to recentScans for compatibility with existing UI code
    const { history: recentScans, setCurrentInput } = useAnalysisStore();
    const { colors, isDark } = useThemeColors();

    // loadRecentScans is not needed as Zustand persist middleware handles hydration automatically

    // Pick media functionality (unchanged)
    // Start analysis helper
    const handleStartAnalysis = async (input: any) => {
        const { startAnalysis } = useAnalysisStore.getState();
        startAnalysis(input);
        router.push('/analysis/processing');
    };

    // Pick media functionality
    const pickMedia = async (type: 'image' | 'video') => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: type === 'image'
                ? ImagePicker.MediaTypeOptions.Images
                : ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const input: AnalysisInput = {
                uri: asset.uri,
                type: type,
                fileName: asset.fileName || `Start Analysis`,
                mimeType: asset.mimeType || 'image/jpeg',
                duration: asset.duration || undefined,
            };
            setCurrentInput(input);
            handleStartAnalysis(input);
        }
    };

    // Camera handling - Direct capture
    const handleCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const input: AnalysisInput = {
                uri: asset.uri,
                type: 'video',
                fileName: `Captured Video`,
                mimeType: asset.mimeType || 'video/mp4',
                duration: asset.duration || undefined,
            };
            setCurrentInput(input);
            handleStartAnalysis(input);
        }
    };



    const handleViewResult = (id: string, title: string) => {
        router.push({
            pathname: '/analysis/[id]',
            params: { id, title }
        });
    };

    const logoSource = isDark
        ? require('../../assets/images/viro_logo_white.png')
        : require('../../assets/images/viro_logo.png');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <Image
                        source={logoSource}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <View style={[
                        styles.badge,
                        {
                            backgroundColor: colors.glassLight,
                            borderColor: colors.glassBorder
                        }
                    ]}>
                        <Text style={[styles.badgeText, { color: colors.textSecondary }]}>PRO</Text>
                    </View>
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <AnalyzeHero onPress={handleCamera} />

                    <View style={styles.quickActions}>
                        <QuickAction
                            icon={Link}
                            label="Paste Link"
                            onPress={() => { /* TODO */ }}
                        />
                        <QuickAction
                            icon={ImageIcon}
                            label="Upload"
                            onPress={() => pickMedia('video')}
                        />
                    </View>

                    {/* New Metadata Input */}
                    <View style={styles.metadataSection}>
                        <MetadataInput />
                    </View>
                </View>

                {/* Recent Scans */}
                {/* Recent Scans (Videos/Images) */}
                <View style={styles.recentSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Scans</Text>
                        <Pressable onPress={() => router.push('/history/scans')}>
                            <Text style={[styles.viewAllText, { color: colors.viroPink }]}>View All</Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.recentList}
                    >
                        {recentScans.filter(s => s.input.type !== 'text').slice(0, 10).length > 0 ? (
                            recentScans.filter(s => s.input.type !== 'text').slice(0, 10).map((scan) => (
                                <View key={scan.id} style={{ marginRight: 20 }}>
                                    <RecentScanCard
                                        score={scan.score}
                                        title={scan.seo?.titles?.[0] || scan.input.fileName || 'Untitled Scan'}
                                        thumbnail={scan.input.thumbnailUri ? { uri: scan.input.thumbnailUri } : (scan.input.type === 'image' ? { uri: scan.input.uri } : undefined)}
                                        onPress={() => handleViewResult(scan.id, scan.seo?.titles?.[0] || scan.input.fileName || 'Scan Result')}
                                    />
                                </View>
                            ))
                        ) : (
                            <View style={[styles.emptyCard, { backgroundColor: colors.glassLight, borderColor: colors.glassBorder }]}>
                                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No recent scans</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>

                {/* Recent Metadata (Text) */}
                <View style={styles.recentSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Metadata</Text>
                        <Pressable onPress={() => router.push('/history/metadata')}>
                            <Text style={[styles.viewAllText, { color: colors.viroPink }]}>View All</Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.recentList}
                    >
                        {recentScans.filter(s => s.input.type === 'text').slice(0, 10).length > 0 ? (
                            recentScans.filter(s => s.input.type === 'text').slice(0, 10).map((scan) => (
                                <View key={scan.id} style={{ marginRight: 20 }}>
                                    <MetadataCard
                                        score={scan.score}
                                        title={scan.input.fileName || scan.input.text || 'Untitled'}
                                        onPress={() => handleViewResult(scan.id, scan.input.fileName || 'Result')}
                                    />
                                </View>
                            ))
                        ) : (
                            <View style={[styles.emptyCard, { backgroundColor: colors.glassLight, borderColor: colors.glassBorder }]}>
                                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No recent metadata</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 12,
    },
    logo: {
        width: 80,
        height: 32,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
    },
    heroSection: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    quickActions: {
        flexDirection: 'row',
        marginTop: 40,
        gap: 24,
    },
    metadataSection: {
        width: '100%',
        marginTop: 48,
        marginBottom: 20,
    },
    recentSection: {
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
    },
    recentList: {
        paddingHorizontal: 24,
        paddingRight: 24,
    },
    emptyCard: {
        width: 210,
        height: 150,
        borderRadius: 24,
        borderWidth: 1,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
});
