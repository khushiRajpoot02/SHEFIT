import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { colours, fontSizes, fontWeights, spacing, radius, shadows } from '../../theme';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  /** Optional icon rendered before the title */
  leftIcon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  textStyle,
  leftIcon,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colours.white : colours.primary}
          size="small"
        />
      ) : (
        <>
          {leftIcon ?? null}
          <Text
            style={[
              styles.label,
              styles[`label_${variant}`],
              styles[`labelSize_${size}`],
              leftIcon ? styles.labelWithIcon : null,
              textStyle,
            ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colours.transparent,
  },
  fullWidth: {
    width: '100%',
  },
  // ─── Variants ───────────────────────────────────────────────────
  primary: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
    ...shadows.md,
  },
  outline: {
    backgroundColor: colours.transparent,
    borderColor: colours.border,
  },
  ghost: {
    backgroundColor: colours.transparent,
    borderColor: colours.transparent,
  },
  // ─── Sizes ──────────────────────────────────────────────────────
  size_sm: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    minHeight: 40,
  },
  size_md: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    minHeight: 52,
  },
  size_lg: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    minHeight: 60,
  },
  // ─── Disabled ───────────────────────────────────────────────────
  disabled: {
    opacity: 0.5,
  },
  // ─── Labels ─────────────────────────────────────────────────────
  label: {
    fontWeight: fontWeights.semiBold,
    letterSpacing: 0.5,
  },
  label_primary: {
    color: colours.white,
  },
  label_outline: {
    color: colours.textPrimary,
  },
  label_ghost: {
    color: colours.primary,
  },
  labelSize_sm: {
    fontSize: fontSizes.sm,
  },
  labelSize_md: {
    fontSize: fontSizes.base,
  },
  labelSize_lg: {
    fontSize: fontSizes.lg,
  },
  labelWithIcon: {
    marginLeft: spacing[2],
  },
});
