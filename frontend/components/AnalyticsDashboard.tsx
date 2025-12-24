"use client";

import { useEffect, useState } from 'react';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
    LineChart, Line, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { API_URL } from "@/lib/api";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsDashboard() {
    const { t, language } = useLanguage();
    const [policyData, setPolicyData] = useState([]);
    const [expiryData, setExpiryData] = useState([]);
    const [growthData, setGrowthData] = useState([]);
    const [financialData, setFinancialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const [policyRes, expiryRes, growthRes, financialRes] = await Promise.all([
                    fetch(`${API_URL}/api/analytics/policy-distribution`, { headers }),
                    fetch(`${API_URL}/api/analytics/expiry-timeline`, { headers }),
                    fetch(`${API_URL}/api/analytics/customer-growth`, { headers }),
                    fetch(`${API_URL}/api/analytics/financial-summary`, { headers })
                ]);

                if (!policyRes.ok || !expiryRes.ok || !growthRes.ok || !financialRes.ok) {
                    throw new Error("One or more analytics endpoints failed to load.");
                }

                setPolicyData(await policyRes.json());
                setExpiryData(await expiryRes.json());
                setGrowthData(await growthRes.json());
                setFinancialData(await financialRes.json());
            } catch (err: any) {
                console.error("Failed to fetch analytics", err);
                setError(err.message || "Failed to load analytics data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-zinc-500" /></div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Financial Overview Cards */}
            {financialData && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('analytics_total_revenue')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">€{financialData.total_revenue.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {/* Policy Types - Pie Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>{t('analytics_policy_dist')}</CardTitle>
                        <CardDescription>{t('analytics_policy_dist_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={policyData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {policyData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Expiring Policies - Bar Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>{t('analytics_expiries')}</CardTitle>
                        <CardDescription>{t('analytics_expiries_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={expiryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" name={language === 'tr' ? "Sona Erecek Poliçeler" : "Policies Expiring"} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Revenue Trend - Bar Chart (New) */}
                {financialData?.revenue_trend && (
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>{t('analytics_revenue')}</CardTitle>
                            <CardDescription>{t('analytics_revenue_desc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={financialData.revenue_trend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <RechartsTooltip formatter={(value) => `£${value}`} />
                                    <Legend />
                                    <Bar dataKey="amount" fill="#82ca9d" name={language === 'tr' ? "Ciro (£)" : "Revenue (£)"} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Customer Growth - Line Chart */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>{t('analytics_growth')}</CardTitle>
                        <CardDescription>{t('analytics_growth_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} name={language === 'tr' ? "Toplam Kullanıcı" : "Total Users"} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
