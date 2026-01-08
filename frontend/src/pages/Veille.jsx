import { useState, useEffect } from 'react'
import {
  Bell, Rss, AlertCircle, CheckCircle2, Clock, ExternalLink,
  Filter, Search, Star, Bookmark, TrendingUp, Globe, FileText,
  RefreshCw, Settings, Zap, Wifi, WifiOff
} from 'lucide-react'

const API_BASE = 'http://localhost:8000'

const keywords = [
  'TF1', 'M6', 'Canal+', 'France TV', 'Netflix', 'Disney+',
  'Droits TV', 'Streaming', 'Publicité', 'Arcom', 'Fusion', 'Acquisition'
]

export default function Veille() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [alerts, setAlerts] = useState([])
  const [sources, setSources] = useState([])
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const [alertsRes, sourcesRes] = await Promise.all([
        fetch(`${API_BASE}/api/veille/alerts`),
        fetch(`${API_BASE}/api/veille/sources`)
      ])

      if (alertsRes.ok) {
        const data = await alertsRes.json()
        const alertsData = data.alerts || []
        setAlerts(alertsData)
        setLastUpdate(data.last_update)
        setIsLive(true)
        if (alertsData.length > 0 && !selectedAlert) {
          setSelectedAlert(alertsData[0])
        }
      }

      if (sourcesRes.ok) {
        const data = await sourcesRes.json()
        setSources(data.sources || [])
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err)
      setIsLive(false)
      // Fallback to demo data
      const demoAlerts = [
        {
          id: 1,
          title: 'TF1 annonce une restructuration de sa régie publicitaire',
          source: 'Communiqué TF1',
          time: 'Il y a 15 min',
          priority: 'high',
          category: 'Corporate',
          read: false,
          aiSummary: 'TF1 Publicité réorganise ses équipes commerciales pour renforcer son offre digitale.'
        },
        {
          id: 2,
          title: 'Canal+ acquiert les droits de la Premier League pour 2026-2029',
          source: 'AFP',
          time: 'Il y a 45 min',
          priority: 'high',
          category: 'Droits TV',
          read: false,
          aiSummary: 'Canal+ remporte l\'appel d\'offres face à beIN Sports. Montant estimé : 400M€/an.'
        },
      ]
      setAlerts(demoAlerts)
      setSelectedAlert(demoAlerts[0])
      setSources([
        { name: 'AFP', type: 'RSS', status: 'active', url: 'afp.com' },
        { name: 'Le Monde', type: 'RSS', status: 'active', url: 'lemonde.fr' },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
    // Refresh every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredAlerts = alerts.filter(a => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'unread') return !a.read
    if (activeFilter === 'high') return a.priority === 'high'
    return a.category === activeFilter
  })

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">
              <Bell size={28} />
              Veille Information
            </h1>
            <p className="page-description">
              Surveillance automatique des actualités médias via flux RSS
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isLive ? (
              <span className="tag tag-green"><Wifi size={12} /> LIVE - RSS Feeds</span>
            ) : (
              <span className="tag tag-orange"><WifiOff size={12} /> Données démo</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon cyan"><Rss size={24} /></div>
          <div className="stat-value">{sources.length}</div>
          <div className="stat-label">Sources RSS actives</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><Bell size={24} /></div>
          <div className="stat-value">{alerts.length}</div>
          <div className="stat-label">Alertes détectées</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><AlertCircle size={24} /></div>
          <div className="stat-value">{alerts.filter(a => a.priority === 'high').length}</div>
          <div className="stat-label">Haute priorité</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle2 size={24} /></div>
          <div className="stat-value">30 min</div>
          <div className="stat-label">Fréquence MAJ</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid-2">
        {/* Alerts List */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Zap size={18} />
              Alertes du jour
              {lastUpdate && (
                <span className="text-xs text-gray" style={{ marginLeft: 12, fontWeight: 400 }}>
                  MAJ: {new Date(lastUpdate).toLocaleTimeString('fr-FR')}
                </span>
              )}
            </h3>
            <button className="btn btn-sm btn-secondary" onClick={fetchAlerts} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spinner' : ''} /> Actualiser
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {[
              { key: 'all', label: 'Toutes' },
              { key: 'unread', label: 'Non lues' },
              { key: 'high', label: 'Prioritaires' },
            ].map(f => (
              <button
                key={f.key}
                className={`tag ${activeFilter === f.key ? 'tag-blue' : 'tag-gray'}`}
                onClick={() => setActiveFilter(f.key)}
                style={{ cursor: 'pointer' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Alerts */}
          <div className="flex flex-col gap-3" style={{ maxHeight: 500, overflowY: 'auto' }}>
            {loading && alerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="text-center text-gray p-4">Aucune alerte</div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4"
                  style={{
                    background: selectedAlert?.id === alert.id ? 'var(--accent-blue)' : 'var(--bg-dark)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    borderLeft: alert.priority === 'high' ? '3px solid var(--error)' :
                                alert.priority === 'medium' ? '3px solid var(--warning)' : '3px solid var(--border-color)'
                  }}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`tag tag-${
                      alert.category === 'Corporate' ? 'blue' :
                      alert.category === 'Droits TV' ? 'purple' :
                      alert.category === 'Entertainment' ? 'pink' :
                      alert.category === 'Médias' ? 'cyan' : 'green'
                    }`}>
                      {alert.category || 'Général'}
                    </span>
                    {alert.priority === 'high' && <span className="tag tag-red">Important</span>}
                  </div>
                  <div className="font-medium text-sm" style={{ marginBottom: 4 }}>
                    {alert.title?.substring(0, 80)}{alert.title?.length > 80 ? '...' : ''}
                  </div>
                  <div className="text-xs text-gray">{alert.source}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alert Detail & AI Analysis */}
        <div>
          {selectedAlert && (
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="card-title">
                  <FileText size={18} />
                  Détail de l'alerte
                </h3>
                <div className="flex gap-2">
                  {selectedAlert.link && (
                    <a href={selectedAlert.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                      <ExternalLink size={14} /> Voir source
                    </a>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">{selectedAlert.title}</h4>
                <div className="flex gap-2 mb-3">
                  <span className="tag tag-gray">{selectedAlert.source}</span>
                </div>
              </div>

              <div className="p-4 mb-4" style={{ background: 'var(--bg-dark)', borderRadius: '8px', borderLeft: '3px solid var(--accent-blue)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} style={{ color: 'var(--accent-blue)' }} />
                  <span className="font-medium text-sm">Résumé / Extrait</span>
                </div>
                <p className="text-sm">{selectedAlert.aiSummary || selectedAlert.summary || 'Aucun résumé disponible'}</p>
              </div>

              <div className="flex gap-2">
                <button className="btn btn-primary">
                  Créer un article
                </button>
                <button className="btn btn-secondary">
                  Marquer comme traité
                </button>
              </div>
            </div>
          )}

          {/* Sources */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Globe size={18} />
                Sources RSS actives
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {sources.map((source, i) => (
                <div key={i} className="flex items-center justify-between p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
                  <div className="flex items-center gap-3">
                    <Rss size={16} style={{ color: source.status === 'active' ? 'var(--success)' : 'var(--warning)' }} />
                    <div>
                      <div className="font-medium text-sm">{source.name}</div>
                      <div className="text-xs text-gray">{source.url || source.type}</div>
                    </div>
                  </div>
                  <span className={`status-dot ${source.status}`}></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="card mt-6">
        <div className="card-header">
          <h3 className="card-title">
            <Search size={18} />
            Mots-clés surveillés
          </h3>
        </div>
        <div className="flex gap-2 flex-wrap">
          {keywords.map((kw, i) => (
            <span key={i} className="tag tag-blue">
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="alert alert-info mt-6">
        <Zap size={20} />
        <div>
          <strong>Surveillance automatique RSS</strong>
          <p className="text-sm mt-1">
            Les flux RSS sont scrutés toutes les 30 minutes. Les articles pertinents sont filtrés
            par mots-clés et classés par priorité. Sources: Le Monde, Les Échos, Variety, Hollywood Reporter, PureMédias.
          </p>
        </div>
      </div>
    </div>
  )
}
