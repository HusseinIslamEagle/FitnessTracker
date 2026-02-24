import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

function getEnvVariable(key) {
  const value = import.meta.env[key];

  if (!value) {
    if (import.meta.env.DEV) {
      throw new Error(`Missing environment variable: ${key}`);
    } else {
      console.error(`Missing environment variable: ${key}`);
    }
  }

  return value;
}

const firebaseConfig = {
  apiKey: getEnvVariable("VITE_FIREBASE_API_KEY"),
  authDomain: getEnvVariable("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnvVariable("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getEnvVariable("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnvVariable("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvVariable("VITE_FIREBASE_APP_ID"),
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();