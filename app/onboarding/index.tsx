// app/onboarding/index.tsx - Onboarding Step 1: Predict Virality
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TrendingUp } from 'lucide-react-native';
import { Colors } from '../../src/constants/Colors';

export default function OnboardingStep1() {
    const router = useRouter();

    const handleNext = () => {
        router.push('/onboarding/step2');
    };

    const handleSkip = () => {
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Skip Button */}
            <View style={styles.header}>
                <View />
                <Pressable onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </Pressable>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Icon */}
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(236, 72, 153, 0.15)' }]}>
                    <TrendingUp size={80} color={Colors.viroPink} strokeWidth={1.5} />
                </View>

                {/* Text */}
                <Text style={styles.title}>Predict Virality</Text>
                <Text style={styles.subtitle}>
                    Analyze your videos before posting to know their viral potential with AI-powered insights.
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                {/* Progress Dots */}
                <View style={styles.dotsContainer}>
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={styles.dot} />
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
        backgroundColor: Colors.viroPink,
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
