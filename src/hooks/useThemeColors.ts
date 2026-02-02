// useThemeColors.ts - Hook for dynamic colors
import { useThemeStore } from '../store/useThemeStore';
import { DarkColors, LightColors } from '../constants/Colors';

export function useThemeColors() {
    const isDark = useThemeStore((state) => state.isDark);

    const colors = isDark ? DarkColors : LightColors;

    return {
        colors,
        isDark,
        theme: isDark ? 'dark' : 'light' as 'dark' | 'light',
    };
}
