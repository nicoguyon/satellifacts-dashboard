import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Database, Tv, Film, TrendingUp, Users, Bell, Mail, Linkedin,
  MessageSquare, BarChart3, ArrowUpRight, ArrowDownRight, Clock,
  CheckCircle2, AlertCircle, XCircle, Zap, FileText, Activity
} from 'lucide-react'

const modules = [
  {
    id: 'rag',
    path: '/rag',
    title: 'RAG Archives',
    description: 'Recherche sémantique dans les archives Satellifacts',
    icon: Database,
    color: '#3b82f6',
    status: 'active',
    stats: { articles: '15,847', searches: '234' }
  },
  {
    id: 'audiences',
    path: '/audiences',
    title: 'Audiences Médiamat',
    description: 'Automatisation des tableaux d\'audiences TV',
    icon: Tv,
    color: '#8b5cf6',
    status: 'pending',
    stats: { updates: 'En attente', lastSync: '-' }
  },
  {
    id: 'boxoffice',
    path: '/boxoffice',
    title: 'Box-Office Cinéma',
    description: 'Données box-office France, US et Monde',
    icon: Film,
    color: '#ec4899',
    status: 'active',
    stats: { films: '2,456', lastUpdate: 'Aujourd\'hui' }
  },
  {
    id: 'finance',
    path: '/finance',
    title: 'Données Financières',
    description: 'Suivi des groupes de médias cotés',
    icon: TrendingUp,
    color: '#10b981',
    status: 'active',
    stats: { companies: '48', markets: '3' }
  },
  {
    id: 'organigrammes',
    path: '/organigrammes',
    title: 'Organigrammes',
    description: 'Base de données des dirigeants médias',
    icon: Users,
    color: '#f59e0b',
    status: 'blocked',
    stats: { contacts: '-', reason: 'RGPD' }
  },
  {
    id: 'veille',
    path: '/veille',
    title: 'Veille Information',
    description: 'Surveillance automatique des actualités',
    icon: Bell,
    color: '#06b6d4',
    status: 'active',
    stats: { sources: '156', alerts: '12' }
  },
  {
    id: 'newsletters',
    path: '/newsletters',
    title: 'Newsletters',
    description: 'Personnalisation par profil abonné',
    icon: Mail,
    color: '#f97316',
    status: 'active',
    stats: { profiles: '6', templates: '18' }
  },
  {
    id: 'linkedin',
    path: '/linkedin',
    title: 'LinkedIn B2B',
    description: 'Génération de contenu et leads',
    icon: Linkedin,
    color: '#0077b5',
    status: 'pending',
    stats: { posts: '45', leads: '89' }
  }
]

const recentActivity = [
  { type: 'search', message: 'Recherche RAG: "Canal+ acquisition droits sportifs"', time: 'Il y a 5 min' },
  { type: 'update', message: 'Box-office France mis à jour automatiquement', time: 'Il y a 23 min' },
  { type: 'alert', message: 'Nouvelle alerte veille: Fusion TF1-M6', time: 'Il y a 1h' },
  { type: 'newsletter', message: 'Newsletter "Audiovisuel" générée pour 234 abonnés', time: 'Il y a 2h' },
  { type: 'finance', message: 'Cours Vivendi mis à jour: +2.3%', time: 'Il y a 3h' },
]

function StatusBadge({ status }) {
  const config = {
    active: { icon: CheckCircle2, color: 'green', label: 'Actif' },
    pending: { icon: Clock, color: 'orange', label: 'En attente' },
    blocked: { icon: XCircle, color: 'red', label: 'Bloqué' },
    inactive: { icon: AlertCircle, color: 'gray', label: 'Inactif' }
  }
  const { icon: Icon, color, label } = config[status] || config.inactive
  return (
    <span className={`tag tag-${color}`}>
      <Icon size={12} style={{ marginRight: 4 }} />
      {label}
    </span>
  )
}

export default function Dashboard() {
  return (
    <div className="fade-in">
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <h1>Bienvenue sur Satellifacts AI</h1>
        <p>Plateforme d'intelligence artificielle pour l'industrie des médias</p>
      </div>

      {/* Quick Stats */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FileText size={24} />
          </div>
          <div className="stat-value">15,847</div>
          <div className="stat-label">Articles indexés</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} /> +127 cette semaine
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Activity size={24} />
          </div>
          <div className="stat-value">8</div>
          <div className="stat-label">Modules actifs</div>
          <div className="stat-change positive">
            <Zap size={14} /> 6 opérationnels
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <Bell size={24} />
          </div>
          <div className="stat-value">12</div>
          <div className="stat-label">Alertes aujourd'hui</div>
          <div className="stat-change">
            <Clock size={14} /> Dernière: il y a 1h
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <Mail size={24} />
          </div>
          <div className="stat-value">1,245</div>
          <div className="stat-label">Newsletters envoyées</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} /> +18% d'ouverture
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="card-header">
        <h2 className="card-title">Modules IA</h2>
      </div>
      <div className="grid-4 mb-6">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <Link to={module.path} key={module.id} className="module-card">
              <div className="module-card-header">
                <div
                  className="module-icon"
                  style={{
                    background: `${module.color}20`,
                    color: module.color
                  }}
                >
                  <Icon size={22} />
                </div>
                <div className="module-status">
                  <StatusBadge status={module.status} />
                </div>
              </div>
              <div className="module-title">{module.title}</div>
              <div className="module-description">{module.description}</div>
              <div className="module-footer">
                <span className="text-xs text-gray">
                  {Object.entries(module.stats).map(([key, val], i) => (
                    <span key={key}>
                      {i > 0 && ' • '}
                      {val}
                    </span>
                  ))}
                </span>
                <ArrowUpRight size={16} style={{ color: 'var(--accent-blue)' }} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Activity size={18} />
              Activité récente
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3"
                style={{
                  padding: '12px',
                  background: 'var(--bg-dark)',
                  borderRadius: '8px'
                }}
              >
                <div
                  className="stat-icon blue"
                  style={{ width: 36, height: 36, marginBottom: 0 }}
                >
                  {activity.type === 'search' && <Database size={16} />}
                  {activity.type === 'update' && <Film size={16} />}
                  {activity.type === 'alert' && <Bell size={16} />}
                  {activity.type === 'newsletter' && <Mail size={16} />}
                  {activity.type === 'finance' && <TrendingUp size={16} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="text-sm">{activity.message}</div>
                  <div className="text-xs text-gray">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Zap size={18} />
              Actions rapides
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/rag" className="btn btn-primary w-full">
              <Database size={18} />
              Rechercher dans les archives
            </Link>
            <Link to="/veille" className="btn btn-secondary w-full">
              <Bell size={18} />
              Voir les alertes du jour
            </Link>
            <Link to="/boxoffice" className="btn btn-secondary w-full">
              <Film size={18} />
              Consulter le box-office
            </Link>
            <Link to="/chatbot" className="btn btn-secondary w-full">
              <MessageSquare size={18} />
              Ouvrir le chatbot expert
            </Link>
            <Link to="/newsletters" className="btn btn-secondary w-full">
              <Mail size={18} />
              Générer une newsletter
            </Link>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card mt-6">
        <div className="card-header">
          <h3 className="card-title">État du système</h3>
          <span className="tag tag-green">Tous les systèmes opérationnels</span>
        </div>
        <div className="grid-4">
          <div className="flex items-center gap-3">
            <span className="status-dot active"></span>
            <span className="text-sm">API Backend</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="status-dot active"></span>
            <span className="text-sm">Base de données RAG</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="status-dot active"></span>
            <span className="text-sm">Scraping CNC</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="status-dot pending"></span>
            <span className="text-sm">API Médiamétrie</span>
          </div>
        </div>
      </div>
    </div>
  )
}
