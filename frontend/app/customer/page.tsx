"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MechanicMapLoader from '@/components/MechanicMapLoader';
import LogoutButton from "@/components/LogoutButton";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import { API_URL } from "@/lib/api";
import { User } from "@/types/user";
import { Loader2 } from "lucide-react";

export default function CustomerPortal() {
    const { t } = useLanguage();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">{t('my_policies')}</h1>
                    <p className="text-zinc-500">{t('manage_renewals')}</p>
                </div>
                <div className="flex items-center gap-4">
                    <LanguageToggle />
                    <LogoutButton />
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {user?.policy_type || "No Policy"} {user?.policy_number ? `#${user.policy_number}` : ""}
                            </CardTitle>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${user?.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {user?.is_active ? t('active') : "Inactive"}
                            </span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {user?.premium ? `£${user.premium.toFixed(2)}` : "£0.00"}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {t('next_renewal')}: {user?.policy_expiry ? new Date(user.policy_expiry).toLocaleDateString() : "N/A"}
                            </p>
                            <Button className="mt-4 w-full" disabled={!user?.is_active}>
                                {t('renew_policy')}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>{t('nearby_mechanics')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MechanicMapLoader />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
