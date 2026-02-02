import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Grid, List as ListIcon, Search, Sparkles, ChevronRight, Hash } from 'lucide-react-native';
import { Colors } from '../../src/constants/Colors';
import { useThemeColors } from '../../src/hooks/useThemeColors';
import { useAnalysisHistory } from '../../src/store/useAnalysisStore';
import { MetadataCard } from '../../src/components/MetadataCard';
import { AnalysisResult } from '../../src/types/analysis';

export default function MetadataHistoryScreen() {
    const router = useRouter();
    const { colors, isDark } = useThemeColors();
    const history = useAnalysisHistory();
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter for Metadata (Text) only
    const metadataHistory = useMemo(() => {
        return history.filter(item => item.input.type === 'text');
    }, [history]);

    // Apply Search
    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return metadataHistory;
        const query = searchQuery.toLowerCase();
        return metadataHistory.filter(
            (item) =>
                item.input.fileName?.toLowerCase().includes(query) ||
                item.input.text?.toLowerCase().includes(query)
        );
    }, [metadataHistory, searchQuery]);

    const handleViewResult = (id: string, title: string) => {
        router.push({
            pathname: '/analysis/seo/[id]',
            params: { id, title } // Correct params for seo screen
        });
    };

    const renderItem = ({ item }: { item: AnalysisResult }) => {
        if (viewMode === 'grid') {
            return (
                <View style={styles.gridItem}>
                    <MetadataCard
                        score={item.score}
                        title={item.input.fileName || item.input.text || 'Untitled'}
                        onPress={() => handleViewResult(item.id, item.input.fileName || 'Result')}
                    />
                </View>
            );
        }

        // List View Render
        return (
            <Pressable
                style={styles.listItem}
                onPress={() => handleViewResult(item.id, item.input.fileName || 'Result')}
            >
                <View style={[styles.listIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                    <Sparkles size={20} color={Colors.viroPink} />
                </View>
                <View style={styles.listContent}>
                    <Text style={[styles.listTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                        {item.input.fileName || item.input.text || 'Untitled'}
                    </Text>
                    <Text style={[styles.listDate, { color: colors.textSecondary }]}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
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
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Metadata History</Text>

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
                    placeholder="Search metadata..."
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
                        <Text style={[styles.emptyText, { color: colors.textMuted }]}>No metadata found</Text>
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
        marginRight: '2%', // Rough gap logic
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
    listIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
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
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
    }
});
