// _layout.tsx - Root Layout
// Handles global providers, fonts, and navigation structure

import { useEffect, useCallback } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import '../src/styles/global.css';
import { useSubscriptionStore } from '../src/store/useSubscriptionStore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const initializeSubscription = useSubscriptionStore((state) => state.initialize);

    // Initialize RevenueCat on app start
    useEffect(() => {
        async function prepare() {
            try {
                await initializeSubscription();
                // Artificial delay if needed, or wait for other assets
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#000000' },
                    animation: 'fade',
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                    name="analysis"
                    options={{
                        presentation: 'modal',
                    }}
                />
                <Stack.Screen
                    name="paywall"
                    options={{
                        presentation: 'modal',
                        animation: 'slide_from_bottom',
                    }}
                />
            </Stack>
        </View>
    );
}
