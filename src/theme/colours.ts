/**
 * GymGirl Community – Design Token: Colours
 *
 * All colour values are derived from the Figma file:
 * https://www.figma.com/design/k1o9AXwKvOypeA1HONt0Eq/GymGirlClub
 *
 * Usage: import { colours } from '@theme';
 */

export const colours = {
  // ─── Backgrounds ───────────────────────────────────────────────
  background: '#1A1008',     // main app background (darkest)
  surface: '#231610',        // card / modal surface
  surfaceAlt: '#2E1E12',     // input & secondary surfaces
  overlay: 'rgba(0,0,0,0.55)',

  // ─── Brand / Primary ───────────────────────────────────────────
  primary: '#E07020',        // CTA buttons, active icons
  primaryDark: '#C05510',    // pressed state
  primaryLight: '#FF8C3A',   // hover / highlight
  primaryFaded: 'rgba(224,112,32,0.15)', // tinted bg (chips, badges)

  // ─── Text ──────────────────────────────────────────────────────
  textPrimary: '#FFFFFF',
  textSecondary: '#A09285',  // subheadings, hints
  textMuted: '#6E5E50',      // placeholder, disabled

  // ─── Borders ───────────────────────────────────────────────────
  border: '#3C2A1A',         // card borders
  borderInput: '#4A3222',    // input field border
  borderFocused: '#E07020',  // input border when focused

  // ─── Status ────────────────────────────────────────────────────
  success: '#4CAF50',
  error: '#FF5252',
  warning: '#FFA726',
  info: '#42A5F5',

  // ─── Utility ───────────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColourKey = keyof typeof colours;
