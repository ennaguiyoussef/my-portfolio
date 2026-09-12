import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Cloud,
  Brain,
  Download,
  ExternalLink,
  Building2,
  Cpu
} from 'lucide-react';
import { API_URL } from '../api';
import './CV.css';

const certifications = [
  {
    id: 'oci-ai-foundations',
    title: 'Oracle Cloud Infrastructure Certified AI Foundations Associate',
    issuer: 'Oracle',
    issued: 'Aug 2026',
    tags: ['Machine Learning', 'Deep Learning', 'AI'],
    icon: Brain,
    iconColor: 'var(--color-accent-tertiary)',
    credentialUrl: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=...'
  },
  {
    id: 'oci-foundations',
    title: 'Oracle Cloud Infrastructure Certified Foundations Associate',
    issuer: 'Oracle',
    issued: 'Aug 2026',
    tags: ['Cloud Computing', 'OCI Architecture'],
    icon: Cloud,
    iconColor: 'var(--color-accent-primary)',
    credentialUrl: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=...'
  },
  {
    id: 'oci-ai-vector-search',
    title: 'Oracle AI Vector Search Certified Professional',
    issuer: 'Oracle',
    issued: 'Oct 2025',
    tags: ['Vector Search', 'RAG', 'GenAI', 'Embeddings'],
    icon: Cpu,
    iconColor: 'var(--color-accent-secondary)',
    credentialUrl: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=...'
  },
  {
    id: 'oci-multicloud-architect',
    title: 'Oracle Cloud Infrastructure 2025 Certified Multicloud Architect Professional',
    issuer: 'Oracle',
    issued: 'Oct 2025',
    tags: ['Multicloud Architecture', 'Cloud Infrastructure'],
    icon: Building2,
    iconColor: 'var(--color-accent-warning)',
    credentialUrl: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=...'
  }
];

function CV() {
  return (
    <section className="cv section" id="cv">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Career</span>
          <h2 className="section-title">Curriculum <span>Vitae</span></h2>
          <p className="section-description">
            Academic journey and recognized certifications
          </p>
        </motion.div>

        {/* Download Button */}
        <motion.div
          className="cv-download"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.a
            href={`${API_URL}/api/cv`}
            download
            className="btn btn-primary download-btn"
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="icon-md" />
            <span>Download CV (PDF)</span>
            <ExternalLink className="icon-sm" />
          </motion.a>
          <p className="download-note">Last updated: September 2026</p>
        </motion.div>

        {/* Certifications */}
        <motion.div
          className="cv-block certifications"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="block-header">
            <div
              className="block-icon"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-tertiary)20, var(--color-accent-primary)20)',
                borderColor: 'var(--color-accent-tertiary)'
              }}
            >
              <Award className="icon-lg" style={{ color: 'var(--color-accent-tertiary)' }} />
            </div>
            <div>
              <h3 className="block-title">Certifications</h3>
              <p className="block-subtitle">Oracle Cloud & AI credentials</p>
            </div>
          </div>

          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                className="cert-card"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <div
                  className="cert-icon"
                  style={{
                    background: `linear-gradient(135deg, ${cert.iconColor}20, ${cert.iconColor}40)`,
                    borderColor: cert.iconColor
                  }}
                >
                  {React.createElement(cert.icon, { className: "icon-lg", style: { color: cert.iconColor } })}
                </div>
                <div className="cert-content">
                  <h4 className="cert-name">{cert.title}</h4>
                  <p className="cert-issuer">{cert.issuer} · {cert.issued}</p>
                  <div className="cert-tags">
                    {cert.tags.map((tag, i) => (
                      <span key={tag} className="cert-tag" style={{ borderColor: cert.iconColor }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <motion.a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="cert-link-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="icon-sm" />
                  <span>Show Credential</span>
                </motion.a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CV;