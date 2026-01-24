// store/useSubscriptionStore.ts - Subscription State Management
// Zustand store for managing subscription state, usage tracking, and limits

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    SubscriptionTier,
    UsageData,
    TIER_CONFIGS,
    canAnalyze,
    isWithinDurationLimit,
    getRemainingAnalyses,
} from '../types/subscription';
import {
    initializeRevenueCat,
    getCustomerInfo,
    restorePurchases,
    getTierFromCustomerInfo,
    MockCustomerInfo,
} from '../services/RevenueCatService';

interface SubscriptionStoreState {
    // Subscription status
    tier: SubscriptionTier;
    isActive: boolean;
    expiresAt?: string;
    isLoading: boolean;
    error: string | null;

    // Usage tracking
    usage: UsageData;

    // Actions
    initialize: () => Promise<void>;
    refreshSubscription: () => Promise<void>;
    setTier: (tier: SubscriptionTier) => void;
    incrementUsage: () => void;
    checkMonthlyReset: () => void;
    canPerformAnalysis: (videoDurationSeconds?: number) => { allowed: boolean; reason?: string };
    getRemainingAnalyses: () => number;
    restoreUserPurchases: () => Promise<void>;
}

/**
 * Get the start of the current month as ISO string
 */
function getMonthStart(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

/**
 * Check if the stored month start is in a previous month
 */
function isNewMonth(storedMonthStart: string): boolean {
    const stored = new Date(storedMonthStart);
    const currentMonthStart = new Date(getMonthStart());
    return stored < currentMonthStart;
}

export const useSubscriptionStore = create<SubscriptionStoreState>()(
    persist(
        (set, get) => ({
            // Initial state
            tier: SubscriptionTier.FREE,
            isActive: false,
            expiresAt: undefined,
            isLoading: false,
            error: null,
            usage: {
                analysesThisMonth: 0,
                monthStartDate: getMonthStart(),
            },

            /**
             * Initialize RevenueCat and fetch subscription status
             */
            initialize: async () => {
                try {
                    set({ isLoading: true, error: null });

                    // Initialize RevenueCat SDK
                    await initializeRevenueCat();

                    // Fetch customer info
                    const customerInfo = await getCustomerInfo();
                    const tier = getTierFromCustomerInfo(customerInfo);
                    const isActive = tier !== SubscriptionTier.FREE;

                    set({
                        tier,
                        isActive,
                        isLoading: false,
                    });

                    // Check for monthly usage reset
                    get().checkMonthlyReset();

                    console.log('[SubscriptionStore] Initialized with tier:', tier);
                } catch (error: any) {
                    console.error('[SubscriptionStore] Initialization error:', error);
                    set({
                        isLoading: false,
                        error: error.message || 'Failed to initialize subscription',
                    });
                }
            },

            /**
             * Refresh subscription status from RevenueCat
             */
            refreshSubscription: async () => {
                try {
                    set({ isLoading: true });

                    const customerInfo = await getCustomerInfo();
                    const tier = getTierFromCustomerInfo(customerInfo);
                    const isActive = tier !== SubscriptionTier.FREE;

                    set({
                        tier,
                        isActive,
                        isLoading: false,
                    });

                    console.log('[SubscriptionStore] Refreshed tier:', tier);
                } catch (error: any) {
                    console.error('[SubscriptionStore] Refresh error:', error);
                    set({ isLoading: false });
                }
            },

            /**
             * Manually set subscription tier (for testing/debugging)
             */
            setTier: (tier: SubscriptionTier) => {
                set({
                    tier,
                    isActive: tier !== SubscriptionTier.FREE,
                });
            },

            /**
             * Increment usage counter after successful analysis
             */
            incrementUsage: () => {
                set((state) => ({
                    usage: {
                        ...state.usage,
                        analysesThisMonth: state.usage.analysesThisMonth + 1,
                        lastAnalysisDate: new Date().toISOString(),
                    },
                }));
                console.log('[SubscriptionStore] Usage incremented');
            },

            /**
             * Check and reset usage if we're in a new month
             */
            checkMonthlyReset: () => {
                const { usage } = get();

                if (isNewMonth(usage.monthStartDate)) {
                    set({
                        usage: {
                            analysesThisMonth: 0,
                            monthStartDate: getMonthStart(),
                        },
                    });
                    console.log('[SubscriptionStore] Monthly usage reset');
                }
            },

            /**
             * Check if user can perform an analysis
             * @param videoDurationSeconds - Duration of video (for duration limit check)
             * @returns Object with allowed status and optional reason if blocked
             */
            canPerformAnalysis: (videoDurationSeconds?: number) => {
                const { tier, usage } = get();
                const config = TIER_CONFIGS[tier];

                // Check monthly usage limit
                if (!canAnalyze(tier, usage.analysesThisMonth)) {
                    return {
                        allowed: false,
                        reason: `You've used all ${config.monthlyLimit} analyses for this month. Upgrade to continue!`,
                    };
                }

                // Check video duration limit (if provided)
                if (videoDurationSeconds !== undefined) {
                    if (!isWithinDurationLimit(tier, videoDurationSeconds)) {
                        const maxMinutes = Math.floor(config.maxVideoDuration / 60);
                        const maxSeconds = config.maxVideoDuration % 60;
                        const limitText = maxMinutes > 0
                            ? `${maxMinutes} minute${maxMinutes > 1 ? 's' : ''}${maxSeconds > 0 ? ` ${maxSeconds} seconds` : ''}`
                            : `${maxSeconds} seconds`;

                        return {
                            allowed: false,
                            reason: `Video exceeds ${limitText} limit for ${config.name} tier. Upgrade for longer videos!`,
                        };
                    }
                }

                return { allowed: true };
            },

            /**
             * Get remaining analyses for this month
             */
            getRemainingAnalyses: () => {
                const { tier, usage } = get();
                return getRemainingAnalyses(tier, usage.analysesThisMonth);
            },

            /**
             * Restore user purchases from app stores
             */
            restoreUserPurchases: async () => {
                try {
                    set({ isLoading: true, error: null });

                    const customerInfo = await restorePurchases();
                    const tier = getTierFromCustomerInfo(customerInfo);
                    const isActive = tier !== SubscriptionTier.FREE;

                    set({
                        tier,
                        isActive,
                        isLoading: false,
                    });

                    console.log('[SubscriptionStore] Purchases restored, tier:', tier);
                } catch (error: any) {
                    console.error('[SubscriptionStore] Restore error:', error);
                    set({
                        isLoading: false,
                        error: error.message || 'Failed to restore purchases',
                    });
                }
            },
        }),
        {
            name: 'viro-subscription-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // Only persist usage data, NOT tier (tier comes from mock service / RevenueCat)
            // This prevents mismatch when mock service resets on app restart
            partialize: (state) => ({
                usage: state.usage,
            }),
        }
    )
);

// Selector hooks for common use cases
export const useSubscriptionTier = () =>
    useSubscriptionStore((state) => state.tier);
export const useIsSubscribed = () =>
    useSubscriptionStore((state) => state.isActive);
export const useSubscriptionLoading = () =>
    useSubscriptionStore((state) => state.isLoading);
export const useRemainingAnalyses = () =>
    useSubscriptionStore((state) => state.getRemainingAnalyses());
