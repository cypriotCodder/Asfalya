export type Language = 'en' | 'tr';

export const translations = {
    en: {
        // Dashboard
        // Authentication
        login_title: "Welcome Back",
        login_subtitle: "Enter your credentials to access your account",
        email_label: "Email",
        password_label: "Password",
        login_button: "Sign In",
        signup_link: "Don't have an account? Sign up",
        signup_title: "Create Account",
        signup_subtitle: "Enter your information to create an account",
        full_name_label: "Full Name",
        phone_label: "Phone",
        confirm_password_label: "Confirm Password",
        signup_button: "Sign Up",
        login_link: "Already have an account? Sign in",
        loading: "Loading...",

        // Dashboard
        dashboard: "Dashboard",
        overview: "Overview",
        customers: "Customers",
        insights: "Insights",
        logout: "Logout",
        welcome: "Welcome back, Admin!",
        stats_total_customers: "Total Customers",
        stats_active_policies: "Active Policies",
        stats_expiring_soon: "Expiring Soon",

        // Customer Portal
        my_policies: "My Policies",
        manage_renewals: "Manage your insurance renewals",
        active: "Active",
        next_renewal: "Next renewal",
        renew_policy: "Renew Policy",
        nearby_mechanics: "Nearby Mechanics",

        // Actions & Dialogs
        add_customer: "Add Customer",
        create_notification: "Create Notification",
        search_placeholder: "Search by name, email, phone, plate...",

        // Customer List Table
        col_id: "ID",
        col_name: "Name",
        col_contact: "Contact",
        col_vehicle: "Vehicle",
        col_policy: "Policy",
        col_premium: "Premium",
        col_expiry: "Expiry",
        col_status: "Status",
        col_actions: "Actions",
        whatsapp: "WhatsApp",
        edit: "Edit",
        delete: "Delete",
        save_changes: "Save Changes",

        // Analytics
        analytics_total_revenue: "Total Revenue",
        analytics_policy_dist: "Policy Distribution",
        analytics_policy_dist_desc: "Breakdown by Policy Type",
        analytics_expiries: "Upcoming Expiries",
        analytics_expiries_desc: "Renewals in Next 6 Months",
        analytics_revenue: "Revenue Trend",
        analytics_revenue_desc: "Monthly Revenue Growth",
        analytics_growth: "Customer Growth",
        analytics_growth_desc: "Cumulative Registered Users",

        // Notification Dialog
        notif_title: "Create Notification",
        notif_message: "Message",
        notif_audience: "Target Audience",
        notif_audience_all: "All Customers",
        notif_audience_active: "Active Policies Only",
        notif_audience_renewal: "Expiring in 1 Week",
        notif_send: "Send Broadcast",
        notif_sending: "Sending...",
    },
    tr: {
        // Dashboard
        // Authentication
        login_title: "Hoşgeldiniz",
        login_subtitle: "Hesabınıza erişmek için bilgilerinizi girin",
        email_label: "E-posta",
        password_label: "Şifre",
        login_button: "Giriş Yap",
        signup_link: "Hesabınız yok mu? Kayıt olun",
        signup_title: "Hesap Oluştur",
        signup_subtitle: "Hesap oluşturmak için bilgilerinizi girin",
        full_name_label: "Ad Soyad",
        phone_label: "Telefon",
        confirm_password_label: "Şifre Tekrar",
        signup_button: "Kayıt Ol",
        login_link: "Zaten hesabınız var mı? Giriş yapın",
        loading: "Yükleniyor...",

        // Dashboard
        dashboard: "Panel",
        overview: "Genel Bakış",
        customers: "Müşteriler",
        insights: "Analizler",
        logout: "Çıkış Yap",
        welcome: "Hoşgeldin, Yönetici!",
        stats_total_customers: "Toplam Müşteri",
        stats_active_policies: "Aktif Poliçeler",
        stats_expiring_soon: "Yakında Bitiyor",

        // Customer Portal
        my_policies: "Poliçelerim",
        manage_renewals: "Yenilemelerinizi yönetin",
        active: "Aktif",
        next_renewal: "Sonraki Yenileme",
        renew_policy: "Poliçeyi Yenile",
        nearby_mechanics: "Yakındaki Tamirciler",

        // Actions & Dialogs
        add_customer: "Müşteri Ekle",
        create_notification: "Bildirim Oluştur",
        search_placeholder: "İsim, e-posta, telefon, plaka ara...",

        // Customer List Table
        col_id: "NO",
        col_name: "İsim",
        col_contact: "İletişim",
        col_vehicle: "Araç",
        col_policy: "Poliçe",
        col_premium: "Prim",
        col_expiry: "Bitiş Tarihi",
        col_status: "Durum",
        col_actions: "İşlemler",
        whatsapp: "WhatsApp",
        edit: "Düzenle",
        delete: "Sil",
        save_changes: "Kaydet",

        // Analytics
        analytics_total_revenue: "Toplam Ciro",
        analytics_policy_dist: "Poliçe Dağılımı",
        analytics_policy_dist_desc: "Poliçe Türüne Göre",
        analytics_expiries: "Yaklaşan Yenilemeler",
        analytics_expiries_desc: "Önümüzdeki 6 Ay",
        analytics_revenue: "Ciro Trendi",
        analytics_revenue_desc: "Aylık Ciro Büyümesi",
        analytics_growth: "Müşteri Büyümesi",
        analytics_growth_desc: "Kümülatif Kayıtlı Kullanıcı",

        // Notification Dialog
        notif_title: "Bildirim Oluştur",
        notif_message: "Mesaj",
        notif_audience: "Hedef Kitle",
        notif_audience_all: "Tüm Müşteriler",
        notif_audience_active: "Sadece Aktif Poliçeler",
        notif_audience_renewal: "1 Hafta İçinde Bitenler",
        notif_send: "Gönder",
        notif_sending: "Gönderiliyor...",
    }
};
