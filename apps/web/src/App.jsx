import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import SiteLayout from '@/components/SiteLayout';
import AtlCommercialPage from '@/pages/AtlCommercialPage';
import HomePage from '@/pages/HomePage';
import LegalPage from '@/pages/LegalPage';
import AtlLabPage from '@/pages/AtlLabPage';
import CareerPage from '@/pages/CareerPage';
import { HanziPage, NotFoundPage, ProjectsPage } from '@/pages/SitePages';
import { preferredLocale } from '@/i18n';

function LanguageEntry() {
  let storage;
  try { storage = window.localStorage; } catch { storage = undefined; }
  const locale = preferredLocale(storage, navigator.languages || [navigator.language]);
  return <Navigate to={`/${locale}`} replace />;
}

function LegacyLabRoute() {
  let storage;
  try { storage = window.localStorage; } catch { storage = undefined; }
  const locale = preferredLocale(storage, navigator.languages || [navigator.language]);
  return <Navigate to={locale === 'fr' ? '/fr/projets/atl-lab' : '/en/projects/atl-lab'} replace />;
}

function AtlRoute() {
  const { pathname, search, hash } = useLocation();
  if (pathname !== '/atl') return <Navigate to={`/atl${search}${hash}`} replace />;
  return <AtlCommercialPage />;
}

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<LanguageEntry />} />
    <Route element={<SiteLayout />}>
      <Route path="fr" element={<HomePage />} /><Route path="en" element={<HomePage />} />
      <Route path="fr/projets" element={<ProjectsPage />} /><Route path="en/projects" element={<ProjectsPage />} />
      <Route path="fr/parcours" element={<CareerPage />} /><Route path="en/experience" element={<CareerPage />} />
      <Route path="fr/atl" element={<Navigate to="/atl" replace />} /><Route path="en/atl" element={<AtlCommercialPage />} />
      <Route path="projects" element={<Navigate to="/en/projects" replace />} /><Route path="experience" element={<Navigate to="/en/experience" replace />} />
      <Route path="about" element={<Navigate to="/en" replace />} /><Route path="skills" element={<Navigate to="/en/experience" replace />} />
      <Route path="fr/projets/atl-lab" element={<AtlLabPage />} /><Route path="en/projects/atl-lab" element={<AtlLabPage />} />
      <Route path="projects/atl-lab" element={<LegacyLabRoute />} />
      <Route path="fr/mentions-legales" element={<LegalPage />} /><Route path="en/legal-notice" element={<LegalPage />} />
      <Route path="projects/malun" element={<HanziPage />} />
      <Route path="projects/hanzi-learning-app" element={<Navigate to="/projects/malun" replace />} />
      <Route path="atl" caseSensitive={false} element={<AtlRoute />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes></BrowserRouter>;
}
