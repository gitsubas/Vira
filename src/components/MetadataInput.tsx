import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { Sparkles, ArrowRight } from 'lucide-react-native'; // Changed from AutoSparkle to Sparkles if AutoSparkle not avail
import { Colors } from '../constants/Colors';
import { useThemeColors } from '../hooks/useThemeColors';
import { useAnalysisStore } from '../store/useAnalysisStore';
import { useRouter } from 'expo-router';

export function MetadataInput() {
    const { colors, isDark } = useThemeColors();
    const [topic, setTopic] = useState('');
    const { startAnalysis, status } = useAnalysisStore();
    const router = useRouter();

    const handleGenerate = async () => {
        if (!topic.trim()) return;

        // Navigate to processing screen immediately
        router.push('/analysis/processing');

        try {
            // Start analysis with text input
            await startAnalysis({
                type: 'text',
                text: topic,
                fileName: topic, // Use topic as "filename" for history
                uri: '', // Not needed for text
                mimeType: '', // Not needed
            });
        } catch (error) {
            console.error('Generation failed', error);
            // Processing screen will handle the error state via store
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.glassContainer, {
                borderColor: colors.glassBorder,
                backgroundColor: isDark ? 'rgba(25, 25, 25, 0.6)' : 'rgba(255, 255, 255, 0.6)'
            }]}>
                <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Sparkles size={20} color={Colors.viroPink} />
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            AI Metadata Generator
                        </Text>
                    </View>

                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Enter a topic to generate titles, descriptions & tags
                    </Text>

                    <View style={[styles.inputContainer, {
                        backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                        borderColor: colors.glassBorder
                    }]}>
                        <TextInput
                            style={[styles.input, { color: colors.textPrimary }]}
                            placeholder="Type a subject (e.g., 'Funny Cat Fail')"
                            placeholderTextColor={colors.textMuted}
                            value={topic}
                            onChangeText={setTopic}
                            returnKeyType="go"
                            onSubmitEditing={handleGenerate}
                        />
                        <Pressable
                            style={[styles.generateButton, !topic.trim() && styles.disabledButton]}
                            onPress={handleGenerate}
                            disabled={!topic.trim() || status === 'processing'}
                        >
                            {status === 'processing' ? (
                                <ActivityIndicator size="small" color={Colors.white} />
                            ) : (
                                <ArrowRight size={20} color={Colors.white} />
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    glassContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
    },
    content: {
        padding: 20,
        zIndex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        paddingLeft: 16,
        paddingRight: 6,
        paddingVertical: 6,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
    },
    generateButton: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: Colors.viroPink,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: 'gray',
        opacity: 0.5,
    }
});
