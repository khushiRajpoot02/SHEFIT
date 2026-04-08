import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBiometricAuth } from '../../../hooks/useBiometricAuth'; 

interface Props {
    onSuccess: () => void;
    onFallback: () => void;
}

const BiometricGateScreen: React.FC<Props> = ({ onSuccess, onFallback }) => {

    console.log("entring----bts");
    const { verify, isLoading } = useBiometricAuth();
    const [error, setError] = useState(false);
    // auto-trigger on mount
    // call handleVerify() inside useEffect
    const handleVerify = async () => {
        setError(false);
        const passed = await verify();
        if (passed) {
            onSuccess();          // ← gate opens
        } else {
            setError(true);       // ← show retry UI
        }
    };
  
    useEffect(() => {
        // write this
        handleVerify();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                {/* App name */}
                <Text style={styles.logo}>FIT<Text style={styles.accent}>PULSE</Text></Text>

                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>Verify your identity to continue</Text>

                {/* Biometric icon button — tapping retries */}
                {/* show disabled state when isLoading */}
                <TouchableOpacity
                    style={styles.biometricButton}
                    onPress={handleVerify}
                    disabled={isLoading}
                >
                    <Text style={styles.icon}>
                        {Platform.OS === 'ios' ? '👤' : '👆'}
                    </Text>
                    <Text style={styles.buttonText}>
                        {Platform.OS === 'ios' ? 'Use Face ID / Touch ID' : 'Use Fingerprint'}
                    </Text>
                </TouchableOpacity>

                {/* Only show error + fallback after a failed attempt */}
                {error && (
                    <>
                        <Text style={styles.errorText}>Biometric failed. Try again.</Text>
                        <TouchableOpacity onPress={onFallback}>
                            <Text style={styles.fallbackText}>Use password instead</Text>
                        </TouchableOpacity>
                    </>
                )}

            </View>
        </SafeAreaView>
    );
};

export default BiometricGateScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f0f0f' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    logo: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: 3, marginBottom: 40 },
    accent: { color: '#f97316' },
    title: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#888', marginBottom: 48 },
    biometricButton: {
        alignItems: 'center', gap: 12, padding: 24,
        borderWidth: 1, borderColor: '#333', borderRadius: 16,
    },
    icon: { fontSize: 40 },
    buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
    errorText: { color: '#ef4444', marginTop: 24, fontSize: 13 },
    fallbackText: { color: '#f97316', marginTop: 12, fontSize: 14, fontWeight: '600' },
});
