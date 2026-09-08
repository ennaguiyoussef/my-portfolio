import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  GraduationCap,
  Brain,
  Cpu,
  Award,
  ChevronRight,
  CheckCircle2,
  Building2,
  MapPin,
  Globe,
  Mail,
  ExternalLink
} from 'lucide-react';
import './Roadmap.css';

const roadmapSteps = [
  {
    id: 'baccalaureate',
    year: '2021',
    title: 'Scientific Baccalaureate',
    subtitle: 'Mathematics & Physics Specialization',
    institution: 'High School Excellence Program',
    location: 'Morocco',
    icon: Award,
    iconColor: 'var(--color-accent-primary)',
    skills: ['Advanced Mathematics', 'Physics', 'Chemistry', 'Critical Thinking'],
    type: 'education'
  },
  {
    id: 'bachelor',
    year: '2022 – 2025',
    title: 'Licence in Mathematical & Computer Sciences (SMI)',
    subtitle: 'Applied Mathematics & Computer Science',
    institution: 'USMBA, Fez',
    location: 'Fez, Morocco',
    icon: GraduationCap,
    iconColor: 'var(--color-accent-secondary)',
    skills: ['Algorithms & Data Structures', 'C/C++', 'Java', 'Databases', 'Networks', 'Linear Algebra', 'Statistics'],
    type: 'education'
  },
  {
    id: 'master',
    year: '2025 – 2027 (Current)',
    title: 'Master in Web Intelligence & Data Science (WISD)',
    subtitle: 'AI, Machine Learning & Web Technologies — Double Degree with Sorbonne Université (Institut Galilée, Master EID2)',
    institution: 'USMBA, Fez / Sorbonne Université, Institut Galilée',
    location: 'Fez, Morocco / Paris, France',
    icon: Brain,
    iconColor: 'var(--color-accent-tertiary)',
    skills: ['ML & Deep Learning', 'Agentic AI', 'MLOps', 'Cloud', 'Full-Stack', 'LangGraph', 'Data Engineering', 'Decision Systems'],
    type: 'education'
  },
  {
    id: 'current',
    year: '2026 — Present',
    title: 'Open to Internship: AI Engineer & Data Scientist',
    subtitle: 'Looking for an End-of-Studies / Master Thesis Internship (PFE) or Engineering Placement',
    institution: 'Available for Hybrid / On-site / Remote',
    location: 'Fez / Casablanca / Remote',
    locationSecondary: 'Open to Relocation / Worldwide',
    icon: Cpu,
    iconColor: 'var(--color-accent-success)',
    skills: ['Machine Learning', 'Agentic AI', 'Deep Learning', 'NLP / RAG', 'Python / PyTorch', 'Spring Boot', 'Docker'],
    type: 'career',
    isActive: true,
    cta: {
      label: 'Get in Touch / Hire Me',
      action: 'mailto:youssef.ennagui@usmba.ac.ma'
    }
  }
];

const futureSteps = [
  {
    id: 'phd',
    year: '2027+',
    title: 'PhD in AI',
    subtitle: 'Multi-Agent Systems Research',
    icon: Award,
    iconColor: 'var(--color-accent-primary)',
  },
  {
    id: 'startup',
    year: 'Future',
    title: 'AI Startup',
    subtitle: 'Democratizing Agentic AI',
    icon: ChevronRight,
    iconColor: 'var(--color-accent-secondary)',
  },
];

function Roadmap() {
  const containerRef = useRef(null);
  const [visibleSteps, setVisibleSteps] = useState(new Set());
  const { scrollY } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  // Track which steps are visible for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSteps(prev => new Set(prev).add(entry.target.dataset.stepId));
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = containerRef.current?.querySelectorAll('[data-step-id]');
    elements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Animate the connecting line progress
  const lineProgress = useTransform(scrollY, [0, 1], [0, 100]);

  return (
    <section className="roadmap section" id="roadmap" ref={containerRef}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Journey</span>
          <h2 className="section-title">Education & Career <span>Roadmap</span></h2>
          <p className="section-description">
            A chronological journey through academic excellence and professional growth in AI & Web Technologies
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="timeline-wrapper">
          {/* Timeline Axis - The central spine */}
          <div className="timeline-axis">
            {/* Progress fill */}
            <motion.div
              className="timeline-progress"
              style={{ height: lineProgress }}
            />
            {/* Progress indicator */}
            <motion.div
              className="timeline-indicator"
              animate={{
                scale: [1, 1.3, 1],
                boxShadow: [
                  '0 0 0 0 rgba(34, 211, 238, 0.5)',
                  '0 0 0 20px rgba(34, 211, 238, 0)',
                  '0 0 0 0 rgba(34, 211, 238, 0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Steps */}
          <div className="timeline-steps" role="list" aria-label="Education and career timeline">
            {roadmapSteps.map((step, index) => (
              <TimelineStep
                key={step.id}
                step={step}
                index={index}
                isLast={index === roadmapSteps.length - 1}
                isVisible={visibleSteps.has(step.id)}
              />
            ))}

            {/* Future Aspirations */}
            <motion.div
              className="future-aspirations"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              role="listitem"
            >
              <div className="future-header">
                <motion.div
                  className="future-icon"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <ChevronRight className="icon-xl" style={{ color: 'var(--color-accent-primary)' }} />
                </motion.div>
                <div>
                  <h3 className="future-title">Future Aspirations</h3>
                  <p className="future-subtitle">Where the journey continues...</p>
                </div>
              </div>

              <div className="future-grid" role="list">
                {futureSteps.map((future, i) => (
                  <motion.div
                    key={future.id}
                    className="future-card"
                    role="listitem"
                    whileHover={{ y: -8, scale: 1.02 }}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
                  >
                    <div
                      className="future-card-icon"
                      style={{
                        background: `linear-gradient(135deg, ${future.iconColor}20, ${future.iconColor}40)`,
                        borderColor: future.iconColor
                      }}
                    >
                      {React.createElement(future.icon, { className: "icon-lg", style: { color: future.iconColor } })}
                    </div>
                    <div className="future-card-content">
                      <span className="future-year">{future.year}</span>
                      <h4 className="future-card-title">{future.title}</h4>
                      <p className="future-card-subtitle">{future.subtitle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineStep({ step, index, isLast, isVisible }) {
  const isActive = step.isActive === true;
  const stepRef = useRef(null);

  return (
    <motion.article
      ref={stepRef}
      className={`timeline-step ${isActive ? 'is-active' : ''} ${step.type}`}
      data-step-id={step.id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{ '--step-color': step.iconColor }}
      role="listitem"
    >
      {/* Left Column: Year Badge */}
      <div className="timeline-year" aria-hidden="true">
        <span className={`year-badge ${isActive ? 'is-active' : ''}`}>
          {step.year}
        </span>
      </div>

      {/* Center Column: Node & Connector */}
      <div className="timeline-node-column">
        <motion.div
          className="node-wrapper"
          animate={{ scale: isVisible ? [1, 1.12, 1] : 1 }}
          transition={{ duration: 2, repeat: isVisible ? Infinity : 0, delay: index * 0.15 }}
        >
          {/* Connector line segment (above node) */}
          {!isLast && (
            <div className="connector-segment" aria-hidden="true" />
          )}

          {/* Node Core */}
          <div className="node-core" role="img" aria-label={`${step.title} milestone`}>
            <div className="node-inner">
              {React.createElement(step.icon, { className: "node-icon", style: { color: step.iconColor } })}
            </div>
            <div className="node-ring" />
            <div className="node-pulse" />
            {isVisible && (
              <motion.div
                className="node-check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                <CheckCircle2 className="icon-sm" style={{ color: 'var(--color-bg-deep)' }} />
              </motion.div>
            )}
            {isActive && (
              <motion.div
                className="node-active-ring"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.15, 0]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            )}
          </div>

          {/* Connector line segment (below node) */}
          <div className="connector-segment" aria-hidden="true" />
        </motion.div>
      </div>

      {/* Right Column: Content Card */}
      <motion.div
        className={`timeline-card ${step.type} ${isActive ? 'is-active' : ''}`}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 + index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ x: 6 }}
      >
        <div className="card-header">
          <div
            className="card-icon"
            style={{
              background: `linear-gradient(135deg, ${step.iconColor}15, ${step.iconColor}30)`,
              borderColor: step.iconColor
            }}
          >
            {React.createElement(step.icon, { className: "icon-lg", style: { color: step.iconColor } })}
          </div>
          <div className="card-meta">
            <h3 className="card-title">{step.title}</h3>
            <p className="card-subtitle">{step.subtitle}</p>
            <div className="card-meta-items">
              <span className="meta-item institution">
                <Building2 className="icon-xs" />
                {step.institution}
              </span>
              <span className="meta-item location">
                <MapPin className="icon-xs" />
                {step.location}
              </span>
              {step.locationSecondary && (
                <span className="meta-item location-secondary">
                  <Globe className="icon-xs" />
                  {step.locationSecondary}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card-skills">
          {step.skills.slice(0, 6).map((skill, i) => (
            <motion.span
              key={skill}
              className="skill-tag"
              style={{ '--tag-color': step.iconColor }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.04, duration: 0.3 }}
              whileHover={{ scale: 1.06 }}
            >
              {skill}
            </motion.span>
          ))}
          {step.skills.length > 6 && (
            <motion.span
              className="skill-tag more-tag"
              whileHover={{ scale: 1.06 }}
            >
              +{step.skills.length - 6} more
            </motion.span>
          )}
        </div>

        {/* Active CTA */}
        {isActive && step.cta && (
          <motion.div
            className="card-cta"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <motion.a
              href={step.cta.action}
              className="cta-button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Mail className="icon-sm" aria-hidden="true" />
              <span>{step.cta.label}</span>
              <ExternalLink className="icon-sm" aria-hidden="true" />
            </motion.a>
            <p className="cta-note">Available immediately for end-of-studies internship (PFE)</p>
          </motion.div>
        )}
      </motion.div>
    </motion.article>
  );
}

export default Roadmap;