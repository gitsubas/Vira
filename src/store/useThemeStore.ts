// useThemeStore.ts - Theme Management State
// Manages light/dark mode preference and persistence

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    mode: ThemeMode;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
    // Helper to get active scheme
    isDark: boolean;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            mode: 'dark', // Default to 'dark' for Obsidian theme

            toggleTheme: () => {
                const current = get().mode;
                const next = current === 'light' ? 'dark' : 'light';
                set({ mode: next, isDark: next === 'dark' });
            },

            setTheme: (mode) => {
                set({
                    mode,
                    isDark: mode === 'system'
                        ? Appearance.getColorScheme() === 'dark'
                        : mode === 'dark'
                });
            },

            // Initial computation (updated by listener in _layout)
            isDark: true,
        }),
        {
            name: 'viro-theme-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Re-evaluate system preference on load
                    if (state.mode === 'system') {
                        state.isDark = Appearance.getColorScheme() === 'dark';
                    } else {
                        state.isDark = state.mode === 'dark';
                    }
                }
            }
        }
    )
);
