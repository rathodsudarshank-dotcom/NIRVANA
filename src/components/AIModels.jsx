import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { AI_MODELS } from '../data/bridgeData';

import visionLogo from '../assets/workflow-vision.jpeg';
import aiLogo from '../assets/workflow-ai.jpeg';
import edgeLogo from '../assets/workflow-edge.jpeg';
import riskLogo from '../assets/workflow-risk.jpeg';

const MODEL_LOGOS = [
  { img: visionLogo, invert: false },
  { img: aiLogo, invert: false },
  { img: edgeLogo, invert: false },
  { img: riskLogo, invert: false },
];

export default function AIModels() {
  const headingRef = useScrollReveal();
  const setRef = useStaggerReveal(AI_MODELS.length, 120);

  return (
    <section className="section">
      <div className="container">
        <div ref={headingRef} className="reveal">
          <div className="section__label">AI & Neural Networks</div>
          <h2 className="section__title">Intelligence Behind the Assessment</h2>
          <p className="section__subtitle">
            NIRVANA combines multiple AI models — each specialized for a different aspect
            of infrastructure monitoring — into a unified risk assessment pipeline.
          </p>
        </div>

        <div className="ai-models__grid">
          {AI_MODELS.map((model, i) => (
            <div key={i} ref={setRef(i)} className="ai-model-card reveal">
              <div className="ai-model-card__header">
                <div className="ai-model-card__icon-wrap">
                  <img
                    src={MODEL_LOGOS[i]?.img}
                    alt={model.name}
                    className="ai-model-card__icon"
                  />
                </div>
                <h3 className="ai-model-card__name">{model.name}</h3>
              </div>
              <p className="ai-model-card__desc">{model.description}</p>
              <span className="ai-model-card__tech">{model.tech}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
