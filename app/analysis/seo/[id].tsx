// app/analysis/seo/[id].tsx - Generated Content / SEO Optimization Screen
// Displays AI-generated titles, captions, and hashtags

import React, { useState } from 'react';
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

type TabType = 'titles' | 'caption' | 'hashtags';

export default function SEOScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const getResultById = useAnalysisStore((state) => state.getResultById);
    const result = id ? getResultById(id) : null;

    const [activeTab, setActiveTab] = useState<TabType>('titles');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

    if (!result) {
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

    const { seo } = result;

    // Tab button component
    const TabButton = ({ tab, label, icon: Icon }: { tab: TabType; label: string; icon: any }) => (
        <Pressable
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab)}
        >
            <Icon size={18} color={activeTab === tab ? Colors.white : Colors.textMuted} />
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
                {label}
            </Text>
        </Pressable>
    );

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

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TabButton tab="titles" label="Titles" icon={Type} />
                <TabButton tab="caption" label="Caption" icon={MessageSquare} />
                <TabButton tab="hashtags" label="Hashtags" icon={Hash} />
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Titles Tab */}
                {activeTab === 'titles' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Suggested Titles</Text>
                        <Text style={styles.sectionSubtitle}>
                            AI-generated titles optimized for engagement
                        </Text>

                        {seo?.titles?.length ? (
                            seo.titles.map((title, index) => (
                                <View key={index} style={styles.itemCard}>
                                    <Text style={styles.itemText}>{title}</Text>
                                    <Pressable
                                        style={styles.copyButton}
                                        onPress={() => handleCopy(title, index)}
                                    >
                                        {copiedIndex === index ? (
                                            <Check size={18} color={Colors.viroCyan} />
                                        ) : (
                                            <Copy size={18} color={Colors.textMuted} />
                                        )}
                                    </Pressable>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noContent}>No titles generated</Text>
                        )}
                    </View>
                )}

                {/* Caption Tab */}
                {activeTab === 'caption' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Optimized Caption</Text>
                        <Text style={styles.sectionSubtitle}>
                            Ready-to-use caption with keywords and hooks
                        </Text>

                        {seo?.caption ? (
                            <View style={styles.captionCard}>
                                <Text style={styles.captionText}>{seo.caption}</Text>
                                <View style={styles.captionActions}>
                                    <Pressable
                                        style={styles.actionButton}
                                        onPress={() => handleCopy(seo.caption, -1)}
                                    >
                                        {copiedIndex === -1 ? (
                                            <>
                                                <Check size={18} color={Colors.viroCyan} />
                                                <Text style={[styles.actionButtonText, { color: Colors.viroCyan }]}>
                                                    Copied
                                                </Text>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={18} color={Colors.white} />
                                                <Text style={styles.actionButtonText}>Copy</Text>
                                            </>
                                        )}
                                    </Pressable>
                                </View>
                            </View>
                        ) : (
                            <Text style={styles.noContent}>No caption generated</Text>
                        )}
                    </View>
                )}

                {/* Hashtags Tab */}
                {activeTab === 'hashtags' && (
                    <View style={styles.section}>
                        <View style={styles.hashtagsHeader}>
                            <View>
                                <Text style={styles.sectionTitle}>Trending Hashtags</Text>
                                <Text style={styles.sectionSubtitle}>
                                    Optimized for discoverability
                                </Text>
                            </View>
                            {seo?.hashtags?.length > 0 && (
                                <Pressable style={styles.copyAllButton} onPress={handleCopyAllHashtags}>
                                    <Copy size={16} color={Colors.white} />
                                    <Text style={styles.copyAllText}>Copy All</Text>
                                </Pressable>
                            )}
                        </View>

                        {seo?.hashtags?.length ? (
                            <View style={styles.hashtagsCloud}>
                                {seo.hashtags.map((tag, index) => (
                                    <Pressable
                                        key={index}
                                        style={styles.hashtagChip}
                                        onPress={() => handleCopy(tag, index + 100)}
                                    >
                                        <Text style={styles.hashtagText}>{tag}</Text>
                                        {copiedIndex === index + 100 && (
                                            <Check size={14} color={Colors.viroCyan} />
                                        )}
                                    </Pressable>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.noContent}>No hashtags generated</Text>
                        )}
                    </View>
                )}

                {/* Suggested Filename */}
                {seo?.filename && (
                    <View style={styles.filenameSection}>
                        <Text style={styles.filenameLabel}>SEO Filename</Text>
                        <View style={styles.filenameCard}>
                            <Text style={styles.filenameText}>{seo.filename}</Text>
                            <Pressable onPress={() => handleCopy(seo.filename!, -2)}>
                                {copiedIndex === -2 ? (
                                    <Check size={18} color={Colors.viroCyan} />
                                ) : (
                                    <Copy size={18} color={Colors.textMuted} />
                                )}
                            </Pressable>
                        </View>
                    </View>
                )}
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
    sectionSubtitle: {
        color: Colors.textMuted,
        fontSize: 14,
        marginBottom: 16,
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
    filenameSection: {
        marginTop: 8,
    },
    filenameLabel: {
        color: Colors.textMuted,
        fontSize: 14,
        marginBottom: 8,
    },
    filenameCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    filenameText: {
        flex: 1,
        color: Colors.white,
        fontSize: 14,
        fontFamily: 'monospace',
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
});
