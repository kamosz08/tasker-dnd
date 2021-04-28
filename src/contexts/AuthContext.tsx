import React, { useContext, useEffect, useState } from "react";
import { auth, firestoreDB } from "../firebase";
import firebase from "firebase/app";

type Context = {
  user: firebase.User | null;
  loaded: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  logIn: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = React.createContext<Context | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoaded(true);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const signUp = (email: string, password: string) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        return firestoreDB
          .collection("users")
          .doc(userCredential.user?.uid)
          .set({
            email: userCredential.user?.email,
          });
      });
  };

  const logIn = (email: string, password: string) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return auth.signOut();
  };

  const resetPassword = (email: string) => {
    return auth.sendPasswordResetEmail(email);
  };

  const contextValue = {
    user: currentUser,
    loaded,
    signUp,
    logIn,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a CountProvider");
  }
  return context;
};
