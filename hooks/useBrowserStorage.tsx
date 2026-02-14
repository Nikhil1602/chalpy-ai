"use client";

import { StorageType } from "@/types";

const useBrowserStorage = () => {

    const isBrowser = () => typeof window !== "undefined";

    const getItems = (key: string = '', type: StorageType = 'local') => {

        if (!isBrowser()) return null;

        const value = type === 'local' ? window.localStorage.getItem(key) : window.sessionStorage.getItem(key);

        if (value !== null)
            return JSON.parse(value);

        return null;

    }

    const setItems = (key: string, value: any, type: StorageType = 'local') => {

        if (!isBrowser()) return null;

        type === 'local' ? window.localStorage.setItem(key, JSON.stringify(value)) : window.sessionStorage.setItem(key, JSON.stringify(value));


    }

    const clearOne = (key: string, type: StorageType = 'local') => {

        if (!isBrowser()) return null;

        type === 'local' ? window.localStorage.removeItem(key) : window.sessionStorage.removeItem(key);

    }

    const clearAll = (type: StorageType = 'local') => {

        if (!isBrowser()) return null;

        type === 'local' ? window.localStorage.clear() : window.sessionStorage.clear();

    }

    return { getItems, setItems, clearAll, clearOne }

}

export default useBrowserStorage

// USAGE: ALWAYS USE IT IN USEEFFECT HOOK

// 1. TO SET ITEMS:
// -> setItems("name", "Nikhil"); OR setItems("name", "Nikhil", "session");
// -> setItems("age", 25);
// -> setItems("subjects", [ "English", "Maths", "Science" ]);
// -> setItems("marks", { English: 59, Maths: 30, Science: 60 });

// 2. TO GET ITEMS:
// -> getItems("name") OR getItems("name", "session") -> Nikhil
// -> getItems("age") -> 25
// -> getItems("subjects") -> [ "English", "Maths", "Science" ]
// -> getItems("marks") -> { English: 59, Maths: 30, Science: 60 }