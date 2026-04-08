import * as Keychain from 'react-native-keychain';
import Toast from 'react-native-toast-message';
const SERVICE = "GymGirlBiometricAuth";

// check the device  compatibility
export const getSupportedBiometryType = async ()=>{
    return Keychain.getSupportedBiometryType();
    // returned format is 'FaceID' || 'TouchID' || 'Fingerprint' || null
}
// check if user has already enabled it ? 
export const isBiometricEnabled = async (): Promise<boolean>=>{
    return Keychain.hasGenericPassword({service : SERVICE});
    // it check if an item exist in keychain under our service key

}

// enable biometric login after first successfull login 

export const enableBiometricLogin = async (): Promise<void>=>{
    await Keychain.setGenericPassword('user', 'biometric_enabled', {
        service : SERVICE,
        accessControl : Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED
    })
}

// verify ( show the fingerprint prompt)

export const verifyBiometric = async():Promise<boolean>=>{
    try{

        const result =  await Keychain.getGenericPassword({
            service : SERVICE,
            authenticationPrompt:{
                title: 'Log in to GymGirl',
                cancel : 'Cancel',
            },
        });
        return result !==false;
    }
    catch(error:any){
        Toast.show({
            text1 : error?.message || "Verification error"
        });
        return false;
    }
  
}

export const  disableBiometricLogin = async():Promise<void>=>{
    await Keychain.resetGenericPassword({service:SERVICE});
};
