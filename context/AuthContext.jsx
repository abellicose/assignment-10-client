"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { apiPublic } from "@/lib/api";

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleLogin = async () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (name, photo) =>
    updateProfile(auth.currentUser, { displayName: name, photoURL: photo });

  const logout = async () => {
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  const syncUser = async (firebaseUser, role) => {
    await apiPublic.put("/users", {
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      photo: firebaseUser.photoURL,
      role,
    });
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        try {
          const { data } = await apiPublic.post("/auth/jwt", {
            email: currentUser.email,
          });
          localStorage.setItem("access-token", data.token);
        } catch {
          localStorage.removeItem("access-token");
        }
      } else {
        localStorage.removeItem("access-token");
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = {
    user,
    loading,
    register,
    login,
    googleLogin,
    updateUserProfile,
    syncUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
