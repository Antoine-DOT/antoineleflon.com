import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactBlock from '@/components/ContactBlock';
import PageMeta from '@/components/PageMeta';
import { useLocale } from '@/i18n';
import { careerContent, careerTimeline } from './career-content';
import './solar-pages.css';
import './career.css';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const numberPattern = /^(\d+)(.*)$/;

function CountUp({ value }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(() => value.replace(numberPattern, '0$2'));
  useEffect(() => {
    const match = numberPattern.exec(value);
    if (!match) return undefined;
    const target = Number(match[1]);
    if (reducedMotion() || !('IntersectionObserver' in window)) { setShown(value); return undefined; }
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const startedAt = performance.now();
      const tick = now => {
        const progress = Math.min((now - startedAt) / 1400, 1);
        setShown(`${Math.round(target * (1 - (1 - progress) ** 3))}${match[2]}`);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: .6 });
    observer.observe(ref.current);
    return () => { observer.disconnect(); if (frame) cancelAnimationFrame(frame); };
  }, [value]);
  return <span ref={ref}>{shown}</span>;
}

function useShortBars() {
  const plotRef = useRef(null);
  const [shortBars, setShortBars] = useState([]);
  useEffect(() => {
    const plot = plotRef.current;
    if (!plot) return undefined;
    // A label moves beside its bar only when it cannot fit inside it.
    const measure = () => setShortBars([...plot.querySelectorAll('.career-bar')]
      .filter(bar => bar.firstElementChild.offsetWidth + 14 > bar.clientWidth)
      .map(bar => bar.dataset.label));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(plot);
    return () => observer.disconnect();
  }, []);
  return [plotRef, shortBars];
}

function Timeline({ c }) {
  const [plotRef, shortBars] = useShortBars();
  const today = new Date();
  const now = [today.getFullYear(), today.getMonth() + 1];
  const { start } = careerTimeline;
  const end = now[0] > careerTimeline.end[0] ? [now[0], 12] : careerTimeline.end;
  const months = ([y, m]) => (y - start[0]) * 12 + (m - start[1]);
  const total = months(end);
  const pct = date => `${(Math.max(0, Math.min(months(date), total)) / total) * 100}%`;
  const years = Array.from({ length: end[0] - start[0] }, (_, i) => start[0] + 1 + i);
  return <figure className="career-timeline reveal" aria-label={c.timelineTitle}>
    <div className="career-timeline__plot" ref={plotRef}>
      {years.map(year => <span key={year} className={`career-timeline__year${year % 2 ? ' is-odd' : ''}`} style={{ left: pct([year, 1]) }}><b>{year}</b></span>)}
      <span className="career-timeline__now" style={{ left: pct(now) }}><b>{c.today}</b></span>
      {careerTimeline.lanes.map(lane => {
        const rows = Math.max(...lane.items.map(item => (item[3] ?? 0) + 1));
        return <div key={lane.key} className={`career-lane career-lane--${lane.key}`} style={{ '--rows': rows }}>
          <p>{c.lanes[lane.key]}</p>
          <div className="career-lane__track">
            {lane.items.map(([label, from, to, row = 0], index) => <span key={label} data-label={label} className={`career-bar${to ? '' : ' is-ongoing'}${shortBars.includes(label) ? ' is-short' : ''}`} style={{ left: pct(from), width: `calc(${pct(to ?? now)} - ${pct(from)})`, top: `calc(${row} * (var(--bar) + 6px))`, '--d': index }}><span>{label}</span></span>)}
          </div>
        </div>;
      })}
    </div>
  </figure>;
}

function useCareerProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (reducedMotion()) { element.style.setProperty('--progress', '1'); return undefined; }
    let frame;
    const update = () => {
      const rect = element.getBoundingClientRect();
      const progress = (window.innerHeight * .65 - rect.top) / rect.height;
      element.style.setProperty('--progress', Math.max(0, Math.min(progress, 1)).toFixed(3));
      frame = undefined;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return ref;
}

export default function CareerPage() {
  const isFr = useLocale() === 'fr';
  const c = isFr ? careerContent.fr : careerContent.en;
  const careerRef = useCareerProgress();

  return <div className="solar-page career-page">
    <PageMeta title={c.title} description={c.description} alternatePath={isFr ? '/en/experience' : '/fr/parcours'} />

    <header className="solar-page-intro career-intro container reveal">
      <div>
        <p className="solar-index">{c.index}</p>
        <h1>{isFr ? 'Parcours' : 'Experience'}<span>.</span></h1>
      </div>
      <p>{c.lead}</p>
      <i aria-hidden="true" />
    </header>

    <section className="career-figures container reveal" aria-label={isFr ? 'Chiffres clés' : 'Key figures'}>
      <dl>{c.figures.map(([value, label]) => <div key={label}><dt><CountUp value={value} /></dt><dd>{label}</dd></div>)}</dl>
    </section>

    <section className="career-section container" aria-labelledby="career-timeline-title">
      <header className="career-heading reveal">
        <p className="solar-index">{c.timelineIndex}</p>
        <h2 id="career-timeline-title">{c.timelineTitle}</h2>
      </header>
      <Timeline c={c} />
    </section>

    <section className="career-section container" aria-labelledby="career-experience-title">
      <header className="career-heading reveal">
        <p className="solar-index">{c.experienceIndex}</p>
        <h2 id="career-experience-title">{c.experienceTitle}</h2>
      </header>
      <div className="career-entries" ref={careerRef}>
        <div className="career-line" aria-hidden="true" />
        {c.entries.map((entry, index) => <article className={`career-entry career-entry--${index} reveal`} key={entry.company}>
          <div className="career-entry__when"><time>{entry.period}</time><span>{entry.duration}</span></div>
          <i className="career-entry__planet" aria-hidden="true" />
          <div className="career-entry__body">
            <p className="career-entry__place">{entry.place}</p>
            {entry.url
              ? <a className="career-entry__company" href={entry.url} target="_blank" rel="noopener noreferrer"><h3>{entry.company}</h3><ExternalLink aria-label={c.official} /></a>
              : <h3 className="career-entry__company">{entry.company}</h3>}
            <p className="career-entry__role">{entry.role}</p>
            <p className="career-entry__summary">{entry.summary}</p>
            <ul className="career-highlights">
              {entry.highlights.map(([key, text], h) => <li key={key} style={{ '--h': h }}><strong>{key}</strong><span>{text}</span></li>)}
            </ul>
            {entry.tools && <ul className="career-tools" aria-label={c.tools}>{entry.tools.map(tool => <li key={tool}>{tool}</li>)}</ul>}
            {entry.links && <div className="career-entry__links">{entry.links.map(([label, to]) => <Link className="solar-link" key={to} to={to}>{label}<ArrowRight size={15} aria-hidden="true" /></Link>)}</div>}
          </div>
        </article>)}
      </div>
    </section>

    <section className="career-section career-band" aria-labelledby="career-education-title">
      <div className="container">
        <header className="career-heading reveal">
          <p className="solar-index">{c.educationIndex}</p>
          <h2 id="career-education-title">{c.educationTitle}</h2>
        </header>
        <ol className="career-education">
          {c.education.map(item => <li className="reveal" key={item.degree}><time>{item.period}</time><h3>{item.degree}</h3><p>{item.school} · {item.place}</p>{item.thesis && <p className="career-education__thesis">{item.thesis}</p>}</li>)}
        </ol>
      </div>
    </section>

    <section className="career-section career-horizons" aria-labelledby="career-horizons-title">
      <div className="container">
        <header className="career-heading reveal">
          <p className="solar-index">{c.horizonsIndex}</p>
          <h2 id="career-horizons-title">{c.horizonsTitle}</h2>
          <p>{c.horizonsLead}</p>
        </header>
        <div className="career-places reveal">
          <svg className="career-places__arc" viewBox="0 0 1000 140" preserveAspectRatio="none" aria-hidden="true"><path d="M0 110 Q500 -60 1000 110" pathLength="1" /></svg>
          <ol>
            {c.places.map((place, index) => {
              const u = (index + .5) / c.places.length;
              return <li key={place.name} className={place.kind ? `is-${place.kind}` : ''} style={{ '--i': index, '--y': `${110 - 340 * u * (1 - u)}px` }}>
                <i aria-hidden="true" />
                <strong>{place.name}</strong>
                {place.note && <span>{place.note}</span>}
              </li>;
            })}
          </ol>
        </div>
      </div>
    </section>

    <section className="career-section container career-pair">
      <div className="reveal">
        <p className="solar-index">{c.certificationsIndex}</p>
        <ul className="career-certifications">{c.certifications.map(([name, field], index) => <li key={name} style={{ '--c': index }}><i aria-hidden="true" /><strong>{name}</strong><span>{field}</span></li>)}</ul>
      </div>
      <div className="reveal">
        <p className="solar-index">{c.languagesIndex}</p>
        <ul className="career-languages">
          {c.languages.map(([name, level, steps]) => <li key={name}>
            <div><strong>{name}</strong><span>{level}</span></div>
            <span className={`career-meter${steps ? '' : ' is-learning'}`} aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <i key={i} className={i < steps ? 'is-on' : ''} style={{ '--s': i }} />)}</span>
          </li>)}
        </ul>
      </div>
    </section>

    <section className="career-section career-band" aria-labelledby="career-skills-title">
      <div className="container">
        <header className="career-heading reveal">
          <p className="solar-index">{c.skillsIndex}</p>
          <h2 id="career-skills-title">{c.skillsTitle}</h2>
        </header>
        <div className="career-skills">
          {c.skills.map(([group, items]) => <article className="reveal" key={group}><h3>{group}</h3><ul>{items.map((item, i) => <li key={item} style={{ '--s': i }}>{item}</li>)}</ul></article>)}
        </div>
      </div>
    </section>

    <ContactBlock title={c.ctaTitle} text={c.ctaText} business={{ label: c.ctaBusiness, to: isFr ? '/atl' : '/en/atl' }} />
  </div>;
}
