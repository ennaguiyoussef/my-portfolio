import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Cpu,
  Code2,
  Database,
  Cloud,
  Terminal,
  GitBranch,
  Container,
  Layers,
  Zap,
  User,
  Award,
  BookOpen,
  Target
} from 'lucide-react';
import './About.css';

const skillCategories = [
  {
    category: 'AI & Machine Learning',
    icon: Brain,
    color: 'var(--color-accent-primary)',
    skills: ['PyTorch', 'TensorFlow/Keras', 'Transformers/NLP', 'Scikit-Learn', 'Computer Vision', 'MLOps']
  },
  {
    category: 'Agentic AI & LLMs',
    icon: Cpu,
    color: 'var(--color-accent-secondary)',
    skills: ['LangGraph', 'LangChain', 'RAG Pipelines', 'Prompt Engineering', 'Vector Databases', 'Agent Evaluation']
  },
  {
    category: 'Full-Stack Development',
    icon: Code2,
    color: 'var(--color-accent-tertiary)',
    skills: ['React/TypeScript', 'FastAPI/Python', 'Node.js', 'PostgreSQL', 'Redis', 'GraphQL']
  },
  {
    category: 'DevOps & Cloud',
    icon: Cloud,
    color: 'var(--color-accent-warning)',
    skills: ['Docker', 'Kubernetes', 'AWS/GCP', 'CI/CD (GitHub Actions)', 'Terraform', 'Monitoring']
  }
];

const tools = [
  { name: 'Git/GitHub', icon: GitBranch, category: 'Version Control' },
  { name: 'Docker', icon: Container, category: 'Containerization' },
  { name: 'Linux/Terminal', icon: Terminal, category: 'Environment' },
  { name: 'VS Code', icon: Code2, category: 'IDE' },
  { name: 'Jupyter', icon: Layers, category: 'Notebooks' },
  { name: 'Postman', icon: Zap, category: 'API Testing' },
];

const highlights = [
  { icon: Award, label: 'Top 5%', desc: 'National Math Ranking' },
  { icon: BookOpen, label: '3.9/4.0', desc: 'Master GPA' },
  { icon: Target, label: '15+', desc: 'Projects Built' },
  { icon: User, label: '3+', desc: 'Years Experience' },
];

function About() {
  return (
    <section className="about section" id="about">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Profile</span>
          <h2 className="section-title">About <span>Me</span></h2>
          <p className="section-description">
            Master's student in Web Intelligence & Data Science, passionate about building
            intelligent systems that combine Machine Learning, Agentic AI, and modern web architectures.
          </p>
        </motion.div>

        <div className="about-grid">
          {/* Image/Photo - LEFT Side */}
          <motion.div
            className="about-image"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="image-wrapper glass">
              {/* Image Container - proper 4:5 portrait aspect ratio */}
              <div className="about-image-container">
                <img
                  src="/avatar.jpeg"
                  alt="Youssef Ennagui - Agentic AI Engineer"
                  className="about-image-img w-full h-full object-cover object-top rounded-2xl"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling?.style?.setProperty('display', 'flex');
                  }}
                />
                {/* Fallback SVG - shown if image fails to load */}
                <div className="image-placeholder fallback" aria-label="Profile photo fallback" style={{ display: 'none' }}>
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="12" cy="8" r="5" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                </div>
              </div>
              <div className="image-ring" />
              <div className="image-ring image-ring-2" />

              {/* Floating badges - positioned at corners, not over face */}
              <div className="floating-badge badge-1">
                <Brain className="icon-md" />
                <span>AI Engineer</span>
              </div>
              <div className="floating-badge badge-2">
                <Code2 className="icon-md" />
                <span>Full-Stack</span>
              </div>
              <div className="floating-badge badge-3">
                <Cpu className="icon-md" />
                <span>Agentic AI</span>
              </div>
            </div>
          </motion.div>

          {/* Content - RIGHT Side */}
          <motion.div
            className="about-content"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="about-card glass">
              <div className="about-intro">
                <p className="about-text">
                  Holding a Bachelor's degree in Mathematical and Computer Sciences (SMI),
                  I am currently pursuing a Master's degree in Web Intelligence and Data Science (WISD).
                  Driven by AI engineering and full-stack software development, I build end-to-end machine
                  learning pipelines, deep learning models, and scalable web applications.
                </p>
                <p className="about-text">
                  My focus is on integrating autonomous agents and intelligent data solutions to solve
                  complex, real-world problems. I thrive at the intersection of research and production,
                  turning cutting-edge AI research into reliable, scalable systems.
                </p>
              </div>

              {/* Highlights - Minimal */}
              <div className="about-highlights">
                {highlights.map((highlight, index) => (
                  <motion.div
                    key={highlight.label}
                    className="highlight-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="highlight-icon">
                      {React.createElement(highlight.icon, { className: "icon-md", style: { color: 'var(--color-accent-primary)' } })}
                    </div>
                    <span className="highlight-value">{highlight.label}</span>
                    <span className="highlight-desc">{highlight.desc}</span>
                  </motion.div>
                ))}
              </div>

              {/* Tools & Environment */}
              <div className="about-tools">
                <h3 className="tools-title">Tools & Environment</h3>
                <div className="tools-grid">
                  {tools.map((tool, index) => (
                    <motion.button
                      key={tool.name}
                      className="tool-card"
                      whileHover={{ y: -4, scale: 1.02 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      <div className="tool-icon" style={{ color: 'var(--color-accent-primary)' }}>
                        {React.createElement(tool.icon, { className: "icon-xl" })}
                      </div>
                      <span className="tool-name">{tool.name}</span>
                      <span className="tool-category">{tool.category}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Minimal Skills - Just Tags */}
              <div className="about-skills-minimal">
                <h3 className="skills-minimal-title">
                  <span className="skills-minimal-icon">
                    <Brain className="icon-md" style={{ color: 'var(--color-accent-primary)' }} />
                  </span>
                  Core Competencies
                </h3>
                <div className="skills-minimal-grid">
                  {skillCategories.map((category, catIndex) => (
                    <motion.div
                      key={category.category}
                      className="skills-minimal-category"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + catIndex * 0.08 }}
                    >
                      <div className="skills-minimal-header">
                        <div
                          className="skills-minimal-icon"
                          style={{
                            background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)`,
                            borderColor: category.color
                          }}
                        >
                          {React.createElement(category.icon, { className: "icon-sm", style: { color: category.color } })}
                        </div>
                        <h4 className="skills-minimal-name">{category.category}</h4>
                      </div>
                      <div className="skills-minimal-tags">
                        {category.skills.map((skill, skillIndex) => (
                          <motion.span
                            key={skill}
                            className="skill-tag-minimal"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + catIndex * 0.08 + skillIndex * 0.03 }}
                            whileHover={{ scale: 1.05 }}
                            style={{ borderColor: category.color }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;