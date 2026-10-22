export const LANGUAGE_KEY = 'antoineleflon-language';

// nginx redirects /fr to /fr/ because the build emits fr/index.html, so routes
// must compare paths without the trailing slash.
export function normalizePath(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') || '/' : pathname;
}

export function localeFromPath(rawPathname) {
  const pathname = normalizePath(rawPathname);
  if (pathname === '/atl' || pathname.startsWith('/fr/') || pathname === '/fr') return 'fr';
  return 'en';
}

export function preferredLocale(storage, languages = []) {
  let saved;
  try { saved = storage?.getItem(LANGUAGE_KEY); } catch { saved = undefined; }
  if (saved === 'fr' || saved === 'en') return saved;
  return languages.some(language => language.toLowerCase().startsWith('fr')) ? 'fr' : 'en';
}

const routePairs = [['/fr','/en'],['/fr/projets','/en/projects'],['/fr/parcours','/en/experience'],['/fr/projets/atl-lab','/en/projects/atl-lab']];

export function localizedPath(rawPathname, locale) {
  const pathname = normalizePath(rawPathname);
  const pair = routePairs.find(paths => paths.includes(pathname));
  if (pair) return pair[locale === 'fr' ? 0 : 1];
  if (pathname === '/atl') return locale === 'fr' ? '/atl' : '/en/atl';
  if (pathname === '/fr/atl' || pathname === '/en/atl') return locale === 'fr' ? '/atl' : '/en/atl';
  if (pathname === '/projects') return locale === 'fr' ? '/fr/projets' : '/en/projects';
  if (pathname === '/experience') return locale === 'fr' ? '/fr/parcours' : '/en/experience';
  return locale === 'fr' ? '/fr' : '/en';
}
