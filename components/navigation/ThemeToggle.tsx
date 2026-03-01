"use client";

import { useEffect, useState } from "react";
import { motion } from 'motion/react';
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {

    const [theme, setTheme] = useState("dark");

    useEffect(() => {

        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

    }, [theme]);

    const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

    return (
        <div className="absolute right-3 top-3">

            {/* LIGHT STYLE */}
            <div className="flex items-center gap-6">
                <span className="text-md font-bold uppercase text-neutral-800 dark:text-white">
                    {theme === "light" ? "Light" : "Dark"}
                </span>

                <button onClick={toggleTheme} className="relative cursor-pointer w-[85px] flex items-center h-10 rounded-full bg-gray-100 dark:bg-gray-800 p-2 transition-colors duration-500">
                    <motion.div layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className=" w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center" animate={{ x: theme === "dark" ? 40 : 0 }}>
                        {theme === "light" ? (
                            <Sun className="text-white" size={20} />
                        ) : (
                            <Moon className="text-white" size={20} />
                        )}
                    </motion.div>

                    {theme === "light" ?
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Moon className="text-neutral-400" size={20} />
                        </div>
                        :
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Sun className="text-neutral-400" size={20} />
                        </div>
                    }
                </button>
            </div>
        </div>
    );
}