import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { submitContact } from '../lib/api';

const initialForm = {
  name: '',
  email: '',
  organization: '',
  message: '',
};

export default function Contact() {
  const ref = useScrollReveal();
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (status.type !== 'idle') {
      setStatus({ type: 'idle', message: '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const result = await submitContact(formData);
      setStatus({ type: 'success', message: result.message || 'Thank you for your inquiry. Our team will respond within 48 hours.' });
      setFormData(initialForm);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to send your inquiry right now. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
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

            {status.type === 'success' && (
              <div style={{ marginTop: 24, padding: 20, background: 'var(--status-green-bg)', border: '1px solid var(--status-green)', borderRadius: 'var(--radius-md)', color: 'var(--status-green)', fontSize: '0.9rem', fontWeight: 500 }}>
                {status.message}
              </div>
            )}

            {status.type === 'error' && (
              <div style={{ marginTop: 24, padding: 16, background: 'rgba(239, 68, 68, 0.08)', border: '1px solid var(--status-red)', borderRadius: 'var(--radius-md)', color: '#FCA5A5', fontSize: '0.9rem' }}>
                {status.message}
              </div>
            )}

            <form className="contact__form" onSubmit={handleSubmit}>
              <input className="contact__input" type="text" name="name" placeholder="Full Name" required aria-label="Full Name" value={formData.name} onChange={handleChange} />
              <input className="contact__input" type="email" name="email" placeholder="Email Address" required aria-label="Email Address" value={formData.email} onChange={handleChange} />
              <input className="contact__input" type="text" name="organization" placeholder="Organization" aria-label="Organization" value={formData.organization} onChange={handleChange} />
              <textarea className="contact__textarea" name="message" placeholder="Tell us about your infrastructure monitoring needs..." required aria-label="Message" value={formData.message} onChange={handleChange} />
              <button className="btn btn--primary" type="submit" style={{ alignSelf: 'flex-start' }} disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Send Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
