// Colors.ts - Viro Design System Colors
// Based on "Obsidian & Glass" Style Guide

export const Colors = {
    // Primary
    black: '#000000',
    white: '#FFFFFF',
    platinum: '#E5E5E5',

    // Brand Colors
    viroPink: '#FF2D78',     // Viro accent pink
    viroCyan: '#00D4FF',     // Viro accent cyan

    // Glass & Surface
    glassLight: 'rgba(255, 255, 255, 0.08)',
    glassHeavy: 'rgba(20, 20, 20, 0.6)',
    glassBorder: 'rgba(255, 255, 255, 0.15)',

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#D4D4D8',
    textMuted: '#A1A1AA',

    // Semantic
    success: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444',
} as const;

export type ColorName = keyof typeof Colors;
