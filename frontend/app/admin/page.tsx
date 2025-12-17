"use client";

import { Button } from "@/components/ui/button";
import ExcelUpload from "@/components/ExcelUpload";
import LogoutButton from "@/components/LogoutButton";
import CustomerList from "@/components/CustomerList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import DashboardStats from "@/components/DashboardStats";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function AdminDashboard() {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [targetAudience, setTargetAudience] = useState("all");

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/notifications/broadcast", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                message: notificationMessage,
                target_audience: targetAudience
            }),
        });

        if (res.ok) {
            const data = await res.json();
            alert(`Sent ${data.sent_count} messages successfully!`);
            setIsNotificationOpen(false);
            setNotificationMessage("");
        } else {
            alert("Failed to send notifications");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Admin Dashboard</h1>
                    <p className="text-zinc-500">Agency Overview & Insights</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setIsNotificationOpen(true)}>Create Notification</Button>
                    <LogoutButton />
                </div>
            </header>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <DashboardStats />
                    <div className="mb-8">
                        <ExcelUpload />
                    </div>
                </TabsContent>

                <TabsContent value="customers">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CustomerList />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="insights">
                    <AnalyticsDashboard />
                </TabsContent>
            </Tabs>

            <Dialog open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Broadcast Notification</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSendNotification} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="audience">Target Audience</Label>
                            <select
                                id="audience"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                            >
                                <option value="all">All Customers</option>
                                <option value="active">Active Policies Only</option>
                                <option value="renewal_1week">Expiring in 1 Week</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <textarea
                                id="message"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Type your message here..."
                                value={notificationMessage}
                                onChange={(e) => setNotificationMessage(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">Send Broadcast</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
