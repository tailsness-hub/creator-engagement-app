/**
 * Design System - Theme Configuration
 * 
 * Centralized design tokens for consistent styling across the app
 */

// Color Palette
export const Colors = {
  // Primary Brand Colors
  primary: '#6366F1', // Modern indigo
  primaryDark: '#4F46E5',
  primaryLight: '#8B5CF6',
  
  // Secondary Colors
  secondary: '#F59E0B', // Amber accent
  secondaryDark: '#D97706',
  secondaryLight: '#FCD34D',
  
  // Platform Colors
  discord: '#5865F2',
  instagram: '#E4405F',
  instagramGradient: ['#405DE6', '#5851DB', '#833AB4', '#C13584', '#E1306C', '#FD1D1D'],
  twitter: '#1DA1F2', // Twitter blue
  
  // Semantic Colors
  success: '#10B981', // Green
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  info: '#3B82F6', // Blue
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },
  
  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  
  // Border Colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
};

// Typography Scale
export const Typography = {
  // Font Sizes
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Font Weights
  weight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font Families (React Native defaults + platform specific)
  family: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    // iOS specific
    ios: {
      regular: 'San Francisco',
      medium: 'San Francisco',
      bold: 'San Francisco',
    },
    // Android specific
    android: {
      regular: 'Roboto',
      medium: 'Roboto-Medium',
      bold: 'Roboto-Bold',
    },
  },
};

// Spacing Scale (following 8pt grid system)
export const Spacing = {
  xs: 4,   // 0.25rem
  sm: 8,   // 0.5rem
  md: 12,  // 0.75rem
  base: 16, // 1rem
  lg: 20,  // 1.25rem
  xl: 24,  // 1.5rem
  '2xl': 32, // 2rem
  '3xl': 48, // 3rem
  '4xl': 64, // 4rem
  '5xl': 80, // 5rem
  '6xl': 96, // 6rem
};

// Border Radius
export const BorderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
};

// Shadows (elevation system)
export const Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Animation Durations
export const Animations = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },
  
  easing: {
    easeInOut: 'ease-in-out',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    linear: 'linear',
  },
};

// Layout Constants
export const Layout = {
  // Screen padding
  screenPadding: Spacing.base,
  
  // Component spacing
  componentSpacing: Spacing.xl,
  
  // Header heights
  headerHeight: 64,
  
  // Button heights
  buttonHeight: {
    sm: 36,
    base: 48,
    lg: 56,
  },
  
  // Input heights
  inputHeight: {
    sm: 40,
    base: 48,
    lg: 56,
  },
};

// Common Style Combinations
export const CommonStyles = {
  // Card styles
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadows.md,
  },
  
  // Button styles
  buttonPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    ...Shadows.base,
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    fontSize: Typography.size.base,
    color: Colors.text.primary,
  },
  
  // Text styles
  textPrimary: {
    color: Colors.text.primary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.normal,
  },
  
  textSecondary: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.normal,
  },
  
  // Layout helpers
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  flex1: {
    flex: 1,
  },
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Animations,
  Layout,
  CommonStyles,
};