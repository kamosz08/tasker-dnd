import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import firebase from "firebase/app";

type Context = {
  user: firebase.User | null;
  signUp: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
};

const AuthContext = React.createContext<Context | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const signUp = (email: string, password: string) => {
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const contextValue = {
    user: currentUser,
    signUp,
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
