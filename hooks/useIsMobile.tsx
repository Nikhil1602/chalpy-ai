"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

const useIsMobile = (): boolean => {

    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {

        const mediaQuery = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
        );

        const handleChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        // Set initial value
        setIsMobile(mediaQuery.matches);

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);

    }, []);

    return isMobile!;

}

export default useIsMobile;

// USAGE:
// const isMobile = useIsMobile();
// if (isMobile)
//      return null;
// return ( <>...</> )