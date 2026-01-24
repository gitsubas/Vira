// (tabs)/profile.tsx - Profile/Settings Screen
// User profile, subscription management, and settings

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Crown, Settings, HelpCircle, RefreshCw, CreditCard } from 'lucide-react-native';
import { GlassView } from '../../src/components/GlassView';
import { Colors } from '../../src/constants/Colors';
import { useSubscriptionStore } from '../../src/store/useSubscriptionStore';
import { SubscriptionTier, TIER_CONFIGS } from '../../src/types/subscription';
import { presentCustomerCenter } from '../../src/services/PaywallService';

export default function ProfileScreen() {
    const router = useRouter();
    const {
        tier,
        isActive,
        isLoading,
        usage,
        restoreUserPurchases,
        getRemainingAnalyses,
    } = useSubscriptionStore();

    const tierConfig = TIER_CONFIGS[tier];
    const remainingAnalyses = getRemainingAnalyses();

    // Navigate to paywall
    const handleUpgrade = useCallback(() => {
        router.push('/paywall');
    }, [router]);

    // Open Customer Center for subscribers
    const handleManageSubscription = useCallback(async () => {
        try {
            await presentCustomerCenter({
                onRestoreCompleted: (customerInfo) => {
                    console.log('[Profile] Restore completed in Customer Center');
                    Alert.alert('Restored', 'Your subscription has been restored!');
                },
            });
        } catch (error) {
            Alert.alert('Error', 'Unable to open subscription management. Please try again.');
        }
    }, []);

    // Restore purchases
    const handleRestore = useCallback(async () => {
        try {
            await restoreUserPurchases();
            Alert.alert('Restored', 'Your purchases have been restored.');
        } catch (error) {
            Alert.alert('Restore Failed', 'Unable to restore purchases. Please try again.');
        }
    }, [restoreUserPurchases]);

    // Get tier display info
    const getTierDisplayName = () => {
        switch (tier) {
            case SubscriptionTier.ENTERPRISE:
                return 'Vira Enterprise';
            case SubscriptionTier.PRO:
                return 'Vira Pro';
            default:
                return 'Rising Stars (Free)';
        }
    };

    const getTierColor = () => {
        switch (tier) {
            case SubscriptionTier.ENTERPRISE:
                return '#FFD700'; // Gold
            case SubscriptionTier.PRO:
                return Colors.viroPink;
            default:
                return Colors.textMuted;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
            </View>

            <View style={styles.content}>
                {/* User Info */}
                <GlassView style={styles.userCard}>
                    <View style={styles.avatar}>
                        <User size={32} color={Colors.white} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>Vira User</Text>
                        <Text style={[styles.userPlan, { color: getTierColor() }]}>
                            {getTierDisplayName()}
                        </Text>
                    </View>
                    {isLoading && (
                        <ActivityIndicator size="small" color={Colors.viroPink} />
                    )}
                </GlassView>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <GlassView style={styles.statCard}>
                        <Text style={styles.statValue}>{usage.analysesThisMonth}</Text>
                        <Text style={styles.statLabel}>Scans this month</Text>
                    </GlassView>
                    <GlassView style={styles.statCard}>
                        <Text style={[styles.statValue, { color: remainingAnalyses > 0 ? Colors.viroCyan : Colors.viroPink }]}>
                            {remainingAnalyses === Infinity ? '∞' : remainingAnalyses}
                        </Text>
                        <Text style={styles.statLabel}>Remaining</Text>
                    </GlassView>
                </View>

                {/* Subscription Limits */}
                <GlassView style={styles.limitsCard}>
                    <Text style={styles.limitsTitle}>Your Plan Limits</Text>
                    <View style={styles.limitRow}>
                        <Text style={styles.limitLabel}>Monthly Analyses</Text>
                        <Text style={styles.limitValue}>{tierConfig.monthlyLimit}</Text>
                    </View>
                    <View style={styles.limitRow}>
                        <Text style={styles.limitLabel}>Max Video Duration</Text>
                        <Text style={styles.limitValue}>
                            {tierConfig.maxVideoDuration >= 60
                                ? `${Math.floor(tierConfig.maxVideoDuration / 60)} min`
                                : `${tierConfig.maxVideoDuration} sec`}
                        </Text>
                    </View>
                </GlassView>

                {/* Menu Items */}
                <View style={styles.menu}>
                    {/* Show Upgrade or Manage based on subscription status */}
                    {tier === SubscriptionTier.FREE ? (
                        <MenuItem
                            icon={Crown}
                            label="Upgrade to Vira Pro"
                            onPress={handleUpgrade}
                            highlight
                        />
                    ) : (
                        <MenuItem
                            icon={CreditCard}
                            label="Manage Subscription"
                            onPress={handleManageSubscription}
                        />
                    )}

                    <MenuItem
                        icon={RefreshCw}
                        label="Restore Purchases"
                        onPress={handleRestore}
                    />

                    <MenuItem
                        icon={Settings}
                        label="Settings"
                        onPress={() => {/* TODO: Navigate to settings */ }}
                    />

                    <MenuItem
                        icon={HelpCircle}
                        label="Help & Support"
                        onPress={() => {/* TODO: Navigate to help */ }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

function MenuItem({
    icon: Icon,
    label,
    onPress,
    highlight,
}: {
    icon: any;
    label: string;
    onPress?: () => void;
    highlight?: boolean;
}) {
    return (
        <Pressable style={[styles.menuItem, highlight && styles.menuItemHighlight]} onPress={onPress}>
            <Icon size={20} color={highlight ? Colors.viroPink : Colors.white} />
            <Text style={[styles.menuLabel, highlight && styles.menuLabelHighlight]}>{label}</Text>
        </Pressable>
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
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginBottom: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.glassLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    userInfo: {
        flex: 1,
        marginLeft: 16,
    },
    userName: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    userPlan: {
        fontSize: 14,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    statValue: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: '700',
    },
    statLabel: {
        color: Colors.textMuted,
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    limitsCard: {
        padding: 16,
        marginBottom: 16,
    },
    limitsTitle: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    limitRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    limitLabel: {
        color: Colors.textMuted,
        fontSize: 14,
    },
    limitValue: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    menu: {
        gap: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.glassLight,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    menuItemHighlight: {
        borderColor: Colors.viroPink,
        backgroundColor: 'rgba(233, 30, 99, 0.1)',
    },
    menuLabel: {
        color: Colors.white,
        fontSize: 16,
        marginLeft: 12,
    },
    menuLabelHighlight: {
        color: Colors.viroPink,
        fontWeight: '600',
    },
});
