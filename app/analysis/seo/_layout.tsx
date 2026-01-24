// app/analysis/seo/_layout.tsx - SEO Screen Layout
import { Stack } from 'expo-router';
import { Colors } from '../../../src/constants/Colors';

export default function SEOLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.black },
            }}
        />
    );
}
