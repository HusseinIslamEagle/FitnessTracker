import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";

import { auth, googleProvider } from "../firebase";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? { ...currentUser } : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = useCallback(async (email, password, name) => {
    try {
      setAuthError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      if (name?.trim()) {
        await updateProfile(result.user, { displayName: name.trim() });
      }

      // بعد updateProfile الأفضل نقرأ currentUser لضمان displayName محدث
      setUser(auth.currentUser ? { ...auth.currentUser } : { ...result.user });

      return auth.currentUser || result.user;
    } catch (e) {
      setAuthError(e);
      throw e;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setAuthError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser({ ...result.user });
      return result.user;
    } catch (e) {
      setAuthError(e);
      throw e;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      setAuthError(null);
      const result = await signInWithPopup(auth, googleProvider);
      setUser({ ...result.user });
      return result.user;
    } catch (e) {
      setAuthError(e);
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setAuthError(null);
      await signOut(auth);
      setUser(null);
    } catch (e) {
      setAuthError(e);
      throw e;
    }
  }, []);

  const updateUserName = useCallback(async (newName) => {
    if (!auth.currentUser) return;
    try {
      setAuthError(null);
      await updateProfile(auth.currentUser, { displayName: newName?.trim() || "" });
      setUser({ ...auth.currentUser });
    } catch (e) {
      setAuthError(e);
      throw e;
    }
  }, []);

  const changePassword = useCallback(async (newPassword) => {
    if (!auth.currentUser) return;
    try {
      setAuthError(null);
      await updatePassword(auth.currentUser, newPassword);
    } catch (e) {
      setAuthError(e);
      throw e;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      signup,
      login,
      loginWithGoogle,
      logout,
      updateUserName,
      changePassword,
    }),
    [user, loading, authError, signup, login, loginWithGoogle, logout, updateUserName, changePassword]
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}