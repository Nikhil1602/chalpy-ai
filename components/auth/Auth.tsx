"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { signIn } from 'next-auth/react'
import { useToast } from "@/hooks";
import { useRouter } from "next/navigation";

const formVariants = {
    hidden: { opacity: 0, x: 20, filter: "blur(4px)" },
    visible: {
        opacity: 1, x: 0, filter: "blur(0px)",
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const, staggerChildren: 0.06 }
    },
    exit: { opacity: 0, x: -20, filter: "blur(4px)", transition: { duration: 0.3 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

const AuthPage = () => {

    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [email, setEmail] = useState("");
    const [showResend, setShowResend] = useState(false);
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showDone, setShowDone] = useState(false);

    const { showToast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (isSignUp) {

            try {

                setShowLoader(true);
                const result = await fetch("/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        name,
                    }),
                });

                console.log(result);

                if (!result.ok) {
                    const errorData = await result.json();
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
                setShowDone(true);
                setTimeout(() => {
                    setShowDone(false);
                    setIsSignUp(false);
                }, 4000);

            } catch (error) {

                console.error("Login error:", error);
                showToast("An error occurred during login. Please try again.", "error");

            } finally {
                setShowLoader(false);
            }

            return;

        }

        try {

            setShowLoader(true);

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

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
                setShowResend(true);
            }

        } catch (error) {

            console.error("Login error:", error);
            showToast("An error occurred during login. Please try again.", "error");

        } finally {
            setShowLoader(false);
        }

    };

    const handleForgotPassword = async () => {

        setShowLoader(true);

        await fetch("/api/forgot", {
            method: "POST",
            body: JSON.stringify({ email }),
        });

        setShowLoader(false);

        showToast("Reset link sent to email!", "success");

    }

    const handleResendVerification = async () => {

        setShowLoader(true);
        await fetch("/api/resend-verification", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
        setShowLoader(false);
        showToast("Verification email sent!", "success");
        setShowResend(false);

    }

    return (
        <div className="min-h-screen flex items-center justify-center gradient-mesh relative overflow-hidden px-4">
            {/* Floating orbs */}
            <motion.div
                className="pointer-events-none absolute w-[500px] h-[500px] rounded-full blur-3xl"
                style={{
                    background: "radial-gradient(circle, hsl(24 95% 53% / 0.18), transparent 70%)",
                    top: "-10%",
                    right: "-5%",
                }}
                animate={{ y: [0, 30, 0], x: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="pointer-events-none absolute w-[400px] h-[400px] rounded-full blur-3xl"
                style={{
                    background: "radial-gradient(circle, hsl(30 100% 60% / 0.14), transparent 70%)",
                    bottom: "-10%",
                    left: "-5%",
                }}
                animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />


            {showDone ?
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="w-full max-w-md border p-8 rounded-2xl text-center"
                >
                    <h1 className="text-2xl font-bold text-gray-200">Verification link sent! ✅</h1>
                    <p className="text-gray-500 mt-2">You're all set up and ready to go. kindly open your email to verify your account.</p>
                </motion.div>
                : <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="w-full max-w-md"
                >
                    <div className="border border-gray-700 glow-lg rounded-2xl m-2 sm:m-8 p-8 shadow-2xl">
                        {/* Header */}
                        <motion.div className="text-center mb-2" layout>
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4">
                                <Image src="/logo.png" alt="Logo" width={50} height={50} />
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isSignUp ? "signup" : "signin"}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <h1 className="text-2xl font-bold text-gray-200">
                                        {isSignUp ? "Create account" : "Welcome back"}
                                    </h1>
                                    <p className="text-gray-500 mt-1 text-sm">
                                        {isSignUp ? "Start your journey today" : "Sign in to continue"}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Social buttons */}
                        <motion.div className="space-y-3 mb-4" variants={itemVariants}>
                            <motion.button
                                onClick={() => signIn("google")}
                                className="flex cursor-pointer gap-2 items-center justify-center w-full py-3 px-4 rounded-xl border border-border bg-orange-600 text-sm text-foreground hover:bg-primary/5 transition-colors"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaGoogle className="w-5 h-5 text-foreground" />
                                <span className="text-secondary-foreground text-sm">Continue with Google</span>
                            </motion.button>
                            <motion.button
                                onClick={() => signIn("github")}
                                className="flex cursor-pointer gap-2 items-center justify-center w-full py-3 px-4 rounded-xl border border-border bg-gray-800 text-sm text-foreground hover:bg-primary/5 transition-colors"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaGithub className="w-5 h-5 text-foreground" />
                                <span className="text-secondary-foreground text-sm">Continue with GitHub</span>
                            </motion.button>
                        </motion.div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-px bg-gray-800" />
                            <span className="text-xs text-gray-500 uppercase tracking-widest">or</span>
                            <div className="flex-1 h-px bg-gray-800" />
                        </div>

                        {/* Form */}
                        <AnimatePresence mode="wait">
                            <motion.form key={isSignUp ? "signup-form" : "signin-form"} variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleSubmit} className="space-y-4">
                                {isSignUp && (
                                    <motion.div variants={itemVariants}>
                                        <label className="text-xs font-medium text-gray-400 mb-1.5 block">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type="text"
                                                value={name}
                                                required={isSignUp}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="John Doe"
                                                className="w-full pl-10 pr-4 bg-gray-900 py-3 rounded-xl bg-input border border-border text-gray-100 selection:bg-orange-800 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all duration-200"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants}>
                                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-900 rounded-xl bg-input border border-border text-gray-100 selection:bg-orange-800 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all duration-200"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-12 bg-gray-900 py-3 rounded-xl bg-input border border-border text-gray-100 selection:bg-orange-800 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all duration-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-100 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </motion.div>

                                {!isSignUp && (
                                    <motion.div variants={itemVariants} className="flex justify-end">
                                        <button onClick={handleForgotPassword} type="button" className="text-xs text-orange-500 hover:text-orange-500/80 cursor-pointer transition-colors">
                                            Forgot password?
                                        </button>
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants}>
                                    <motion.button
                                        type="submit"
                                        disabled={showLoader}
                                        className={`w-full py-3 px-4 rounded-xl bg-orange-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${showLoader ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-orange-600"}`}
                                        whileHover={showLoader ? undefined : { scale: 1.01 }}
                                        whileTap={showLoader ? undefined : { scale: 0.98 }}
                                    >
                                        <>
                                            {showLoader ? (
                                                <div className="w-4 flex items-center h-4 border-t-2 border-r-2 border-orange-500 rounded-full"><LoaderCircle className="w-8 h-8 animate-spin text-white" /></div>
                                            ) : (
                                                <>
                                                    {isSignUp ? "Create Account" : "Sign In"}
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </>
                                    </motion.button>
                                </motion.div>
                            </motion.form>
                        </AnimatePresence>

                        {/* Toggle */}
                        <motion.p className="text-center mt-2 text-xs text-gray-400" layout>
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button onClick={() => setIsSignUp(!isSignUp)} className="text-orange-500 hover:text-orange-500/80 font-medium cursor-pointer transition-colors">
                                {isSignUp ? "Sign in" : "Sign up"}
                            </button>
                        </motion.p>

                        {(!isSignUp && showResend) && (
                            <motion.div variants={itemVariants} className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendVerification}
                                    className="text-xs cursor-pointer hover:underline text-orange-500 hover:text-orange-500/80 transition-colors"
                                >
                                    Resend verification email
                                </button>
                            </motion.div>
                        )}

                    </div>
                </motion.div>}
        </div>
    );
};

export default AuthPage;
