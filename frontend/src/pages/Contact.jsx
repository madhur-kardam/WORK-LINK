import { useEffect, useRef, useState } from 'react';
import PublicNavbar from '../components/PublicNavbar.jsx';
import './Contact.css';

const FAQS = [
  { q: 'How do I register as a worker?', a: "Currently, you can browse jobs and apply directly through our platform. We're working on a full registration system that will allow you to create a profile and receive job notifications." },
  { q: 'How can employers post jobs?', a: 'Employers can contact us via phone or email to post job requirements. We verify all job postings to ensure they meet our quality standards before they go live on the platform.' },
  { q: 'Is there any fee to use WorkLink?', a: 'For workers, using WorkLink to find jobs is completely free. Employers pay a nominal fee for posting job listings, which helps us maintain and improve the platform.' },
  { q: 'How do I report an issue?', a: 'You can report any issues by calling our support line, sending an email to support@worklink.com, or using the contact form on this page. We aim to respond to all queries within 24 hours.' },
  { q: 'What types of jobs are available?', a: 'We list various grey-collar jobs including Carpenter, Plumber, Electrician, Painter, Mason, Welder, AC Technician, Tile Fitter, Gardener, and more. New categories are added based on demand.' }
];

const SOCIALS = [
  { title: 'Facebook', icon: '📘' },
  { title: 'Twitter', icon: '🐦' },
  { title: 'Instagram', icon: '📷' },
  { title: 'LinkedIn', icon: '💼' },
  { title: 'WhatsApp', icon: '💬' }
];

const EMPTY_FORM = { name: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const successRef = useRef(null);

  useEffect(() => {
    document.title = 'Contact Us - WorkLink';
  }, []);

  // Scroll to the success message, then hide it after 5 seconds
  useEffect(() => {
    if (!sent) return;
    successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const timer = setTimeout(() => setSent(false), 5000);
    return () => clearTimeout(timer);
  }, [sent]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="contact-page">
      <PublicNavbar />

      <div className="container">
        <div className="page-header">
          <h1>Get in Touch</h1>
          <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-form-section">
            <h2><span>✉️</span> Send Us a Message</h2>
            <div
              className="success-message"
              ref={successRef}
              style={{ display: sent ? 'block' : 'none' }}
            >
              ✅ Thank you! Your message has been sent successfully. We'll get back to you soon.
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name *</label>
                <input type="text" name="name" required placeholder="Enter your full name" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" required placeholder="your.email@example.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <select name="subject" required value={form.subject} onChange={handleChange}>
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="worker">I'm a Worker</option>
                  <option value="employer">I'm an Employer</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership Opportunity</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea name="message" required placeholder="Tell us how we can help you..." value={form.message} onChange={handleChange}></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>

          <div className="contact-info-section">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Our Office</h3>
              <p>
                WorkLink Headquarters<br />
                45, MG Road, Pithumpur<br />
                Madhya Pradesh - 453771<br />
                India
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Call Us</h3>
              <p>
                Phone: <a href="tel:+919876543210">+91 98765 43210</a><br />
                Toll Free: <a href="tel:18001234567">1800 123 4567</a><br />
                Available: Mon-Sat, 9 AM - 6 PM
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h3>Email Us</h3>
              <p>
                General: <a href="mailto:info@worklink.com">info@worklink.com</a><br />
                Support: <a href="mailto:support@worklink.com">support@worklink.com</a><br />
                Jobs: <a href="mailto:jobs@worklink.com">jobs@worklink.com</a>
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">🌐</div>
              <h3>Follow Us</h3>
              <p>Stay connected with us on social media</p>
              <div className="social-links">
                {SOCIALS.map((s) => (
                  <a href="#" className="social-btn" title={s.title} key={s.title}>{s.icon}</a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="faq-section">
          <h2>❓ Frequently Asked Questions</h2>
          {FAQS.map((f) => (
            <div className="faq-item" key={f.q}>
              <div className="faq-question">{f.q}</div>
              <div className="faq-answer">{f.a}</div>
            </div>
          ))}
        </div>

        <div className="map-section">
          <h2>📍 Find Us on the Map</h2>
          <div className="map-placeholder">
            🗺️ WorkLink Office - 45, MG Road, Pithumpur, MP 453771
          </div>
        </div>
      </div>
    </div>
  );
}
