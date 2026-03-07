"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { signIn } from 'next-auth/react'
import { useAuth } from "@/store/AuthContext";
import Image from "next/image";

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

    const [showPassword, setShowPassword] = useState(false);
    const { login, signup, authState, user, handleAuthChange, handleAuthState, resendVerification, forgotPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        authState.hasSignUp ? signup(e) : login(e);

    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-mesh relative overflow-hidden px-4">

            {/* Floating orbs */}
            <motion.div className="pointer-events-none absolute w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, hsl(24 95% 53% / 0.18), transparent 70%)", top: "-10%", right: "-5%" }} animate={{ y: [0, 30, 0], x: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="pointer-events-none absolute w-[400px] h-[400px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, hsl(30 100% 60% / 0.14), transparent 70%)", bottom: "-10%", left: "-5%" }} animate={{ y: [0, -20, 0], x: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

            {authState.isVerificationSend ?
                <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} className="w-full max-w-md border p-8 rounded-2xl text-center">
                    <h1 className="text-2xl font-bold text-gray-200">Verification link sent! ✅</h1>
                    <p className="text-gray-500 mt-2">You're all set up and ready to go. kindly open your email to verify your account.</p>
                </motion.div>
                : <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} className="w-full max-w-md">
                    <div className="border border-gray-700 glow-lg rounded-2xl m-2 sm:m-8 p-8 shadow-2xl">

                        {/* Header */}
                        <motion.div className="text-center mb-2" layout>
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4">
                                <Image src="/logo.png" alt="Logo" width={50} height={50} />
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div key={authState.hasSignUp ? "signup" : "signin"} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.25 }}>
                                    <h1 className="text-2xl font-bold text-gray-200">
                                        {authState.hasSignUp ? "Create account" : "Welcome back"}
                                    </h1>
                                    <p className="text-gray-500 mt-1 text-sm">
                                        {authState.hasSignUp ? "Start your journey today" : "Sign in to continue"}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Social buttons */}
                        <motion.div className="space-y-3 mb-4" variants={itemVariants}>
                            <motion.button onClick={() => signIn("google")} className="flex cursor-pointer gap-2 items-center justify-center w-full py-3 px-4 rounded-xl border border-border bg-orange-600 text-sm text-foreground hover:bg-primary/5 transition-colors" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                                <FaGoogle className="w-5 h-5 text-foreground" />
                                <span className="text-secondary-foreground text-sm">Continue with Google</span>
                            </motion.button>
                            <motion.button onClick={() => signIn("github")} className="flex cursor-pointer gap-2 items-center justify-center w-full py-3 px-4 rounded-xl border border-border bg-gray-800 text-sm text-foreground hover:bg-primary/5 transition-colors" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
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
                            <motion.form key={authState.hasSignUp ? "signup-form" : "signin-form"} variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleSubmit} className="space-y-4">
                                {authState.hasSignUp && (
                                    <motion.div variants={itemVariants}>
                                        <label className="text-xs font-medium text-gray-400 mb-1.5 block">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input type="text" name="name" value={user.name} required={authState.hasSignUp} onChange={(e) => handleAuthChange(e)} placeholder="John Doe" className="w-full pl-10 pr-4 bg-gray-900 py-3 rounded-xl bg-input border border-border text-gray-100 selection:bg-orange-800 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all duration-200" />
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants}>
                                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input type="email" name="email" value={user.email} required onChange={(e) => handleAuthChange(e)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-gray-900 rounded-xl bg-input border border-border text-gray-100 selection:bg-orange-800 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all duration-200" />
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input type={showPassword ? "text" : "password"} name="password" value={user.password} required onChange={(e) => handleAuthChange(e)} placeholder="••••••••" className="w-full pl-10 pr-12 bg-gray-900 py-3 rounded-xl bg-input border border-border text-gray-100 selection:bg-orange-800 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all duration-200" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-100 transition-colors">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </motion.div>

                                {!authState.hasSignUp && (
                                    <motion.div variants={itemVariants} className="flex justify-end">
                                        <button onClick={forgotPassword} type="button" className="text-xs text-orange-500 hover:text-orange-500/80 cursor-pointer transition-colors">
                                            Forgot password?
                                        </button>
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants}>
                                    <motion.button type="submit" disabled={authState.isLoading} className={`w-full py-3 px-4 rounded-xl bg-orange-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${authState.isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-orange-600"}`} whileHover={authState.isLoading ? undefined : { scale: 1.01 }} whileTap={authState.isLoading ? undefined : { scale: 0.98 }}>
                                        <>
                                            {authState.isLoading ? (
                                                <div className="w-4 flex items-center h-4 border-t-2 border-r-2 border-orange-500 rounded-full"><LoaderCircle className="w-8 h-8 animate-spin text-white" /></div>
                                            ) : (
                                                <>
                                                    {authState.hasSignUp ? "Create Account" : "Sign In"}
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
                            {authState.hasSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button onClick={() => handleAuthState("hasSignUp", !authState.hasSignUp)} className="text-orange-500 hover:text-orange-500/80 font-medium cursor-pointer transition-colors">
                                {authState.hasSignUp ? "Sign in" : "Sign up"}
                            </button>
                        </motion.p>

                        {(!authState.hasSignUp && authState.isVerificationResend) && (
                            <motion.div variants={itemVariants} className="text-center">
                                <button type="button" onClick={resendVerification} className="text-xs cursor-pointer hover:underline text-orange-500 hover:text-orange-500/80 transition-colors">
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