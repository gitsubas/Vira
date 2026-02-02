// (tabs)/profile.tsx - Profile/Settings Screen
// Added Theme Toggle

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Crown, Settings, HelpCircle, RefreshCw, CreditCard, Moon, Sun } from 'lucide-react-native';
import { GlassView } from '../../src/components/GlassView';
import { Colors } from '../../src/constants/Colors';
import { useSubscriptionStore } from '../../src/store/useSubscriptionStore';
import { SubscriptionTier, TIER_CONFIGS } from '../../src/types/subscription';
import { presentCustomerCenter } from '../../src/services/PaywallService';
import { useThemeStore } from '../../src/store/useThemeStore';
import { useThemeColors } from '../../src/hooks/useThemeColors';

export default function ProfileScreen() {
    const router = useRouter();
    const { colors, isDark } = useThemeColors();
    const { toggleTheme } = useThemeStore();

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
                return colors.textMuted;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Profile</Text>
            </View>

            <View style={styles.content}>
                {/* User Info */}
                <GlassView style={styles.userCard}>
                    <View style={[styles.avatar, { borderColor: colors.glassBorder, backgroundColor: colors.glassLight }]}>
                        <User size={32} color={colors.textPrimary} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={[styles.userName, { color: colors.textPrimary }]}>Vira User</Text>
                        <Text style={[styles.userPlan, { color: getTierColor() }]}>
                            {getTierDisplayName()}
                        </Text>
                    </View>
                    {isLoading && (
                        <ActivityIndicator size="small" color={Colors.viroPink} />
                    )}
                </GlassView>

                {/* Appearance Toggle */}
                <GlassView style={styles.appearanceCard}>
                    <View style={styles.appearanceRow}>
                        <View style={styles.appearanceLabelContainer}>
                            {isDark ? <Moon size={20} color={colors.textPrimary} /> : <Sun size={20} color={colors.textPrimary} />}
                            <Text style={[styles.appearanceLabel, { color: colors.textPrimary }]}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#767577', true: Colors.viroPink }}
                            thumbColor={Colors.white}
                        />
                    </View>
                </GlassView>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <GlassView style={styles.statCard}>
                        <Text style={[styles.statValue, { color: colors.textPrimary }]}>{usage.analysesThisMonth}</Text>
                        <Text style={[styles.statLabel, { color: colors.textMuted }]}>Scans this month</Text>
                    </GlassView>
                    <GlassView style={styles.statCard}>
                        <Text style={[styles.statValue, { color: remainingAnalyses > 0 ? Colors.viroCyan : Colors.viroPink }]}>
                            {remainingAnalyses === Infinity ? '∞' : remainingAnalyses}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textMuted }]}>Remaining</Text>
                    </GlassView>
                </View>

                {/* Subscription Limits */}
                <GlassView style={styles.limitsCard}>
                    <Text style={[styles.limitsTitle, { color: colors.textPrimary }]}>Your Plan Limits</Text>
                    <View style={[styles.limitRow, { borderBottomColor: colors.glassBorder }]}>
                        <Text style={[styles.limitLabel, { color: colors.textMuted }]}>Monthly Analyses</Text>
                        <Text style={[styles.limitValue, { color: colors.textPrimary }]}>{tierConfig.monthlyLimit}</Text>
                    </View>
                    <View style={styles.limitRowNoBorder}>
                        <Text style={[styles.limitLabel, { color: colors.textMuted }]}>Max Video Duration</Text>
                        <Text style={[styles.limitValue, { color: colors.textPrimary }]}>
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
                            colors={colors}
                        />
                    ) : (
                        <MenuItem
                            icon={CreditCard}
                            label="Manage Subscription"
                            onPress={handleManageSubscription}
                            colors={colors}
                        />
                    )}

                    <MenuItem
                        icon={RefreshCw}
                        label="Restore Purchases"
                        onPress={handleRestore}
                        colors={colors}
                    />

                    <MenuItem
                        icon={Settings}
                        label="Settings"
                        onPress={() => {/* TODO: Navigate to settings */ }}
                        colors={colors}
                    />

                    <MenuItem
                        icon={HelpCircle}
                        label="Help & Support"
                        onPress={() => {/* TODO: Navigate to help */ }}
                        colors={colors}
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
    colors
}: {
    icon: any;
    label: string;
    onPress?: () => void;
    highlight?: boolean;
    colors: any;
}) {
    return (
        <Pressable
            style={[
                styles.menuItem,
                { backgroundColor: colors.glassLight, borderColor: colors.glassBorder },
                highlight && styles.menuItemHighlight
            ]}
            onPress={onPress}
        >
            <Icon size={20} color={highlight ? Colors.viroPink : colors.textPrimary} />
            <Text style={[
                styles.menuLabel,
                { color: colors.textPrimary },
                highlight && styles.menuLabelHighlight
            ]}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    title: {
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
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    userInfo: {
        flex: 1,
        marginLeft: 16,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
    },
    userPlan: {
        fontSize: 14,
        marginTop: 2,
    },
    appearanceCard: {
        padding: 16,
        marginBottom: 16,
    },
    appearanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    appearanceLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    appearanceLabel: {
        fontSize: 16,
        fontWeight: '500',
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
        fontSize: 28,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    limitsCard: {
        padding: 16,
        marginBottom: 16,
    },
    limitsTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    limitRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    limitRowNoBorder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    limitLabel: {
        fontSize: 14,
    },
    limitValue: {
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
        borderRadius: 12,
        borderWidth: 1,
    },
    menuItemHighlight: {
        borderColor: Colors.viroPink,
        backgroundColor: 'rgba(233, 30, 99, 0.1)',
    },
    menuLabel: {
        fontSize: 16,
        marginLeft: 12,
    },
    menuLabelHighlight: {
        color: Colors.viroPink,
        fontWeight: '600',
    },
});
