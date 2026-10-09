import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Contact() {
  const ref = useScrollReveal();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div ref={ref} className="reveal">
          <div className="contact">
            <div className="section__label">Contact</div>
            <h2 className="section__title" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}>Get in Touch</h2>
            <p className="section__subtitle" style={{ fontSize: '0.92rem' }}>
              Interested in NIRVANA for your infrastructure monitoring needs?
              Reach out for a demonstration or partnership inquiry.
            </p>

            {submitted ? (
              <div style={{ marginTop: 24, padding: 20, background: 'var(--status-green-bg)', border: '1px solid var(--status-green)', borderRadius: 'var(--radius-md)', color: 'var(--status-green)', fontSize: '0.9rem', fontWeight: 500 }}>
                Thank you for your inquiry. Our team will respond within 48 hours.
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit}>
                <input className="contact__input" type="text" placeholder="Full Name" required aria-label="Full Name" />
                <input className="contact__input" type="email" placeholder="Email Address" required aria-label="Email Address" />
                <input className="contact__input" type="text" placeholder="Organization" aria-label="Organization" />
                <textarea className="contact__textarea" placeholder="Tell us about your infrastructure monitoring needs..." required aria-label="Message" />
                <button className="btn btn--primary" type="submit" style={{ alignSelf: 'flex-start' }}>
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
