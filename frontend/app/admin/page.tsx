import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Admin Dashboard</h1>
                    <p className="text-zinc-500">Agency Overview & Insights</p>
                </div>
                <Button>Create Notification</Button>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Active Policies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">1,234</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending Renewals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-yellow-600">56</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Churn Risk (ML)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-red-600">High</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
