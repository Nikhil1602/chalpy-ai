"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Lock, Eye, EyeOff, ArrowRight, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks";

export default function ResetPasswordPage() {

    const params = useParams();
    const token = Array.isArray(params.token) ? params.token[0] : params.token;

    const router = useRouter();
    const { showToast } = useToast();

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }

        setLoading(true);

        const res = await fetch("/api/reset", {
            method: "POST",
            body: JSON.stringify({ token, password }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            showToast("Reset link expired or invalid", "error");
            return;
        }

        showToast("Password updated successfully!", "success");
        router.push("/auth");
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-mesh relative overflow-hidden px-4">

            {/* Background Orbs */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
                style={{
                    background: "radial-gradient(circle, hsl(24 95% 53% / 0.18), transparent 70%)",
                    top: "-10%",
                    right: "-5%",
                }}
                animate={{ y: [0, 30, 0], x: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full blur-3xl"
                style={{
                    background: "radial-gradient(circle, hsl(30 100% 60% / 0.14), transparent 70%)",
                    bottom: "-10%",
                    left: "-5%",
                }}
                animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="border border-gray-700 glow-lg rounded-2xl p-8 shadow-2xl">

                    <div className="text-center mb-6">
                        <Image src="/logo.png" alt="Logo" width={50} height={50} className="mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-200">Reset Password</h1>
                        <p className="text-gray-500 text-sm mt-1">Enter your new password</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="text-xs text-gray-400 mb-1 block">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 border border-border bg-gray-900 py-3 rounded-xl text-gray-100 selection:bg-orange-800 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all duration-200"
                                    placeholder="••••••••"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-3 cursor-pointer rounded-xl bg-orange-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition"
                        >
                            {loading ? (
                                <LoaderCircle className="animate-spin" size={18} />
                            ) : (
                                <>
                                    Update Password <ArrowRight size={16} />
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </motion.div>
        </div>
    );
}
