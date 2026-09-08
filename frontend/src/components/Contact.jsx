import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  User,
  MapPin
} from 'lucide-react';
import { API_URL } from '../api';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        // FastAPI validation errors come back as { detail: [...] } or { detail: "..." }
        const detail = data && data.detail;
        const message =
          typeof detail === 'string'
            ? detail
            : Array.isArray(detail) && detail[0]?.msg
              ? detail[0].msg
              : 'Failed to send message. Please try again.';
        setErrorMessage(message);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <section className="contact section" id="contact">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Connect</span>
          <h2 className="section-title">Get In <span>Touch</span></h2>
          <p className="section-description">
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="contact-grid">
          {/* Contact Info - Left Side */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="contact-card glass">
              <h3 className="contact-info-title">Let's Start a Conversation</h3>
              <p className="contact-info-text">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                Whether it's building intelligent systems, designing scalable architectures, or exploring the frontiers of AI — let's make something remarkable together.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <Mail className="icon-md" />
                  </div>
                  <div className="method-content">
                    <span className="method-label">Email</span>
                    <a href="mailto:youssef.ennagui@usmba.ac.ma" className="method-value">
                      youssef.ennagui@usmba.ac.ma
                    </a>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <MapPin className="icon-md" />
                  </div>
                  <div className="method-content">
                    <span className="method-label">Location</span>
                    <span className="method-value">Fez, Morocco</span>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <MessageSquare className="icon-md" />
                  </div>
                  <div className="method-content">
                    <span className="method-label">Availability</span>
                    <span className="method-value">Open to freelance & full-time</span>
                  </div>
                </div>
              </div>

              <div className="contact-socials">
                <a
                  href="https://github.com/ennaguiyoussef"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="social-link"
                  aria-label="GitHub"
                >
                  <svg className="icon-lg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/youssef-ennagui-b1862b37a/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="social-link"
                  aria-label="LinkedIn"
                >
                  <svg className="icon-lg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="mailto:youssef.ennagui@usmba.ac.ma"
                  className="social-link"
                  aria-label="Email"
                >
                  <Mail className="icon-lg" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form - Right Side */}
          <motion.div
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="contact-form-card glass">
              <h3 className="form-title">Send a Message</h3>

              {status === 'success' && (
                <motion.div
                  className="form-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  <div className="success-icon">
                    <CheckCircle2 className="icon-xl" />
                  </div>
                  <h4>Message Sent!</h4>
                  <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
                  <motion.button
                    className="btn btn-primary"
                    onClick={() => setStatus('idle')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              )}

              {status !== 'success' && (
                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        <User className="icon-sm" />
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={status === 'loading'}
                        autoComplete="name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        <Mail className="icon-sm" />
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={status === 'loading'}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                      <MessageSquare className="icon-sm" />
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-input"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-textarea"
                      placeholder="Tell me about your project, idea, or just say hello..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={status === 'loading'}
                      rows={5}
                    />
                  </div>

                  {status === 'error' && (
                    <motion.div
                      className="form-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="icon-sm" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    className="btn btn-primary form-submit"
                    disabled={status === 'loading'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="icon-md spinner" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="icon-md" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;