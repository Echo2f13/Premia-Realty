/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import {
  signOutCustomer,
  subscribeToUserProfile,
} from "../data/firebaseService";

const AuthContext = createContext({ user: null, profile: null, loading: true });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let profileUnsubscribe;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (profileUnsubscribe) {
        profileUnsubscribe();
      }

      if (firebaseUser) {
        // Check for admin custom claim
        const tokenResult = await firebaseUser.getIdTokenResult();
        const isUserAdmin = Boolean(tokenResult.claims.admin);
        setIsAdmin(isUserAdmin);

        console.log("🔐 Auth Context - Token Claims:", {
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          isAdmin: isUserAdmin,
          claims: tokenResult.claims,
        });

        profileUnsubscribe = subscribeToUserProfile(firebaseUser.uid, (nextProfile) => {
          setProfile(nextProfile);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signOut: signOutCustomer,
      isAuthenticated: Boolean(user),
      isAdmin,
    }),
    [user, profile, loading, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);


