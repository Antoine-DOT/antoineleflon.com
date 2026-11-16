import { ArrowDown, ArrowRight, ExternalLink, MousePointerClick } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '@/components/PageMeta';
import { useLocale, useLocalizedContent } from '@/i18n';
import './solar-pages.css';

const useT=()=>useLocalizedContent();
const Chips=({items})=><div className="chips">{items.map(x=><span key={x}>{x}</span>)}</div>;
const Intro=({eyebrow,title,lead,className=''})=><header className={`page-intro container reveal ${className}`}><div>{eyebrow&&<p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1></div><div><p className="lead">{lead}</p></div></header>;
const Flow=({steps,className=''})=><div className={`flow ${className}`}>{steps.map((step,index)=><div className="flow-item" key={step}><span>{String(index+1).padStart(2,'0')}</span><strong>{step}</strong>{index<steps.length-1&&<ArrowRight aria-hidden="true"/>}</div>)}</div>;

function MalunTile(){const isFr=useLocale()==='fr';const [flipped,setFlipped]=useState(false);return <>
  <button type="button" className={`learning-slab${flipped?' is-flipped':''}`} onClick={()=>setFlipped(value=>!value)} aria-pressed={flipped} aria-label={isFr?'Retourner la carte : 學, xué, learn':'Flip the card: 學, xué, learn'}>
    <span className="learning-slab__flip" aria-hidden="true">
      <span className="learning-slab__face"><strong>學</strong><i/></span>
      <span className="learning-slab__face learning-slab__face--back"><span className="learning-slab__answer"><small>xué</small><strong>Learn</strong></span><i/></span>
    </span>
  </button>
  <button type="button" className={`visual-pill learning-hint${flipped?' is-flipped':''}`} tabIndex={-1} aria-hidden="true" onClick={()=>setFlipped(value=>!value)}><MousePointerClick/>{flipped?(isFr?'Cliquez pour revenir':'Click to flip back'):(isFr?'Cliquez sur la carte':'Click the card')}</button>
</>}

function LabCore({to,title}){const isFr=useLocale()==='fr';return <Link to={to} className="orbit-project__visual orbit-project__visual--link" aria-label={`${isFr?'Explorer':'Explore'} ${title}`}>
  <svg className="system-streams" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M21 26 L50 50"/><path d="M85 35 L50 50"/><path d="M44 83 L50 50"/></svg>
  <div className="system-orbit system-orbit--wide" aria-hidden="true"/><div className="system-orbit system-orbit--tight" aria-hidden="true"/>
  <div className="system-core" aria-hidden="true"><i className="system-core__magma"/><i className="system-core__shade"/><span>ATL</span></div>
  <i className="system-node system-node--one" aria-hidden="true"/><i className="system-node system-node--two" aria-hidden="true"/><i className="system-node system-node--three" aria-hidden="true"/>
  <span className="visual-pill system-cta" aria-hidden="true">{isFr?'Explorer le lab':'Explore the lab'}<ArrowRight/></span>
</Link>}

function ProjectFeature({project,to,label,type,index}){return <article className={`orbit-project orbit-project--${type} reveal`}>
  {type==='atl'?<LabCore to={to} title={project.title}/>:<div className="orbit-project__visual"><MalunTile/><div className="learning-sequence" aria-hidden="true"><span>Study</span><b/><span>Review</span><b/><span>Progress</span></div></div>}
  <div className="orbit-project__copy"><div className="orbit-project__meta"><span>0{index}</span><p>{project.kicker}</p></div><h2>{project.title}</h2><p className={`orbit-project__status is-${type}`}><i aria-hidden="true"/>{project.status}</p><p className="orbit-project__description">{project.text}</p><ul className="orbit-project__facts">{project.facts.map(fact=><li key={fact}>{fact}</li>)}</ul><Chips items={project.tags}/><Link className="solar-link" to={to}>{label}<ArrowRight size={17}/></Link></div>
</article>}

export function ProjectsPage(){const t=useT();const locale=useLocale();const isFr=locale==='fr';return <div className="solar-page projects-orbit-page"><PageMeta title={`${t.projects.title} · Antoine Leflon`} description={t.projects.description} alternatePath={isFr?'/en/projects':'/fr/projets'}/><header className="solar-page-intro projects-intro container reveal"><div><p className="solar-index">01 / {isFr?'Projets sélectionnés':'Selected work'}</p><h1>{t.projects.title}<span>.</span></h1></div><p>{t.projects.lead}</p></header><section className="orbit-projects container" aria-label={isFr?'Projets sélectionnés':'Selected projects'}><ProjectFeature project={t.projects.atl} to={isFr?'/fr/projets/atl-lab':'/en/projects/atl-lab'} label={t.ui.caseStudy} type="atl" index="1"/><ProjectFeature project={t.projects.hanzi} to="/projects/malun" label={isFr?'Découvrir le projet en anglais':t.projects.hanzi.exploreLabel} type="malun" index="2"/></section>
  <nav className="projects-exit container" aria-label={isFr?'Suite':'Next'}><Link className="solar-link" to={isFr?'/fr/parcours':'/en/experience'}>{isFr?'Voir mon parcours':'See my experience'}<ArrowRight size={16}/></Link><Link className="projects-bridge" to={isFr?'/atl':'/en/atl'}>{isFr?'Ce savoir-faire, je le mets au service des entreprises avec ATL':'I bring this know-how to businesses with ATL'}<ArrowRight aria-hidden="true"/></Link></nav></div>}

const MALUN_SHOTS=[['1-home','Home: today’s goal and progress'],['2-card','Review: a flashcard with spaced repetition'],['3-path','A TOCFL level with cards per session'],['4-quiz','Quiz: test yourself in seconds'],['5-topics','Learn by subject: collections and topics'],['6-learn','Learn: by level, subject, quiz or numbers']];
const Shot=({name,alt,className=''})=><img className={`malun-shot ${className}`} src={`/malun/${name}.jpg`} alt={alt} width="414" height="900" loading="lazy" decoding="async"/>;
export function HanziPage(){const t=useT();return <><PageMeta title={`${t.hanzi.title} — Antoine Leflon`} description={t.hanzi.description}/><section className="case-hero product-case"><div className="container case-hero-grid"><div className="reveal"><p className="eyebrow">{t.hanzi.status}</p><h1>{t.hanzi.title}</h1><p className="lead">{t.hanzi.lead}</p><a className="text-link" href="https://malun.app" target="_blank" rel="noopener noreferrer">{t.ui.openApp}<ExternalLink size={16}/></a></div><Shot name="1-home" alt={MALUN_SHOTS[0][1]} className="is-hero"/></div></section>
  <section className="case-section container product-story reveal"><div className="story-heading"><p className="eyebrow">{t.hanzi.problemTitle}</p><h2>Building the tool I needed</h2></div><ol>{t.story.hanzi.slice(0,3).map(([title,text],i)=><li key={title}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></section>
  <section className="product-flow-section"><div className="container reveal"><p className="eyebrow">04 · {t.story.hanzi[3][0]}</p><div className="product-narrative"><div><h2>{t.ui.productFlow}</h2><p>{t.story.hanzi[3][1]}</p><Flow steps={['Study','Review','Progress']}/></div><Shot name="2-card" alt={MALUN_SHOTS[1][1]}/></div><div className="curriculum-pair"><div><span>TOCFL</span><p>{t.hanzi.curricula.split('.')[0]}.</p></div><div><span>HSK</span><p>{t.hanzi.curricula.split('.').slice(1).join('.')}</p></div></div></div></section>
  <section className="malun-gallery container reveal" aria-label="Screenshots"><p className="eyebrow">{t.hanzi.statusTitle} · {t.hanzi.status}</p><p className="section-context">{t.hanzi.statusText}</p><div className="malun-gallery__row">{MALUN_SHOTS.map(([name,alt])=><Shot key={name} name={name} alt={alt}/>)}</div></section>
  <section className="case-section container"><div className="section-title reveal"><span>05</span><div><p className="eyebrow">{t.story.hanzi[4][0]}</p><h2>{t.hanzi.decisionsTitle}</h2></div></div><p className="section-context reveal">{t.story.hanzi[4][1]}</p><ol className="decision-list reveal">{t.hanzi.decisions.map((x,i)=><li key={x}><span>0{i+1}</span>{x}</li>)}</ol></section>
  <section className="architecture-section product-architecture"><div className="container reveal"><p className="eyebrow">06 · {t.hanzi.architectureTitle}</p><div className="stack-diagram"><div>{t.ui.browser}</div><ArrowDown/><div>Django</div><ArrowDown/><div>PostgreSQL</div><aside><span>{t.ui.identity}</span><b>Keycloak / OIDC</b><span>{t.ui.runtime}</span><b>Docker / Nginx</b></aside></div><p>{t.hanzi.architecture}</p><a className="text-link" href="https://malun.app" target="_blank" rel="noopener noreferrer">{t.ui.openApp}<ExternalLink size={16}/></a><Link className="text-link back-link" to="/projects">← {t.common.back}</Link></div></section></>}

export function NotFoundPage(){const locale=useLocale();const isFr=locale==='fr';const copy=isFr?{title:'Page introuvable',description:'La page demandée est introuvable.',eyebrow:'Erreur 404',text:'Cette page n’existe pas ou a été déplacée.',home:'Retour à l’accueil',projects:'Voir les projets'}:{title:'Page not found',description:'The requested page could not be found.',eyebrow:'Error 404',text:'The page you are looking for does not exist or may have moved.',home:'Back to Home',projects:'View Projects'};return <><PageMeta title={`${copy.title} · Antoine Leflon`} description={copy.description} noindex/><section className="not-found container reveal"><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}.</h1><p>{copy.text}</p><div><Link className="button primary" to={isFr?'/fr':'/en'}>{copy.home}</Link><Link className="text-link" to={isFr?'/fr/projets':'/en/projects'}>{copy.projects}<ArrowRight size={17}/></Link></div></section></>}
