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
        notif_success_prefix: "Success: Sent",
        notif_success_suffix: "messages",
        notif_failed: "Failed to send notification",
        notif_error: "Error sending notification",

        // Landing Page
        landing_title: "Asfalya",
        landing_subtitle: "Insurance Notification & Insights Platform",
        admin_portal: "Admin Portal",
        customer_portal: "Customer Portal",

        // Excel Upload
        import_data: "Import Data",
        mechanics: "Mechanics",
        // customers: "Customers", // DUPLICATE REMOVED
        upload_button: "Upload",
        uploading: "Uploading...",
        upload_success: "Success",
        upload_error: "Error",

        // Mechanic Map
        book_specifics: "Book specifics",

        // Create Customer Dialog
        add_customer_title: "Add New Customer",
        vehicle_plate: "Vehicle Plate",
        policy_number: "Policy Number",
        policy_type: "Policy Type",
        policy_expiry: "Policy Expiry",
        create_customer_button: "Create Customer",
        customer_created: "Customer created successfully!",
        customer_create_failed: "Failed to create customer",
        validation_email_phone: "Please provide at least an email or phone number.",
        error_occurred: "An error occurred.",

        // Status & Actions
        inactive: "Inactive",
        delete_confirm: "Are you sure you want to delete this customer?",
        delete_failed: "Failed to delete customer",
        update_failed: "Failed to update customer",
        no_customers: "No customers found.",
        edit_customer_title: "Edit Customer",

        // Activation & Errors
        activate_title: "Activate Account",
        send_code_button: "Send Activation Code",
        code_sent_to: "Code sent to",
        enter_code_label: "Enter Code",
        verify_code_button: "Verify Code",
        set_password_button: "Set Password",
        back_to_login: "Back to Login",
        first_time_login: "First Time Login? Activate Account",
        err_invalid_credentials: "Invalid credentials. Please check your credentials.",
        err_login_failed: "Login failed. Please check your credentials.",
        err_send_code_failed: "Failed to send code",
        err_request_code_failed: "Failed to request code. Please try again.",
        err_invalid_code: "Invalid code",
        err_invalid_code_retry: "Invalid code. Please try again.",
        err_passwords_mismatch: "Passwords do not match",
        err_set_password_failed: "Failed to set password",
        err_registration_failed: "Registration failed",
        err_something_went_wrong: "Something went wrong",
        success_password_set: "Password set successfully! Please login.",
        upload_failed_msg: "Upload failed",

        // Footer
        all_rights_reserved: "All rights reserved.",
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
        notif_success_prefix: "Başarılı:",
        notif_success_suffix: "mesaj gönderildi",
        notif_failed: "Bildirim gönderilemedi",
        notif_error: "Bildirim gönderilirken hata oluştu",

        // Landing Page
        landing_title: "Asfalya",
        landing_subtitle: "Sigorta Bildirim ve Analiz Platformu",
        admin_portal: "Yönetici Paneli",
        customer_portal: "Müşteri Paneli",

        // Excel Upload
        import_data: "Veri İçe Aktar",
        mechanics: "Tamirciler",
        // customers: "Müşteriler", // DUPLICATE REMOVED
        upload_button: "Yükle",
        uploading: "Yükleniyor...",
        upload_success: "Başarılı",
        upload_error: "Hata",

        // Mechanic Map
        book_specifics: "Randevu Al",

        // Create Customer Dialog
        add_customer_title: "Yeni Müşteri Ekle",
        vehicle_plate: "Araç Plakası",
        policy_number: "Poliçe Numarası",
        policy_type: "Poliçe Türü",
        policy_expiry: "Poliçe Bitiş Tarihi",
        create_customer_button: "Müşteri Oluştur",
        customer_created: "Müşteri başarıyla oluşturuldu!",
        customer_create_failed: "Müşteri oluşturulamadı",
        validation_email_phone: "Lütfen en az bir e-posta veya telefon numarası girin.",
        error_occurred: "Bir hata oluştu.",

        // Status & Actions
        inactive: "Pasif",
        delete_confirm: "Bu müşteriyi silmek istediğinizden emin misiniz?",
        delete_failed: "Müşteri silinemedi",
        update_failed: "Müşteri güncellenemedi",
        no_customers: "Müşteri bulunamadı.",
        edit_customer_title: "Müşteriyi Düzenle",

        // Activation & Errors
        activate_title: "Hesabı Etkinleştir",
        send_code_button: "Etkinleştirme Kodu Gönder",
        code_sent_to: "Kod gönderildi:",
        enter_code_label: "Kodu Girin",
        verify_code_button: "Kodu Doğrula",
        set_password_button: "Şifreyi Güncelle",
        back_to_login: "Girişe Dön",
        first_time_login: "İlk Kez mi Giriş Yapıyorsunuz? Hesabı Etkinleştir",
        err_invalid_credentials: "Geçersiz bilgiler. Lütfen bilgilerinizi kontrol edin.",
        err_login_failed: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
        err_send_code_failed: "Kod gönderilemedi",
        err_request_code_failed: "Kod isteği başarısız. Lütfen tekrar deneyin.",
        err_invalid_code: "Geçersiz kod",
        err_invalid_code_retry: "Geçersiz kod. Lütfen tekrar deneyin.",
        err_passwords_mismatch: "Şifreler eşleşmiyor",
        err_set_password_failed: "Şifre güncellenemedi",
        err_registration_failed: "Kayıt başarısız",
        err_something_went_wrong: "Bir şeyler yanlış gitti",
        success_password_set: "Şifre başarıyla güncellendi! Lütfen giriş yapın.",
        upload_failed_msg: "Yükleme başarısız",

        // Footer
        all_rights_reserved: "Tüm hakları saklıdır.",
    }
};
