import React from 'react';
import { auth, provider } from '../utils/firebase';
import { type User, signInWithPopup } from 'firebase/auth';

interface GoogleLoginButtonProps {
    onLogin: (user: User) => void;
    onError: (error: unknown) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onLogin, onError }) => {
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            onLogin(result.user)
        } catch (error) {
            onError(error)
        }
    }

    return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

export default GoogleLoginButton