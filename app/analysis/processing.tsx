// analysis/processing.tsx - Analysis Processing Screen
// Shows loading animation while Gemini API processes the media

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { X, RefreshCw } from 'lucide-react-native';
import { Colors } from '../../src/constants/Colors';
import { useAnalysisStore } from '../../src/store/useAnalysisStore';

export default function ProcessingScreen() {
    const router = useRouter();
    const { status, progress, error, currentResult, clearCurrent, startAnalysis, currentInput } = useAnalysisStore();

    const rotation = useSharedValue(0);
    const pulse = useSharedValue(1);

    useEffect(() => {
        // Start rotation animation
        rotation.value = withRepeat(
            withTiming(360, { duration: 3000, easing: Easing.linear }),
            -1,
            false
        );

        // Pulse animation
        pulse.value = withRepeat(
            withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    // Watch for completion or error
    useEffect(() => {
        if (status === 'completed' && currentResult) {
            // Navigate based on type
            if (currentInput?.type === 'text') {
                router.replace(`/analysis/seo/${currentResult.id}`);
            } else {
                router.replace(`/analysis/${currentResult.id}`);
            }
        }
    }, [status, currentResult, currentInput]);

    const rotationStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
    }));

    // Handle cancel
    const handleCancel = () => {
        clearCurrent();
        router.replace('/(tabs)');
    };

    // Handle retry
    const handleRetry = () => {
        if (currentInput) {
            startAnalysis(currentInput);
        }
    };

    // Show error state
    if (status === 'failed' && error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorIcon}>⚠️</Text>
                        <Text style={styles.errorTitle}>Analysis Failed</Text>
                        <Text style={styles.errorMessage}>{error.message}</Text>

                        {error.retryable && (
                            <Pressable style={styles.retryButton} onPress={handleRetry}>
                                <RefreshCw size={20} color={Colors.black} />
                                <Text style={styles.retryButtonText}>Try Again</Text>
                            </Pressable>
                        )}

                        <Pressable style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.cancelButtonText}>Go Back</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Close button */}
            <View style={styles.header}>
                <Pressable style={styles.closeButton} onPress={handleCancel}>
                    <X size={24} color={Colors.textMuted} />
                </Pressable>
            </View>

            <View style={styles.content}>
                {/* Animated Scanner */}
                <View style={styles.scannerContainer}>
                    <Animated.View style={[styles.scannerOuter, rotationStyle]}>
                        <View style={styles.scannerDot} />
                    </Animated.View>
                    <Animated.View style={[styles.scannerInner, pulseStyle]}>
                        <Text style={styles.scannerIcon}>📊</Text>
                    </Animated.View>
                </View>

                {/* Status Text */}
                <Text style={styles.title}>
                    {status === 'uploading' ? 'Preparing...' : 'Analyzing...'}
                </Text>
                <Text style={styles.tip}>{progress || 'Starting analysis...'}</Text>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                This may take up to a minute for longer videos
            </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    header: {
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    scannerContainer: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    scannerOuter: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderTopColor: Colors.white,
    },
    scannerDot: {
        position: 'absolute',
        top: -4,
        left: '50%',
        marginLeft: -4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.white,
    },
    scannerInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannerIcon: {
        fontSize: 32,
    },
    title: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 12,
    },
    tip: {
        color: Colors.textMuted,
        fontSize: 16,
        textAlign: 'center',
    },
    footer: {
        color: Colors.textMuted,
        fontSize: 13,
        textAlign: 'center',
        paddingBottom: 40,
        paddingHorizontal: 40,
    },
    // Error state styles
    errorContainer: {
        alignItems: 'center',
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorTitle: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    errorMessage: {
        color: Colors.textMuted,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 25,
        gap: 8,
        marginBottom: 16,
    },
    retryButtonText: {
        color: Colors.black,
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    cancelButtonText: {
        color: Colors.textMuted,
        fontSize: 16,
    },
});
