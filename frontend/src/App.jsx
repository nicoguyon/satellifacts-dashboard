import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Database, Tv, Film, TrendingUp, Users,
  Bell, Mail, Linkedin, MessageSquare, BarChart3, Search,
  Settings, HelpCircle, ChevronRight, Zap
} from 'lucide-react'

// Import pages
import Dashboard from './pages/Dashboard'
import RAGArchives from './pages/RAGArchives'
import Audiences from './pages/Audiences'
import BoxOffice from './pages/BoxOffice'
import Finance from './pages/Finance'
import Organigrammes from './pages/Organigrammes'
import Veille from './pages/Veille'
import Newsletters from './pages/Newsletters'
import LinkedInModule from './pages/LinkedIn'
import Chatbot from './pages/Chatbot'
import Analytics from './pages/Analytics'

import './App.css'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', status: 'active' },
  { section: 'Modules IA' },
  { path: '/rag', icon: Database, label: 'RAG Archives', status: 'active', badge: 'T1' },
  { path: '/audiences', icon: Tv, label: 'Audiences TV', status: 'pending', badge: 'T2' },
  { path: '/boxoffice', icon: Film, label: 'Box-Office', status: 'active', badge: 'T3' },
  { path: '/finance', icon: TrendingUp, label: 'Données Financières', status: 'active', badge: 'T4' },
  { path: '/organigrammes', icon: Users, label: 'Organigrammes', status: 'inactive', badge: 'T5' },
  { path: '/veille', icon: Bell, label: 'Veille Info', status: 'active', badge: 'T6' },
  { path: '/newsletters', icon: Mail, label: 'Newsletters', status: 'active', badge: 'T7' },
  { path: '/linkedin', icon: Linkedin, label: 'LinkedIn B2B', status: 'pending', badge: 'T8' },
  { section: 'Premium' },
  { path: '/chatbot', icon: MessageSquare, label: 'Chatbot Expert', status: 'active' },
  { path: '/analytics', icon: BarChart3, label: 'Prédiction Éditoriale', status: 'active' },
]

function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">SF</div>
          <div>
            <div className="logo-text">Satellifacts</div>
            <div className="logo-subtitle">AI Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="nav-section">
        {navItems.map((item, index) => {
          if (item.section) {
            return (
              <div key={index} className="nav-section-title">
                {item.section}
              </div>
            )
          }

          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="nav-item-icon" />
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
              {item.status && !item.badge && (
                <span className={`status-dot ${item.status}`}></span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-color)' }}>
        <div className="nav-item">
          <Settings size={20} className="nav-item-icon" />
          <span>Paramètres</span>
        </div>
        <div className="nav-item">
          <HelpCircle size={20} className="nav-item-icon" />
          <span>Aide</span>
        </div>
      </div>
    </aside>
  )
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rag" element={<RAGArchives />} />
            <Route path="/audiences" element={<Audiences />} />
            <Route path="/boxoffice" element={<BoxOffice />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/organigrammes" element={<Organigrammes />} />
            <Route path="/veille" element={<Veille />} />
            <Route path="/newsletters" element={<Newsletters />} />
            <Route path="/linkedin" element={<LinkedInModule />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
