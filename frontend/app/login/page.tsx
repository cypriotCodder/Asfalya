"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const formData = new URLSearchParams();
        formData.append("username", email); // OAuth2 expects 'username'
        formData.append("password", password);

        try {
            const res = await fetch(`${API_URL}/token`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData,
            });

            if (!res.ok) throw new Error("Invalid credentials");

            const data = await res.json();
            localStorage.setItem("token", data.access_token);
            document.cookie = `token=${data.access_token}; path=/;`; // For middleware

            // Basic role check (In real app, decode token or call /me)
            // For now, let's redirect to home, middleware handles access
            router.push("/");
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900 relative">
            <div className="absolute top-4 right-4">
                <LanguageToggle />
            </div>

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">{t('login_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email_label')}</Label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="admin@asfalya.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t('password_label')}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full">
                            {t('login_button')}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/signup" className="text-sm text-blue-600 hover:underline">
                        {t('signup_link')}
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
