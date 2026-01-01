"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from '@/components/LanguageToggle';

import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { API_URL } from '@/lib/api';

/**
 * @brief Landing page component.
 * @details Entry point of the application. Provides navigation to Admin and Customer portals.
 */
export default function Home() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-950 text-white relative">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text text-center">
        {t('landing_title')}
      </h1>
      <p className="text-xl mb-12 text-zinc-400 text-center max-w-2xl">
        {t('landing_subtitle')}
      </p>

      <div className="flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {!loading && (
          <>
            {(user?.is_admin || !user) && (
              <Link href="/admin">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                  {t('admin_portal')}
                </Button>
              </Link>
            )}
            {(user && !user.is_admin || !user) && (
              <Link href="/customer">
                <Button size="lg" variant="outline" className="text-white hover:text-black hover:bg-white border-zinc-700 px-8">
                  {t('customer_portal')}
                </Button>
              </Link>
            )}
          </>
        )}
      </div>

      <footer className="absolute bottom-8 text-zinc-600 text-sm">
        © {new Date().getFullYear()} Asfalya. {t('all_rights_reserved')}
      </footer>
    </main>
  );
}
