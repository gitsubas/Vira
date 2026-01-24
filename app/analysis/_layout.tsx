// analysis/_layout.tsx - Analysis Stack Layout
// Handles the analysis flow screens (selection, processing, result)

import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/Colors';

export default function AnalysisLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.black },
                animation: 'slide_from_bottom',
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    // Modal presentation for the capture screen
                    presentation: 'modal',
                }}
            />
            <Stack.Screen name="processing" />
            <Stack.Screen name="[id]" />
        </Stack>
    );
}
