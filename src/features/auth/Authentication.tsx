import React, { useEffect, useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import firebase from '@react-native-firebase/app';
import { useAuth } from '../../hooks/useAuth';
import { login, signup } from '../../services/auth';
import { ActivityIndicator } from 'react-native';
import { validateLoginForm, validateSignupForm } from '../../utils/validation';
import { LoginErrors } from '../../utils/validation';
import { useBiometricAuth } from '../../hooks/useBiometricAuth';
import { Alert } from 'react-native';

export type AuthScreen = 'login' | 'signup';

export type AuthResult<T> = {
  isValid : boolean,
  errors : T,
  apiErrors? : string;
}

const Authentication: React.FC = () => {

  const [activeScreen, setActiveScreen] = useState<AuthScreen>('signup');
  const { user, loading } = useAuth();
  const { isAvailable, isEnabled, enable } = useBiometricAuth();


const handleSignup = async (email: string, password: string, fullName:string, agreedToTerms:boolean): Promise<AuthResult<LoginErrors>> => {
      const result = validateSignupForm(email, password, fullName, agreedToTerms);
     if(!result.isValid) return result;
    try {
      const signupResponse = await signup(email, password)
      return result
    }
    catch (error:any) {
      console.error(error.message);
      return {...result, apiErrors : error?.message || "Signup Failed"};
    }
}
  // const handleLogin = async (email: string, password: string) : Promise<AuthResult<LoginErrors>> => {
  //   const result  = validateLoginForm(email, password);
  //   if(!result.isValid) return result;
  //   try {
  //     const loginResponse = await login(email, password);
  //     return result;
  //     console.log("loginResponse----", loginResponse);
  //   }
  //   catch (error:any) {
  //     console.error(error.messgae);
  //     return {...result, apiErrors : error?.message || "Login Failed" };
  //   }
  // }
  
  const handleLogin = async (email: string, password: string): Promise<AuthResult<LoginErrors>> => {
    const result = validateLoginForm(email, password);
    if (!result.isValid) return result;
    try {
      await login(email, password);
      // ← add this block after successful login
      if (isAvailable && !isEnabled) {
        Alert.alert(
          'Enable Biometric Login?',
          'Log in faster next time using your fingerprint or Face ID.',
          [
            { text: 'Not Now', style: 'cancel' },
            {
              text: 'Enable',
              onPress: () => enable(),
            },
          ]
        );
      }
      return result;
    } catch (error: any) {
      return { ...result, apiErrors: error?.message || 'Login Failed' };
    }
  };
  


  if (loading) {
    return <ActivityIndicator />
  }

return (
    activeScreen === 'login' ? (
      <LoginScreen
        onNavigateToSignup={() => setActiveScreen('signup')}
        onLogin={handleLogin}
      />
    ) : (
      <SignupScreen
        onNavigateToLogin={() => setActiveScreen('login')}
        onSignup={handleSignup}
      />

    )
  )
}

export default Authentication;

// jitnaa unke bare me sochungi I will waste my time so I do not think about them I just my project and along with lear the c oncepts so that I can crack the job offer and resign from here make sure I am doing this only 
// Jai Mata Di 
// Try to handle  things by your own 