"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "./config";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    User,
    UserCredential,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { getUserById } from "./users/get_users";
import { UserProfile } from "./users/profile";

const usersCollection = "users";

interface AuthContextType {
    currentUserProfile: UserProfile | null;
    loadingUserProfile: boolean;
    signup: (email: string, password: string) => Promise<UserCredential>;
    login: (email: string, password: string) => Promise<UserCredential>;
    resetPassword: (email: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuthProfile: () => Promise<void>;
    emailVerified: boolean | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [currentUserProfile, setCurrentUserProfile] =
        useState<UserProfile | null>(null);
    const [loadingUserProfile, setLoadingUserProfile] = useState(true);
    const [emailVerified, setEmailVerified] = useState<boolean | undefined>(undefined);

    // Auth handlers with proper return types
    const signup = async (email: string, password: string) => {
        try {
            console.log("Signing up with email:", email);
            const userCredential: UserCredential =
                await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up:", userCredential.user);
            await createUserProfileWithCredentials(userCredential.user);
            console.log("User profile created for:", userCredential.user.uid);
            await sendEmailVerification(userCredential.user);
            console.log("Email verification sent to:", email);
            return userCredential;
        } catch (error) {
            console.log("Error signing up:", error);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error) {
            console.log("Error logging in:", error);
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.log("Error resetting password:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            setEmailVerified(undefined);
            setCurrentUserProfile(null);
            await signOut(auth);
        } catch (error) {
            console.log("Error logging out:", error);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                setLoadingUserProfile(true);
                if (!user) {
                    setCurrentUserProfile(null);
                    return;
                }
                setEmailVerified(user.emailVerified);
                const userProfile = await getUserById(user.uid);
                if (userProfile) {
                    setCurrentUserProfile(userProfile);
                } else {
                    // If the user profile doesn't exist, create it & log out so user can re-login
                    await createUserProfileWithCredentials(user);
                    await logout();
                }
            } catch (err) {
                console.error("onAuthStateChanged:", err);
                setEmailVerified(undefined);
                setCurrentUserProfile(null);
            } finally {
                setLoadingUserProfile(false);
            }
        });
        return unsubscribe;
    }, []);

    const refreshAuthProfile = async () => {
        if (!currentUserProfile) return;
        setLoadingUserProfile(true);
        const userProfile = await getUserById(
            currentUserProfile.uid
        );
        setCurrentUserProfile(userProfile);
        setLoadingUserProfile(false);
    };

    const value = {
        currentUserProfile,
        loadingUserProfile,
        signup,
        login,
        resetPassword,
        logout,
        refreshAuthProfile,
        emailVerified,
    };

    return <AuthContext.Provider value={ value }> { children } </AuthContext.Provider>;
}

const createUserProfileWithCredentials = async (
    user: User
) => {
    try {
        const registeredOn = Timestamp.now();
        await setDoc(doc(db, usersCollection, user.uid), {
            uid: user.uid,
            email: user.email,
            registeredOn: registeredOn,
        });
    } catch (error) {
        console.error("Error creating user profile:", error);
    }
};