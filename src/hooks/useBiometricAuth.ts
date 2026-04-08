
import { useState, useEffect, useCallback } from "react";
import { getSupportedBiometryType, isBiometricEnabled, enableBiometricLogin, verifyBiometric, disableBiometricLogin } from "../services/biometricAuthService";
import Toast from "react-native-toast-message";

interface BiometricState {
    isAvailable: boolean,
    isEnabled: boolean,
    isLoading: boolean,
    isVerified: boolean
}

export const useBiometricAuth = () => {

    const [state, setState] = useState<BiometricState>({
        isAvailable: false,
        isEnabled: false,
        isLoading: true,
        isVerified: false,
    })

    // On mount: check device capability + check if user previously enabled it
    // Run both checks in parallel with Promise.all
    // Update state with results
    // Set isLoading to false when done
    useEffect(() => {
        const init = async () => {
            
            try {
                console.log("entring----bts");
                const [biometricType, biometricEnabled] = await Promise.all(
                    [getSupportedBiometryType(), isBiometricEnabled()]
                )
                //  return [biometricType, biometricEnabled ] ;

                // const biometricType = await getSupportedBiometryType();
                // const biometricEnabled = await isBiometricEnabled();
                console.log("biometricType--", biometricType);
                console.log("biometricEnabled", biometricEnabled);
                setState(prev => ({
                    ...prev,
                    isAvailable: !!biometricType,
                    isEnabled: biometricEnabled,
                    isLoading: false,
                }))
            }
            catch (e: any) {
                 console.error("error-message",e?.message, e?.code);
                Toast.show({
                    text1: e?.message
                });
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                }))

            }
        }
        init();
    }, []);

    // react-native-keychain  it is native module I used inside my code 
    // Wrap enableBiometricLogin from service
    // On success: set isEnabled to true in state
    
    const enable = useCallback(async () => {
        await enableBiometricLogin();
        setState(prev => ({
            ...prev,
            isEnabled: true,
        }))
    }, []);

    // Wrap verifyBiometric from service
    // On success: set isVerified to true in state
    // Return the boolean result (caller needs to know if it passed)
    const verify = useCallback(async (): Promise<boolean> => {
        const result = await verifyBiometric();
        if (result) {
            setState(prev => ({
                ...prev,
                isVerified: true,
            }))
        }
        return result;
    }, []);

    // Wrap disableBiometricLogin from service
    // On success: set isEnabled and isVerified to false in state
    const disable = useCallback(async () => {
        await disableBiometricLogin();
        setState(prev => ({
            ...prev,
            isEnabled: false,
            isVerified: false
        }))
    }, []);
    return {
        ...state,
        enable,
        verify,
        disable

    };
}