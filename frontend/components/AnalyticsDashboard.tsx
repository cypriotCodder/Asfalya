"use client";

import { useEffect, useState } from 'react';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
    LineChart, Line, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsDashboard() {
    const [policyData, setPolicyData] = useState([]);
    const [expiryData, setExpiryData] = useState([]);
    const [growthData, setGrowthData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const [policyRes, expiryRes, growthRes] = await Promise.all([
                    fetch("http://localhost:8000/api/analytics/policy-distribution", { headers }),
                    fetch("http://localhost:8000/api/analytics/expiry-timeline", { headers }),
                    fetch("http://localhost:8000/api/analytics/customer-growth", { headers })
                ]);

                if (policyRes.ok) setPolicyData(await policyRes.json());
                if (expiryRes.ok) setExpiryData(await expiryRes.json());
                if (growthRes.ok) setGrowthData(await growthRes.json());
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-zinc-500" /></div>;
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {/* Policy Types - Pie Chart */}
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Policy Distribution</CardTitle>
                    <CardDescription>Breakdown by Policy Type</CardDescription>
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
                                {policyData.map((entry, index) => (
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
                    <CardTitle>Upcoming Expiries</CardTitle>
                    <CardDescription>Renewals in Next 6 Months</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={expiryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="Policies Expiring" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Customer Growth - Line Chart */}
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Customer Growth</CardTitle>
                    <CardDescription>Cumulative Registered Users</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke="#82ca9d" strokeWidth={2} name="Total Users" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
