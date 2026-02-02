import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Grid, List as ListIcon, Search, Video, Image as ImageIcon, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../src/constants/Colors';
import { useThemeColors } from '../../src/hooks/useThemeColors';
import { useAnalysisHistory } from '../../src/store/useAnalysisStore';
import { RecentScanCard } from '../../src/components/RecentScanCard';
import { AnalysisResult } from '../../src/types/analysis';

export default function ScansHistoryScreen() {
    const router = useRouter();
    const { colors, isDark } = useThemeColors();
    const history = useAnalysisHistory();
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter for Scans (Video/Image) only
    const scansHistory = useMemo(() => {
        return history.filter(item => item.input.type === 'video' || item.input.type === 'image');
    }, [history]);

    // Apply Search
    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return scansHistory;
        const query = searchQuery.toLowerCase();
        return scansHistory.filter(
            (item) =>
                item.input.fileName?.toLowerCase().includes(query) ||
                item.seo?.titles?.[0]?.toLowerCase().includes(query)
        );
    }, [scansHistory, searchQuery]);

    const handleViewResult = (id: string, title: string) => {
        router.push({
            pathname: '/analysis/[id]',
            params: { id, title }
        });
    };

    const renderItem = ({ item }: { item: AnalysisResult }) => {
        if (viewMode === 'grid') {
            return (
                <View style={styles.gridItem}>
                    <RecentScanCard
                        score={item.score}
                        title={item.seo?.titles?.[0] || item.input.fileName || 'Untitled'}
                        thumbnail={item.input.thumbnailUri ? { uri: item.input.thumbnailUri } : (item.input.type === 'image' ? { uri: item.input.uri } : undefined)}
                        onPress={() => handleViewResult(item.id, item.seo?.titles?.[0] || item.input.fileName || 'Result')}
                    />
                </View>
            );
        }

        // List View Render
        return (
            <Pressable
                style={styles.listItem}
                onPress={() => handleViewResult(item.id, item.seo?.titles?.[0] || item.input.fileName || 'Result')}
            >
                <View style={styles.listThumbnail}>
                    {item.input.thumbnailUri ? (
                        <Image source={{ uri: item.input.thumbnailUri }} style={StyleSheet.absoluteFill} />
                    ) : (
                        <View style={[styles.placeholderThumb, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                            {item.input.type === 'video' ? <Video size={20} color={colors.textMuted} /> : <ImageIcon size={20} color={colors.textMuted} />}
                        </View>
                    )}
                </View>
                <View style={styles.listContent}>
                    <Text style={[styles.listTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                        {item.seo?.titles?.[0] || item.input.fileName || 'Untitled'}
                    </Text>
                    <Text style={[styles.listDate, { color: colors.textSecondary }]}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
                <View style={[styles.scoreBadge, { backgroundColor: item.score >= 70 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)' }]}>
                    <Text style={[styles.scoreText, { color: item.score >= 70 ? '#22C55E' : '#F59E0B' }]}>{item.score}</Text>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.textPrimary} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Scan History</Text>

                {/* View Mode Toggle */}
                <Pressable
                    onPress={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
                    style={[styles.modeButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                >
                    {viewMode === 'grid' ? <ListIcon size={20} color={colors.textPrimary} /> : <Grid size={20} color={colors.textPrimary} />}
                </Pressable>
            </View>

            {/* Search */}
            <View style={[styles.searchContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                <Search size={20} color={colors.textMuted} />
                <TextInput
                    style={[styles.searchInput, { color: colors.textPrimary }]}
                    placeholder="Search scans..."
                    placeholderTextColor={colors.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* List */}
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[
                    styles.listContainer,
                    viewMode === 'grid' && styles.gridContainer
                ]}
                numColumns={viewMode === 'grid' ? 2 : 1}
                key={viewMode} // Force re-render on mode change
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.textMuted }]}>No scans found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 16,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        flex: 1,
    },
    modeButton: {
        padding: 8,
        borderRadius: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    gridContainer: {
        gap: 16,
    },
    // Grid Item
    gridItem: {
        flex: 1,
        maxWidth: '48%',
        marginRight: '2%', // Rough gap logic for even columns
        marginBottom: 16,
    },
    // List Item styles
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        gap: 12,
    },
    listThumbnail: {
        width: 48,
        height: 48,
        borderRadius: 10,
        overflow: 'hidden',
    },
    placeholderThumb: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        flex: 1,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    listDate: {
        fontSize: 13,
    },
    scoreBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    scoreText: {
        fontSize: 14,
        fontWeight: '700',
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
    }
});
