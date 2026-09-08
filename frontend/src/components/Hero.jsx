import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Cpu } from 'lucide-react';
import { GitHubIcon, LinkedInIcon, EmailIcon } from './BrandIcons';
import './Hero.css';

function Hero() {
  return (
    <header className="hero" id="top">
      {/* Background Effects */}
      <div className="hero-bg" aria-hidden="true">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
        <div className="grid-pattern" />
      </div>

      <div className="hero-content container">
        <div className="hero-grid">
          {/* LEFT: Content */}
          <motion.div
            className="hero-content-left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Greeting Badge */}
            <motion.div
              className="hero-greeting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="greeting-badge">
                <span className="greeting-wave" aria-hidden="true">👋</span>
                Hello, I'm
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              className="hero-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Youssef <span className="name-accent">Ennagui</span>
            </motion.h1>

            {/* Role */}
            <motion.div
              className="hero-role"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="hero-role-text">
                <span className="role-icon-wrapper">
                  <Cpu className="icon-lg" />
                </span>
                Agentic AI Engineer <span className="role-separator">|</span> Data Scientist
              </span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="hero-tagline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Master's student in Web Intelligence & Data Science, building intelligent systems
              that combine Machine Learning, Agentic AI, and modern web architectures.
              Turning cutting-edge research into reliable, scalable production systems.
            </motion.p>

            {/* Actions */}
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.a
                href="#projects"
                className="btn btn-primary"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Projects
                <ArrowRight className="icon-md" />
              </motion.a>
              <motion.a
                href="#contact"
                className="btn btn-secondary"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Me
                <Mail className="icon-md" />
              </motion.a>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="scroll-indicator"
              animate={{
                y: [0, 10, 0],
                opacity: [0, 1, 1]
              }}
              transition={{
                y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                opacity: { delay: 1.2, duration: 0.6 }
              }}
            >
              <motion.div className="scroll-mouse" aria-hidden="true">
                <div className="scroll-wheel" />
              </motion.div>
              <span className="scroll-text">Scroll to explore</span>
            </motion.div>
          </motion.div>

          {/* RIGHT: Clean Compact Portrait */}
          <motion.div
            className="hero-portrait"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="portrait-container">
              <div className="portrait-card">
                <img
                  src="/avatar.jpeg"
                  alt="Youssef Ennagui"
                  className="portrait-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling?.style?.setProperty('display', 'flex');
                  }}
                />
                <div className="portrait-fallback" style={{ display: 'none' }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <circle cx="12" cy="8" r="5" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                </div>

                {/* Floating Social Icons */}
                <div className="portrait-social-dock">
                  <a href="https://github.com/ennaguiyoussef" target="_blank" rel="noreferrer noopener" aria-label="GitHub">
                    <GitHubIcon className="icon-sm" />
                  </a>
                  <a href="https://www.linkedin.com/in/youssef-ennagui-b1862b37a/" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
                    <LinkedInIcon className="icon-sm" />
                  </a>
                  <a href="mailto:youssef.ennagui@usmba.ac.ma" aria-label="Email">
                    <EmailIcon className="icon-sm" />
                  </a>
                </div>
              </div>

              {/* Status Badge */}
              <div className="hero-status-pill">
                <span className="status-dot"></span>
                <span>Available for opportunities</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

export default Hero;