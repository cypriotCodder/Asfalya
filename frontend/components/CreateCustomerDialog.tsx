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
import { API_URL } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

interface CreateCustomerDialogProps {
    onSuccess: () => void;
}

export default function CreateCustomerDialog({ onSuccess }: CreateCustomerDialogProps) {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        full_name: "",
        premium: "",
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
            alert(t('validation_email_phone'));
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/customers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: formData.email || null,
                    phone: formData.phone || null,
                    full_name: formData.full_name || null,
                    premium: formData.premium ? parseFloat(formData.premium) : 0,
                    vehicle_plate: formData.vehicle_plate || null,
                    policy_number: formData.policy_number || null,
                    policy_type: formData.policy_type || null,
                    policy_expiry: formData.policy_expiry || null
                })
            });

            if (res.ok) {
                alert(t('customer_created'));
                setOpen(false);
                setFormData({
                    email: "",
                    phone: "",
                    full_name: "",
                    premium: "",
                    vehicle_plate: "",
                    policy_number: "",
                    policy_type: "",
                    policy_expiry: ""
                });
                onSuccess();
            } else {
                const error = await res.json();
                alert(`${t('customer_create_failed')}: ${error.detail}`);
            }
        } catch (err) {
            console.error(err);
            alert(t('error_occurred'));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t('add_customer')}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('add_customer_title')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">{t('full_name_label')}</Label>
                        <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email_label')}</Label>
                            <Input
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="customer@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">{t('phone_label')}</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1234567890"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vehicle_plate">{t('vehicle_plate')}</Label>
                        <Input
                            id="vehicle_plate"
                            value={formData.vehicle_plate}
                            onChange={(e) => setFormData({ ...formData, vehicle_plate: e.target.value })}
                            placeholder="ABC-123"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="policy_number">{t('policy_number')}</Label>
                            <Input
                                id="policy_number"
                                value={formData.policy_number}
                                onChange={(e) => setFormData({ ...formData, policy_number: e.target.value })}
                                placeholder="POL-001"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="policy_type">{t('policy_type')}</Label>
                            <Input
                                id="policy_type"
                                value={formData.policy_type}
                                onChange={(e) => setFormData({ ...formData, policy_type: e.target.value })}
                                placeholder="Comprehensive"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="premium">Premium (£)</Label>
                        <Input
                            id="premium"
                            type="number"
                            step="0.01"
                            value={formData.premium}
                            onChange={(e) => setFormData({ ...formData, premium: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="policy_expiry">{t('policy_expiry')}</Label>
                        <Input
                            id="policy_expiry"
                            type="date"
                            value={formData.policy_expiry}
                            onChange={(e) => setFormData({ ...formData, policy_expiry: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full">{t('create_customer_button')}</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
