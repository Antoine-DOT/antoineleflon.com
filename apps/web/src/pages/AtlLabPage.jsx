import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Equal, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageMeta from '@/components/PageMeta';
import { useLocale } from '@/i18n';
import { labContent } from './atl-lab-content';
import './solar-pages.css';
import './atl-lab.css';

// Zone positions on the orbit around the firewall (viewBox 640 × 470).
const zoneNodes = [[560, 240], [402, 381], [112, 315], [123, 154], [382, 95], [238, 381]];
const firewall = [320, 240];
const internet = [592, 46];
// Allowed flows drawn through the firewall: [legend key, from zone, to zone or null for the firewall].
const flows = [['app', 0, 1], ['deploy', 3, 0], ['observe', 4, null]];

function useLiveRelease() {
  const [release, setRelease] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch('/.version', { cache: 'no-store' })
      .then(response => (response.ok ? response.json() : null))
      .then(data => { if (!cancelled && data?.commit) setRelease(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return release;
}

// Counts the leading number of a figure up from zero the first time it scrolls into view.
function CountUp({ value }) {
  const ref = useRef(null);
  const [, target, rest] = value.match(/^(\d+)(.*)$/) || [null, null, value];
  const [current, setCurrent] = useState(target);
  useEffect(() => {
    const node = ref.current;
    if (!target || !node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    setCurrent('0');
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / 1400, 1);
        setCurrent(String(Math.round(Number(target) * (1 - (1 - progress) ** 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: .6 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [target]);
  return <span ref={ref}>{target ? current : ''}{rest}</span>;
}

function ZoneMap({ c }) {
  const [fx, fy] = firewall;
  const visit = `M${internet[0]},${internet[1]} L${fx},${fy} L${zoneNodes[0][0]},${zoneNodes[0][1]}`;
  const flowPath = (from, to) => `M${zoneNodes[from][0]},${zoneNodes[from][1]} L${fx},${fy}${to === null ? '' : ` L${zoneNodes[to][0]},${zoneNodes[to][1]}`}`;
  return <svg className="lab-map" viewBox="0 0 640 470" role="img" aria-labelledby="lab-map-title lab-map-desc">
    <title id="lab-map-title">{c.mapTitle}</title>
    <desc id="lab-map-desc">{c.mapLead}</desc>
    <defs>
      <radialGradient id="lab-sun" cx="34%" cy="30%" r="75%">
        <stop offset="0" stopColor="#ffc45b" /><stop offset=".3" stopColor="#ff7a24" /><stop offset=".62" stopColor="#c83a16" /><stop offset="1" stopColor="#3a1810" />
      </radialGradient>
    </defs>
    <ellipse className="lab-map__orbit" cx={fx} cy={fy} rx="240" ry="150" />
    <ellipse className="lab-map__orbit lab-map__orbit--outer" cx={fx} cy={fy} rx="300" ry="205" />
    {zoneNodes.map(([x, y]) => <line key={`${x}-${y}`} className="lab-map__spoke" x1={fx} y1={fy} x2={x} y2={y} />)}
    {flows.map(([key, from, to]) => <path key={key} className={`lab-map__flow lab-map__flow--${key}`} d={flowPath(from, to)} />)}
    <path className="lab-map__visit" d={visit} />
    <circle className="lab-map__packet" r="5"><animateMotion dur="3.6s" repeatCount="indefinite" path={visit} /></circle>
    <circle cx={fx} cy={fy} r="64" fill="url(#lab-sun)" />
    <text className="lab-map__core-label" x={fx} y={fy + 5} textAnchor="middle">{c.mapLabels.firewall.toUpperCase()}</text>
    <circle className="lab-map__internet" cx={internet[0]} cy={internet[1]} r="7" />
    <text className="lab-map__label" x={internet[0] - 14} y={internet[1] + 6} textAnchor="end">{c.mapLabels.internet}</text>
    {zoneNodes.map(([x, y], index) => <g key={c.zones[index][0]} className={`lab-map__zone${index === 0 ? ' is-public' : ''}`}>
      <circle cx={x} cy={y} r="27" />
      <text className="lab-map__number" x={x} y={y + 7} textAnchor="middle">{index + 1}</text>
      <text className="lab-map__label" x={x} y={y + 54} textAnchor="middle">{c.zones[index][0]}</text>
      <text className="lab-map__sublabel" x={x} y={y + 73} textAnchor="middle">{c.zones[index][3]}</text>
    </g>)}
  </svg>;
}

function Releases({ c, commit }) {
  return <figure className="lab-releases reveal">
    <figcaption className="solar-index">{c.releasesLabel}</figcaption>
    <pre>
      <span>releases/</span>
      {c.releasesOld.map(name => <span key={name}>├── <em>{name}/</em></span>)}
      <span className="is-current">└── {commit ? `${commit.slice(0, 7)}/` : `${c.releasesCurrent}/`} <b>← current</b></span>
    </pre>
  </figure>;
}

function Pipeline({ c }) {
  const ref = useRef(null);
  // The travelling dot stops on the last step's marker, wherever the text wraps.
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const measure = () => node.querySelectorAll('.lab-pipeline__stage > ol').forEach(list => {
      list.style.setProperty('--end', `${list.lastElementChild.offsetTop}px`);
    });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [c]);
  return <div className="lab-pipeline reveal" ref={ref}>
    <ol className="lab-pipeline__stages">
      {c.pipeline.map(stage => <li className="lab-pipeline__stage" key={stage.zone}>
        <header><h3>{stage.zone}</h3><span>{stage.title}{stage.live && <em><i aria-hidden="true" />{stage.live}</em>}</span></header>
        <ol>{stage.steps.map(([title, text]) => <li key={title}><strong>{title}</strong><p>{text}</p></li>)}</ol>
      </li>)}
    </ol>
    <div className="lab-pipeline__foot">
      <p className="lab-pipeline__same"><Equal size={18} aria-hidden="true" />{c.pipelineSame}</p>
      <p className="lab-pipeline__rollback"><RotateCcw size={18} aria-hidden="true" />{c.pipelineRollback}</p>
    </div>
  </div>;
}

function Steps({ items, className }) {
  return <ol className={`lab-steps ${className}`}>
    {items.map(([title, text], index) => <li className="reveal" key={title}>
      <span>{String(index + 1).padStart(2, '0')}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </li>)}
  </ol>;
}

export default function AtlLabPage() {
  const isFr = useLocale() === 'fr';
  const c = isFr ? labContent.fr : labContent.en;
  const release = useLiveRelease();
  const releaseDate = release && new Date(release.built_at).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return <div className="solar-page lab-page">
    <PageMeta title={c.title} description={c.description} alternatePath={isFr ? '/en/projects/atl-lab' : '/fr/projets/atl-lab'} />

    <header className="solar-page-intro lab-intro container reveal">
      <div>
        <p className="solar-index">{c.index}</p>
        <h1>ATL-Lab<span>.</span></h1>
      </div>
      <div className="lab-intro__copy">
        <p>{c.lead}</p>
        {release && <p className="lab-live"><i aria-hidden="true" />{c.live} <code>{release.commit.slice(0, 7)}</code>{releaseDate && <>, {c.liveBuilt} {releaseDate}</>}.</p>}
      </div>
      <i aria-hidden="true" />
    </header>

    <section className="lab-specs container reveal" aria-label={isFr ? 'Chiffres clés' : 'Key figures'}>
      <dl>{c.specs.map(([value, label, detail]) => <div key={label}>
        <dt><CountUp value={value} /></dt>
        <dd><strong>{label}</strong>{detail}</dd>
      </div>)}</dl>
      <ul className="lab-stack">{c.stack.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <section className="lab-section lab-map-section container" aria-labelledby="lab-map-heading">
      <header className="lab-heading reveal">
        <p className="solar-index">{c.mapIndex}</p>
        <h2 id="lab-map-heading">{c.mapTitle}</h2>
        <p>{c.mapLead}</p>
      </header>
      <div className="lab-map-layout">
        <figure className="lab-panel reveal">
          <ZoneMap c={c} />
          <figcaption><ul className="lab-legend">{c.mapFlows.map(([key, label]) => <li key={key}><i className={`lab-legend__${key}`} aria-hidden="true" />{label}</li>)}</ul></figcaption>
        </figure>
        <ol className="lab-zones">
          {c.zones.map(([name, contents, role], index) => <li className="reveal" key={name}>
            <span>{index + 1}</span>
            <div><h3>{name}</h3><p className="lab-zones__contents">{contents}</p><p>{role}</p></div>
          </li>)}
        </ol>
      </div>
    </section>

    <section className="lab-section lab-band" aria-labelledby="lab-path-heading">
      <div className="container">
        <header className="lab-heading reveal">
          <p className="solar-index">{c.pathIndex}</p>
          <h2 id="lab-path-heading">{c.pathTitle}</h2>
        </header>
        <Steps items={c.path} className="lab-steps--path" />
      </div>
    </section>

    <section className="lab-section container" aria-labelledby="lab-deploy-heading">
      <header className="lab-heading reveal">
        <p className="solar-index">{c.deployIndex}</p>
        <h2 id="lab-deploy-heading">{c.deployTitle}</h2>
      </header>
      <div className="lab-deploy reveal">
        <Steps items={c.deploy} className="lab-steps--deploy" />
        <svg className="lab-rollback" viewBox="0 0 1000 70" preserveAspectRatio="none" aria-hidden="true">
          <path d="M822 4 C 822 62, 414 66, 414 10" />
          <path className="lab-rollback__head" d="M405 23 L414 8 L423 23" />
        </svg>
        <p className="lab-rollback-note">{c.rollback}</p>
      </div>
      <div className="lab-deploy-foot">
        <aside className="lab-example reveal">
          <p className="solar-index">{c.caseLabel}</p>
          <p>{c.caseText}</p>
        </aside>
        <Releases c={c} commit={release?.commit} />
      </div>
    </section>

    <section className="lab-section lab-band" aria-labelledby="lab-pipeline-heading">
      <div className="container">
        <header className="lab-heading reveal">
          <p className="solar-index">{c.pipelineIndex}</p>
          <h2 id="lab-pipeline-heading">{c.pipelineTitle}</h2>
          <p>{c.pipelineLead}</p>
        </header>
        <Pipeline c={c} />
        <aside className="lab-example reveal">
          <p className="solar-index">{c.pipelineCaseLabel}</p>
          <p>{c.pipelineCaseText}</p>
        </aside>
      </div>
    </section>

    <section className="lab-section lab-ai" aria-labelledby="lab-ai-heading">
      <div className="container lab-ai__grid">
        <header className="lab-heading reveal">
          <p className="solar-index">{c.aiIndex}</p>
          <h2 id="lab-ai-heading">{c.aiTitle}</h2>
          <p>{c.aiLead}</p>
        </header>
        <div className="lab-loop reveal" aria-label={c.loop.join(', ')}>
          <div className="lab-loop__ring" aria-hidden="true" />
          <strong>{c.loopCenter}</strong>
          <ol>{c.loop.map((step, index) => <li key={step} style={{ '--i': index }}><span>{step}</span></li>)}</ol>
        </div>
        <div className="lab-roles">
          {c.roles.map(([name, verb, text]) => <article className="reveal" key={name}><p>{verb}</p><h3>{name}</h3><span>{text}</span></article>)}
        </div>
        <div className="lab-observer reveal">
          <header><h3>{c.observerTitle}</h3><p>{c.observerLead}</p></header>
          <dl>{c.observerPoints.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
        </div>
      </div>
    </section>

    <section className="lab-section container" aria-labelledby="lab-rules-heading">
      <header className="lab-heading reveal">
        <p className="solar-index">{c.rulesIndex}</p>
        <h2 id="lab-rules-heading">{c.rulesTitle}</h2>
      </header>
      <ol className="lab-rules">
        {c.rules.map(([title, text], index) => <li className="reveal" key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></li>)}
      </ol>
    </section>

    <section className="lab-section lab-band" aria-labelledby="lab-choices-heading">
      <div className="container lab-choices">
        <header className="lab-heading reveal">
          <p className="solar-index">{c.choicesIndex}</p>
          <h2 id="lab-choices-heading">{c.choicesTitle}</h2>
        </header>
        <dl>{c.choices.map(([choice, reason]) => <div className="reveal" key={choice}><dt>{choice}</dt><dd>{reason}</dd></div>)}</dl>
      </div>
    </section>

    <section className="lab-section container" aria-labelledby="lab-origin-heading">
      <header className="lab-heading reveal">
        <p className="solar-index">{c.originIndex}</p>
        <h2 id="lab-origin-heading">{c.originTitle}</h2>
      </header>
      <ol className="lab-origin">
        {c.origin.map(([title, text]) => <li className="reveal" key={title}><i aria-hidden="true" /><h3>{title}</h3><p>{text}</p></li>)}
      </ol>
    </section>

    <nav className="lab-exit container" aria-label={isFr ? 'Suite' : 'Next'}>
      <Link className="solar-link" to={isFr ? '/fr/projets' : '/en/projects'}><ArrowLeft size={16} aria-hidden="true" />{c.back}</Link>
      <Link className="lab-bridge" to={isFr ? '/atl' : '/en/atl'}>{c.bridge}<ArrowRight aria-hidden="true" /></Link>
    </nav>
  </div>;
}
