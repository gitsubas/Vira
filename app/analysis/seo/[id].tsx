// app/analysis/seo/[id].tsx - Generated Content / SEO Optimization Screen
// Displays AI-generated titles, captions, and hashtags

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Copy, Check, RefreshCw, Hash, Type, MessageSquare } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../../../src/constants/Colors';
import { useAnalysisStore } from '../../../src/store/useAnalysisStore';

type TabType = 'titles' | 'caption' | 'hashtags' | 'tiktok' | 'instagram' | 'youtube';

export default function SEOScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const getResultById = useAnalysisStore((state) => state.getResultById);
    const result = id ? getResultById(id) : null;

    console.log('[SEOScreen] Render', { id, resultFound: !!result, hasSeo: !!result?.seo });
    if (result?.seo) {
        console.log('[SEOScreen] Platforms keys:', Object.keys(result.seo.platforms || {}));
    }

    const [activeTab, setActiveTab] = useState<TabType>('tiktok');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // Platform tabs logic - Derived state
    const { seo } = result || {};


    // Handle back
    const handleBack = () => {
        router.back();
    };

    // Copy to clipboard
    const handleCopy = async (text: string, index: number) => {
        await Clipboard.setStringAsync(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Copy all hashtags
    const handleCopyAllHashtags = async () => {
        const hashtags = result?.seo?.hashtags?.join(' ') || '';
        await Clipboard.setStringAsync(hashtags);
        Alert.alert('Copied!', 'All hashtags copied to clipboard');
    };

    if (!result || !seo) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Result not found</Text>
                    <Pressable style={styles.backButton} onPress={handleBack}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // Platform tabs logic
    // (Logic moved to tabs definition)

    // Tab definitions
    // Tab definitions - Always these 3 platforms
    const tabs: TabType[] = ['tiktok', 'instagram', 'youtube'];

    // Reset active tab if switching between modes (though usually fresh mount)
    // We handle this by initializing correctly or checking valid tab

    // Tab button component (enhanced for platform support)
    const TabButton = ({ tab, label, icon: Icon }: { tab: string; label: string; icon: any }) => (
        <Pressable
            style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
                activeTab === tab && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab(tab as any)}
        >
            <Icon size={18} color={activeTab === tab ? Colors.white : Colors.textMuted} />
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
                {label}
            </Text>
        </Pressable>
    );

    // Render Platform Specific Content
    const renderPlatformContent = (platform: 'tiktok' | 'instagram' | 'youtube') => {
        const data = seo.platforms?.[platform];
        if (!data) return <Text style={styles.noContent}>No data for {platform}</Text>;

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{platform.charAt(0).toUpperCase() + platform.slice(1)} Optimization</Text>

                {/* Title */}
                <View style={styles.cardGroup}>
                    <Text style={styles.cardLabel}>Title</Text>
                    <View style={styles.itemCard}>
                        <Text style={styles.itemText}>{data.title}</Text>
                        <Pressable style={styles.copyButton} onPress={() => handleCopy(data.title, 1)}>
                            {copiedIndex === 1 ? <Check size={18} color={Colors.viroCyan} /> : <Copy size={18} color={Colors.textMuted} />}
                        </Pressable>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.cardGroup}>
                    <Text style={styles.cardLabel}>Description/Caption</Text>
                    <View style={styles.captionCard}>
                        <View style={styles.captionHeader}>
                            <Text style={styles.captionText}>{data.description}</Text>
                            <Pressable style={styles.copyButton} onPress={() => handleCopy(data.description, 2)}>
                                {copiedIndex === 2 ? <Check size={18} color={Colors.viroCyan} /> : <Copy size={18} color={Colors.textMuted} />}
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Tags */}
                <View style={styles.cardGroup}>
                    <View style={styles.hashtagsHeader}>
                        <Text style={styles.cardLabel}>Tags</Text>
                        <Pressable style={styles.copyButton} onPress={() => {
                            Clipboard.setStringAsync(data.tags.join(' '));
                            Alert.alert('Copied', 'All tags copied');
                        }}>
                            <Copy size={18} color={Colors.textMuted} />
                        </Pressable>
                    </View>
                    <View style={styles.hashtagsCloud}>
                        {data.tags.map((tag, idx) => (
                            <Pressable key={idx} style={styles.hashtagChip} onPress={() => handleCopy(tag, 100 + idx)}>
                                <Text style={styles.hashtagText}>{tag}</Text>
                                {copiedIndex === 100 + idx && <Check size={14} color={Colors.viroCyan} style={{ marginLeft: 4 }} />}
                            </Pressable>
                        ))}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.headerButton} onPress={handleBack}>
                    <ArrowLeft size={24} color={Colors.white} />
                </Pressable>
                <Text style={styles.headerTitle}>Optimization</Text>
                <View style={styles.headerButton} />
            </View>

            {/* Tabs - Always show platform options if we have a result */}
            <View style={styles.tabsContainer}>
                <TabButton tab="tiktok" label="TikTok" icon={Hash} />
                <TabButton tab="instagram" label="Instagram" icon={MessageSquare} />
                <TabButton tab="youtube" label="YouTube" icon={Type} />
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Render content based on active tab */}
                {renderPlatformContent(activeTab as 'tiktok' | 'instagram' | 'youtube')}
            </ScrollView>
        </SafeAreaView>
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
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 8,
        gap: 8,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    tabButtonActive: {
        backgroundColor: Colors.viroPink,
    },
    tabLabel: {
        color: Colors.textMuted,
        fontSize: 14,
        fontWeight: '500',
    },
    tabLabelActive: {
        color: Colors.white,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    itemText: {
        flex: 1,
        color: Colors.white,
        fontSize: 15,
        lineHeight: 22,
    },
    copyButton: {
        padding: 4,
        marginLeft: 12,
    },
    captionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    captionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    captionText: {
        color: Colors.white,
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 16,
    },
    captionActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    actionButtonText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
    hashtagsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    copyAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.viroPink,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
    },
    copyAllText: {
        color: Colors.white,
        fontSize: 13,
        fontWeight: '500',
    },
    hashtagsCloud: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    hashtagChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    hashtagText: {
        color: Colors.viroCyan,
        fontSize: 14,
        fontWeight: '500',
    },
    noContent: {
        color: Colors.textMuted,
        fontSize: 15,
        textAlign: 'center',
        paddingVertical: 24,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: Colors.white,
        fontSize: 18,
        marginBottom: 16,
    },
    backButton: {
        backgroundColor: Colors.viroPink,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    backButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    // New Styles
    cardGroup: {
        marginBottom: 16,
    },
    cardLabel: {
        color: Colors.textMuted,
        fontSize: 12,
        marginBottom: 6,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
