// Colors.ts - Viro Design System Colors
// Dynamic Theme Support

export const BaseColors = {
    // Brand Colors
    viroPink: '#FF2D78',
    viroCyan: '#00D4FF',
    success: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444',
};

// Obsidian & Glass (Dark Mode)
export const DarkColors = {
    background: '#000000',
    textPrimary: '#FFFFFF',
    textSecondary: '#D4D4D8',
    textMuted: '#A1A1AA',

    // Glass
    glassLight: 'rgba(255, 255, 255, 0.08)',
    glassHeavy: 'rgba(20, 20, 20, 0.6)',
    glassBorder: 'rgba(255, 255, 255, 0.15)',

    // UI
    cardBackground: 'rgba(255, 255, 255, 0.05)',
    inputBackground: 'rgba(255, 255, 255, 0.1)',

    // Icon
    iconPrimary: '#FFFFFF', // White icons on dark bg
    ...BaseColors,
};

// Clean Light (Light Mode)
export const LightColors = {
    background: '#F5F5F7', // Apple-like light gray
    textPrimary: '#1A1A1A',
    textSecondary: '#52525B',
    textMuted: '#71717A',

    // Glass (Darker tint for visibility on light bg)
    glassLight: 'rgba(0, 0, 0, 0.05)',
    glassHeavy: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(0, 0, 0, 0.1)',

    // UI
    cardBackground: '#FFFFFF',
    inputBackground: 'rgba(0, 0, 0, 0.05)',

    // Icon
    iconPrimary: '#000000', // Black icons on light bg
    ...BaseColors,
};

// Legacy export for backward compatibility during refactor
export const Colors = {
    ...DarkColors,
    black: '#000000',
    white: '#FFFFFF',
    platinum: '#E5E5E5',
};

export type ThemeColors = typeof DarkColors;
