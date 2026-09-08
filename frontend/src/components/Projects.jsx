import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  ExternalLink,
  Code2,
  Database,
  Cloud,
  Cpu,
  Brain,
  Zap,
  Layers,
  Search,
  Filter,
  Lock,
  Image,
  Star,
  GitFork,
  Server,
  Bot,
} from 'lucide-react';
import './Projects.css';

// Category-specific icons for gradient placeholders
const categoryPlaceholderIcons = {
  'AI/ML': Brain,
  'MLOps': Cpu,
  'Full-Stack': Code2,
  'Infrastructure': Database,
};

// SVG Gradient Placeholder Component
function ProjectPlaceholder({ category, CategoryIcon }) {
  const gradients = {
    'AI/ML': 'from-cyan-500/20 via-blue-500/10 to-purple-500/20',
    'MLOps': 'from-purple-500/20 via-violet-500/10 to-indigo-500/20',
    'Full-Stack': 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
    'Infrastructure': 'from-amber-500/20 via-orange-500/10 to-red-500/20',
  };

  const borderColors = {
    'AI/ML': 'border-cyan-500/30',
    'MLOps': 'border-purple-500/30',
    'Full-Stack': 'border-emerald-500/30',
    'Infrastructure': 'border-amber-500/30',
  };

  const iconColors = {
    'AI/ML': 'text-cyan-400',
    'MLOps': 'text-purple-400',
    'Full-Stack': 'text-emerald-400',
    'Infrastructure': 'text-amber-400',
  };

  const gradient = gradients[category] || gradients['AI/ML'];
  const borderColor = borderColors[category] || borderColors['AI/ML'];
  const iconColor = iconColors[category] || iconColors['AI/ML'];

  return (
    <div className={`relative w-full h-full flex items-center justify-center p-6 bg-gradient-to-br ${gradient} ${borderColor} border rounded-t-2xl overflow-hidden`}>
      {/* Glassmorphic category badge - top left */}
      <span className="absolute top-4 left-4 px-2.5 py-1 text-xs font-medium rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
        {category}
      </span>
      {/* Subtle grid pattern */}
      <svg className="absolute inset-0 opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>

      {/* Floating geometric accents */}
      <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/5 blur-xl" />
      <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-white/5 blur-xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 blur-xl" />

      {/* Category Icon */}
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
      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" aria-hidden="true" />
    </div>
  );
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const fallbackProjects = [
  {
    id: 1,
    title: 'Agentic RAG Chatbot',
    description: 'Production-grade chatbot with autonomous multi-step reasoning, citation tracking, and real-time token streaming.',
    longDescription: 'Built a sophisticated RAG system using LangGraph for agent orchestration. Implements hybrid search (semantic + keyword), document reranking, and tool-calling agents for web search, code execution, and API integration. Includes conversation memory, source attribution, and real-time token streaming.',
    technologies: ['Python', 'LangGraph', 'FastAPI', 'ChromaDB', 'React', 'TypeScript', 'Tailwind CSS', 'WebSockets'],
    category: 'AI/ML',
    demo_url: '',
    repo_url: 'https://github.com/ennaguiyoussef',
    featured: true,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop',
    metrics: { stars: 247, forks: 32 }
  },
  {
    id: 2,
    title: 'End-to-End ML Pipeline Platform',
    description: 'Complete ML platform from data ingestion to model deployment with automated feature engineering and model monitoring.',
    longDescription: 'Designed and built a production ML platform with Kubeflow pipelines. Features automated data validation, drift detection, model registry with lineage tracking, canary deployments, and comprehensive monitoring dashboards. Supports both batch and real-time inference.',
    technologies: ['Python', 'PyTorch', 'Kubeflow', 'Docker', 'Kubernetes', 'MLflow', 'Prometheus', 'Grafana'],
    category: 'MLOps',
    demo_url: '',
    repo_url: 'https://github.com/ennaguiyoussef',
    featured: true,
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=450&fit=crop',
    metrics: { stars: 189, forks: 24 }
  },
  {
    id: 3,
    title: 'Multi-Agent Code Assistant',
    description: 'Autonomous multi-agent system for code generation, review, and refactoring with GitHub Actions integration.',
    longDescription: 'Built using LangGraph with specialized agents for code analysis, test generation, security review, and documentation. Integrates with GitHub Actions for automated PR reviews. Achieves 92% accuracy on HumanEval benchmark.',
    technologies: ['Python', 'LangGraph', 'FastAPI', 'React', 'PostgreSQL', 'Redis', 'GitHub API', 'WebSockets'],
    category: 'AI/ML',
    demo_url: '',
    repo_url: 'https://github.com/ennaguiyoussef',
    featured: false,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    metrics: { stars: 156, forks: 18 }
  },
  {
    id: 4,
    title: 'Real-Time Analytics Dashboard',
    description: 'High-performance dashboard for streaming data visualization handling 100K+ events/second with sub-second latency.',
    longDescription: 'Built with React, TypeScript, and WebSocket connections to a Go backend. Implements virtualized rendering for large datasets, WebGL-accelerated charts, and real-time collaboration using CRDTs. Deployed on Kubernetes with auto-scaling.',
    technologies: ['React', 'TypeScript', 'Go', 'WebSockets', 'ClickHouse', 'Redis', 'Docker', 'Kubernetes'],
    category: 'Full-Stack',
    demo_url: '',
    repo_url: 'https://github.com/ennaguiyoussef',
    featured: false,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    metrics: { stars: 312, forks: 45 }
  },
  {
    id: 5,
    title: 'Vector Search Engine',
    description: 'Custom vector database with HNSW indexing, hybrid search, filtering, and real-time updates.',
    longDescription: 'Built from scratch in Rust with Python bindings. Implements hierarchical navigable small world (HNSW) graphs for approximate nearest neighbor search. Supports metadata filtering, range queries, and incremental indexing. Achieves 99.5% recall at 10x lower latency.',
    technologies: ['Rust', 'Python', 'PyO3', 'HNSW', 'SIMD', 'Docker', 'Benchmarking'],
    category: 'Infrastructure',
    demo_url: '',
    repo_url: 'https://github.com/ennaguiyoussef',
    featured: true,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    metrics: { stars: 423, forks: 56 }
  },
  {
    id: 6,
    title: 'Distributed Task Queue',
    description: 'High-throughput distributed task queue with priority scheduling, retries, dead letter queues, and exactly-once semantics.',
    longDescription: 'Implemented in Go with Redis backend. Features priority queues, delayed execution, cron-like scheduling, rate limiting, and horizontal scaling. Includes Python SDK and dashboard for monitoring. Processes 1M+ tasks/day in production.',
    technologies: ['Go', 'Redis', 'Protocol Buffers', 'Docker', 'Kubernetes', 'Prometheus', 'gRPC'],
    category: 'Infrastructure',
    demo_url: '',
    repo_url: 'https://github.com/ennaguiyoussef',
    featured: false,
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop',
    metrics: { stars: 198, forks: 28 }
  }
];

const categories = ['All', 'AI/ML', 'MLOps', 'Full-Stack', 'Infrastructure'];

const categoryIcons = {
  'AI/ML': Brain,
  'MLOps': Cpu,
  'Full-Stack': Code2,
  'Infrastructure': Database,
  'All': Layers
};

function Projects() {
  const [projects, setProjects] = useState(fallbackProjects);
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
        if (data && data.length > 0) {
          setProjects(data);
          setStatus('ok');
        } else {
          setStatus('fallback');
        }
      } catch {
        setStatus('fallback');
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => projects.filter(project => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
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

        {/* Status Messages */}
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

          {status === 'fallback' && (
            <motion.div
              className="projects-message projects-warning"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              key="fallback"
            >
              <Zap className="icon-md" />
              API unavailable — showing sample projects. Start the backend to see live data.
            </motion.div>
          )}

          {status !== 'loading' && filteredProjects.length === 0 && (
            <motion.div
              className="projects-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              key="empty"
            >
              <Search className="icon-md" />
              No projects match your filters.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects Grid/List */}
        <AnimatePresence mode="popLayout">
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
        </AnimatePresence>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, viewMode }) {
  const CategoryIcon = categoryIcons[project.category] || Code2;
  const PlaceholderIcon = categoryPlaceholderIcons[project.category] || Brain;

  const techToShow = project.technologies.slice(0, viewMode === 'grid' ? 6 : 8);
  const remainingCount = project.technologies.length - techToShow.length;

  return (
    <motion.article
      className={`project-card ${project.featured ? 'is-featured' : ''} ${viewMode}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
    >
      {/* 1. Preview Image / Mockup Banner */}
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

      {/* 2. Card Content - Flex Column */}
      <div className="card-body">
        {/* Title */}
        <h3 className="project-title">{project.title}</h3>

        {/* Description - Clean 3-line clamp */}
        <p className="project-description">{project.description}</p>

        {/* Tech Tags - Individual pill chips with clean flex gap layout */}
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

        {/* 3. Footer Actions - Pinned to Bottom */}
        <div className="card-actions">
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