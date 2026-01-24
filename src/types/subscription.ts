// types/subscription.ts - Subscription Data Types
// Defines structures for subscription tiers, limits, and usage tracking

/**
 * Subscription tier levels
 */
export enum SubscriptionTier {
    FREE = 'FREE',
    PRO = 'PRO',
    ENTERPRISE = 'ENTERPRISE',
}

/**
 * Configuration for each subscription tier
 * Defines usage limits and feature access
 */
export interface TierConfig {
    name: string;
    maxVideoDuration: number; // Maximum video duration in seconds
    monthlyLimit: number;     // Maximum analyses per month
    price?: string;           // Display price (e.g., "$9.99/mo")
    features: string[];       // Feature list for paywall display
}

/**
 * Tier configurations with limits
 */
export const TIER_CONFIGS: Record<SubscriptionTier, TierConfig> = {
    [SubscriptionTier.FREE]: {
        name: 'Free',
        maxVideoDuration: 10,     // 10 seconds max
        monthlyLimit: 5,          // 5 analyses per month
        features: [
            '5 video analyses per month',
            'Videos up to 10 seconds',
            'Basic viral score',
            'SEO suggestions',
        ],
    },
    [SubscriptionTier.PRO]: {
        name: 'Pro',
        maxVideoDuration: 180,    // 3 minutes max
        monthlyLimit: 100,        // 100 analyses per month
        price: '$19.99/month',
        features: [
            '100 video analyses per month',
            'Videos up to 3 minutes',
            'Detailed viral analysis',
            'SEO optimization tools',
            'Hashtag generator',
            'Priority support',
        ],
    },
    [SubscriptionTier.ENTERPRISE]: {
        name: 'Enterprise',
        maxVideoDuration: 600,    // 10 minutes max
        monthlyLimit: 300,        // 300 analyses per month
        price: '$79.99/month',
        features: [
            '300 video analyses per month',
            'Videos up to 10 minutes',
            'Advanced analytics dashboard',
            'Team collaboration (coming soon)',
            'API access (coming soon)',
            'Dedicated support',
        ],
    },
};

/**
 * RevenueCat product identifiers
 * These should match your RevenueCat dashboard configuration
 */
export const REVENUECAT_PRODUCT_IDS = {
    PRO_MONTHLY: 'monthly',           // Monthly subscription product ID
    PRO_YEARLY: 'yearly',             // Yearly subscription product ID (if available)
    ENTERPRISE_MONTHLY: 'enterprise_monthly',
    ENTERPRISE_YEARLY: 'enterprise_yearly',
};

/**
 * RevenueCat entitlement identifiers
 * These must match the entitlement identifiers in your RevenueCat dashboard
 */
export const ENTITLEMENTS = {
    PRO: 'vira_pro',                  // Vira Pro entitlement
    ENTERPRISE: 'vira_enterprise',    // Vira Enterprise entitlement
};

/**
 * Usage data tracked per user
 */
export interface UsageData {
    analysesThisMonth: number;
    monthStartDate: string;     // ISO date string for month tracking
    lastAnalysisDate?: string;  // ISO date of last analysis
}

/**
 * Complete subscription state
 */
export interface SubscriptionState {
    tier: SubscriptionTier;
    isActive: boolean;
    expiresAt?: string;         // ISO date when subscription expires
    usage: UsageData;
}

/**
 * Purchase error types
 */
export enum PurchaseErrorType {
    CANCELLED = 'CANCELLED',
    NETWORK_ERROR = 'NETWORK_ERROR',
    STORE_ERROR = 'STORE_ERROR',
    ALREADY_OWNED = 'ALREADY_OWNED',
    UNKNOWN = 'UNKNOWN',
}

/**
 * Purchase error structure
 */
export interface PurchaseError {
    type: PurchaseErrorType;
    message: string;
}

/**
 * Check if video duration is within tier limit
 */
export function isWithinDurationLimit(
    tier: SubscriptionTier,
    durationSeconds: number
): boolean {
    const config = TIER_CONFIGS[tier];
    return durationSeconds <= config.maxVideoDuration;
}

/**
 * Check if user can perform another analysis this month
 */
export function canAnalyze(tier: SubscriptionTier, currentUsage: number): boolean {
    const config = TIER_CONFIGS[tier];
    return currentUsage < config.monthlyLimit;
}

/**
 * Get remaining analyses for the month
 */
export function getRemainingAnalyses(
    tier: SubscriptionTier,
    currentUsage: number
): number {
    const config = TIER_CONFIGS[tier];
    return Math.max(0, config.monthlyLimit - currentUsage);
}
