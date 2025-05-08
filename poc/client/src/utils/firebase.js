import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
}

const app = initializeApp(config);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };