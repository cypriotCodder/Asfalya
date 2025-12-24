"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import CreateCustomerDialog from "./CreateCustomerDialog";
import { useLanguage } from "@/context/LanguageContext";
import { API_URL } from "@/lib/api";

interface Customer {
    id: number;
    email: string | null;
    phone: string | null;
    full_name: string | null;
    premium: number | null;
    is_active: boolean;
    policy_type?: string;
    policy_number?: string;
    policy_expiry?: string;
    vehicle_plate?: string;
}

export default function CustomerList() {
    const { t } = useLanguage();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = customers.filter(c =>
            c.email?.toLowerCase().includes(lowerQuery) ||
            c.full_name?.toLowerCase().includes(lowerQuery) ||
            c.phone?.includes(lowerQuery) ||
            c.vehicle_plate?.toLowerCase().includes(lowerQuery) ||
            c.policy_number?.toLowerCase().includes(lowerQuery) ||
            c.id.toString().includes(lowerQuery)
        );
        setFilteredCustomers(filtered);
    }, [searchQuery, customers]);

    const fetchCustomers = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/customers`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            const data = await res.json();
            setCustomers(data);
            setFilteredCustomers(data);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(t('delete_confirm'))) return;

        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/customers/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            fetchCustomers();
        } else {
            alert(t('delete_failed'));
        }
    };

    const handleWhatsApp = (phone: string | null) => {
        if (!phone) return;
        const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCustomer) return;

        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/customers/${editingCustomer.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                email: editingCustomer.email,
                phone: editingCustomer.phone,
                full_name: editingCustomer.full_name,
                premium: editingCustomer.premium,
                policy_type: editingCustomer.policy_type,
                policy_number: editingCustomer.policy_number,
                policy_expiry: editingCustomer.policy_expiry,
                vehicle_plate: editingCustomer.vehicle_plate
            }),
        });

        if (res.ok) {
            setIsEditDialogOpen(false);
            setEditingCustomer(null);
            fetchCustomers();
        } else {
            alert(t('update_failed'));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder={t('search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
                <CreateCustomerDialog onSuccess={fetchCustomers} />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('col_id')}</TableHead>
                            <TableHead>{t('col_name')}</TableHead>
                            <TableHead>{t('col_contact')}</TableHead>
                            <TableHead>{t('col_vehicle')}</TableHead>
                            <TableHead>{t('col_policy')}</TableHead>
                            <TableHead>{t('col_premium')}</TableHead>
                            <TableHead>{t('col_expiry')}</TableHead>
                            <TableHead>{t('col_status')}</TableHead>
                            <TableHead className="text-right">{t('col_actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCustomers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell>{customer.id}</TableCell>
                                <TableCell className="font-medium">{customer.full_name || "-"}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        <span>{customer.email || "-"}</span>
                                        <span className="text-xs text-muted-foreground">{customer.phone || "-"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{customer.vehicle_plate || "-"}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{customer.policy_type || "-"}</span>
                                        <span className="text-xs text-muted-foreground">{customer.policy_number}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {customer.premium ? `£${customer.premium.toFixed(2)}` : "-"}
                                </TableCell>
                                <TableCell>
                                    {customer.policy_expiry ? new Date(customer.policy_expiry).toLocaleDateString() : "-"}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs ${customer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {customer.is_active ? t('active') : t('inactive')}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right space-x-2 whitespace-nowrap">
                                    {customer.phone && (
                                        <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100" onClick={() => handleWhatsApp(customer.phone)}>
                                            {t('whatsapp')}
                                        </Button>
                                    )}
                                    <Button variant="outline" size="sm" onClick={() => {
                                        setEditingCustomer(customer);
                                        setIsEditDialogOpen(true);
                                    }}>
                                        {t('edit')}
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(customer.id)}>
                                        {t('delete')}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredCustomers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center h-24">
                                    {t('no_customers')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{t('edit_customer_title')}</DialogTitle>
                    </DialogHeader>
                    {editingCustomer && (
                        <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="full_name">{t('full_name_label')}</Label>
                                <Input
                                    id="full_name"
                                    value={editingCustomer.full_name || ""}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, full_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('email_label')}</Label>
                                <Input
                                    id="email"
                                    value={editingCustomer.email || ""}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">{t('phone_label')}</Label>
                                <Input
                                    id="phone"
                                    value={editingCustomer.phone || ""}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vehicle_plate">{t('vehicle_plate')}</Label>
                                <Input
                                    id="vehicle_plate"
                                    value={editingCustomer.vehicle_plate || ""}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, vehicle_plate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="policy_number">{t('policy_number')}</Label>
                                <Input
                                    id="policy_number"
                                    value={editingCustomer.policy_number || ""}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, policy_number: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="policy_type">{t('policy_type')}</Label>
                                <Input
                                    id="policy_type"
                                    value={editingCustomer.policy_type || ""}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, policy_type: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="premium">Premium (£)</Label>
                                <Input
                                    id="premium"
                                    type="number"
                                    step="0.01"
                                    value={editingCustomer.premium || ""}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, premium: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="policy_expiry">{t('policy_expiry')}</Label>
                                <Input
                                    id="policy_expiry"
                                    type="date"
                                    value={editingCustomer.policy_expiry ? new Date(editingCustomer.policy_expiry).toISOString().split('T')[0] : ""}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, policy_expiry: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2">
                                <Button type="submit" className="w-full">{t('save_changes')}</Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
