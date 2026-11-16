import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageMeta from '@/components/PageMeta';
import { useLocale } from '@/i18n';
import { malunContent } from './malun-content';
import './solar-pages.css';
import './atl-lab.css';
import './malun.css';

function Heading({ id, index, title, lead }) {
  return <header className="lab-heading reveal">
    <p className="solar-index">{index}</p>
    <h2 id={id}>{title}</h2>
    {lead && <p>{lead}</p>}
  </header>;
}

export default function MalunPage() {
  const isFr = useLocale() === 'fr';
  const c = isFr ? malunContent.fr : malunContent.en;
  const shotDir = isFr ? '/malun/fr' : '/malun';

  return <div className="solar-page lab-page malun-page">
    <PageMeta title={c.title} description={c.description} alternatePath={isFr ? '/en/projects/malun' : '/fr/projets/malun'} />

    <header className="solar-page-intro lab-intro malun-intro container reveal">
      <div>
        <p className="solar-index">{c.index}</p>
        <h1>Malun<span>.</span></h1>
      </div>
      <div className="lab-intro__copy">
        <p>{c.lead}</p>
        <p className="lab-live"><i aria-hidden="true" />{c.status}</p>
        <a className="solar-link" href="https://apps.apple.com/app/id6828634809" target="_blank" rel="noopener noreferrer">{c.store}<ExternalLink size={16} aria-hidden="true" /></a>
        <a className="solar-link" href="https://malun.app" target="_blank" rel="noopener noreferrer">{c.open}<ExternalLink size={16} aria-hidden="true" /></a>
      </div>
      <i aria-hidden="true" />
    </header>

    <section className="lab-specs container reveal" aria-label={isFr ? 'Chiffres clés' : 'Key figures'}>
      <dl>{c.specs.map(([value, label, detail]) => <div key={label}>
        <dt>{value}</dt>
        <dd><strong>{label}</strong>{detail}</dd>
      </div>)}</dl>
      <ul className="lab-stack">{c.stack.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <section className="lab-section lab-band" aria-labelledby="malun-shots-heading">
      <div className="container">
        <Heading id="malun-shots-heading" index={c.shotsIndex} title={c.shotsTitle} />
        <ul className="malun-shots reveal">
          {c.shots.map(([name, alt]) => <li key={name}><img src={`${shotDir}/${name}.jpg`} alt={alt} width="414" height="900" loading="lazy" decoding="async" /></li>)}
        </ul>
        <p className="malun-shots__note">{c.shotsNote}</p>
      </div>
    </section>

    <section className="lab-section container" aria-labelledby="malun-origin-heading">
      <Heading id="malun-origin-heading" index={c.originIndex} title={c.originTitle} />
      <ol className="lab-origin">
        {c.origin.map(([title, text]) => <li className="reveal" key={title}><i aria-hidden="true" /><h3>{title}</h3><p>{text}</p></li>)}
      </ol>
    </section>

    <section className="lab-section lab-band" aria-labelledby="malun-loop-heading">
      <div className="container">
        <Heading id="malun-loop-heading" index={c.loopIndex} title={c.loopTitle} />
        <ol className="lab-rules">
          {c.loop.map(([title, text], index) => <li className="reveal" key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></li>)}
        </ol>
      </div>
    </section>

    <section className="lab-section container lab-choices" aria-labelledby="malun-choices-heading">
      <Heading id="malun-choices-heading" index={c.choicesIndex} title={c.choicesTitle} />
      <dl>{c.choices.map(([choice, reason]) => <div className="reveal" key={choice}><dt>{choice}</dt><dd>{reason}</dd></div>)}</dl>
    </section>

    <section className="lab-section lab-band" aria-labelledby="malun-build-heading">
      <div className="container">
        <Heading id="malun-build-heading" index={c.buildIndex} title={c.buildTitle} />
        <ol className="lab-rules">
          {c.build.map(([title, text], index) => <li className="reveal" key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></li>)}
        </ol>
      </div>
    </section>

    <section className="lab-section container" aria-labelledby="malun-ship-heading">
      <Heading id="malun-ship-heading" index={c.shipIndex} title={c.shipTitle} />
      <ol className="lab-steps lab-steps--deploy">
        {c.ship.map(([title, text], index) => <li className="reveal" key={title}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </li>)}
      </ol>
    </section>

    <nav className="lab-exit container" aria-label={isFr ? 'Suite' : 'Next'}>
      <Link className="solar-link" to={isFr ? '/fr/projets' : '/en/projects'}><ArrowLeft size={16} aria-hidden="true" />{c.back}</Link>
      <Link className="lab-bridge" to={isFr ? '/fr/projets/atl-lab' : '/en/projects/atl-lab'}>{c.bridge}<ArrowRight aria-hidden="true" /></Link>
    </nav>
  </div>;
}
