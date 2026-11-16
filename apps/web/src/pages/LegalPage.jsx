import PageMeta from '@/components/PageMeta';
import { useLocale } from '@/i18n';
import './legal.css';

const email = 'aleflonpro@gmail.com';
const phone = '+33 6 28 55 25 68';
const address = '26 Lotissement les Chênes, 83580 Gassin, France';

const copy = {
  fr: {
    title: 'Mentions légales',
    description: 'Mentions légales et données personnelles du site antoineleflon.com.',
    eyebrow: 'Informations légales',
    updated: 'Dernière mise à jour : 23 octobre 2026',
    sections: [
      ['Éditeur', [
        'Antoine Leflon, entrepreneur individuel (micro-entreprise), nom commercial ATL Corporation.',
        'SIRET : 131 445 744 00017, immatriculé au Registre national des entreprises.',
        `Adresse : ${address}.`,
        `Contact : ${email}, ${phone}.`,
        'Directeur de la publication : Antoine Leflon.',
      ]],
      ['Hébergement', [
        'Le site est auto-hébergé par son éditeur, Antoine Leflon (ATL Corporation), sur son infrastructure ATL-Lab.',
        `Adresse : ${address}. Contact : ${email}.`,
      ]],
      ['Propriété intellectuelle', [
        'Les textes, visuels et logos de ce site appartiennent à Antoine Leflon, sauf mention contraire. Toute reproduction sans autorisation écrite est interdite. Les marques citées appartiennent à leurs propriétaires.',
      ]],
      ['Données personnelles', [
        'Ce site ne dépose aucun cookie et n’utilise aucun outil publicitaire ni de mesure d’audience. Il ne charge aucune ressource depuis un service tiers.',
        'Vos préférences de thème et de langue sont enregistrées dans votre navigateur (stockage local). Elles ne sont jamais transmises.',
        'Comme tout serveur web, le serveur enregistre des journaux techniques : adresse IP, date, page demandée, navigateur. Ils servent uniquement à la sécurité et au bon fonctionnement du site (intérêt légitime), sont supprimés automatiquement après une durée limitée et ne sont jamais partagés.',
        'Le site n’a pas de formulaire. Si vous m’écrivez par e-mail ou par WhatsApp, vos messages servent uniquement à vous répondre. Les liens vers LinkedIn, Malt, GitHub ou WhatsApp mènent à des services soumis à leurs propres politiques.',
        `Vous pouvez exercer vos droits d’accès, de rectification, d’effacement et d’opposition en écrivant à ${email}. Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr).`,
      ]],
    ],
  },
  en: {
    title: 'Legal notice',
    description: 'Legal notice and privacy information for antoineleflon.com.',
    eyebrow: 'Legal information',
    updated: 'Last updated: October 23, 2026',
    sections: [
      ['Publisher', [
        'Antoine Leflon, sole proprietor (French micro-entreprise), trading as ATL Corporation.',
        'SIRET: 131 445 744 00017, registered with the French National Business Register (RNE).',
        `Address: ${address}.`,
        `Contact: ${email}, ${phone}.`,
        'Publication director: Antoine Leflon.',
      ]],
      ['Hosting', [
        'The site is self-hosted by its publisher, Antoine Leflon (ATL Corporation), on the ATL-Lab infrastructure.',
        `Address: ${address}. Contact: ${email}.`,
      ]],
      ['Intellectual property', [
        'Texts, visuals and logos on this site belong to Antoine Leflon unless stated otherwise. Reproduction without written permission is prohibited. Cited trademarks belong to their owners.',
      ]],
      ['Personal data', [
        'This site sets no cookies and uses no advertising or audience measurement tools. It loads no resources from third-party services.',
        'Your theme and language preferences are saved in your browser (local storage). They are never transmitted.',
        'Like any web server, the server keeps technical logs: IP address, date, requested page, browser. They are used only for security and to keep the site running (legitimate interest), are deleted automatically after a limited period and are never shared.',
        'The site has no form. If you contact me by email or WhatsApp, your messages are used only to reply to you. Links to LinkedIn, Malt, GitHub or WhatsApp lead to services governed by their own policies.',
        `You can exercise your rights of access, rectification, erasure and objection by writing to ${email}. You may also lodge a complaint with the CNIL, the French data protection authority (cnil.fr).`,
      ]],
    ],
  },
};

export default function LegalPage() {
  const isFr = useLocale() === 'fr';
  const t = copy[isFr ? 'fr' : 'en'];
  return <>
    <PageMeta title={`${t.title} · Antoine Leflon`} description={t.description} alternatePath={isFr ? '/en/legal-notice' : '/fr/mentions-legales'} />
    <article className="legal-page container">
      <header><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p className="legal-page__updated">{t.updated}</p></header>
      {t.sections.map(([title, paragraphs]) => <section key={title}><h2>{title}</h2>{paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}
    </article>
  </>;
}
