"use client";

import { toast } from 'react-toastify';

const useToast = () => {

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', theme: "dark" | "light" = "dark") => {
        switch (type) {
            case 'success':
                toast.success(message, {
                    autoClose: 3000,
                    theme: theme,
                });
                break;
            case 'error':
                toast.error(message, {
                    autoClose: 3000,
                    theme: theme,
                });
                break;
            case 'warning':
                toast.warning(message, {
                    autoClose: 3000,
                    theme: theme,
                });
                break;
            default:
                toast.info(message, {
                    autoClose: 3000,
                    theme: theme,
                });
        }
    };

    return { showToast };

}

export default useToast