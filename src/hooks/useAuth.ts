import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useState, useEffect } from 'react';
import *  as authServices from '../services/auth';

export const useAuth = () => {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, [])
    return {
        login: authServices.login,
        logout: authServices.logout,
        signup: authServices.signup,
        loading,
        user
    }
}

