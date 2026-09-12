import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Code2,
  Cpu,
  Brain,
  Layers,
  Search,
  Filter,
  Lock,
  FolderOpen,
  Eye,
  ExternalLink,
} from 'lucide-react';
import './Projects.css';

// Category-specific icons for gradient placeholders
const categoryPlaceholderIcons = {
  'AI/ML': Brain,
  'MLOps': Cpu,
  'Full-Stack': Code2,
  'Computer Vision': Eye,
  'Agentic AI': Brain,
};

// SVG Gradient Placeholder Component
function ProjectPlaceholder({ category, CategoryIcon }) {
  const gradients = {
    'AI/ML': 'from-cyan-500/20 via-blue-500/10 to-purple-500/20',
    'MLOps': 'from-purple-500/20 via-violet-500/10 to-indigo-500/20',
    'Full-Stack': 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
    'Computer Vision': 'from-pink-500/20 via-rose-500/10 to-red-500/20',
    'Agentic AI': 'from-cyan-500/20 via-blue-500/10 to-purple-500/20',
  };

  const borderColors = {
    'AI/ML': 'border-cyan-500/30',
    'MLOps': 'border-purple-500/30',
    'Full-Stack': 'border-emerald-500/30',
    'Computer Vision': 'border-pink-500/30',
    'Agentic AI': 'border-cyan-500/30',
  };

  const iconColors = {
    'AI/ML': 'text-cyan-400',
    'MLOps': 'text-purple-400',
    'Full-Stack': 'text-emerald-400',
    'Computer Vision': 'text-pink-400',
    'Agentic AI': 'text-cyan-400',
  };

  const gradient = gradients[category] || gradients['AI/ML'];
  const borderColor = borderColors[category] || borderColors['AI/ML'];
  const iconColor = iconColors[category] || iconColors['AI/ML'];

  return (
    <div className={`relative w-full h-full flex items-center justify-center p-6 bg-gradient-to-br ${gradient} ${borderColor} border rounded-t-2xl overflow-hidden`}>
      <span className="absolute top-4 left-4 px-2.5 py-1 text-xs font-medium rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
        {category}
      </span>
      <svg className="absolute inset-0 opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>

      <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/5 blur-xl" />
      <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-white/5 blur-xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 blur-xl" />

      <div className="relative flex flex-col items-center gap-3">
        <CategoryIcon className={`${iconColor} text-5xl drop-shadow-[0_0_20px_currentColor]`} />
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
          {category}
        </span>
      </div>
    </div>
  );
}

// Project Image Component with fallback
function ProjectImage({ src, alt, category, CategoryIcon, isError }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError || isError) {
    return <ProjectPlaceholder category={category} CategoryIcon={CategoryIcon} />;
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-t-2xl">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => setHasError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" aria-hidden="true" />
    </div>
  );
}

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = RAW_API_URL.replace(/\/+$/, '');

const categories = ['All', 'AI/ML', 'MLOps', 'Full-Stack', 'Computer Vision', 'Agentic AI'];

const categoryIcons = {
  'AI/ML': Brain,
  'MLOps': Cpu,
  'Full-Stack': Code2,
  'Computer Vision': Eye,
  'Agentic AI': Brain,
  'All': Layers
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    async function fetchProjects() {
      try {
        setStatus('loading');
        const res = await fetch(`${API_URL}/api/projects`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
        setStatus('ok');
      } catch {
        setProjects([]);
        setStatus('error');
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => projects.filter(project => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const projectTech = Array.isArray(project.technologies) ? project.technologies : [];
    const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          projectTech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }), [projects, activeCategory, searchQuery]);

  return (
    <section className="projects section" id="projects">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Work</span>
          <h2 className="section-title">Featured <span>Projects</span></h2>
          <p className="section-description">
            A selection of production-grade systems and open-source contributions in AI, MLOps, and web engineering
          </p>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          className="projects-controls"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="controls-left">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="controls-right">
            <div className="category-filters" role="tablist" aria-label="Project categories">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`category-filter ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * categories.indexOf(cat) }}
                >
                  {React.createElement(categoryIcons[cat], { className: "icon-sm" })}
                  {cat}
                </motion.button>
              ))}
            </div>

            <div className="view-toggle" role="group" aria-label="View mode">
              <motion.button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                whileTap={{ scale: 0.95 }}
                aria-label="Grid view"
              >
                <Layers className="icon-md" />
              </motion.button>
              <motion.button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                whileTap={{ scale: 0.95 }}
                aria-label="List view"
              >
                <Filter className="icon-md" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Status & Empty Messages */}
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div
              className="projects-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="loading"
            >
              <motion.div className="loading-spinner" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
              Loading projects...
            </motion.div>
          )}

          {status !== 'loading' && projects.length === 0 && (
            <motion.div
              className="projects-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              key="no-projects"
            >
              <FolderOpen className="icon-md" />
              No projects found yet.
            </motion.div>
          )}

          {status !== 'loading' && projects.length > 0 && filteredProjects.length === 0 && (
            <motion.div
              className="projects-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              key="empty-filter"
            >
              <Search className="icon-md" />
              No projects match your filters.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects Grid/List */}
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 && (
            <motion.div
              key={viewMode}
              className={`projects-grid ${viewMode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, viewMode }) {
  const CategoryIcon = categoryIcons[project.category] || Code2;
  const PlaceholderIcon = categoryPlaceholderIcons[project.category] || Brain;
  const technologies = Array.isArray(project.technologies) ? project.technologies : [];

  const techToShow = technologies.slice(0, viewMode === 'grid' ? 6 : 8);
  const remainingCount = technologies.length - techToShow.length;

  return (
    <motion.article
      className={`project-card ${project.featured ? 'is-featured' : ''} ${viewMode}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
    >
      {/* Preview Image */}
      <div className="project-thumb group">
        <ProjectImage
          src={project.image}
          alt={`Preview of ${project.title}`}
          category={project.category}
          CategoryIcon={PlaceholderIcon}
        />
        <div className="thumb-badge-wrapper">
          {project.featured && <span className="thumb-badge featured">Featured</span>}
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        {/* Tech Tags */}
        <div className="project-tech" role="list" aria-label="Technologies used">
          {techToShow.map((tech, i) => (
            <motion.span
              key={tech}
              className="tech-tag"
              role="listitem"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.03, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              {tech}
            </motion.span>
          ))}
          {remainingCount > 0 && (
            <motion.span
              className="tech-tag tech-more-tag"
              role="listitem"
              whileHover={{ scale: 1.05 }}
            >
              +{remainingCount} more
            </motion.span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="card-actions">
          {project.demo_url && (
            <motion.a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer noopener"
              className="action-btn secondary"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`View ${project.title} live demo`}
            >
              <ExternalLink className="icon-sm" aria-hidden="true" />
              <span>Live Demo</span>
            </motion.a>
          )}
          {project.repo_url ? (
            <motion.a
              href={project.repo_url}
              target="_blank"
              rel="noreferrer noopener"
              className="action-btn primary"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`View ${project.title} source code on GitHub`}
            >
              <GitBranch className="icon-sm" aria-hidden="true" />
              <span>View Code</span>
            </motion.a>
          ) : (
            <button className="action-btn disabled" disabled aria-label="Private repository">
              <Lock className="icon-sm" aria-hidden="true" />
              <span>Private</span>
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default Projects;