import 'server-only';
import { Locale, defaultLocale, locales } from '../i18n/config';

const dictionaries = {
  en: () => import('../i18n/dictionaries/en.json').then((module) => module.default),
  es: () => import('../i18n/dictionaries/es.json').then((module) => module.default),
  fr: () => import('../i18n/dictionaries/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  const selectedLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
  return dictionaries[selectedLocale]();
};
