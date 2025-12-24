"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function LogoutButton() {
    const { t } = useLanguage();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        router.push("/login");
    };

    return (
        <Button variant="destructive" onClick={handleLogout}>
            {t('logout')}
        </Button>
    );
}
