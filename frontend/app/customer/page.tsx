import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MechanicMapLoader from '@/components/MechanicMapLoader';
import LogoutButton from "@/components/LogoutButton";

export default function CustomerPortal() {
    return (
        <div className="min-h-screen bg-white p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">My Policies</h1>
                    <p className="text-zinc-500">Manage your insurance renewals</p>
                </div>
                <LogoutButton />
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Car Insurance #8392
                            </CardTitle>
                            <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-xs">Active</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$120.00 / mo</div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Next renewal: Dec 20, 2025
                            </p>
                            <Button className="mt-4 w-full">Renew Policy</Button>
                        </CardContent>
                    </Card>
                </div>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Nearby Mechanics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MechanicMapLoader />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
