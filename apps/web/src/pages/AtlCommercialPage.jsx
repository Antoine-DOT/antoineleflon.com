import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Bot, BriefcaseBusiness, Check, Download, Globe2, Mail, MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import PageMeta from '@/components/PageMeta';
import { useLocale } from '@/i18n';
import { atlContent } from './atl-content';
import './solar-pages.css';

const phone = '+33628552568';
const phoneLabel = '+33 6 28 55 25 68';
const email = 'aleflonpro@gmail.com';
const malt = 'https://www.malt.fr/profile/antoineleflon1';
const resume = '/Antoine_Leflon_RESUME2026.pdf';
const icons = [Zap, ShieldCheck, Globe2, Bot];

export default function AtlCommercialPage() {
  const isFr = useLocale() === 'fr';
  const c = isFr ? atlContent.fr : atlContent.en;
  const whatsapp = `https://wa.me/${phone.slice(1)}?text=${encodeURIComponent(c.whatsappMessage)}`;
  const heroActions = useRef(null);
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const target = heroActions.current;
    if (!target || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return <div className="atl-page solar-page atl-orbit-page">
    <PageMeta title={c.title} description={c.description} alternatePath={isFr ? '/en/atl' : '/atl'} image={{ src: `https://antoineleflon.com/og-atl-${isFr ? 'fr' : 'en'}.jpg`, width: 1800, height: 945 }} imageAlt={c.brand} />

    <section className="atl-hero atl-solar-hero">
      <div className="container">
        <header className="atl-brand reveal" aria-label="ATL Corporation">
          <span className="atl-brand-subtitle">{c.brand}</span>
        </header>
        <div className="atl-hero-copy reveal">
          <h1 className="atl-hero-title">{c.heroTitle[0]}<em>{c.heroTitle[1]}</em></h1>
          <p className="atl-hero-intro">{c.heroLead}</p>
          <div className="atl-actions" ref={heroActions}>
            <a className="atl-button atl-button--primary" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />{c.whatsappCta}</a>
            <a className="atl-button" href={`mailto:${email}`}><Mail aria-hidden="true" />{c.emailCta}</a>
          </div>
          <ul className="atl-reassurance">{c.reassurance.map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
          <a className="atl-missions-teaser" href="#missions">{c.missionsTeaser}<ArrowRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="atl-solar-object" aria-hidden="true"><div className="atl-solar-disc"/><div className="atl-solar-arc"/><i/></div>
      </div>
    </section>

    <section className="atl-pains container" aria-labelledby="atl-pains-title">
      <header className="atl-section-heading reveal">
        <p className="eyebrow">{c.painsEyebrow}</p>
        <h2 id="atl-pains-title">{c.painsTitle}</h2>
      </header>
      <ul className="atl-pain-list">{c.pains.map((pain, index) => <li className="reveal" key={pain} style={{ '--i': index }}>{pain}</li>)}</ul>
      <p className="atl-pains-answer reveal">{c.painsAnswer}</p>
    </section>

    <section className="atl-services container" aria-labelledby="atl-services-title">
      <header className="atl-section-heading reveal">
        <p className="eyebrow">{c.servicesEyebrow}</p>
        <h2 id="atl-services-title">{c.servicesTitle}</h2>
      </header>
      <div className="atl-service-grid atl-service-quadrants">
        {c.services.map(([title, promise, examples], index) => {const Icon = icons[index]; return <article className="atl-service-card reveal" key={title} style={{ '--i': index }}>
          <div className="atl-service-label"><span>0{index + 1}</span><Icon aria-hidden="true" /></div>
          <h3>{title}</h3>
          <strong>{promise}</strong>
          <div className="atl-examples"><small>{c.examplesLabel}</small><ul>{examples.map((example, j) => <li key={example} style={{ '--j': j }}>{example}</li>)}</ul></div>
        </article>;})}
      </div>
    </section>

    <section className="atl-steps container" aria-labelledby="atl-steps-title">
      <header className="atl-section-heading reveal">
        <p className="eyebrow">{c.stepsEyebrow}</p>
        <h2 id="atl-steps-title">{c.stepsTitle}</h2>
      </header>
      <ol className="atl-step-list">{c.steps.map(([title, text], index) => <li className="reveal" key={title} style={{ '--i': index }}><span>{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
    </section>

    <section className="atl-missions" id="missions" aria-labelledby="atl-missions-title">
      <div className="container">
        <div className="atl-missions-intro reveal">
          <div>
            <p className="eyebrow">{c.missionsEyebrow}</p>
            <svg className="atl-missions-map" viewBox="0 0 240 220" aria-hidden="true">
              <g className="atl-missions-globe"><circle cx="120" cy="120" r="78" /><ellipse cx="120" cy="120" rx="34" ry="78" /><ellipse cx="120" cy="120" rx="78" ry="26" /></g>
              <circle className="atl-missions-orbit" cx="120" cy="120" r="98" />
              <path className="atl-missions-route" d="M70 104 Q 128 8 182 132" />
              <path className="atl-missions-comet" d="M70 104 Q 128 8 182 132" pathLength="100" />
              <circle className="atl-missions-city" cx="70" cy="104" r="4" /><circle className="atl-missions-city atl-missions-city--far" cx="182" cy="132" r="4" />
              <text x="70" y="126" textAnchor="middle">{c.missionsMap[0]}</text><text x="182" y="154" textAnchor="middle">{c.missionsMap[1]}</text>
            </svg>
          </div>
          <div>
            <h2 id="atl-missions-title">{c.missionsTitle}</h2>
            <p className="atl-missions-lead">{c.missionsLead}</p>
          </div>
        </div>
        <ul className="atl-missions-list">{c.missionsDomains.map(([title, text], index) => <li className="reveal" key={title} style={{ '--i': index }}><h3>{title}</h3><p>{text}</p></li>)}</ul>
        <div className="atl-actions reveal">
          <a className="atl-button atl-button--primary" href={malt} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness aria-hidden="true" />{c.missionsMalt}</a>
          <a className="atl-button" href={resume} download><Download aria-hidden="true" />{c.missionsCv}</a>
          <a className="atl-button" href={`mailto:${email}?subject=${encodeURIComponent(c.missionsEmailSubject)}`}><Mail aria-hidden="true" />{c.missionsEmail}</a>
        </div>
      </div>
    </section>

    <section className="atl-trust container reveal" aria-labelledby="atl-trust-title">
      <div className="atl-trust-heading">
        <p className="eyebrow">{c.trustEyebrow}</p>
        <h2 id="atl-trust-title">{c.trustTitle}</h2>
        <div className="atl-trust-orbit"><img className="atl-trust-photo" src="/photoAntoine.jpg" alt={c.photoAlt} width="719" height="662" loading="lazy" /><span aria-hidden="true" /></div>
      </div>
      <div className="atl-trust-copy">
        {c.trustText.map(text => <p key={text}>{text}</p>)}
        <a className="text-link" href={isFr ? '/fr/parcours' : '/en/experience'}>{c.background}<ArrowRight size={17} /></a>
      </div>
    </section>

    <section className="atl-contact" id="contact">
      <div className="container reveal">
        <div className="atl-contact-heading">
          <p className="eyebrow">{c.contactEyebrow}</p>
          <h2>{c.contactTitle}</h2>
          <p>{c.contactText}</p>
        </div>
        <div className="atl-contact-links">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" /><span><small>{c.whatsappLabel}</small><strong>{phoneLabel}</strong></span></a>
          <a href={`mailto:${email}`}><Mail aria-hidden="true" /><span><small>{c.emailLabel}</small><strong>{email}</strong></span></a>
          <a href={malt} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness aria-hidden="true" /><span><small>{c.maltLabel}</small><strong>Malt</strong></span></a>
        </div>
      </div>
    </section>

    <nav className={`atl-sticky-cta${showSticky ? ' is-visible' : ''}`} aria-label={isFr ? 'Contacter Antoine' : 'Contact Antoine'}>
      <a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />{c.stickyWhatsapp}</a>
      <a href={`mailto:${email}`}><Mail aria-hidden="true" />{c.stickyEmail}</a>
    </nav>
  </div>;
}
