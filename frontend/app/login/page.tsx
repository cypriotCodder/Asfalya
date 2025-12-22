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
    const router = useRouter();

    // Login State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Activation State
    const [view, setView] = useState<"login" | "activate">("login");
    const [activationStep, setActivationStep] = useState<"request" | "verify" | "password">("request");

    const [otpCode, setOtpCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [tempToken, setTempToken] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const formData = new URLSearchParams();
        formData.append("username", email);
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

            router.push("/");
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        }
    };

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch(`${API_URL}/auth/request-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) throw new Error("Failed to send code");
            setActivationStep("verify");
        } catch (err) {
            setError("Failed to request code. Please try again.");
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch(`${API_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: otpCode }),
            });
            if (!res.ok) throw new Error("Invalid code");
            const data = await res.json();
            setTempToken(data.access_token);
            setActivationStep("password");
        } catch (err) {
            setError("Invalid code. Please try again.");
        }
    };

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const res = await fetch(`${API_URL}/auth/set-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tempToken}`
                },
                body: JSON.stringify({ new_password: newPassword }),
            });
            if (!res.ok) throw new Error("Failed to set password");

            // Auto login or redirect to login
            alert("Password set successfully! Please login.");
            setView("login");
            setPassword("");
        } catch (err) {
            setError("Failed to set password.");
        }
    };

    if (view === "activate") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900 relative">
                <div className="absolute top-4 right-4">
                    <LanguageToggle />
                </div>

                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Activate Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activationStep === "request" && (
                            <form onSubmit={handleRequestOtp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="act-email">{t('email_label')}</Label>
                                    <Input
                                        id="act-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="admin@asfalya.com"
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <Button type="submit" className="w-full">Send Activation Code</Button>
                            </form>
                        )}

                        {activationStep === "verify" && (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <p className="text-sm text-center text-zinc-500">Code sent to {email}</p>
                                <div className="space-y-2">
                                    <Label htmlFor="otp">Enter Code</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        required
                                        placeholder="123456"
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <Button type="submit" className="w-full">Verify Code</Button>
                            </form>
                        )}

                        {activationStep === "password" && (
                            <form onSubmit={handleSetPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new-pass">{t('password_label')}</Label>
                                    <Input
                                        id="new-pass"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="conf-pass">{t('confirm_password_label')}</Label>
                                    <Input
                                        id="conf-pass"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <Button type="submit" className="w-full">Set Password</Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <button onClick={() => setView("login")} className="text-sm text-blue-600 hover:underline">
                            Back to Login
                        </button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

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
                <CardFooter className="flex flex-col gap-2 justify-center">
                    <button onClick={() => setView("activate")} className="text-sm text-blue-600 hover:underline font-bold">
                        First Time Login? Activate Account
                    </button>
                    <Link href="/signup" className="text-sm text-zinc-500 hover:underline">
                        {t('signup_link')}
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
