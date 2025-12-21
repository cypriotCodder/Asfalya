export interface User {
    id: number;
    email: string;
    phone: string | null;
    full_name: string | null;
    is_active: boolean;
    is_admin: boolean;
    premium: number | null;
    policy_type: string | null;
    policy_number: string | null;
    policy_expiry: string | null;
    vehicle_plate: string | null;
    created_at: string;
}
