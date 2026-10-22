import { useLocation } from 'react-router-dom';
import { en, fr } from '@/content';
import { localeFromPath } from '@/language-routing';

export { LANGUAGE_KEY, localizedPath, localeFromPath, normalizePath, preferredLocale } from '@/language-routing';

export function useLocale() {
  return localeFromPath(useLocation().pathname);
}

export function useLocalizedContent() {
  return useLocale() === 'fr' ? fr : en;
}
