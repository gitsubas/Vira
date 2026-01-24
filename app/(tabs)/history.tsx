// (tabs)/history.tsx - History Screen
// Shows list of past analyses with search

import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    FlatList,
    TextInput,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Clock, Search, Trash2, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../src/constants/Colors';
import { useAnalysisStore, useAnalysisHistory } from '../../src/store/useAnalysisStore';
import { AnalysisResult } from '../../src/types/analysis';

export default function HistoryScreen() {
    const router = useRouter();
    const history = useAnalysisHistory();
    const deleteFromHistory = useAnalysisStore((state) => state.deleteFromHistory);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter history based on search
    const filteredHistory = useMemo(() => {
        if (!searchQuery.trim()) return history;
        const query = searchQuery.toLowerCase();
        return history.filter(
            (item) =>
                item.input.fileName?.toLowerCase().includes(query) ||
                item.viralPotential?.toLowerCase().includes(query)
        );
    }, [history, searchQuery]);

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Get score color
    const getScoreColor = (score: number) => {
        if (score >= 70) return '#22C55E'; // Green
        if (score >= 40) return '#F59E0B'; // Amber
        return '#EF4444'; // Red
    };

    // Handle view result
    const handleViewResult = (id: string) => {
        router.push(`/analysis/${id}`);
    };

    // Handle delete
    const handleDelete = (id: string) => {
        deleteFromHistory(id);
    };

    // Render history item
    const renderItem = ({ item }: { item: AnalysisResult }) => (
        <Pressable
            style={styles.historyCard}
            onPress={() => handleViewResult(item.id)}
        >
            {/* Thumbnail */}
            <View style={styles.thumbnail}>
                {item.input.type === 'video' ? (
                    <View style={styles.videoThumbnail}>
                        <Text style={styles.videoIcon}>🎬</Text>
                    </View>
                ) : (
                    <View style={styles.imageThumbnail}>
                        <Text style={styles.imageIcon}>📷</Text>
                    </View>
                )}
            </View>

            {/* Content */}
            <View style={styles.cardContent}>
                <Text style={styles.fileName} numberOfLines={1}>
                    {item.input.fileName || 'Untitled'}
                </Text>
                <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
            </View>

            {/* Score Badge */}
            <View style={[styles.scoreBadge, { backgroundColor: `${getScoreColor(item.score)}20` }]}>
                <Text style={[styles.scoreText, { color: getScoreColor(item.score) }]}>
                    {item.score}
                </Text>
            </View>

            {/* Chevron */}
            <ChevronRight size={20} color={Colors.textMuted} />
        </Pressable>
    );

    // Empty state
    if (history.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.title}>History</Text>
                </View>

                <View style={styles.emptyState}>
                    <Clock size={48} color={Colors.textMuted} strokeWidth={1} />
                    <Text style={styles.emptyTitle}>No analyses yet</Text>
                    <Text style={styles.emptySubtext}>
                        Your past scans will appear here
                    </Text>
                    <Pressable
                        style={styles.analyzeButton}
                        onPress={() => router.push('/analysis')}
                    >
                        <Text style={styles.analyzeButtonText}>Analyze Now</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>History</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Search size={20} color={Colors.textMuted} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search past scans..."
                    placeholderTextColor={Colors.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Results Count */}
            <Text style={styles.resultsCount}>
                {filteredHistory.length} {filteredHistory.length === 1 ? 'scan' : 'scans'}
            </Text>

            {/* History List */}
            <FlatList
                data={filteredHistory}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                    <View style={styles.noResults}>
                        <Text style={styles.noResultsText}>No matching scans found</Text>
                    </View>
                }
            />
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
        paddingVertical: 16,
    },
    title: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: '700',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginHorizontal: 20,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        color: Colors.white,
        fontSize: 16,
        paddingVertical: 14,
    },
    resultsCount: {
        color: Colors.textMuted,
        fontSize: 14,
        paddingHorizontal: 20,
        marginTop: 16,
        marginBottom: 8,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    historyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 12,
    },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: 10,
        overflow: 'hidden',
    },
    videoThumbnail: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageThumbnail: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoIcon: {
        fontSize: 20,
    },
    imageIcon: {
        fontSize: 20,
    },
    cardContent: {
        flex: 1,
    },
    fileName: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
    dateText: {
        color: Colors.textMuted,
        fontSize: 13,
        marginTop: 4,
    },
    scoreBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    scoreText: {
        fontSize: 16,
        fontWeight: '700',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    emptySubtext: {
        color: Colors.textMuted,
        fontSize: 14,
        marginTop: 8,
    },
    analyzeButton: {
        marginTop: 24,
        backgroundColor: Colors.viroPink,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    analyzeButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    noResults: {
        alignItems: 'center',
        paddingTop: 40,
    },
    noResultsText: {
        color: Colors.textMuted,
        fontSize: 16,
    },
});
