"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionManager() {
    const router = useRouter();

    useEffect(() => {
        const checkSession = () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiry = payload.exp * 1000; // Convert to milliseconds
                const now = Date.now();

                if (now >= expiry) {
                    console.log("Session expired. Logging out.");
                    logout();
                } else {
                    // Schedule logout
                    const timeUntilExpiry = expiry - now;
                    console.log(`Session valid for ${(timeUntilExpiry / 60000).toFixed(1)} minutes`);

                    const timer = setTimeout(() => {
                        console.log("Session time limit reached. Logging out.");
                        logout();
                    }, timeUntilExpiry);

                    return () => clearTimeout(timer);
                }
            } catch (e) {
                console.error("Invalid token format", e);
                // If token is invalid, might as well logout
                logout();
            }
        };

        const logout = () => {
            localStorage.removeItem("token");
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            router.push("/login");
        };

        // Check continuously (e.g. every minute) to handle cases where tab was sleeping
        // But simply setting the timeout above is usually efficient.
        // We run it once on mount.
        const cleanup = checkSession();
        return cleanup;

    }, [router]);

    return null; // This component renders nothing
}
