import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactBlock from '@/components/ContactBlock';
import PageMeta from '@/components/PageMeta';
import { useLocale, useLocalizedContent } from '@/i18n';
import { homeContent } from './home-content';
import './solar-pages.css';
import './home.css';

function DoorVisual({ kind }) {
  if (kind === 'career') return <div className="landing-door__visual landing-door__visual--career" aria-hidden="true">
    <span style={{ '--l': '4%', '--w': '30%', '--d': 0 }} /><span style={{ '--l': '36%', '--w': '42%', '--d': 1 }} /><span className="is-now" style={{ '--l': '84%', '--w': '12%', '--d': 2 }} />
    <span className="is-study" style={{ '--l': '4%', '--w': '28%', '--d': 1 }} /><span className="is-study" style={{ '--l': '36%', '--w': '42%', '--d': 2 }} />
    <i />
  </div>;
  if (kind === 'projects') return <div className="landing-door__visual landing-door__visual--projects" aria-hidden="true">
    <span className="landing-door__orbit" /><span className="landing-door__sun" /><span className="landing-door__tile">學</span>
  </div>;
  return <div className="landing-door__visual landing-door__visual--atl" aria-hidden="true">
    <span className="landing-door__horizon" /><img src="/atl-logo-v9.svg" alt="" />
  </div>;
}

export default function HomePage() {
  const isFr = useLocale() === 'fr';
  const c = isFr ? homeContent.fr : homeContent.en;
  const t = useLocalizedContent();

  return <div className="solar-page landing-page">
    <PageMeta title={c.title} description={t.home.description} alternatePath={isFr ? '/en' : '/fr'} />

    <header className="landing-hero container">
      <div className="landing-hero__copy reveal">
        <p className="landing-hero__overline">{c.index}</p>
        <h1>Antoine <span>Leflon</span></h1>
        <div className="landing-hero__intro">
          <p className="landing-hero__lead">{c.lead[0]}<em>{c.lead[1]}</em></p>
          <p className="landing-hero__status"><i aria-hidden="true" />{c.status}</p>
          <div className="landing-hero__actions">
            <Link className="landing-button landing-button--primary" to={c.primary[1]}>{c.primary[0]}<ArrowRight aria-hidden="true" /></Link>
            <Link className="landing-button" to={c.secondary[1]}>{c.secondary[0]}<ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
      <div className="landing-portrait reveal">
        <svg className="landing-portrait__orbit" viewBox="0 0 100 100" aria-hidden="true"><path d="M8 58 A74 19 0 0 1 156 58" transform="rotate(-14 82 58)" /></svg>
        <span className="landing-portrait__sun" aria-hidden="true" />
        <svg className="landing-portrait__orbit is-front" viewBox="0 0 100 100" aria-hidden="true"><g transform="rotate(-14 82 58)"><path d="M8 58 A74 19 0 0 0 156 58" /><circle r="1.5"><animateMotion dur="18s" repeatCount="indefinite" path="M156 58 A74 19 0 1 1 8 58 A74 19 0 1 1 156 58" /></circle></g></svg>
        <span className="landing-portrait__photo"><img src="/photoAntoine.jpg" alt={c.photoAlt} width="719" height="662" /></span>
      </div>
    </header>

    <section className="landing-doors container" aria-labelledby="landing-doors-title">
      <header className="landing-heading reveal">
        <p className="solar-index">{c.doorsIndex}</p>
        <h2 id="landing-doors-title">{c.doorsTitle}</h2>
      </header>
      <div className="landing-doors__grid">
        {c.doors.map((door, index) => <Link key={door.key} className={`landing-door landing-door--${door.key} reveal`} to={door.to} style={{ '--i': index }}>
          <DoorVisual kind={door.key} />
          <div className="landing-door__body">
            <span className="landing-door__index">0{index + 1}</span>
            <h3>{door.title}</h3>
            <p>{door.text}</p>
            <span className="landing-door__cta">{door.cta}<ArrowRight aria-hidden="true" /></span>
          </div>
        </Link>)}
      </div>
    </section>

    <ContactBlock title={c.contactTitle} text={c.contactText} />
  </div>;
}
