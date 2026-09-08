import { FiGithub, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">YE</span>
            <p className="footer-tagline">Développeur Full-Stack passionné par le code propre et l'architecture logicielle.</p>
          </div>

          <div className="footer-links">
            <h3 className="footer-links-title">Liens rapides</h3>
            <nav aria-label="Navigation footer">
              <ul className="footer-nav">
                <li><a href="#about">À propos</a></li>
                <li><a href="#cv">CV</a></li>
                <li><a href="#projects">Projets</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>
          </div>

          <div className="footer-social">
            <h3 className="footer-links-title">Me suivre</h3>
            <div className="social-links" role="list" aria-label="Réseaux sociaux">
              <a
                href="https://github.com/votre-username"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                role="listitem"
              >
                <FiGithub size={20} />
              </a>
              <a
                href="https://linkedin.com/in/votre-username"
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                role="listitem"
              >
                <FiLinkedin size={20} />
              </a>
              <a
                href="mailto:vous@email.com"
                className="social-link"
                aria-label="Email"
                role="listitem"
              >
                <FiMail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <FiHeart className="heart-icon" aria-hidden="true" />
            <span>Construit avec passion par <strong>Youssef Ennagui</strong></span>
            <span className="divider" aria-hidden="true">·</span>
            <span>&copy; {currentYear}</span>
            <span className="divider" aria-hidden="true">·</span>
            <span>Tous droits réservés</span>
          </div>

          <div className="footer-legal">
            <a href="#" aria-label="Mentions légales">Mentions légales</a>
            <span className="divider" aria-hidden="true">·</span>
            <a href="#" aria-label="Politique de confidentialité">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}