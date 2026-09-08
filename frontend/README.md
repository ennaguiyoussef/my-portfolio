# Ultra-Sleek Portfolio - Frontend

A modern, production-grade portfolio built with React, Framer Motion, and Lucide React. Features dark/light theme, animated roadmap, micro-interactions, and glassmorphism design.

## ✨ Features

- **Dark/Light Theme** - System preference detection with manual toggle
- **Animated Roadmap** - Interactive education & career timeline with pulsing nodes
- **Micro-interactions** - Hover effects, loading states, smooth transitions
- **Glassmorphism UI** - Backdrop blur, subtle borders, gradient accents
- **Responsive Design** - Mobile-first, flawless across all viewports
- **Accessible** - Semantic HTML, focus states, reduced motion support
- **Performance** - Optimized animations, lazy loading, code splitting

## 🛠 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Framer Motion** - Animations & gestures
- **Lucide React** - Beautiful icons
- **CSS Custom Properties** - Design tokens & theming
- **Intersection Observer** - Scroll-triggered animations

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation with theme toggle
│   ├── Hero.jsx            # Landing section with animated role
│   ├── About.jsx           # Profile with skills visualization
│   ├── Roadmap.jsx         # Animated education/career timeline
│   ├── CV.jsx              # Experience & certifications
│   ├── Projects.jsx        # Filterable project showcase
│   └── ChatWidget.jsx      # AI assistant chat interface
├── context/
│   └── ThemeContext.jsx    # Theme state management
├── hooks/
│   └── useScrollReveal.js  # Scroll animation hooks
├── styles/
│   └── designSystem.css    # Design tokens & utilities
├── App.jsx                 # Root component
├── App.css                 # Global layout styles
├── index.css               # Design system import & globals
└── main.jsx                # Entry point
```

## 🎨 Design System

### Color Palette

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--color-bg-deep` | `#0a0a0c` | `#fafafa` | Page background |
| `--color-bg-elevated` | `#111113` | `#ffffff` | Cards, panels |
| `--color-bg-card` | `#161618` | `#f4f4f5` | Interactive cards |
| `--color-accent-primary` | `#22d3ee` | `#0891b2` | Primary actions |
| `--color-accent-secondary` | `#a855f7` | `#9333ea` | Secondary actions |
| `--color-accent-tertiary` | `#10b981` | `#059669` | Success/tech |
| `--color-accent-warning` | `#f59e0b` | `#d97706` | Warnings/featured |

### Typography

- **Display**: Space Grotesk (headlines, numbers)
- **Body**: DM Sans (UI text, paragraphs)
- **Mono**: JetBrains Mono (code, data)

### Spacing Scale

Based on 4px grid: `--space-1` (4px) through `--space-32` (128px)

### Animations

- **Durations**: fast (150ms), normal (250ms), slow (400ms), slower (600ms)
- **Easings**: ease-out, ease-in-out, spring, bounce
- **Reduced Motion**: Fully respected via `prefers-reduced-motion`

## 🧩 Component Highlights

### Navbar
- Glassmorphism backdrop blur
- Animated mobile drawer
- Theme toggle with sun/moon icons
- Social links with hover effects
- Scroll-aware background

### Hero
- Gradient orbs with float animation
- Rotating role with animated icons
- Specialty cards with hover lift
- Scroll indicator with mouse animation

### Roadmap (Signature Feature)
- Vertical timeline with animated progress line
- Pulsing nodes with expanding rings
- Scroll-triggered card entrances
- Future aspirations section
- Responsive: centered on mobile, alternating on desktop

### About
- Skill categories with animated progress bars
- Proficiency levels (0-100%)
- Tools grid with hover effects
- Statistics summary cards

### Projects
- Category filters (All, AI/ML, MLOps, Full-Stack, Infrastructure)
- Search functionality
- Grid/List view toggle
- Hover reveal with full description
- Featured project badges
- Metrics (stars, forks)

### CV
- Three-column timeline (marker, year, card)
- Education & Experience sections
- Certifications grid
- Animated achievement lists
- Technology tags per entry

### ChatWidget
- Floating action button with badge
- Animated window entrance
- Typing indicator
- Message copy functionality
- Rotating suggestion chips
- Error state handling

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels & roles
- Focus-visible outlines
- Color contrast ratios (WCAG AA)
- Reduced motion support
- Keyboard navigation
- Screen reader friendly

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px - 1280px
- **Wide**: > 1280px

## 🔧 Customization

### Theme Colors
Edit `src/styles/designSystem.css`:
```css
:root {
  --color-accent-primary: #your-color;
  --color-accent-secondary: #your-color;
  --color-accent-tertiary: #your-color;
}
```

### Content
Update data arrays in each component:
- `Hero.jsx` - roles, specialties
- `Roadmap.jsx` - roadmapSteps, futureSteps
- `About.jsx` - skillCategories, tools
- `Projects.jsx` - fallbackProjects
- `CV.jsx` - education, experience, certifications

### Fonts
Change Google Fonts import in `src/index.css`

## 📦 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy dist/ folder
```

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📄 License

MIT License - Feel free to use for your own portfolio!

## 🙏 Credits

- **Fonts**: Google Fonts (Space Grotesk, DM Sans, JetBrains Mono)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Inspiration**: Modern portfolio designs from Dribbble & Behance

---

Built with 💜 by Youssef Ennagui