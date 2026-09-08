import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Sun,
  Moon,
  Mail
} from 'lucide-react';
import { GitHubIcon, LinkedInIcon, EmailIcon } from './BrandIcons';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#roadmap', label: 'Roadmap' },
  { href: '#projects', label: 'Projects' },
  { href: '#cv', label: 'CV' },
  { href: '#contact', label: 'Contact' },
];

const socialLinks = [
  { href: 'https://github.com/ennaguiyoussef', icon: GitHubIcon, label: 'GitHub', external: true },
  { href: 'https://www.linkedin.com/in/youssef-ennagui-b1862b37a/', icon: LinkedInIcon, label: 'LinkedIn', external: true },
  { href: 'mailto:youssef.ennagui@usmba.ac.ma', icon: EmailIcon, label: 'Email', external: false },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <motion.header
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ zIndex: 'var(--z-fixed)' }}
    >
      <nav className="navbar-inner container flex-between">
        {/* Logo */}
        <motion.a
          href="#top"
          className="navbar-logo"
          onClick={handleLinkClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="logo-text">YE</span>
          <span className="logo-dot">.</span>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="navbar-desktop flex-center flex-gap-8">
          <ul className="navbar-links flex-center flex-gap-6">
            {navLinks.map((link, index) => (
              <li key={link.href}>
                <motion.a
                  href={link.href}
                  className="nav-link"
                  onClick={handleLinkClick}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {link.label}
                </motion.a>
              </li>
            ))}
          </ul>

          {/* Social Links Desktop */}
          <div className="navbar-socials flex-center flex-gap-3">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.external ? '_blank' : undefined}
                rel={social.external ? 'noreferrer noopener' : undefined}
                className="social-link"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                aria-label={social.label}
              >
                <social.icon className="icon-md" />
              </motion.a>
            ))}
          </div>

          {/* Theme Toggle Desktop */}
          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {theme === 'dark' ? (
              <Sun className="icon-md" />
            ) : (
              <Moon className="icon-md" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="navbar-burger"
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <AnimatePresence mode="wait">
            {!open ? (
              <motion.div
                key="menu"
                className="burger-lines"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <span className="line line-1" />
                <span className="line line-2" />
                <span className="line line-3" />
              </motion.div>
            ) : (
              <motion.div
                key="close"
                className="burger-lines"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.3 }}
              >
                <X className="icon-lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            className="navbar-mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="navbar-mobile panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="mobile-header flex-between">
                <motion.a
                  href="#top"
                  className="navbar-logo"
                  onClick={handleLinkClick}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="logo-text">YE</span>
                  <span className="logo-dot">.</span>
                </motion.a>
                <motion.button
                  className="theme-toggle"
                  onClick={toggleTheme}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun className="icon-md" /> : <Moon className="icon-md" />}
                </motion.button>
              </div>

              <ul className="mobile-nav-links flex-col">
                {navLinks.map((link, index) => (
                  <li key={link.href}>
                    <motion.a
                      href={link.href}
                      className="mobile-nav-link"
                      onClick={handleLinkClick}
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>

              <div className="mobile-socials flex-center flex-gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.external ? '_blank' : undefined}
                    rel={social.external ? 'noreferrer noopener' : undefined}
                    className="social-link"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.08 }}
                    aria-label={social.label}
                  >
                    <social.icon className="icon-lg" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;