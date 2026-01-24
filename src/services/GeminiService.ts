// services/GeminiService.ts - Gemini API Integration Service
// Handles media upload, analysis requests, and response parsing

import * as FileSystem from 'expo-file-system/legacy';
import { getModel, ANALYSIS_SYSTEM_PROMPT } from '../lib/gemini';
import {
    AnalysisInput,
    AnalysisResult,
    AnalysisError,
    AnalysisErrorType,
} from '../types/analysis';

// Timeout for analysis requests (10 minutes for long videos)
const ANALYSIS_TIMEOUT = 600000;

/**
 * GeminiService - Handles all Gemini API interactions
 */
export class GeminiService {
    private static instance: GeminiService;

    private constructor() { }

    static getInstance(): GeminiService {
        if (!GeminiService.instance) {
            GeminiService.instance = new GeminiService();
        }
        return GeminiService.instance;
    }

    /**
     * Analyze media content for viral potential
     * @param input - The media file to analyze
     * @returns Analysis result or throws AnalysisError
     */
    async analyzeMedia(input: AnalysisInput): Promise<AnalysisResult> {
        try {
            console.log('[GeminiService] Starting analysis for:', input.fileName);
            console.log('[GeminiService] URI:', input.uri);
            console.log('[GeminiService] MimeType:', input.mimeType);

            // Step 1: Read file as base64 directly from the URI
            console.log('[GeminiService] Reading file as base64...');
            const base64Data = await this.readFileAsBase64(input.uri);
            console.log('[GeminiService] Base64 size:', base64Data.length, 'chars');

            // Step 2: Prepare the request
            const model = getModel();

            const contentParts = [
                {
                    inlineData: {
                        mimeType: this.normalizeMimeType(input.mimeType),
                        data: base64Data,
                    },
                },
                { text: ANALYSIS_SYSTEM_PROMPT },
            ];

            // Step 3: Generate content with timeout
            console.log('[GeminiService] Calling Gemini API...');
            const result = await this.withTimeout(
                model.generateContent(contentParts),
                ANALYSIS_TIMEOUT
            );

            // Step 4: Extract and parse response
            const response = await result.response;
            const text = response.text();
            console.log('[GeminiService] Received response, length:', text.length);

            // Step 5: Parse JSON response
            const parsedResult = this.parseAnalysisResponse(text);

            // Step 6: Construct full result
            return {
                ...parsedResult,
                id: this.generateId(),
                createdAt: new Date().toISOString(),
                input: {
                    uri: input.uri,
                    type: input.type,
                    fileName: input.fileName,
                    thumbnailUri: input.thumbnailUri,
                },
            };
        } catch (error) {
            console.error('[GeminiService] Error:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Normalize MIME type (iOS uses video/quicktime, but Gemini prefers video/mp4)
     */
    private normalizeMimeType(mimeType: string): string {
        const mimeMap: Record<string, string> = {
            'video/quicktime': 'video/mp4',
            'image/heic': 'image/jpeg',
            'image/heif': 'image/jpeg',
        };
        return mimeMap[mimeType] || mimeType;
    }

    /**
     * Read file and convert to base64
     */
    private async readFileAsBase64(uri: string): Promise<string> {
        try {
            // Remove file:// prefix if present for some edge cases
            let cleanUri = uri;

            console.log('[GeminiService] Attempting to read:', cleanUri);

            const base64 = await FileSystem.readAsStringAsync(cleanUri, {
                encoding: 'base64',
            });

            console.log('[GeminiService] Successfully read file');
            return base64;
        } catch (error: any) {
            console.error('[GeminiService] readFileAsBase64 error:', error?.message || error);

            // Try alternative approach: fetch as blob
            try {
                console.log('[GeminiService] Trying fetch approach...');
                const response = await fetch(uri);
                const blob = await response.blob();

                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64 = (reader.result as string).split(',')[1];
                        console.log('[GeminiService] Fetch approach succeeded');
                        resolve(base64);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (fetchError: any) {
                console.error('[GeminiService] Fetch approach failed:', fetchError?.message || fetchError);
                throw {
                    type: AnalysisErrorType.FILE_ERROR,
                    message: 'Could not read media file. Try a different file.',
                    retryable: true,
                } as AnalysisError;
            }
        }
    }

    /**
     * Parse the JSON response from Gemini
     */
    private parseAnalysisResponse(text: string): Omit<AnalysisResult, 'id' | 'createdAt' | 'input'> {
        try {
            console.log('[GeminiService] Raw response preview:', text.substring(0, 300));

            let jsonText = text;
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                jsonText = jsonMatch[1];
            }

            const objectMatch = jsonText.match(/\{[\s\S]*\}/);
            if (objectMatch) {
                jsonText = objectMatch[0];
            }

            const parsed = JSON.parse(jsonText);

            if (typeof parsed.score !== 'number') {
                throw new Error('Missing score field');
            }

            return {
                score: Math.min(100, Math.max(0, parsed.score)),
                viralPotential: parsed.viralPotential || 'Moderate',
                hookStrength: parsed.hookStrength || 'Average',
                pacing: parsed.pacing || 'Not analyzed',
                keywords: parsed.keywords || [],
                improvements: parsed.improvements || [],
                seo: {
                    titles: parsed.seo?.titles || [],
                    caption: parsed.seo?.caption || '',
                    hashtags: parsed.seo?.hashtags || [],
                    filename: parsed.seo?.filename || '',
                },
            };
        } catch (error) {
            console.error('[GeminiService] parseAnalysisResponse error:', error);
            throw {
                type: AnalysisErrorType.PARSE_ERROR,
                message: 'Failed to parse analysis response',
                retryable: true,
            } as AnalysisError;
        }
    }

    private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
        const timeout = new Promise<never>((_, reject) => {
            setTimeout(() => {
                reject({
                    type: AnalysisErrorType.TIMEOUT,
                    message: 'Analysis timed out. Try a shorter video.',
                    retryable: true,
                } as AnalysisError);
            }, ms);
        });
        return Promise.race([promise, timeout]);
    }

    private handleError(error: unknown): AnalysisError {
        if (this.isAnalysisError(error)) {
            return error;
        }

        if (error instanceof Error) {
            const message = error.message.toLowerCase();

            if (message.includes('network') || message.includes('fetch')) {
                return {
                    type: AnalysisErrorType.NETWORK_ERROR,
                    message: 'Network error. Check your connection.',
                    retryable: true,
                };
            }

            if (message.includes('safety') || message.includes('blocked')) {
                return {
                    type: AnalysisErrorType.SAFETY_BLOCK,
                    message: 'Content was flagged. Try different content.',
                    retryable: false,
                };
            }

            if (message.includes('quota') || message.includes('limit')) {
                return {
                    type: AnalysisErrorType.QUOTA_EXCEEDED,
                    message: 'API quota exceeded. Try again later.',
                    retryable: false,
                };
            }

            if (message.includes('memory') || message.includes('size') || message.includes('large')) {
                return {
                    type: AnalysisErrorType.FILE_ERROR,
                    message: 'File is too large. Try a shorter video.',
                    retryable: false,
                };
            }
        }

        return {
            type: AnalysisErrorType.UNKNOWN,
            message: 'An unexpected error occurred.',
            retryable: true,
        };
    }

    private isAnalysisError(error: unknown): error is AnalysisError {
        return typeof error === 'object' && error !== null && 'type' in error && 'message' in error;
    }

    private generateId(): string {
        return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

export const geminiService = GeminiService.getInstance();

export async function analyzeMedia(input: AnalysisInput): Promise<AnalysisResult> {
    return geminiService.analyzeMedia(input);
}
