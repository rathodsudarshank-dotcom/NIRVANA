import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { PROBLEM_CARDS } from '../data/bridgeData';

const ICONS = {
  fragments: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round"/>
      <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round"/>
      <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round"/>
      <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round"/>
    </svg>
  ),
  clock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 3" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 9v4M12 17h.01" strokeLinecap="round"/>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    </svg>
  ),
  alert: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 22h20L12 2zM12 10v4M12 18h.01" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function ProblemSection() {
  const headingRef = useScrollReveal();
  const setRef = useStaggerReveal(PROBLEM_CARDS.length, 120);

  return (
    <section className="section" id="about">
      <div className="container">
        <div ref={headingRef} className="reveal">
          <div className="section__label">The Challenge</div>
          <h2 className="section__title">Infrastructure Doesn&apos;t Fail Without Warning.</h2>
          <p className="section__subtitle">
            Warning signals often exist long before a critical event — but they are scattered across
            sensors, inspections, images and historical data.
          </p>
        </div>

        <div className="problem__cards">
          {PROBLEM_CARDS.map((card, i) => (
            <div key={i} ref={setRef(i)} className="problem__card reveal">
              <div className="problem__card-icon" style={{ color: 'var(--accent)' }}>
                {ICONS[card.icon]}
              </div>
              <h3 className="problem__card-title">{card.title}</h3>
              <p className="problem__card-desc">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
