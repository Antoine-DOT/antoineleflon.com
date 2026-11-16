import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BriefcaseBusiness, Download, Github, Linkedin, Mail, Menu, MessageCircle, Moon, Sun, X } from 'lucide-react';
import BrandMark from '@/components/BrandMark';
import { LANGUAGE_KEY, localizedPath, normalizePath, useLocale, useLocalizedContent } from '@/i18n';

export default function SiteLayout() {
  const t = useLocalizedContent();
  const locale = useLocale();
  const location = useLocation(); const [open, setOpen] = useState(false);
  const pathname = normalizePath(location.pathname);
  const isSolarPage = ['/fr', '/en', '/fr/projets', '/en/projects', '/fr/parcours', '/en/experience', '/atl', '/fr/atl', '/en/atl', '/fr/projets/atl-lab', '/en/projects/atl-lab'].includes(pathname.toLowerCase());
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  const base = `/${locale}`;
  const items = [[base, t.nav.home], [locale === 'fr' ? '/fr/projets' : '/en/projects', t.nav.projects], [locale === 'fr' ? '/fr/parcours' : '/en/experience', t.nav.experience], [locale === 'fr' ? '/atl' : '/en/atl', 'ATL']];
  useEffect(() => {
    setOpen(false); window.scrollTo(0, 0);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = [...document.querySelectorAll('.reveal')];
    if (reduced) { elements.forEach(element => element.classList.add('is-visible')); return undefined; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .12 });
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [location.pathname]);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;
    let frame;
    const move = () => { document.documentElement.style.setProperty('--scroll-shift', `${Math.min(window.scrollY * .035, 26)}px`); frame = undefined; };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(move); };
    window.addEventListener('scroll', onScroll, { passive: true }); move();
    return () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next; document.documentElement.style.colorScheme = next;
    localStorage.setItem('theme', next); setTheme(next);
  };
  const chooseLanguage = next => {
    try { localStorage.setItem(LANGUAGE_KEY, next); } catch { /* Continue without persistence when storage is unavailable. */ }
    window.location.assign(localizedPath(location.pathname, next));
  };
  const shellClass = `site-shell${isSolarPage ? ' solar-shell' : ''}`;
  return <div className={shellClass}><a className="skip-link" href="#main">{locale === 'fr' ? 'Aller au contenu' : 'Skip to content'}</a>
    <header className={`site-header${isSolarPage ? ' solar-header' : ''}`}><div className="container nav-row">
      <Link to={base} className="brand" aria-label={`${t.nav.home}, Antoine Leflon`}><BrandMark /><span>Antoine Leflon</span></Link>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? (locale === 'fr' ? 'Fermer le menu' : 'Close menu') : (locale === 'fr' ? 'Ouvrir le menu' : 'Open menu')}>{open ? <X /> : <Menu />}</button>
      <nav id="main-navigation" aria-label={locale === 'fr' ? 'Navigation principale' : 'Primary navigation'} className={open ? 'nav-links open' : 'nav-links'}>
        {items.map(([path, label]) => <NavLink key={path} end={path === base} to={path}>{label}</NavLink>)}
        <span className="language-switch" role="group" aria-label={locale === 'fr' ? 'Choisir la langue' : 'Choose language'}><button type="button" className={locale === 'fr' ? 'active' : ''} onClick={() => chooseLanguage('fr')} aria-pressed={locale === 'fr'}>FR</button><i>/</i><button type="button" className={locale === 'en' ? 'active' : ''} onClick={() => chooseLanguage('en')} aria-pressed={locale === 'en'}>EN</button></span>
        <button className="theme-button" onClick={toggleTheme} aria-label={t.ui.theme} title={t.ui.theme}>{theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}<span className="sr-only">{theme === 'dark' ? t.ui.light : t.ui.dark}</span></button>
      </nav>
    </div></header><main id="main"><Outlet /></main>
    <footer className={`site-footer${isSolarPage ? ' solar-footer' : ''}`}><div className="container footer-row"><div className="footer-identity"><strong>Antoine Leflon</strong><p>{t.footer} <Link to={locale === 'fr' ? '/fr/projets/atl-lab' : '/en/projects/atl-lab'}>{locale === 'fr' ? 'Hébergé sur ATL-Lab' : 'Hosted on ATL-Lab'}</Link></p></div><nav aria-label={t.ui.social}><a href="https://www.linkedin.com/in/aleflon-cybersec/" target="_blank" rel="noopener noreferrer"><Linkedin size={15}/>LinkedIn</a><a href="https://github.com/Antoine-DOT" target="_blank" rel="noopener noreferrer"><Github size={15}/>GitHub</a><a href="https://www.malt.fr/profile/antoineleflon1" target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={15}/>Malt</a><a href="mailto:aleflonpro@gmail.com"><Mail size={15}/>{locale === 'fr' ? 'E-mail' : 'Email'}</a><a href="https://wa.me/33628552568" target="_blank" rel="noopener noreferrer"><MessageCircle size={15}/>WhatsApp</a><a href="/Antoine_Leflon_RESUME2026.pdf"><Download size={15}/>{t.nav.resume}</a></nav><small>© 2026 Antoine Leflon · <Link to={locale === 'fr' ? '/fr/mentions-legales' : '/en/legal-notice'}>{locale === 'fr' ? 'Mentions légales' : 'Legal notice'}</Link></small></div></footer>
  </div>;
}
