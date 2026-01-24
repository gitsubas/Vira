// app/paywall.tsx - Subscription Paywall Screen
// Premium feature comparison, pricing, and purchase flow

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Check, Crown, Zap, Building2 } from 'lucide-react-native';
import { Colors } from '../src/constants/Colors';
import {
    SubscriptionTier,
    TIER_CONFIGS,
    PurchaseErrorType,
} from '../src/types/subscription';
import { purchaseTier } from '../src/services/RevenueCatService';
import { useSubscriptionStore } from '../src/store/useSubscriptionStore';

// Glowing Silver color palette
const SILVER = {
    primary: '#C0C0C0',
    glow: '#E8E8E8',
    shine: '#FFFFFF',
    dark: '#A8A8A8',
};

export default function PaywallScreen() {
    const router = useRouter();
    const { tier, refreshSubscription, restoreUserPurchases, isLoading } =
        useSubscriptionStore();

    const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(SubscriptionTier.PRO);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    // Handle tier selection
    const handleTierSelect = (tierLevel: SubscriptionTier) => {
        if (tierLevel !== SubscriptionTier.FREE) {
            setSelectedTier(tierLevel);
        }
    };

    // Handle purchase
    const handlePurchase = async () => {
        try {
            setIsPurchasing(true);

            // Use mock purchase
            await purchaseTier(selectedTier);
            await refreshSubscription();

            // Success - navigate back
            const tierName = selectedTier === SubscriptionTier.ENTERPRISE ? 'Enterprise' : 'Pro';
            Alert.alert('Success!', `Welcome to Vira ${tierName}! Enjoy your subscription.`, [
                { text: 'Start Analyzing', onPress: () => router.back() },
            ]);
        } catch (error: any) {
            if (error.type === PurchaseErrorType.CANCELLED) {
                return;
            }
            Alert.alert('Purchase Failed', error.message || 'Unable to complete purchase.');
        } finally {
            setIsPurchasing(false);
        }
    };

    // Handle restore
    const handleRestore = async () => {
        try {
            setIsRestoring(true);
            await restoreUserPurchases();
            Alert.alert('Restored', 'Your purchases have been restored.');
        } catch (error) {
            Alert.alert('Restore Failed', 'Unable to restore purchases. Please try again.');
        } finally {
            setIsRestoring(false);
        }
    };

    // Close paywall
    const handleClose = () => {
        router.back();
    };

    // Get tier icon
    const getTierIcon = (tierLevel: SubscriptionTier) => {
        switch (tierLevel) {
            case SubscriptionTier.PRO:
                return <Crown size={24} color={SILVER.glow} />;
            case SubscriptionTier.ENTERPRISE:
                return <Building2 size={24} color={SILVER.glow} />;
            default:
                return <Zap size={24} color={Colors.textMuted} />;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.closeButton} onPress={handleClose}>
                    <X size={24} color={Colors.white} />
                </Pressable>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero */}
                <View style={styles.hero}>
                    <View style={styles.heroIconContainer}>
                        <Crown size={48} color={SILVER.glow} />
                    </View>
                    <Text style={styles.heroTitle}>Unlock Your Viral Potential</Text>
                    <Text style={styles.heroSubtitle}>
                        Analyze more videos and get detailed insights to grow your audience
                    </Text>
                </View>

                {/* Tier Selection */}
                <View style={styles.tiersContainer}>
                    {[SubscriptionTier.FREE, SubscriptionTier.PRO, SubscriptionTier.ENTERPRISE].map(
                        (tierLevel) => {
                            const config = TIER_CONFIGS[tierLevel];
                            const isCurrentTier = tier === tierLevel;
                            const isSelected = selectedTier === tierLevel && tierLevel !== SubscriptionTier.FREE;
                            const isPremium = tierLevel !== SubscriptionTier.FREE;
                            const isRecommended = tierLevel === SubscriptionTier.PRO;

                            return (
                                <Pressable
                                    key={tierLevel}
                                    style={[
                                        styles.tierCard,
                                        isSelected && styles.tierCardSelected,
                                        isCurrentTier && styles.tierCardCurrent,
                                        !isPremium && styles.tierCardFree,
                                    ]}
                                    onPress={() => handleTierSelect(tierLevel)}
                                    disabled={!isPremium || isCurrentTier}
                                >
                                    {isRecommended && !isCurrentTier && (
                                        <View style={styles.recommendedBadge}>
                                            <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
                                        </View>
                                    )}

                                    <View style={styles.tierHeader}>
                                        {getTierIcon(tierLevel)}
                                        <Text style={[
                                            styles.tierName,
                                            isPremium && styles.tierNamePremium
                                        ]}>
                                            {config.name}
                                        </Text>
                                        {config.price ? (
                                            <Text style={styles.tierPrice}>{config.price}</Text>
                                        ) : (
                                            <Text style={styles.tierPriceFree}>Free</Text>
                                        )}
                                    </View>

                                    <View style={styles.featuresList}>
                                        {config.features.map((feature, index) => (
                                            <View key={index} style={styles.featureItem}>
                                                <Check size={16} color={isPremium ? SILVER.primary : Colors.viroCyan} />
                                                <Text style={styles.featureText}>{feature}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    {isCurrentTier && (
                                        <View style={styles.currentBadge}>
                                            <Text style={styles.currentBadgeText}>Current Plan</Text>
                                        </View>
                                    )}

                                    {isSelected && !isCurrentTier && (
                                        <View style={styles.selectedIndicator}>
                                            <Check size={20} color={Colors.black} />
                                        </View>
                                    )}
                                </Pressable>
                            );
                        }
                    )}
                </View>
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
                {tier === SubscriptionTier.FREE && (
                    <Pressable
                        style={[styles.purchaseButton, isPurchasing && styles.buttonDisabled]}
                        onPress={handlePurchase}
                        disabled={isPurchasing || isLoading}
                    >
                        {isPurchasing ? (
                            <ActivityIndicator color={Colors.black} />
                        ) : (
                            <Text style={styles.purchaseButtonText}>
                                Subscribe to {TIER_CONFIGS[selectedTier].name}
                            </Text>
                        )}
                    </Pressable>
                )}

                <Pressable
                    style={styles.restoreButton}
                    onPress={handleRestore}
                    disabled={isRestoring}
                >
                    {isRestoring ? (
                        <ActivityIndicator color={Colors.textMuted} />
                    ) : (
                        <Text style={styles.restoreButtonText}>Restore Purchases</Text>
                    )}
                </Pressable>

                <Text style={styles.legalText}>
                    By subscribing, you agree to our Terms of Service and Privacy Policy.
                    Subscription auto-renews unless cancelled.
                </Text>
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
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    hero: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    heroIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(192, 192, 192, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: SILVER.glow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
    },
    heroTitle: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 16,
    },
    heroSubtitle: {
        color: Colors.textMuted,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 20,
    },
    tiersContainer: {
        gap: 16,
    },
    tierCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        position: 'relative',
    },
    tierCardSelected: {
        borderColor: SILVER.primary,
        shadowColor: SILVER.glow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },
    tierCardCurrent: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        opacity: 0.7,
    },
    tierCardFree: {
        opacity: 0.6,
    },
    recommendedBadge: {
        position: 'absolute',
        top: -10,
        right: 16,
        backgroundColor: SILVER.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        shadowColor: SILVER.glow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
    },
    recommendedBadgeText: {
        color: Colors.black,
        fontSize: 10,
        fontWeight: '700',
    },
    tierHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    tierName: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '700',
        flex: 1,
    },
    tierNamePremium: {
        color: SILVER.glow,
    },
    tierPrice: {
        color: SILVER.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    tierPriceFree: {
        color: Colors.textMuted,
        fontSize: 16,
        fontWeight: '600',
    },
    featuresList: {
        gap: 8,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    featureText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    currentBadge: {
        marginTop: 16,
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(192, 192, 192, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    currentBadgeText: {
        color: SILVER.glow,
        fontSize: 12,
        fontWeight: '600',
    },
    selectedIndicator: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: SILVER.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 12,
    },
    purchaseButton: {
        backgroundColor: SILVER.primary,
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: SILVER.glow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    purchaseButtonText: {
        color: Colors.black,
        fontSize: 18,
        fontWeight: '700',
    },
    restoreButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    restoreButtonText: {
        color: SILVER.dark,
        fontSize: 14,
    },
    legalText: {
        color: Colors.textMuted,
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 16,
    },
});
