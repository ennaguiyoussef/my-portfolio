import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  ExternalLink,
  Upload,
  FileText,
  Download,
  Eye,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Settings,
  Trash2,
  Pencil,
  List,
  Star,
  RefreshCw,
  Lock,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { GitHubIcon } from './BrandIcons';
import { API_URL, getAdminKey, setAdminKey, clearAdminKey, adminHeaders } from '../api';
import './AdminPanel.css';

const EMPTY_FORM = {
  title: '',
  tagline: '',
  description: '',
  category: 'AI/ML',
  featured: false,
  techStack: [],
  githubUrl: '',
  demoUrl: '',
  coverImage: null,
  coverImageUrl: '',
  coverImagePreview: null,
};

function AdminPanel() {
  // --- Auth gate -------------------------------------------------------
  const [apiKey, setApiKey] = useState(getAdminKey());
  const [unlocked, setUnlocked] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [gateError, setGateError] = useState('');

  // --- UI state --------------------------------------------------------
  const [activeTab, setActiveTab] = useState('projects');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);
  const cvFileInputRef = useRef(null);

  // --- Data ------------------------------------------------------------
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Tab 1: Add/Edit Project Form State
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Tab 3: CV Management State
  const [cvData, setCvData] = useState({
    file: null,
    fileName: 'No CV uploaded yet',
    uploadDate: new Date().toISOString().split('T')[0],
    fileSize: '—',
    version: '—',
    gpa: '3.9/4.0',
    yearsExperience: '3+',
    currentRole: 'Agentic AI Engineer',
    targetPosition: 'Senior AI Engineer',
  });

  const [cvUploading, setCvUploading] = useState(false);

  const categories = ['AI/ML', 'Agentic AI', 'MLOps', 'Full-Stack', 'Computer Vision'];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // --- Auth helpers ----------------------------------------------------
  const verifyAndUnlock = async (key) => {
    setUnlocking(true);
    setGateError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/verify`, {
        headers: { 'X-API-Key': key },
      });
      if (res.ok) {
        setAdminKey(key);
        setApiKey(key);
        setUnlocked(true);
        loadProjects();
      } else if (res.status === 401) {
        setGateError('Invalid API key.');
        clearAdminKey();
      } else if (res.status === 503) {
        setGateError('Admin API is not configured on the server (set ADMIN_API_KEY in backend/.env).');
      } else {
        setGateError(`Unexpected error (${res.status}).`);
      }
    } catch {
      setGateError('Cannot reach the API. Is the backend running on ' + API_URL + '?');
    } finally {
      setUnlocking(false);
    }
  };

  // Auto-verify a stored key on mount.
  useEffect(() => {
    const stored = getAdminKey();
    if (stored) verifyAndUnlock(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (keyInput.trim()) verifyAndUnlock(keyInput.trim());
  };

  const handleLock = () => {
    clearAdminKey();
    setApiKey('');
    setUnlocked(false);
    setKeyInput('');
    setGateError('');
  };

  const handleUnauthorized = () => {
    clearAdminKey();
    setApiKey('');
    setUnlocked(false);
    setGateError('Session expired — please re-enter your key.');
  };

  // --- Projects data ---------------------------------------------------
  const loadProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      if (res.ok) setProjects(await res.json());
    } catch {
      /* leave list as-is */
    } finally {
      setProjectsLoading(false);
    }
  };

  // --- Form handlers ---------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTechStackAdd = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !formData.techStack.includes(value)) {
        setFormData(prev => ({ ...prev, techStack: [...prev.techStack, value] }));
        e.target.value = '';
      }
    }
  };

  const handleTechStackBlur = (e) => {
    const value = e.target.value.trim();
    if (value && !formData.techStack.includes(value)) {
      setFormData(prev => ({ ...prev, techStack: [...prev.techStack, value] }));
      e.target.value = '';
    }
  };

  const removeTechTag = (tag) => {
    setFormData(prev => ({ ...prev, techStack: prev.techStack.filter(t => t !== tag) }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        showToast('Image must be less than 8MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          coverImage: file,
          coverImagePreview: event.target.result,
          coverImageUrl: '',
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, coverImageUrl: url, coverImage: null, coverImagePreview: url || null }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Image must be less than 8MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          coverImage: file,
          coverImagePreview: event.target.result,
          coverImageUrl: '',
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverImage = () => {
    setFormData(prev => ({ ...prev, coverImage: null, coverImagePreview: null, coverImageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Uploads / API calls --------------------------------------------
  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${API_URL}/api/admin/upload-image`, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey }, // no Content-Type: browser sets multipart boundary
      body: fd,
    });
    if (res.status === 401) {
      handleUnauthorized();
      throw new Error('unauthorized');
    }
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.detail || 'Image upload failed');
    }
    const data = await res.json();
    return data.url;
  };

  const handleSaveProject = async () => {
    if (!formData.title.trim()) {
      showToast('Project title is required', 'error');
      return;
    }
    if (!formData.description.trim()) {
      showToast('Description is required', 'error');
      return;
    }
    setIsSaving(true);
    try {
      let imageUrl = (formData.coverImageUrl || '').trim();
      if (formData.coverImage) {
        imageUrl = await uploadImage(formData.coverImage);
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        technologies: formData.techStack,
        demo_url: formData.demoUrl.trim(),
        repo_url: formData.githubUrl.trim(),
        category: formData.category,
        featured: formData.featured,
        image: imageUrl,
      };

      const url = editingId
        ? `${API_URL}/api/projects/${editingId}`
        : `${API_URL}/api/projects`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: adminHeaders(apiKey),
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail || 'Save failed');
      }

      showToast(editingId ? 'Project updated successfully!' : 'Project created successfully!');
      resetForm();
      await loadProjects();
      setActiveTab('manage');
    } catch (err) {
      if (err.message !== 'unauthorized') showToast(err.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const editProject = (p) => {
    setFormData({
      title: p.title || '',
      tagline: '',
      description: p.description || '',
      category: p.category || 'AI/ML',
      featured: !!p.featured,
      techStack: Array.isArray(p.technologies) ? p.technologies : [],
      githubUrl: p.repo_url || '',
      demoUrl: p.demo_url || '',
      coverImage: null,
      coverImageUrl: p.image || '',
      coverImagePreview: p.image || null,
    });
    setEditingId(p.id);
    setActiveTab('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'X-API-Key': apiKey },
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok && res.status !== 204) {
        throw new Error('Delete failed');
      }
      showToast('Project deleted');
      if (editingId === id) resetForm();
      await loadProjects();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  // --- CV upload -------------------------------------------------------
  const uploadCv = async (file) => {
    if (file.type !== 'application/pdf') {
      showToast('Please select a PDF file', 'error');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      showToast('CV must be less than 20MB', 'error');
      return;
    }
    setCvUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_URL}/api/admin/cv`, {
        method: 'POST',
        headers: { 'X-API-Key': apiKey },
        body: fd,
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail || 'CV upload failed');
      }
      const data = await res.json();
      setCvData(prev => ({
        ...prev,
        file,
        fileName: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        version: `v${new Date().getFullYear()}.${Date.now().toString().slice(-4)}`,
      }));
      showToast(data.message || 'CV uploaded', data.reindexed ? 'success' : 'error');
    } catch (err) {
      showToast(err.message || 'CV upload failed', 'error');
    } finally {
      setCvUploading(false);
      if (cvFileInputRef.current) cvFileInputRef.current.value = '';
    }
  };

  const handleCvFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadCv(file);
  };

  const handleCvDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) uploadCv(file);
  };

  const handleSaveCV = async () => {
    // Resume highlights are display-only for now (no backend field yet).
    showToast('Highlights saved locally (display-only).');
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // ====================================================================
  // Gate screen (shown until a valid key is entered)
  // ====================================================================
  if (!unlocked) {
    return (
      <div className="admin-panel">
        <div className="admin-bg" aria-hidden="true">
          <div className="gradient-orb orb-1" />
          <div className="gradient-orb orb-2" />
          <div className="grid-pattern" />
        </div>
        <div className="admin-gate">
          <motion.form
            className="admin-gate-card"
            onSubmit={handleUnlock}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <div className="admin-gate-icon">
              <Lock className="icon-lg" />
            </div>
            <h1 className="admin-gate-title">Admin Access</h1>
            <p className="admin-gate-subtitle">
              Enter your API key to manage projects and your CV.
            </p>
            <div className="form-field">
              <label htmlFor="admin-key">API Key</label>
              <input
                id="admin-key"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Paste your ADMIN_API_KEY"
                autoComplete="off"
                autoFocus
              />
            </div>
            {gateError && (
              <div className="admin-gate-error">
                <AlertCircle className="icon-sm" />
                <span>{gateError}</span>
              </div>
            )}
            <button type="submit" className="btn-primary" disabled={unlocking || !keyInput.trim()}>
              {unlocking ? (
                <>
                  <Loader2 className="icon-sm spinner" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="icon-sm" />
                  Unlock
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    );
  }

  // ====================================================================
  // Main dashboard
  // ====================================================================
  return (
    <div className="admin-panel">
      {/* Background Effects */}
      <div className="admin-bg" aria-hidden="true">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="grid-pattern" />
      </div>

      <div className="admin-container">
        {/* Header */}
        <motion.header className="admin-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="header-content">
            <div>
              <h1 className="admin-title">Portfolio Admin Dashboard</h1>
              <p className="admin-subtitle">Manage projects, CV, and portfolio content</p>
            </div>
            <div className="header-actions">
              <motion.span
                className="mode-badge connected"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                <ShieldCheck className="icon-xs" />
                Connected
              </motion.span>
              <button className="btn-secondary lock-btn" onClick={handleLock} title="Lock admin">
                <LogOut className="icon-sm" /> Lock
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <motion.nav className="tab-nav" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <Plus className="icon-sm" />
              {editingId ? 'Edit Project' : 'Add New Project'}
            </button>
            <button
              className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => { setActiveTab('manage'); loadProjects(); }}
            >
              <List className="icon-sm" />
              Manage Projects
            </button>
            <button
              className={`tab-btn ${activeTab === 'cv' ? 'active' : ''}`}
              onClick={() => setActiveTab('cv')}
            >
              <FileText className="icon-sm" />
              CV & Document Management
            </button>
          </motion.nav>
        </motion.header>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              className={`toast ${toast.type}`}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              key={toast.message}
            >
              <div className="toast-icon">
                {toast.type === 'success' ? <Check className="icon-sm" /> : <AlertCircle className="icon-sm" />}
              </div>
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Panels */}
        <AnimatePresence mode="wait">
          {activeTab === 'projects' && (
            <motion.div
              className="tab-panel"
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {editingId && (
                <div className="editing-banner">
                  <Pencil className="icon-sm" />
                  <span>Editing project #{editingId}</span>
                  <button type="button" className="btn-text" onClick={resetForm}>Cancel edit</button>
                </div>
              )}
              <form className="project-form" onSubmit={e => { e.preventDefault(); handleSaveProject(); }}>
                {/* Project Metadata */}
                <section className="form-section">
                  <h3 className="section-title">
                    <span className="section-icon"><ImageIcon className="icon-sm" /></span>
                    Project Metadata
                  </h3>
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="title">Project Title *</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Agentic RAG Chatbot"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="category">Category *</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field full-width">
                      <label htmlFor="description">Detailed Description *</label>
                      <div className="textarea-wrapper">
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe the project, architecture, challenges, and outcomes..."
                          rows={4}
                          required
                        />
                        <span className="char-count">{formData.description.length} chars</span>
                      </div>
                    </div>
                    <div className="form-field checkbox-field">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                        />
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-text">
                          <strong>Featured Project</strong> — Highlight on home page with special styling
                        </span>
                      </label>
                    </div>
                  </div>
                </section>

                {/* Tech Stack */}
                <section className="form-section">
                  <h3 className="section-title">
                    <span className="section-icon"><Settings className="icon-sm" /></span>
                    Tech Stack
                  </h3>
                  <div className="tech-tag-input">
                    <div className="tag-chips">
                      {formData.techStack.map((tag) => (
                        <motion.span key={tag} className="tag-chip" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                          <span>{tag}</span>
                          <button type="button" className="tag-remove" onClick={() => removeTechTag(tag)} aria-label={`Remove ${tag}`}>
                            <X className="icon-xs" />
                          </button>
                        </motion.span>
                      ))}
                      <input
                        type="text"
                        placeholder="Type tech (e.g., FastAPI, LangGraph) + Enter/Comma"
                        onKeyDown={handleTechStackAdd}
                        onBlur={handleTechStackBlur}
                        className="tag-input"
                        aria-label="Add technology"
                      />
                    </div>
                    <p className="field-hint">Press Enter or Comma to add tags. Click × to remove.</p>
                  </div>
                </section>

                {/* Media & Links */}
                <section className="form-section">
                  <h3 className="section-title">
                    <span className="section-icon"><ExternalLink className="icon-sm" /></span>
                    Media & Links
                  </h3>
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="githubUrl">GitHub Repository URL</label>
                      <div className="input-with-icon">
                        <GitHubIcon className="input-icon" />
                        <input
                          type="url"
                          id="githubUrl"
                          name="githubUrl"
                          value={formData.githubUrl}
                          onChange={handleInputChange}
                          placeholder="https://github.com/username/repo"
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="demoUrl">Live Demo / Docs URL</label>
                      <div className="input-with-icon">
                        <ExternalLink className="input-icon" />
                        <input
                          type="url"
                          id="demoUrl"
                          name="demoUrl"
                          value={formData.demoUrl}
                          onChange={handleInputChange}
                          placeholder="https://demo.example.com (optional)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cover Image Upload */}
                  <div className="form-field full-width">
                    <label>Project Cover Image</label>
                    <div className="cover-upload-area">
                      {formData.coverImagePreview ? (
                        <div className="cover-preview">
                          <img src={formData.coverImagePreview} alt="Cover preview" />
                          <div className="cover-actions">
                            <button type="button" className="btn-secondary" onClick={removeCoverImage}>
                              <Trash2 className="icon-xs" /> Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="dropzone"
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleCoverImageChange}
                            className="file-input"
                            id="coverImage"
                          />
                          <label htmlFor="coverImage" className="dropzone-label">
                            <Upload className="icon-lg" />
                            <span>Drag & drop image here or click to browse</span>
                            <p>PNG, JPG, WebP — Max 8MB</p>
                          </label>
                        </div>
                      )}
                      <div className="url-alternative">
                        <span className="url-divider">or</span>
                        <div className="input-with-icon">
                          <ImageIcon className="input-icon" />
                          <input
                            type="url"
                            name="coverImageUrl"
                            value={formData.coverImageUrl}
                            onChange={handleCoverImageUrlChange}
                            placeholder="https://example.com/image.jpg (alternative)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Action Footer */}
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setPreviewOpen(true)}>
                    <Eye className="icon-sm" /> Preview Card
                  </button>
                  {editingId && (
                    <button type="button" className="btn-secondary" onClick={resetForm}>
                      <X className="icon-sm" /> Cancel
                    </button>
                  )}
                  <button type="submit" className="btn-primary" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="icon-sm spinner" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="icon-sm" />
                        {editingId ? 'Update Project' : 'Save Project'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'manage' && (
            <motion.div
              className="tab-panel"
              key="manage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <section className="form-section">
                <div className="manage-head">
                  <h3 className="section-title">
                    <span className="section-icon"><List className="icon-sm" /></span>
                    All Projects ({projects.length})
                  </h3>
                  <button type="button" className="btn-secondary" onClick={loadProjects} disabled={projectsLoading}>
                    <RefreshCw className={`icon-sm ${projectsLoading ? 'spinner' : ''}`} /> Refresh
                  </button>
                </div>

                {projectsLoading && projects.length === 0 ? (
                  <div className="manage-empty">
                    <Loader2 className="icon-xl spinner" />
                    <p>Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="manage-empty">
                    <ImageIcon className="icon-xl" />
                    <p>No projects yet. Add your first one from the “Add New Project” tab.</p>
                  </div>
                ) : (
                  <div className="manage-list">
                    {projects.map((p) => (
                      <div className="manage-row" key={p.id}>
                        <div className="manage-thumb">
                          {p.image ? (
                            <img src={p.image} alt={p.title} />
                          ) : (
                            <ImageIcon className="icon-lg" />
                          )}
                        </div>
                        <div className="manage-info">
                          <h4 className="manage-name">
                            {p.title}
                            {p.featured && <Star className="icon-xs featured-star" aria-label="Featured" />}
                          </h4>
                          <span className="manage-cat">{p.category}</span>
                          <p className="manage-desc">{(p.description || '').slice(0, 120)}</p>
                          <div className="manage-tech">
                            {(p.technologies || []).slice(0, 5).map((t) => (
                              <span key={t} className="manage-tech-tag">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="manage-actions">
                          <button type="button" className="btn-secondary" onClick={() => editProject(p)}>
                            <Pencil className="icon-xs" /> Edit
                          </button>
                          <button type="button" className="btn-danger" onClick={() => deleteProject(p.id)}>
                            <Trash2 className="icon-xs" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {activeTab === 'cv' && (
            <motion.div
              className="tab-panel"
              key="cv"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Upload Dropzone */}
              <section className="form-section cv-section">
                <h3 className="section-title">
                  <span className="section-icon"><Upload className="icon-sm" /></span>
                  Upload New CV (PDF)
                </h3>
                <p className="field-hint">
                  Uploading replaces the public CV <em>and</em> re-indexes the chatbot so it answers from the new file.
                </p>
                <div className="cv-upload-area">
                  {cvUploading ? (
                    <div className="cv-uploading">
                      <Loader2 className="icon-xl spinner" />
                      <p>Uploading & re-indexing…</p>
                    </div>
                  ) : (
                    <div
                      className={`cv-dropzone ${cvData.file ? 'has-file' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleCvDrop}
                    >
                      <input
                        type="file"
                        ref={cvFileInputRef}
                        accept="application/pdf"
                        onChange={handleCvFileChange}
                        className="file-input"
                        id="cvFile"
                        disabled={cvUploading}
                      />
                      <label htmlFor="cvFile" className="cv-dropzone-label">
                        <FileText className="icon-2xl" />
                        <span>{cvData.file ? 'Drop to replace CV' : 'Drag & drop PDF here or click to browse'}</span>
                        <p>.pdf only — Max 20MB</p>
                      </label>
                    </div>
                  )}
                </div>
              </section>

              {/* Current Active CV Card */}
              <section className="form-section cv-section">
                <h3 className="section-title">
                  <span className="section-icon"><FileText className="icon-sm" /></span>
                  Current Active CV
                </h3>
                <div className="cv-card">
                  <div className="cv-card-header">
                    <div className="cv-icon">
                      <FileText className="icon-xl" />
                    </div>
                    <div className="cv-details">
                      <h4 className="cv-filename">{cvData.fileName}</h4>
                      <div className="cv-meta">
                        <span><strong>Version:</strong> {cvData.version}</span>
                        <span><strong>Uploaded:</strong> {formatDate(cvData.uploadDate)}</span>
                        <span><strong>Size:</strong> {cvData.fileSize}</span>
                      </div>
                    </div>
                    <div className="cv-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => window.open(`${API_URL}/api/cv`, '_blank', 'noopener')}
                      >
                        <Eye className="icon-sm" /> View
                      </button>
                      <a className="btn-secondary" href={`${API_URL}/api/cv`} download>
                        <Download className="icon-sm" /> Download
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Resume Quick Details (display-only) */}
              <section className="form-section cv-section">
                <h3 className="section-title">
                  <span className="section-icon"><Settings className="icon-sm" /></span>
                  Resume Highlights (display-only)
                </h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="gpa">Master GPA</label>
                    <input
                      type="text"
                      id="gpa"
                      value={cvData.gpa}
                      onChange={e => setCvData(prev => ({ ...prev, gpa: e.target.value }))}
                      placeholder="e.g., 3.9/4.0"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="yearsExperience">Years of Experience</label>
                    <input
                      type="text"
                      id="yearsExperience"
                      value={cvData.yearsExperience}
                      onChange={e => setCvData(prev => ({ ...prev, yearsExperience: e.target.value }))}
                      placeholder="e.g., 3+"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="currentRole">Current Role Title</label>
                    <input
                      type="text"
                      id="currentRole"
                      value={cvData.currentRole}
                      onChange={e => setCvData(prev => ({ ...prev, currentRole: e.target.value }))}
                      placeholder="e.g., Agentic AI Engineer"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="targetPosition">Target Position</label>
                    <input
                      type="text"
                      id="targetPosition"
                      value={cvData.targetPosition}
                      onChange={e => setCvData(prev => ({ ...prev, targetPosition: e.target.value }))}
                      placeholder="e.g., Senior AI Engineer"
                    />
                  </div>
                </div>
              </section>

              {/* Save Button */}
              <div className="form-actions cv-actions">
                <button type="button" className="btn-primary" onClick={handleSaveCV} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="icon-sm spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="icon-sm" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Modal */}
        <AnimatePresence>
          {previewOpen && (
            <motion.div
              className="preview-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewOpen(false)}
            >
              <motion.div
                className="preview-modal"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="preview-header">
                  <h3>Project Card Preview</h3>
                  <button className="preview-close" onClick={() => setPreviewOpen(false)}>
                    <X className="icon-md" />
                  </button>
                </div>
                <div className="preview-content">
                  <div className="preview-card">
                    <div className="preview-thumb">
                      {formData.coverImagePreview ? (
                        <img src={formData.coverImagePreview} alt={formData.title} />
                      ) : (
                        <div className="preview-placeholder">
                          <ImageIcon className="icon-2xl" />
                        </div>
                      )}
                      {formData.featured && <span className="preview-badge featured">Featured</span>}
                      <span className="preview-badge category">{formData.category}</span>
                    </div>
                    <div className="preview-body">
                      <h4>{formData.title || 'Project Title'}</h4>
                      <p>{formData.description ? formData.description.substring(0, 120) : 'Add a description...'}</p>
                      <div className="preview-tech">
                        {formData.techStack.slice(0, 5).map(t => <span key={t} className="preview-tech-tag">{t}</span>)}
                        {formData.techStack.length > 5 && <span className="preview-tech-tag more">+{formData.techStack.length - 5} more</span>}
                      </div>
                      <div className="preview-footer">
                        <a href={formData.githubUrl || '#'} target="_blank" rel="noreferrer noopener" className="preview-btn">
                          <GitHubIcon className="icon-xs" /> View Code
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminPanel;
