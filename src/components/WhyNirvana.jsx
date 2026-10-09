import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { WHY_PILLARS } from '../data/bridgeData';

const ICONS = {
  predict: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  multimodal: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
    </svg>
  ),
  explain: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1h-2a1 1 0 01-1-1v-.26A7.01 7.01 0 015 9a7 7 0 017-7z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  scale: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
      <path d="M21 3L3 21M21 3h-6M21 3v6M3 21h6M3 21v-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function WhyNirvana() {
  const headingRef = useScrollReveal();
  const setRef = useStaggerReveal(WHY_PILLARS.length, 120);

  return (
    <section className="section">
      <div className="container">
        <div ref={headingRef} className="reveal">
          <div className="section__label">Why NIRVANA</div>
          <h2 className="section__title">Purpose-Built for Infrastructure Intelligence</h2>
          <p className="section__subtitle">
            NIRVANA provides predictive risk assessment and decision support to help
            engineers prioritize inspection and intervention.
          </p>
        </div>

        <div className="why__grid">
          {WHY_PILLARS.map((pillar, i) => (
            <div key={i} ref={setRef(i)} className="why__card reveal">
              <div className="why__card-icon">{ICONS[pillar.icon]}</div>
              <h3 className="why__card-title">{pillar.title}</h3>
              <p className="why__card-desc">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
