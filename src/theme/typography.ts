/**
 * GymGirl Community – Design Token: Typography
 *
 * Uses the system font stack by default. Swap `fontFamily` values here
 * once a custom font (e.g. Inter or Poppins) is loaded via react-native-fonts
 * or expo-font.
 *
 * Usage: import { typography, fontSizes, fontWeights } from '@theme';
 */

export const fontFamily = {
  regular: undefined,   // System default — replace with 'Inter-Regular'
  medium: undefined,    // Replace with 'Inter-Medium'
  semiBold: undefined,  // Replace with 'Inter-SemiBold'
  bold: undefined,      // Replace with 'Inter-Bold'
  extraBold: undefined, // Replace with 'Inter-ExtraBold'
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 38,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const letterSpacings = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
} as const;

/** Convenience text style presets */
export const textStyles = {
  displayLarge: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.extraBold,
    letterSpacing: letterSpacings.tight,
  },
  displayMedium: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacings.tight,
  },
  h1: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
  },
  h2: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
  },
  h3: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
  },
  bodyLarge: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
  },
  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacings.wider,
  },
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
  },
  button: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacings.wide,
  },
} as const;
