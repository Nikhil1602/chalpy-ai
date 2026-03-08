"use client";

import { createContext, useContext, useState, ReactNode, ChangeEvent } from 'react';
import { AuthContextType, AuthState, User } from '@/types';
import { useToast } from '@/hooks';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import axios from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const userObj: User = {
    name: '',
    email: '',
    password: '',
    avatar: '',
}

const defaultState: AuthState = {
    hasSignUp: false,
    isVerificationSend: false,
    isVerificationResend: false,
    isLoading: false,
}

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User>({ ...userObj });
    const [authState, setAuthState] = useState<AuthState>({ ...defaultState });
    const { showToast } = useToast();
    const router = useRouter();

    const login = async () => {

        try {

            setAuthState({ ...authState, isLoading: true });
            const { email, password } = user;

            const result = await signIn("credentials", { email, password, redirect: false });

            if (result?.ok) {

                showToast("Login successful!", "success");
                router.push("/dashboard");
                return;

            }

            if (result?.error === "USER_NOT_FOUND") {

                showToast("User not found!", "error");
                return;

            }

            if (result?.error === "MISSING_CREDENTIALS") {

                showToast("Missing email or password!", "error");
                return;

            }

            if (result?.error === "INVALID_PASSWORD") {

                showToast("Password is invalid!", "error");
                return;

            }

            if (result?.error === "EMAIL_NOT_VERIFIED") {

                showToast("Email not verified! Please check your inbox or click to resend", "error");
                setAuthState({ ...authState, isVerificationResend: true });

            }

        } catch (error) {

            console.error("Login error:", error);
            showToast("An error occurred during login. Please try again.", "error");

        } finally {

            setAuthState({ ...authState, isLoading: false });

        }

    };

    const signup = async () => {

        try {

            const { email, password, name } = user;
            setAuthState({ ...authState, isLoading: true });
            const resp = await axios.post('/api/register', { email, password, name });
            const result = resp.data;

            if (!result.ok) {

                const errorData = result;

                if (errorData?.error === "USER_EXISTS") {
                    showToast("User already exists!", "error");
                    return;
                }

                if (errorData?.error === "MISSING_FIELDS") {
                    showToast("Please fill in all required fields!", "error");
                    return;
                }

                const errorMessage = errorData?.error || "Registration failed. Please try again.";
                showToast(errorMessage, "error");
                return;

            }

            showToast("Registration successful! Please check your email to verify your account.", "success");
            setAuthState({ ...authState, isVerificationSend: true });
            setTimeout(() => {
                setAuthState({ ...authState, hasSignUp: false, isVerificationSend: false });
            }, 2000);

        } catch (error) {

            console.error("Login error:", error);
            showToast("An error occurred during login. Please try again.", "error");

        } finally {

            setAuthState({ ...authState, isLoading: false });

        }

    };

    const logout = async () => {

        setUser({ ...userObj });

    };

    const forgotPassword = async () => {

        setAuthState({ ...authState, isLoading: true });
        await axios.post('/api/forgot', { email: user.email });
        setAuthState({ ...authState, isLoading: false });
        showToast("Reset link sent to email!", "success");

    };

    const resendVerification = async () => {

        setAuthState({ ...authState, isLoading: true });
        await axios.post('/api/resend-verification', { email: user.email });
        setAuthState({ ...authState, isLoading: false, isVerificationResend: false });
        showToast("Verification email sent!", "success");

    };

    const handleAuthChange = (e: ChangeEvent<HTMLInputElement>) => {

        setUser({ ...user, [e.target.name]: e.target.value });

    }

    const handleAuthState = (name = "isLoading", value = false) => {
        setAuthState({ ...authState, [name]: value });
    }

    const values = { user, authState, handleAuthState, isAuthenticated: user.email !== '', login, logout, signup, forgotPassword, resendVerification, handleAuthChange }

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {

    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;

}