import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

import sensorsLogo from '../assets/workflow-sensors.jpeg';
import visionLogo from '../assets/workflow-vision.jpeg';
import edgeLogo from '../assets/workflow-edge.jpeg';
import aiLogo from '../assets/workflow-ai.jpeg';
import riskLogo from '../assets/workflow-risk.jpeg';

const WORKFLOW_ITEMS = [
  {
    id: 'sensors',
    label: 'Sensors',
    description: 'Accelerometers, strain gauges, displacement sensors, tiltmeters, and environmental monitors continuously capture structural data.',
    logo: sensorsLogo,
    invert: true,
    badge: 'STAGE 01 — TELEMETRY INGESTION',
    title: 'High-Precision Sensor Node',
    sub: 'Tri-Axial Accelerometer, Strain & Displacement Telemetry at 100 Hz',
    status: 'ACTIVE',
  },
  {
    id: 'camera',
    label: 'Computer Vision',
    description: 'HD cameras feed images to AI models that detect surface cracks, spalling, corrosion, and other visible anomalies.',
    logo: visionLogo,
    invert: false,
    badge: 'STAGE 02 — OPTICAL RECONNAISSANCE',
    title: 'High-Resolution Computer Vision',
    sub: 'Real-Time Crack Segmentation, Spalling & Surface Anomaly Detection',
    status: 'ACTIVE',
  },
  {
    id: 'edge',
    label: 'Edge & Cloud',
    description: 'Edge devices pre-process and transmit data to the cloud pipeline for storage, aggregation, and real-time analysis.',
    logo: edgeLogo,
    invert: false,
    badge: 'STAGE 03 — DISTRIBUTED PROCESSING',
    title: 'Edge Compute & Cloud Pipeline',
    sub: 'Low-Latency Preprocessing & Resilient Infrastructure Data Ingestion',
    status: 'SYNCED',
  },
  {
    id: 'ai',
    label: 'AI Analytics',
    description: 'Neural networks perform time-series anomaly detection, sensor fusion, and multimodal risk assessment across all data sources.',
    logo: aiLogo,
    invert: false,
    badge: 'STAGE 04 — MULTIMODAL INFERENCE',
    title: 'Multimodal Deep Learning & Fusion',
    sub: 'Cross-Modal Temporal Attention & Time-Series Anomaly Detection',
    status: 'OPTIMAL',
  },
  {
    id: 'risk',
    label: 'Risk Score',
    description: 'An interpretable health score and risk level are generated with full explainability — showing which factors contributed.',
    logo: riskLogo,
    invert: false,
    badge: 'STAGE 05 — ACTIONABLE INTELLIGENCE',
    title: 'Explainable Health & Risk Score',
    sub: 'Continuous 0–100 Structural Index with Clear Contributory Factors',
    status: 'MONITORING',
  },
];

export default function Workflow() {
  const headingRef = useScrollReveal();
  const containerRef = useRef(null);
  const [activeCount, setActiveCount] = useState(0);
  const [selectedStep, setSelectedStep] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the activation and track active showcase
          WORKFLOW_ITEMS.forEach((_, i) => {
            setTimeout(() => {
              setActiveCount(prev => {
                const next = Math.max(prev, i + 1);
                setSelectedStep(i);
                return next;
              });
            }, (i + 1) * 450);
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const lineHeight = activeCount > 0 ? `${(activeCount / WORKFLOW_ITEMS.length) * 100}%` : '0%';
  const currentItem = WORKFLOW_ITEMS[selectedStep] || WORKFLOW_ITEMS[0];

  return (
    <section className="section workflow" id="features">
      <div className="container container--wide">
        <div ref={headingRef} className="reveal">
          <div className="section__label">How It Works</div>
          <h2 className="section__title">From Sensor Signal to Actionable Intelligence</h2>
          <p className="section__subtitle">
            NIRVANA processes infrastructure data through a real-time pipeline —
            from physical sensors to AI-driven risk assessment.
          </p>
        </div>

        <div className="workflow__grid">
          {/* Workflow Steps Timeline */}
          <div className="workflow__steps" ref={containerRef}>
            <div className="workflow__line" aria-hidden="true">
              <div className="workflow__line-progress" style={{ height: lineHeight }}></div>
            </div>

            {WORKFLOW_ITEMS.map((step, i) => (
              <div
                key={step.id}
                className={`workflow__step ${i < activeCount ? 'active' : ''} ${i === selectedStep ? 'selected' : ''}`}
                onClick={() => setSelectedStep(i)}
                onMouseEnter={() => setSelectedStep(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedStep(i); }}
              >
                <div className={`workflow__step-dot ${step.invert ? 'workflow__step-dot--invert' : ''}`} aria-hidden="true">
                  <img
                    src={step.logo}
                    alt={step.label}
                    className={`workflow__step-img ${step.invert ? 'workflow__step-img--invert' : ''}`}
                  />
                </div>
                <div className="workflow__step-content">
                  <div className="workflow__step-header-row">
                    <span className="workflow__step-num">0{i + 1}</span>
                    <h3 className="workflow__step-label">{step.label}</h3>
                  </div>
                  <p className="workflow__step-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Pipeline Stage Showcase */}
          <div className="workflow__visual reveal">
            <div className="workflow__visual-card">
              <div className="workflow__visual-badge">
                <span className="status-dot status-dot--green" />
                {currentItem.badge}
              </div>

              <div className="workflow__image-wrap">
                <div className="workflow__image-backdrop-glow" />
                <img
                  key={currentItem.id}
                  src={currentItem.logo}
                  alt={currentItem.title}
                  className={`workflow__image ${currentItem.invert ? 'workflow__image--invert' : ''}`}
                  loading="lazy"
                />
                <div className="workflow__image-overlay" />
              </div>

              <div className="workflow__visual-footer">
                <div className="workflow__visual-info">
                  <div className="workflow__visual-title">{currentItem.title}</div>
                  <div className="workflow__visual-sub">{currentItem.sub}</div>
                </div>
                <div className="workflow__visual-status">{currentItem.status}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
