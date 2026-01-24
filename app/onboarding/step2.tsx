// app/onboarding/step2.tsx - Onboarding Step 2: AI Strategy
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowLeft } from 'lucide-react-native';
import { Colors } from '../../src/constants/Colors';

export default function OnboardingStep2() {
    const router = useRouter();

    const handleNext = () => {
        router.push('/onboarding/step3');
    };

    const handleBack = () => {
        router.back();
    };

    const handleSkip = () => {
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <ArrowLeft size={24} color={Colors.white} />
                </Pressable>
                <Pressable onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </Pressable>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Icon */}
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                    <Sparkles size={80} color="#8B5CF6" strokeWidth={1.5} />
                </View>

                {/* Text */}
                <Text style={styles.title}>AI Strategy</Text>
                <Text style={styles.subtitle}>
                    Get data-driven recommendations for hooks, pacing, and content improvements.
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                {/* Progress Dots */}
                <View style={styles.dotsContainer}>
                    <View style={styles.dot} />
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={styles.dot} />
                </View>

                {/* Next Button */}
                <Pressable style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </Pressable>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    skipText: {
        color: Colors.textMuted,
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        color: Colors.textMuted,
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 26,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        gap: 24,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    dotActive: {
        width: 24,
        backgroundColor: '#8B5CF6',
    },
    nextButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 28,
        paddingVertical: 18,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    nextButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
});
