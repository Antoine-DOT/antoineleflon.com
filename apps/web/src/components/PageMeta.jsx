import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const defaultImage = { src: 'https://antoineleflon.com/og-antoine-leflon-2026.png', width: 1731, height: 909 };

export default function PageMeta({ title, description, noindex=false, locale, alternatePath, image=defaultImage, imageAlt }) {
  const location = useLocation();
  const language = locale || (location.pathname === '/atl' || location.pathname === '/fr' || location.pathname.startsWith('/fr/') ? 'fr' : 'en');
  const canonical = `https://antoineleflon.com${location.pathname.replace(/\/$/, '') || '/'}`;
  const alternate = alternatePath && `https://antoineleflon.com${alternatePath}`;
  return <Helmet htmlAttributes={{ lang:language }}><title>{title}</title><meta name="description" content={description} />{noindex&&<meta name="robots" content="noindex, follow" />}
    <link rel="canonical" href={canonical} />
    {alternate&&<link rel="alternate" hrefLang={language === 'fr' ? 'en' : 'fr'} href={alternate} />}{alternate&&<link rel="alternate" hrefLang={language} href={canonical} />}{alternate&&<link rel="alternate" hrefLang="x-default" href="https://antoineleflon.com/en" />}
    <meta property="og:type" content="website" /><meta property="og:title" content={title} /><meta property="og:description" content={description} /><meta property="og:url" content={canonical} /><meta property="og:locale" content={language === 'fr' ? 'fr_FR' : 'en_US'} /><meta property="og:site_name" content="Antoine Leflon" /><meta property="og:image" content={image.src} /><meta property="og:image:width" content={String(image.width)} /><meta property="og:image:height" content={String(image.height)} /><meta property="og:image:alt" content={imageAlt || (language === 'fr' ? 'Antoine Leflon — cybersécurité, infrastructure et automatisation' : 'Antoine Leflon — cybersecurity, infrastructure and automation')} />
    <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={title} /><meta name="twitter:description" content={description} /><meta name="twitter:image" content={image.src} />
  </Helmet>;
}
