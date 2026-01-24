// app/onboarding/_layout.tsx - Onboarding Stack Layout
import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/Colors';

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.black },
                animation: 'slide_from_right',
            }}
        />
    );
}
