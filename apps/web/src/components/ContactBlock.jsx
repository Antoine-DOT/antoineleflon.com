import { ArrowDown, ArrowRight, ArrowUpRight, BriefcaseBusiness, Download, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/i18n';
import './contact-block.css';

const email = 'aleflonpro@gmail.com';
const contacts = [
  { key: 'whatsapp', href: 'https://wa.me/33628552568', icon: MessageCircle, external: true, primary: true },
  { key: 'email', href: `mailto:${email}`, icon: Mail },
  { key: 'linkedin', href: 'https://www.linkedin.com/in/aleflon-cybersec/', icon: Linkedin, external: true },
  { key: 'github', href: 'https://github.com/Antoine-DOT', icon: Github, external: true },
  { key: 'malt', href: 'https://www.malt.fr/profile/antoineleflon1', icon: BriefcaseBusiness, external: true },
  { key: 'resume', href: '/Antoine_Leflon_RESUME2026.pdf', icon: Download, download: true },
];
const labels = {
  fr: { whatsapp: ['WhatsApp', 'Le plus rapide'], email: ['E-mail', email], linkedin: ['LinkedIn', 'Mon réseau pro'], github: ['GitHub', 'Mon code, en public'], malt: ['Malt', 'Missions freelance'], resume: ['CV', 'PDF, en anglais'] },
  en: { whatsapp: ['WhatsApp', 'The fastest way'], email: ['Email', email], linkedin: ['LinkedIn', 'My professional network'], github: ['GitHub', 'My public code'], malt: ['Malt', 'Freelance missions'], resume: ['Resume', 'PDF'] },
};

// Closing contact block shared by the home and career pages.
export default function ContactBlock({ title, text, business }) {
  const locale = useLocale() === 'fr' ? 'fr' : 'en';
  return <section className="contact-block">
    <span className="contact-block__orbit" aria-hidden="true" />
    <div className="container reveal">
      <h2>{title}</h2>
      <p>{text}</p>
      <div className="contact-block__actions">
        {contacts.map(({ key, href, icon: Icon, external, download, primary }) => {
          const [label, hint] = labels[locale][key];
          const Arrow = download ? ArrowDown : ArrowUpRight;
          return <a key={key} className={`contact-card${primary ? ' is-primary' : ''}`} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...(download ? { download: true } : {})}>
            <span className="contact-card__icon"><Icon aria-hidden="true" /><i aria-hidden="true" /></span>
            <span className="contact-card__text"><strong>{label}</strong><small>{primary && <b aria-hidden="true" />}{hint}</small></span>
            <Arrow className={`contact-card__arrow${download ? ' is-download' : ''}`} aria-hidden="true" />
          </a>;
        })}
      </div>
      {business && <Link className="contact-block__business" to={business.to}>{business.label}<ArrowRight aria-hidden="true" /></Link>}
    </div>
  </section>;
}
