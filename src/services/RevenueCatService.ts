// services/RevenueCatService.ts - Subscription Service
// Mock implementation for local development (no RevenueCat dependency)

import {
    SubscriptionTier,
    ENTITLEMENTS,
    PurchaseError,
    PurchaseErrorType,
    TIER_CONFIGS,
} from '../types/subscription';

// ============================================
// MOCK MODE - For local development testing
// ============================================
const USE_MOCK = true; // Set to false when ready to use real RevenueCat

/**
 * Mock Customer Info type (matches RevenueCat's CustomerInfo structure)
 */
export interface MockCustomerInfo {
    entitlements: {
        active: Record<string, {
            identifier: string;
            isActive: boolean;
            expirationDate: string | null;
        }>;
    };
    originalAppUserId: string;
}

/**
 * Mock store for subscription state
 */
let mockSubscriptionState: {
    tier: SubscriptionTier;
    expirationDate: string | null;
} = {
    tier: SubscriptionTier.FREE,
    expirationDate: null,
};

/**
 * Generate mock customer info based on current state
 */
function getMockCustomerInfo(): MockCustomerInfo {
    const active: MockCustomerInfo['entitlements']['active'] = {};

    if (mockSubscriptionState.tier === SubscriptionTier.PRO) {
        active[ENTITLEMENTS.PRO] = {
            identifier: ENTITLEMENTS.PRO,
            isActive: true,
            expirationDate: mockSubscriptionState.expirationDate,
        };
    } else if (mockSubscriptionState.tier === SubscriptionTier.ENTERPRISE) {
        active[ENTITLEMENTS.ENTERPRISE] = {
            identifier: ENTITLEMENTS.ENTERPRISE,
            isActive: true,
            expirationDate: mockSubscriptionState.expirationDate,
        };
    }

    return {
        entitlements: { active },
        originalAppUserId: 'mock_user_123',
    };
}

/**
 * RevenueCatService - Singleton service for managing subscriptions
 * Uses mock data for local development
 */
class RevenueCatService {
    private static instance: RevenueCatService;
    private isInitialized = false;

    private constructor() { }

    static getInstance(): RevenueCatService {
        if (!RevenueCatService.instance) {
            RevenueCatService.instance = new RevenueCatService();
        }
        return RevenueCatService.instance;
    }

    /**
     * Initialize the subscription service
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) {
            console.log('[SubscriptionService] Already initialized');
            return;
        }

        if (USE_MOCK) {
            console.log('[SubscriptionService] Using MOCK mode for local development');
            this.isInitialized = true;
            return;
        }

        // Real RevenueCat initialization would go here
        this.isInitialized = true;
        console.log('[SubscriptionService] Initialized');
    }

    /**
     * Get current customer info (subscription status)
     */
    async getCustomerInfo(): Promise<MockCustomerInfo> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return getMockCustomerInfo();
    }

    /**
     * Get available offerings (mock data)
     */
    async getOfferings(): Promise<null> {
        // In mock mode, we don't use offerings - tier cards handle selection
        return null;
    }

    /**
     * Purchase a subscription tier (mock)
     */
    async purchaseTier(
        tierToPurchase: SubscriptionTier
    ): Promise<{ customerInfo: MockCustomerInfo; success: boolean }> {
        console.log('[SubscriptionService] Mock purchase:', tierToPurchase);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate 10% chance of failure for testing
        if (Math.random() < 0.1) {
            throw {
                type: PurchaseErrorType.STORE_ERROR,
                message: 'Mock payment failed. Please try again.',
            } as PurchaseError;
        }

        // Set expiration to 1 month from now
        const expiration = new Date();
        expiration.setMonth(expiration.getMonth() + 1);

        // Update mock state
        mockSubscriptionState = {
            tier: tierToPurchase,
            expirationDate: expiration.toISOString(),
        };

        console.log('[SubscriptionService] Mock purchase successful:', tierToPurchase);
        return { customerInfo: getMockCustomerInfo(), success: true };
    }

    /**
     * Restore previous purchases (mock)
     */
    async restorePurchases(): Promise<MockCustomerInfo> {
        console.log('[SubscriptionService] Restoring purchases (mock)...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // In mock mode, just return current state
        // You could modify this to simulate finding a previous purchase
        return getMockCustomerInfo();
    }

    /**
     * Identify user (mock - no-op)
     */
    async identify(userId: string): Promise<void> {
        console.log('[SubscriptionService] User identified (mock):', userId);
    }

    /**
     * Log out current user (mock)
     */
    async logout(): Promise<void> {
        console.log('[SubscriptionService] User logged out (mock)');
        mockSubscriptionState = {
            tier: SubscriptionTier.FREE,
            expirationDate: null,
        };
    }

    /**
     * Determine subscription tier from customer info
     */
    getTierFromCustomerInfo(customerInfo: MockCustomerInfo): SubscriptionTier {
        const entitlements = customerInfo.entitlements.active;

        if (entitlements[ENTITLEMENTS.ENTERPRISE]) {
            return SubscriptionTier.ENTERPRISE;
        }

        if (entitlements[ENTITLEMENTS.PRO]) {
            return SubscriptionTier.PRO;
        }

        return SubscriptionTier.FREE;
    }

    /**
     * Check if user has Vira Pro entitlement
     */
    hasViraProEntitlement(customerInfo: MockCustomerInfo): boolean {
        return !!customerInfo.entitlements.active[ENTITLEMENTS.PRO];
    }

    /**
     * Check if user has Vira Enterprise entitlement
     */
    hasViraEnterpriseEntitlement(customerInfo: MockCustomerInfo): boolean {
        return !!customerInfo.entitlements.active[ENTITLEMENTS.ENTERPRISE];
    }

    /**
     * Check if user has any premium entitlement
     */
    hasPremiumEntitlement(customerInfo: MockCustomerInfo): boolean {
        return this.hasViraProEntitlement(customerInfo) || this.hasViraEnterpriseEntitlement(customerInfo);
    }

    /**
     * Check if user has active subscription
     */
    hasActiveSubscription(customerInfo: MockCustomerInfo): boolean {
        return Object.keys(customerInfo.entitlements.active).length > 0;
    }

    /**
     * Get subscription expiration date
     */
    getExpirationDate(customerInfo: MockCustomerInfo): string | undefined {
        const entitlements = customerInfo.entitlements.active;
        let latestExpiration: string | undefined;

        for (const key of Object.keys(entitlements)) {
            const entitlement = entitlements[key];
            if (entitlement.expirationDate) {
                if (!latestExpiration || entitlement.expirationDate > latestExpiration) {
                    latestExpiration = entitlement.expirationDate;
                }
            }
        }

        return latestExpiration;
    }

    // ============================================
    // DEV HELPERS - For testing different states
    // ============================================

    /**
     * [DEV ONLY] Set subscription tier directly for testing
     */
    devSetTier(tier: SubscriptionTier): void {
        if (!USE_MOCK) {
            console.warn('[SubscriptionService] devSetTier only works in mock mode');
            return;
        }

        const expiration = new Date();
        expiration.setMonth(expiration.getMonth() + 1);

        mockSubscriptionState = {
            tier,
            expirationDate: tier === SubscriptionTier.FREE ? null : expiration.toISOString(),
        };

        console.log('[SubscriptionService] DEV: Tier set to', tier);
    }

    /**
     * [DEV ONLY] Reset to free tier
     */
    devResetToFree(): void {
        this.devSetTier(SubscriptionTier.FREE);
    }
}

// Export singleton instance
export const revenueCatService = RevenueCatService.getInstance();

// Export convenience functions
export const initializeRevenueCat = () => revenueCatService.initialize();
export const getCustomerInfo = () => revenueCatService.getCustomerInfo();
export const getOfferings = () => revenueCatService.getOfferings();
export const purchaseTier = (tier: SubscriptionTier) => revenueCatService.purchaseTier(tier);
export const restorePurchases = () => revenueCatService.restorePurchases();
export const getTierFromCustomerInfo = (info: MockCustomerInfo) =>
    revenueCatService.getTierFromCustomerInfo(info);

// Dev helpers
export const devSetTier = (tier: SubscriptionTier) => revenueCatService.devSetTier(tier);
export const devResetToFree = () => revenueCatService.devResetToFree();
