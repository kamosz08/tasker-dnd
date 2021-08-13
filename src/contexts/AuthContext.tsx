import React, { useContext, useEffect, useState } from "react";
import { auth, firestoreDB } from "../firebase";
import firebase from "firebase/app";
import { UserType } from "../types";

type Context = {
  user: UserType | null;
  loaded: boolean;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logIn: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = React.createContext<Context | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const dbUser = await firestoreDB
          .collection("users")
          .doc(user?.uid)
          .get();
        const userData = dbUser.data() as UserType;
        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
      setLoaded(true);
    });
    return () => {
      unsubscribeAuth();
    };
  }, []);

  const signUp = (email: string, password: string, displayName: string) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const newUser: UserType = {
          email: userCredential.user!.email!,
          id: userCredential.user!.uid,
          displayName,
        };
        return firestoreDB
          .collection("users")
          .doc(userCredential.user?.uid)
          .set(newUser);
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
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
