import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppInput, AppButton, Divider } from '../../../components/ui';
import { colours, fontSizes, fontWeights, spacing, radius } from '../../../theme';
import { AuthResult } from '../Authentication';
import { LoginErrors } from '../../../utils/validation';
import Toast from "react-native-toast-message";

const GYM_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
};

interface LoginScreenProps {
  onNavigateToSignup: () => void;
  // TODO: wire up real auth
  // onLoginWithEmail: (email: string, password: string) => void;
  // onLoginWithGoogle: () => void;
  // onLoginWithApple: () => void;
  // onForgotPassword: () => void;
  onLogin: (email: string, password: string) => Promise<AuthResult<LoginErrors>>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToSignup, onLogin }) => {
  const [form, setFrom] = useState({
    email: '',
    password: '',
    emailError: '',
    passwordError: ''
})

  const handleFieldChange = (field: string, value: string) => {
    setFrom((prev) => ({
      ...prev,
      [field]: value
    }
    ))
  }
  const handleFormSubmit = async () => {
    const result = await onLogin(form.email, form.password)
    setFrom(prev => ({
      ...prev,
      emailError: result.errors.email ?? "",
      passwordError: result.errors.password ?? "",
    }))
    if (!result.isValid) return;
    if (result.apiErrors) {
      Toast.show({
        // type : "fail",
        text1: "login failed"
      })

    }
  }
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Hero Image with logo overlay ── */}
        <View style={styles.heroContainer}>
          <Image source={GYM_IMAGE} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <Text style={styles.logoText}>
            FIT<Text style={styles.logoAccent}>PULSE</Text>
          </Text>
        </View>

        {/* ── Form Card ── */}
        <View style={styles.card}>

          {/* Heading */}
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subheading}>Please enter your details to sign in.</Text>

          {/* Email */}
          <AppInput
            label="Email Address"
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={text => {
              // TODO: setValue('email', _text)
              handleFieldChange('email', text);
            }}
            error={form.emailError}
            leftIcon={<Text style={styles.inputIcon}>@</Text>}
          />

          {/* Password label row */}
          <View style={styles.passwordLabelRow}>
            <Text style={styles.inputLabel}>Password</Text>
            <TouchableOpacity onPress={() => { /* TODO: onForgotPassword() */ }}>
              <Text style={styles.forgotLink}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <AppInput
            placeholder="••••••••"
            isPassword
            value={form.password}
            onChangeText={_text => {
              // TODO: setValue('password', _text)
              handleFieldChange('password', _text);

            }}
            error={form.passwordError}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
            containerStyle={styles.passwordInput}
          />

          {/* Sign In button */}
          <AppButton
            title="Sign In"
            onPress={() => handleFormSubmit()}
            // loading={isLoading}
            style={styles.submitButton}
          />

          {/* Divider */}
          <Divider label="Or continue with" />

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <AppButton
              title="Google"
              onPress={() => { /* TODO: onLoginWithGoogle() */ }}
              variant="outline"
              fullWidth={false}
              style={styles.socialButton}
              leftIcon={<Text style={styles.socialIcon}>G</Text>}
            />
            <AppButton
              title="Apple"
              onPress={() => { /* TODO: onLoginWithApple() */ }}
              variant="outline"
              fullWidth={false}
              style={styles.socialButton}
              leftIcon={<Text style={styles.socialIcon}></Text>}
            />
          </View>
          <TouchableOpacity style={styles.biometricButton} onPress={() => console.log("hhh")} activeOpacity={0.85}>
            <View style={styles.biometricIconWrap}>
              <Text style={styles.biometricIcon}>🔐</Text>
            </View>
            <Text style={styles.biometricText}>
              Use {Platform.OS === 'ios' ? 'Face ID / Touch ID' : 'Fingerprint'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={onNavigateToSignup}>
              <Text style={styles.footerLink}>Join the club</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.copyright}>© 2023 FITPULSE INTERACTIVE. ALL RIGHTS RESERVED.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colours.background,
  },
  scroll: {
    flexGrow: 1,
  },
  heroContainer: {
    height: 220,
    overflow: 'hidden',
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 10, 4, 0.55)',
  },
  logoText: {
    position: 'absolute',
    bottom: spacing[5],
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.extraBold,
    color: colours.white,
    letterSpacing: 3,
  },
  logoAccent: {
    color: colours.primary,
  },

  card: {
    marginHorizontal: spacing[4],
    marginTop: spacing[6],
    marginBottom: spacing[4],
  },
  heading: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colours.textPrimary,
    marginBottom: spacing[1],
  },
  subheading: {
    fontSize: fontSizes.md,
    color: colours.textSecondary,
    marginBottom: spacing[6],
  },

  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  inputLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
    color: colours.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  forgotLink: {
    fontSize: fontSizes.sm,
    color: colours.primary,
    fontWeight: fontWeights.medium,
  },
  passwordInput: {
    marginBottom: 0,
  },

  inputIcon: {
    fontSize: 16,
    color: colours.textMuted,
  },

  submitButton: {
    marginTop: spacing[5],
  },

  socialRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  socialButton: {
    flex: 1,
    minHeight: 52,
  },
  socialIcon: {
    fontSize: 16,
    color: colours.textPrimary,
    fontWeight: fontWeights.bold,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing[6],
  },
  footerText: {
    fontSize: fontSizes.sm,
    color: colours.textSecondary,
  },
  footerLink: {
    fontSize: fontSizes.sm,
    color: colours.primary,
    fontWeight: fontWeights.semiBold,
  },
  copyright: {
    textAlign: 'center',
    fontSize: fontSizes.xs,
    color: colours.textMuted,
    letterSpacing: 0.5,
    paddingVertical: spacing[4],
  },
  biometricButton: {
    marginTop: spacing[3],
    borderWidth: 1,
    borderColor: colours.borderInput,
    backgroundColor: colours.surfaceAlt,
    borderRadius: radius.md,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  biometricIconWrap: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colours.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricIcon: {
    fontSize: 13,
  },
  biometricText: {
    color: colours.textPrimary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
  },
});
