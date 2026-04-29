"use client";

import Link from 'next/link';
import { useTranslation } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Locale, languageNames, locales } from '../../../i18n/config';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { dictionary, language, setLanguage, isPending } = useTranslation();
  const { user, isLoading: isAuthLoading, signOut } = useAuth();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
              <span className="material-icons text-white text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark">
              LuxeEstate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1">
              {dictionary.navbar.buy}
            </a>
            <a href="#" className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all">
              {dictionary.navbar.rent}
            </a>
            <a href="#" className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all">
              {dictionary.navbar.sell}
            </a>
            <a href="#" className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all">
              {dictionary.navbar.saved_homes}
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 md:space-x-6">
            
            {/* Language Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                disabled={isPending}
                className="flex items-center gap-1 text-nordic-dark hover:text-mosque transition-colors font-medium text-sm"
              >
                <span className="material-icons text-[18px]">language</span>
                <span className="uppercase">{languageNames[language as Locale].split(' ')[0]} {language}</span>
                <span className="material-icons text-[18px]">{isLangOpen ? 'expand_less' : 'expand_more'}</span>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-nordic-dark/10 py-1 overflow-hidden z-50">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLanguage(loc);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-mosque/5 transition-colors ${
                        language === loc ? 'text-mosque font-medium bg-mosque/5' : 'text-nordic-dark'
                      }`}
                    >
                      {languageNames[loc]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="text-nordic-dark hover:text-mosque transition-colors">
              <span className="material-icons">search</span>
            </button>
            <button className="text-nordic-dark hover:text-mosque transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light"></span>
            </button>
            {isAuthLoading ? (
              <div className="w-9 h-9 ml-2 rounded-full bg-gray-200 animate-pulse border-l border-nordic-dark/10 pl-2 box-content"></div>
            ) : user ? (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-nordic-dark/10">
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent">
                  <img
                    alt="Profile"
                    className="w-full h-full object-cover"
                    src={user.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=" + (user.email || "User")}
                  />
                </div>
                <button
                  onClick={signOut}
                  className="text-nordic-dark/70 hover:text-red-500 transition-colors flex items-center"
                  title={dictionary.navbar.sign_out}
                >
                  <span className="material-icons">logout</span>
                </button>
              </div>
            ) : (
              <Link href="/login" className="ml-2 pl-4 border-l border-nordic-dark/10 text-nordic-dark hover:text-mosque font-medium text-sm transition-colors">
                {dictionary.navbar.log_in}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Placeholder - hidden by default */}
      <div className="md:hidden border-t border-nordic-dark/5 bg-background-light overflow-hidden h-0 transition-all duration-300">
        <div className="px-4 py-2 space-y-1">
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10">{dictionary.navbar.buy}</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5">{dictionary.navbar.rent}</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5">{dictionary.navbar.sell}</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5">{dictionary.navbar.saved_homes}</a>
        </div>
      </div>
    </nav>
  );
}
