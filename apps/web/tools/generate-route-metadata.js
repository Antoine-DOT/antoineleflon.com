import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '../../../dist/apps/web');
const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
const origin = 'https://antoineleflon.com';
const defaultImages = {
  fr: { src: `${origin}/og-antoine-leflon-fr.jpg`, width: 1200, height: 630 },
  en: { src: `${origin}/og-antoine-leflon-en.jpg`, width: 1200, height: 630 },
};

const routes = [
  { path: '/fr', language: 'fr', title: 'Antoine Leflon — Cybersécurité, infrastructure & automatisation', description: 'Le site personnel et professionnel d’Antoine Leflon : cybersécurité, infrastructure, gestion de projet et réalisations techniques.', alternate: '/en' },
  { path: '/en', language: 'en', title: 'Antoine Leflon — Cybersecurity, Infrastructure & Automation', description: 'Personal and professional website of Antoine Leflon: cybersecurity, infrastructure, project management and technical projects.', alternate: '/fr' },
  { path: '/fr/projets', language: 'fr', title: 'Projets · Antoine Leflon', description: 'Une sélection de projets d’infrastructure et de développement réalisés par Antoine Leflon.', alternate: '/en/projects' },
  { path: '/en/projects', language: 'en', title: 'Projects · Antoine Leflon', description: 'Selected infrastructure, software and technical projects by Antoine Leflon.', alternate: '/fr/projets' },
  { path: '/fr/parcours', language: 'fr', title: 'Parcours · Antoine Leflon', description: 'Parcours d’Antoine Leflon : support IT en milieu industriel, cybersécurité et gouvernance en grand groupe, puis activité indépendante avec ATL Corporation.', alternate: '/en/experience' },
  { path: '/en/experience', language: 'en', title: 'Experience · Antoine Leflon', description: 'Antoine Leflon’s experience: IT support in heavy industry, cybersecurity and governance in a large group, then independent work with ATL Corporation.', alternate: '/fr/parcours' },
  { path: '/fr/projets/atl-lab', language: 'fr', title: 'ATL-Lab · Antoine Leflon', description: 'ATL-Lab, l’infrastructure personnelle d’Antoine Leflon : un serveur Proxmox segmenté, supervisé et déployé comme en entreprise. Ce site tourne dessus.', alternate: '/en/projects/atl-lab' },
  { path: '/en/projects/atl-lab', language: 'en', title: 'ATL-Lab · Antoine Leflon', description: 'ATL-Lab, Antoine Leflon’s personal infrastructure: a Proxmox server segmented, monitored and deployed like an enterprise system. This website runs on it.', alternate: '/fr/projets/atl-lab' },
  { path: '/fr/projets/malun', language: 'fr', title: 'Malun · Antoine Leflon', description: 'Malun, l’app iPhone d’Antoine Leflon pour apprendre le mandarin et préparer le TOCFL et le HSK : répétition espacée, quiz et thèmes.', alternate: '/en/projects/malun' },
  { path: '/en/projects/malun', language: 'en', title: 'Malun · Antoine Leflon', description: 'Malun, Antoine Leflon’s iPhone app to learn Mandarin and prepare the TOCFL and the HSK: spaced repetition, quizzes and topics.', alternate: '/fr/projets/malun' },
  { path: '/atl', language: 'fr', title: 'ATL Corporation · Informatique pour TPE et PME, missions cybersécurité en freelance', description: 'Automatisation, IA, site internet et cybersécurité pour les TPE et PME. Missions longues en freelance (GRC, NIS2, gestion des vulnérabilités) pour les grands groupes et les ESN.', alternate: '/en/atl', image: { src: `${origin}/og-atl-fr-1200.jpg`, width: 1200, height: 630, alt: 'ATL Corporation · Services informatiques' } },
  { path: '/en/atl', language: 'en', title: 'ATL Corporation · IT for small businesses, freelance cybersecurity missions', description: 'Automation, AI, websites and cybersecurity for small businesses. Long freelance missions (GRC, NIS2, vulnerability management) for large groups and IT consultancies.', alternate: '/atl', image: { src: `${origin}/og-atl-en-1200.jpg`, width: 1200, height: 630, alt: 'ATL Corporation · IT services' } },
];

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const replaceMeta = (html, attribute, key, value) => html.replace(new RegExp(`<meta data-react-helmet="true" ${attribute}="${key}" content="[^"]*" \\/>`), `<meta data-react-helmet="true" ${attribute}="${key}" content="${escape(value)}" />`);

function render(route) {
  const canonical = `${origin}${route.path}`;
  const altLanguage = route.language === 'fr' ? 'en' : 'fr';
  const image = route.image || defaultImages[route.language];
  const imageAlt = image.alt || (route.language === 'fr'
    ? 'Antoine Leflon — cybersécurité, infrastructure et automatisation'
    : 'Antoine Leflon — cybersecurity, infrastructure and automation');
  let html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${route.language}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(/<link data-react-helmet="true" rel="canonical" href="[^"]*" \/>/, `<link data-react-helmet="true" rel="canonical" href="${canonical}" />`);
  html = replaceMeta(html, 'name', 'description', route.description);
  html = replaceMeta(html, 'property', 'og:title', route.title);
  html = replaceMeta(html, 'property', 'og:description', route.description);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'property', 'og:locale', route.language === 'fr' ? 'fr_FR' : 'en_US');
  html = replaceMeta(html, 'property', 'og:image', image.src);
  html = replaceMeta(html, 'property', 'og:image:width', String(image.width));
  html = replaceMeta(html, 'property', 'og:image:height', String(image.height));
  html = replaceMeta(html, 'property', 'og:image:alt', imageAlt);
  html = replaceMeta(html, 'name', 'twitter:title', route.title);
  html = replaceMeta(html, 'name', 'twitter:description', route.description);
  html = replaceMeta(html, 'name', 'twitter:image', image.src);
  return html.replace('</head>', `\t\t<link rel="alternate" hreflang="${route.language}" href="${canonical}" />\n\t\t<link rel="alternate" hreflang="${altLanguage}" href="${origin}${route.alternate}" />\n\t\t<link rel="alternate" hreflang="x-default" href="${origin}/en" />\n\t</head>`);
}

for (const route of routes) {
  const output = resolve(dist, route.path.slice(1), 'index.html');
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, render(route));
}

writeFileSync(resolve(dist, 'index.html'), render(routes[1]));
