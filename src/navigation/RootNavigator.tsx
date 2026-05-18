import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from '../hooks/useAuth';
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import { ActivityIndicator } from "react-native";
import { useBiometricAuth } from "../hooks/useBiometricAuth";
import { useState } from "react";
import BiometricGateScreen from "../features/auth/screens/BiometricGateScreen";
import { logout } from "../services/auth";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootNavigator = () => {

    console.log("entered inside root");
    const { user, loading } = useAuth();
    const { isEnabled, isLoading: biometricLoading } = useBiometricAuth();
    const [biometricVerified, setBiometricVerified] = useState(false);
    const handleFallback = async () => {
        await logout();             // from useAuth — clears Firebase session
        setBiometricVerified(false); // reset flag
    };


    if (loading || biometricLoading) {
        return <ActivityIndicator />
    }
    const renderContent = () => {
        if (!user) return <AuthNavigator />;
        if (isEnabled && !biometricVerified) {
            return <BiometricGateScreen
                onSuccess={() => setBiometricVerified(true)}
                onFallback={handleFallback}
            />
        }
        return <AppNavigator />
    }
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                {renderContent()}
                {/* <AuthNavigator/> */}
            </NavigationContainer>
        </SafeAreaProvider>
    )
}
export default RootNavigator;