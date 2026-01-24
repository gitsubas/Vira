// store/useAnalysisStore.ts - Analysis State Management
// Zustand store for managing analysis state and history

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { analyzeMedia } from '../services/GeminiService';
import {
    AnalysisInput,
    AnalysisResult,
    AnalysisError,
    AnalysisStatus,
    AnalysisErrorType,
} from '../types/analysis';

interface AnalysisState {
    // Current analysis state
    status: AnalysisStatus;
    currentInput: AnalysisInput | null;
    currentResult: AnalysisResult | null;
    error: AnalysisError | null;
    progress: string; // Current step description

    // History
    history: AnalysisResult[];

    // Actions
    startAnalysis: (input: AnalysisInput) => Promise<AnalysisResult>;
    setProgress: (progress: string) => void;
    clearCurrent: () => void;
    clearError: () => void;
    deleteFromHistory: (id: string) => void;
    clearHistory: () => void;
    getResultById: (id: string) => AnalysisResult | undefined;
}

// Maximum history items to store
const MAX_HISTORY_ITEMS = 50;

export const useAnalysisStore = create<AnalysisState>()(
    persist(
        (set, get) => ({
            // Initial state
            status: 'idle',
            currentInput: null,
            currentResult: null,
            error: null,
            progress: '',
            history: [],

            // Start a new analysis
            startAnalysis: async (input: AnalysisInput) => {
                // Reset state and set input
                set({
                    status: 'uploading',
                    currentInput: input,
                    currentResult: null,
                    error: null,
                    progress: 'Preparing media...',
                });

                try {
                    // Update progress
                    set({ status: 'processing', progress: 'Analyzing content...' });

                    // Call Gemini API
                    const result = await analyzeMedia(input);

                    // Success - update state and add to history
                    set((state) => ({
                        status: 'completed',
                        currentResult: result,
                        progress: 'Analysis complete!',
                        history: [result, ...state.history].slice(0, MAX_HISTORY_ITEMS),
                    }));

                    return result;
                } catch (error) {
                    // Handle error
                    const analysisError: AnalysisError =
                        (error as AnalysisError).type
                            ? (error as AnalysisError)
                            : {
                                type: AnalysisErrorType.UNKNOWN,
                                message: 'Analysis failed. Please try again.',
                                retryable: true,
                            };

                    set({
                        status: 'failed',
                        error: analysisError,
                        progress: '',
                    });

                    throw analysisError;
                }
            },

            // Update progress message
            setProgress: (progress: string) => {
                set({ progress });
            },

            // Clear current analysis state
            clearCurrent: () => {
                set({
                    status: 'idle',
                    currentInput: null,
                    currentResult: null,
                    error: null,
                    progress: '',
                });
            },

            // Clear error
            clearError: () => {
                set({ error: null });
            },

            // Delete item from history
            deleteFromHistory: (id: string) => {
                set((state) => ({
                    history: state.history.filter((item) => item.id !== id),
                }));
            },

            // Clear all history
            clearHistory: () => {
                set({ history: [] });
            },

            // Get result by ID
            getResultById: (id: string) => {
                return get().history.find((item) => item.id === id);
            },
        }),
        {
            name: 'viro-analysis-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // Only persist history, not current state
            partialize: (state) => ({
                history: state.history,
            }),
        }
    )
);

// Selector hooks for common use cases
export const useAnalysisStatus = () => useAnalysisStore((state) => state.status);
export const useAnalysisResult = () => useAnalysisStore((state) => state.currentResult);
export const useAnalysisError = () => useAnalysisStore((state) => state.error);
export const useAnalysisHistory = () => useAnalysisStore((state) => state.history);
export const useAnalysisProgress = () => useAnalysisStore((state) => state.progress);
