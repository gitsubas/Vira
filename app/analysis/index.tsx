// analysis/index.tsx - Upload/Capture Selection Screen
// Allows user to choose: Record Video, Take Photo, or Pick from Gallery

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Video, Camera, ImageIcon, X } from 'lucide-react-native';
import { Colors } from '../../src/constants/Colors';
import {
    captureVideo,
    capturePhoto,
    pickVideoFromGallery,
    pickImageFromGallery,
    MediaAsset,
} from '../../src/services/MediaService';
import { useAnalysisStore } from '../../src/store/useAnalysisStore';
import { useSubscriptionStore } from '../../src/store/useSubscriptionStore';
import { AnalysisInput } from '../../src/types/analysis';

export default function CaptureScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const startAnalysis = useAnalysisStore((state) => state.startAnalysis);
    const { canPerformAnalysis, incrementUsage } = useSubscriptionStore();

    // Handle successful media selection -> start analysis and navigate
    const handleMediaSelected = async (asset: MediaAsset) => {
        console.log('Media selected:', asset);

        // Check subscription limits before proceeding
        const videoDuration = asset.type === 'video' ? asset.duration : undefined;
        const { allowed, reason } = canPerformAnalysis(videoDuration);

        if (!allowed) {
            // Show upgrade prompt and navigate to paywall
            Alert.alert(
                'Upgrade Required',
                reason,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Upgrade Now', onPress: () => router.push('/paywall') },
                ]
            );
            return;
        }

        // Convert MediaAsset to AnalysisInput
        const input: AnalysisInput = {
            uri: asset.uri,
            type: asset.type,
            mimeType: asset.mimeType,
            fileName: asset.fileName,
            duration: asset.duration,
        };

        // Start the analysis first (don't await - let it run in background)
        // The processing screen will monitor the store state
        startAnalysis(input)
            .then(() => {
                // Increment usage counter on successful analysis
                incrementUsage();
            })
            .catch((error) => {
                // Error is handled by the store, processing screen will show it
                console.error('Analysis failed:', error);
            });

        // Navigate to processing screen to show progress
        router.replace('/analysis/processing');
    };

    // Record video with camera
    const handleRecordVideo = async () => {
        setIsLoading(true);
        const result = await captureVideo();
        setIsLoading(false);

        if (result.success && result.asset) {
            handleMediaSelected(result.asset);
        } else if (result.error && result.error !== 'Recording cancelled') {
            Alert.alert('Error', result.error);
        }
    };

    // Take photo with camera
    const handleTakePhoto = async () => {
        setIsLoading(true);
        const result = await capturePhoto();
        setIsLoading(false);

        if (result.success && result.asset) {
            handleMediaSelected(result.asset);
        } else if (result.error && result.error !== 'Capture cancelled') {
            Alert.alert('Error', result.error);
        }
    };

    // Pick video from gallery
    const handlePickVideo = async () => {
        setIsLoading(true);
        const result = await pickVideoFromGallery();
        setIsLoading(false);

        if (result.success && result.asset) {
            handleMediaSelected(result.asset);
        } else if (result.error && result.error !== 'Selection cancelled') {
            Alert.alert('Error', result.error);
        }
    };

    // Pick image from gallery
    const handlePickImage = async () => {
        setIsLoading(true);
        const result = await pickImageFromGallery();
        setIsLoading(false);

        if (result.success && result.asset) {
            handleMediaSelected(result.asset);
        } else if (result.error && result.error !== 'Selection cancelled') {
            Alert.alert('Error', result.error);
        }
    };

    // Close modal and go back
    const handleClose = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Select Media</Text>
                <Pressable onPress={handleClose} style={styles.closeButton}>
                    <X size={24} color={Colors.white} />
                </Pressable>
            </View>

            {/* Options Grid */}
            <View style={styles.optionsContainer}>
                {/* Record Video - Primary action */}
                <OptionCard
                    icon={<Video size={32} color={Colors.white} />}
                    title="Record Video"
                    subtitle="Use camera to record"
                    onPress={handleRecordVideo}
                    disabled={isLoading}
                    primary
                />

                {/* Take Photo */}
                <OptionCard
                    icon={<Camera size={32} color={Colors.white} />}
                    title="Take Photo"
                    subtitle="Capture a snapshot"
                    onPress={handleTakePhoto}
                    disabled={isLoading}
                />

                {/* Pick Video from Gallery */}
                <OptionCard
                    icon={<Video size={32} color={Colors.white} />}
                    title="Choose Video"
                    subtitle="From your library"
                    onPress={handlePickVideo}
                    disabled={isLoading}
                />

                {/* Pick Image from Gallery */}
                <OptionCard
                    icon={<ImageIcon size={32} color={Colors.white} />}
                    title="Choose Photo"
                    subtitle="From your library"
                    onPress={handlePickImage}
                    disabled={isLoading}
                />
            </View>

            {/* Helper text */}
            <Text style={styles.helperText}>
                Select a video or photo to analyze its viral potential
            </Text>
        </SafeAreaView>
    );
}

// Reusable option card component
interface OptionCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onPress: () => void;
    disabled?: boolean;
    primary?: boolean;
}

function OptionCard({ icon, title, subtitle, onPress, disabled, primary }: OptionCardProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.optionCard,
                primary && styles.optionCardPrimary,
                pressed && styles.optionCardPressed,
                disabled && styles.optionCardDisabled,
            ]}
        >
            <View style={styles.optionCardContent}>
                <View style={styles.optionIcon}>{icon}</View>
                <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>{title}</Text>
                    <Text style={styles.optionSubtitle}>{subtitle}</Text>
                </View>
            </View>
        </Pressable>
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
        paddingVertical: 16,
    },
    title: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: '700',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    optionCard: {
        width: '100%',
        height: 100,
        marginBottom: 16,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    optionCardPrimary: {
        // No extra height needed, uniform look is safer
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    optionCardPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    optionCardDisabled: {
        opacity: 0.5,
    },
    optionCardBorder: {
        // Redundant with container border, removed to simplify
        display: 'none',
    },
    optionCardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24, // More padding
    },
    optionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20, // Explicit margin instead of gap
    },
    optionText: {
        flex: 1,
        justifyContent: 'center',
    },
    optionTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    optionSubtitle: {
        color: Colors.textMuted,
        fontSize: 14,
    },
    helperText: {
        color: Colors.textMuted,
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 40,
        paddingBottom: 40,
        marginTop: 20,
    },
});
