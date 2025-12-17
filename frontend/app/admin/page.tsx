"use client";

import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import ExcelUpload from "@/components/ExcelUpload";
import CustomerList from "@/components/CustomerList";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import DashboardStats from "@/components/DashboardStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bell } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";


export default function AdminPage() {
    const { t } = useLanguage();
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifLoading, setNotifLoading] = useState(false);
    const [notifData, setNotifData] = useState({
        message: "",
        target_audience: "all"
    });

    const handleSendNotification = async () => {
        setNotifLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/notifications/broadcast", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(notifData)
            });

            if (res.ok) {
                const data = await res.json();
                alert(`Success: Sent ${data.sent_count} messages`);
                setNotifOpen(false);
                setNotifData({ message: "", target_audience: "all" });
            } else {
                alert("Failed to send notification");
            }
        } catch (e) {
            console.error(e);
            alert("Error sending notification");
        } finally {
            setNotifLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{t('welcome')}</h1>
                <div className="flex items-center gap-4">
                    <LanguageToggle />
                    <LogoutButton />
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
                    <TabsTrigger value="customers">{t('customers')}</TabsTrigger>
                    <TabsTrigger value="insights">{t('insights')}</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    
                    <div className="flex justify-end">
                        <Dialog open={notifOpen} onOpenChange={setNotifOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Bell className="h-4 w-4" />
                                    {t('create_notification')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{t('notif_title')}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>{t('notif_message')}</Label>
                                        <Input
                                            value={notifData.message}
                                            onChange={(e) => setNotifData({ ...notifData, message: e.target.value })}
                                            placeholder="e.g. Renew your policy now!"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>{t('notif_audience')}</Label>
                                        <Select
                                            value={notifData.target_audience}
                                            onValueChange={(val: string) => setNotifData({ ...notifData, target_audience: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">{t('notif_audience_all')}</SelectItem>
                                                <SelectItem value="active">{t('notif_audience_active')}</SelectItem>
                                                <SelectItem value="renewal_1week">{t('notif_audience_renewal')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleSendNotification} disabled={notifLoading}>
                                        {notifLoading ? <Send className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                        {notifLoading ? t('notif_sending') : t('notif_send')}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <DashboardStats />


                </TabsContent>

                <TabsContent value="customers">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('customers')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CustomerList />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="insights" className="space-y-4">
                    <AnalyticsDashboard />
                </TabsContent>
            </Tabs>

            <ExcelUpload />
        </div >
    );
}
