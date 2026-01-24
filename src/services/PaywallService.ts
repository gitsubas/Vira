// services/PaywallService.ts - Paywall and Customer Center Service
// Handles paywall presentation and customer center functionality using RevenueCatUI

import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { PurchasesOffering, CustomerInfo } from 'react-native-purchases';

/**
 * Result type for paywall presentation
 */
export enum PaywallResultType {
    PURCHASED = 'PURCHASED',
    RESTORED = 'RESTORED',
    CANCELLED = 'CANCELLED',
    ERROR = 'ERROR',
    NOT_PRESENTED = 'NOT_PRESENTED',
}

/**
 * Present RevenueCat native paywall
 * @param offering - Optional specific offering to display
 * @returns PaywallResultType indicating the outcome
 */
export async function presentPaywall(
    offering?: PurchasesOffering
): Promise<PaywallResultType> {
    try {
        const result: PAYWALL_RESULT = await RevenueCatUI.presentPaywall({
            offering,
        });

        switch (result) {
            case PAYWALL_RESULT.PURCHASED:
                return PaywallResultType.PURCHASED;
            case PAYWALL_RESULT.RESTORED:
                return PaywallResultType.RESTORED;
            case PAYWALL_RESULT.CANCELLED:
                return PaywallResultType.CANCELLED;
            case PAYWALL_RESULT.NOT_PRESENTED:
                return PaywallResultType.NOT_PRESENTED;
            case PAYWALL_RESULT.ERROR:
            default:
                return PaywallResultType.ERROR;
        }
    } catch (error) {
        console.error('[PaywallService] Error presenting paywall:', error);
        return PaywallResultType.ERROR;
    }
}

/**
 * Present paywall only if user doesn't have the specified entitlement
 * @param requiredEntitlement - Entitlement identifier to check
 * @param offering - Optional specific offering to display
 * @returns PaywallResultType indicating the outcome
 */
export async function presentPaywallIfNeeded(
    requiredEntitlement: string,
    offering?: PurchasesOffering
): Promise<PaywallResultType> {
    try {
        const result: PAYWALL_RESULT = await RevenueCatUI.presentPaywallIfNeeded({
            requiredEntitlementIdentifier: requiredEntitlement,
            offering,
        });

        switch (result) {
            case PAYWALL_RESULT.PURCHASED:
                return PaywallResultType.PURCHASED;
            case PAYWALL_RESULT.RESTORED:
                return PaywallResultType.RESTORED;
            case PAYWALL_RESULT.CANCELLED:
                return PaywallResultType.CANCELLED;
            case PAYWALL_RESULT.NOT_PRESENTED:
                return PaywallResultType.NOT_PRESENTED;
            case PAYWALL_RESULT.ERROR:
            default:
                return PaywallResultType.ERROR;
        }
    } catch (error) {
        console.error('[PaywallService] Error presenting paywall if needed:', error);
        return PaywallResultType.ERROR;
    }
}

/**
 * Simple callback handlers for Customer Center
 */
export interface SimpleCustomerCenterCallbacks {
    onRestoreCompleted?: (customerInfo: CustomerInfo) => void;
    onDismiss?: () => void;
}

/**
 * Present the Customer Center for subscription management
 * Uses simplified callbacks to avoid complex type issues
 */
export async function presentCustomerCenter(
    callbacks?: SimpleCustomerCenterCallbacks
): Promise<void> {
    try {
        await RevenueCatUI.presentCustomerCenter({
            callbacks: {
                onRestoreCompleted: callbacks?.onRestoreCompleted
                    ? ({ customerInfo }: { customerInfo: CustomerInfo }) => {
                        callbacks.onRestoreCompleted?.(customerInfo);
                    }
                    : undefined,
            },
        });
        console.log('[PaywallService] Customer Center presented successfully');
        callbacks?.onDismiss?.();
    } catch (error) {
        console.error('[PaywallService] Error presenting Customer Center:', error);
        throw error;
    }
}

/**
 * Check if paywall presentation resulted in a successful purchase or restore
 */
export function isPaywallSuccess(result: PaywallResultType): boolean {
    return result === PaywallResultType.PURCHASED || result === PaywallResultType.RESTORED;
}
