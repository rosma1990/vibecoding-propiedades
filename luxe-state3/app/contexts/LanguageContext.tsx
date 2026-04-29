'use client';

import React, { createContext, useContext, useState, ReactNode, useTransition } from 'react';
import { Locale } from '../../i18n/config';
import { setLanguage as setLanguageAction } from '../actions/language';
import { useRouter } from 'next/navigation';

type Dictionary = any; // We can type this better later if needed, but 'any' is flexible for JSON

interface LanguageContextType {
  language: Locale;
  dictionary: Dictionary;
  setLanguage: (lang: Locale) => void;
  isPending: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLanguage,
  initialDictionary,
}: {
  children: ReactNode;
  initialLanguage: Locale;
  initialDictionary: Dictionary;
}) {
  const [language, setLanguageState] = useState<Locale>(initialLanguage);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const setLanguage = (lang: Locale) => {
    setLanguageState(lang);
    startTransition(() => {
      setLanguageAction(lang).then(() => {
        router.refresh();
      });
    });
  };

  return (
    <LanguageContext.Provider value={{ language, dictionary: initialDictionary, setLanguage, isPending }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
