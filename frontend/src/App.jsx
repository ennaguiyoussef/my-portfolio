import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Roadmap from './components/Roadmap'
import CV from './components/CV'
import Projects from './components/Projects'
import Contact from './components/Contact'
import ChatWidget from './components/ChatWidget'
import AdminPanel from './components/AdminPanel'
import './App.css'

function App() {
  // Simple hash-based gate: visiting "#admin" shows the protected dashboard
  // instead of the public site. No react-router needed.
  const [isAdmin, setIsAdmin] = useState(
    typeof window !== 'undefined' && window.location.hash === '#admin'
  )

  useEffect(() => {
    const onHashChange = () => setIsAdmin(window.location.hash === '#admin')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (isAdmin) {
    return <AdminPanel />
  }

  return (
    <div className="app">
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Roadmap />
        <CV />
        <Projects />
        <Contact />
      </main>
      <ChatWidget />
      <footer className="footer">
        <div className="container">
          <p className="footer-text">
            Built with <span className="heart">♥</span> by Youssef Ennagui
            {' '}—{' '}
            <span className="year">2024</span>
          </p>
          <div className="footer-links">
            <a href="https://github.com/ennaguiyoussef" target="_blank" rel="noreferrer noopener">GitHub</a>
            <a href="https://www.linkedin.com/in/youssef-ennagui-b1862b37a/" target="_blank" rel="noreferrer noopener">LinkedIn</a>
            <a href="mailto:youssef.ennagui@usmba.ac.ma">Email</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
