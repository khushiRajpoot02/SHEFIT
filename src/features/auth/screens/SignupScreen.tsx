import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppInput, AppButton, Divider } from '../../../components/ui';
import { colours, fontSizes, fontWeights, spacing, radius } from '../../../theme';
import { constants } from '../../../utils/commonConstants';
import { LoginErrors } from '../../../utils/validation';
import { AuthResult } from '../Authentication';
import Toast from 'react-native-toast-message';

interface SignupScreenProps {
  onNavigateToLogin: () => void;
  // TODO: wire up real auth
  // onSignupWithEmail: (name: string, email: string, password: string) => void;
  // onSignupWithGoogle: () => void;
  // onSignupWithApple: () => void;
  onSignup:(email:string, password:string,fullName:string, agreedToTerms:boolean)=>Promise<AuthResult<LoginErrors>>;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigateToLogin, onSignup }) => {
  // TODO: replace with your form state (e.g. useSignupForm hook)


const[signupForm, setSignupForm] = useState({
  fullName : '',
  email : '',
  password : '',
  agreedToTerms : false,
  fullNameError: '',
  emailError:'',
  passwordError:'',
  agreedToTermsError:''
})

const handleFieldChange = (field:string, value:string | boolean)=>{
  setSignupForm((prev)=>({
    ...prev,
    [field]: value

  }))
}

const handleFormSubmit = async()=>{
  const result = await  onSignup(signupForm.email, signupForm.password, signupForm.fullName, signupForm.agreedToTerms);
  setSignupForm(prev=>({
    ...prev,
    emailError: result.errors.email ?? "",
    passwordError : result.errors.password ?? "",
    fullNameError : result.errors.fullName ?? "", 
    agreedToTermsError : result.errors.agreedToterms ?? ""

  }));
  if(!result.isValid) return;
  if(result.apiErrors){
    Toast.show({
      // type : 'fail',
      text1 : "Signup failed"
    })
  }
}

// add each and every field 
// add proper validation and then move further 

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Logo ── */}
        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeIcon}>🏋️</Text>
          </View>
          <Text style={styles.logoLabel}>{constants.GYM_GIRL}</Text>
        </View>

        {/* ── Heading ── */}
        <Text style={styles.heading}>{constants.JOIN_THE_COMMUNITY}</Text>
        <Text style={styles.subheading}>{constants.START_YOUR_JOURNEY}</Text>

        {/* ── Social Buttons ── */}
        <AppButton
          title="Google"
          onPress={() => { /* TODO: onSignupWithGoogle() */ }}
          variant="outline"
          style={styles.socialButton}
          leftIcon={<Text style={styles.socialIcon}>G</Text>}
        />
        <AppButton
          title="Apple"
          onPress={() => { /* TODO: onSignupWithApple() */ }}
          variant="outline"
          style={styles.socialButton}
          leftIcon={<Text style={styles.socialIcon}></Text>}
        />

        {/* ── Divider ── */}
        <Divider label="Or continue with email" />

        {/* ── Form Fields ── */}
        <AppInput
          label="Full Name"
          placeholder="Enter your name"
          autoCapitalize="words"
          value={signupForm.fullName}
          onChangeText={_text => {
            handleFieldChange('fullName', _text);
          }}
          error={signupForm.fullNameError}
          leftIcon={<Text style={styles.inputIcon}>👤</Text>}
        />

        <AppInput
          label="Email Address"
          placeholder="example@gymgirl.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={signupForm.email}
          onChangeText={_text => {
            handleFieldChange('email', _text);
          }}
          error={signupForm.emailError}
          leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
        />

        <AppInput
          label="Password"
          placeholder="Min. 8 characters"
          isPassword
          value={signupForm.password}
          onChangeText={_text => {
            handleFieldChange('password', _text);
          }}
          error={signupForm.passwordError}
          leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
        />
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => {  handleFieldChange('agreedToTerms', !signupForm.agreedToTerms);}}
          activeOpacity={0.8}>
          <View style={[styles.checkbox, signupForm.agreedToTerms && styles.checkboxChecked]}>
            {signupForm.agreedToTerms ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
        {signupForm.agreedToTermsError ? <Text style={styles.termsError}>{signupForm.agreedToTermsError}</Text> : null}
        <AppButton
          title="Create Account"
          onPress={() => { 
            handleFormSubmit()
          }}
          // loading={isLoading}
          style={styles.submitButton}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already part of the squad? </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colours.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[8],
    paddingBottom: spacing[8],
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  logoBadgeIcon: {
    fontSize: 20,
  },
  logoLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colours.textPrimary,
    letterSpacing: 1.5,
    textAlign:'center'
  },
  heading: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.extraBold,
    color: colours.textPrimary,
    lineHeight: fontSizes['4xl'] * 1.15,
    marginBottom: spacing[2],
    textAlign:'center'
  },
  subheading: {
    fontSize: fontSizes.md,
    color: colours.textSecondary,
    marginBottom: spacing[6],
    textAlign: 'center',
  },
  socialButton: {
    marginBottom: spacing[3],
  },
  socialIcon: {
    fontSize: 16,
    color: colours.textPrimary,
    fontWeight: fontWeights.bold,
  },

  inputIcon: {
    fontSize: 16,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
    gap: spacing[3],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.xs,
    borderWidth: 1.5,
    borderColor: colours.borderInput,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  checkmark: {
    color: colours.white,
    fontSize: 13,
    fontWeight: fontWeights.bold,
  },
  termsText: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colours.textSecondary,
    lineHeight: fontSizes.sm * 1.6,
  },
  termsLink: {
    color: colours.primary,
    fontWeight: fontWeights.medium,
  },
  termsError: {
    fontSize: fontSizes.xs,
    color: colours.error,
    marginBottom: spacing[3],
    marginLeft: spacing[1],
  },
  submitButton: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing[5],
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
});
