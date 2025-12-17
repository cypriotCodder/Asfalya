import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface CreateCustomerDialogProps {
    onSuccess: () => void;
}

export default function CreateCustomerDialog({ onSuccess }: CreateCustomerDialogProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        vehicle_plate: "",
        policy_number: "",
        policy_type: "",
        policy_expiry: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        // Simple validation: Ensure at least email or phone is present
        if (!formData.email && !formData.phone) {
            alert("Please provide at least an email or phone number.");
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/customers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: formData.email || null,
                    phone: formData.phone || null,
                    vehicle_plate: formData.vehicle_plate || null,
                    policy_number: formData.policy_number || null,
                    policy_type: formData.policy_type || null,
                    policy_expiry: formData.policy_expiry || null
                })
            });

            if (res.ok) {
                alert("Customer created successfully!");
                setOpen(false);
                setFormData({
                    email: "",
                    phone: "",
                    vehicle_plate: "",
                    policy_number: "",
                    policy_type: "",
                    policy_expiry: ""
                });
                onSuccess();
            } else {
                const error = await res.json();
                alert(`Failed to create customer: ${error.detail}`);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Customer
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="customer@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1234567890"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vehicle_plate">Vehicle Plate</Label>
                        <Input
                            id="vehicle_plate"
                            value={formData.vehicle_plate}
                            onChange={(e) => setFormData({ ...formData, vehicle_plate: e.target.value })}
                            placeholder="ABC-123"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="policy_number">Policy Number</Label>
                            <Input
                                id="policy_number"
                                value={formData.policy_number}
                                onChange={(e) => setFormData({ ...formData, policy_number: e.target.value })}
                                placeholder="POL-001"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="policy_type">Policy Type</Label>
                            <Input
                                id="policy_type"
                                value={formData.policy_type}
                                onChange={(e) => setFormData({ ...formData, policy_type: e.target.value })}
                                placeholder="Comprehensive"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="policy_expiry">Policy Expiry</Label>
                        <Input
                            id="policy_expiry"
                            type="date"
                            value={formData.policy_expiry}
                            onChange={(e) => setFormData({ ...formData, policy_expiry: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full">Create Customer</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
