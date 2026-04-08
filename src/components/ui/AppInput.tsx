import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { colours, fontSizes, fontWeights, spacing, radius } from '../../theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  /** Element rendered on the left side (e.g. an icon component) */
  leftIcon?: React.ReactNode;
  /** Element rendered on the right side (e.g. eye icon for password) */
  rightIcon?: React.ReactNode;
  /** If true, renders a pressure-toggle eye button automatically */
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword = false,
  containerStyle,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(isPassword);

  const borderColor = error
    ? colours.error
    : isFocused
    ? colours.borderFocused
    : colours.borderInput;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.inputRow, { borderColor }]}>
        {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}

        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithLeftIcon : null, style]}
          placeholderTextColor={colours.textMuted}
          selectionColor={colours.primary}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {/* Auto eye toggle for password fields */}
        {isPassword ? (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setIsSecure(prev => !prev)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.eyeIcon}>{isSecure ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.iconRight}>{rightIcon}</View>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing[4],
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
    color: colours.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing[2],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1.5,
    minHeight: 52,
    paddingHorizontal: spacing[3],
  },
  iconLeft: {
    marginRight: spacing[2],
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRight: {
    marginLeft: spacing[2],
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: fontSizes.base,
    color: colours.textPrimary,
    paddingVertical: spacing[3],
  },
  inputWithLeftIcon: {
    paddingLeft: spacing[1],
  },
  eyeIcon: {
    fontSize: 16,
  },
  errorText: {
    fontSize: fontSizes.xs,
    color: colours.error,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
});
