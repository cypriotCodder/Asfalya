"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations['en']) => string;
}

/**
 * @brief Context for managing application language state.
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * @brief Provider component for the LanguageContext.
 * @details Wraps the application to provide translation capabilities.
 * 
 * @param children Child components that will have access to the language context.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('tr');

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('asfalya-lang') as Language;
        if (saved && (saved === 'en' || saved === 'tr')) {
            setLanguage(saved);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('asfalya-lang', lang);
    };

    const t = (key: keyof typeof translations['en']) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
