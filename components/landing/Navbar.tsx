"use client"

import { useState } from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Security", href: "#security" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Use Cases", href: "#use-cases" },
];

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-gray-500/40 bg-black/40 backdrop-blur-xl"
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
                <Link href="#" className="flex items-center gap-2">
                    {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20 glow-sm">
                        <span className="text-lg font-bold text-orange-500">⚡</span>
                    </div>
                    <span className="text-lg font-bold text-gray-200">ChatForge</span> */}
                    <Image src="/logo.png" alt="Chalpy AI Logo" width={45} height={45} />
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-orange-500"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <Link href="#demo" className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors  border border-gray-700 hover:bg-gray-800 hover:border-gray-500 glow-sm">
                        View Demo
                    </Link>
                    <Link href="#cta" className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-primary-foreground transition-all hover:opacity-90 glow-sm">
                        Get Started Free
                    </Link>
                </div>

                <button
                    className="md:hidden text-foreground"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
                >
                    <div className="flex flex-col gap-1 p-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="mt-2 flex flex-col gap-2">
                            <Link href="#demo" className="rounded-lg px-4 py-3 text-sm text-center border border-gray-700 hover:bg-gray-800">
                                View Demo
                            </Link>
                            <Link href="#cta" className="rounded-lg bg-orange-500 px-4 py-3 text-sm text-center font-semibold text-primary-foreground transition-all hover:opacity-90 glow-sm">
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
