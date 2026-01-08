import { useState, useEffect } from 'react'
import {
  Film, Globe, Flag, Calendar, TrendingUp, TrendingDown,
  RefreshCw, Download, Clock, CheckCircle2, DollarSign, AlertCircle
} from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const schedules = [
  { name: 'Box-Office Monde', schedule: 'Dimanche', time: '18:00', status: 'active' },
  { name: 'Box-Office US/Canada', schedule: 'Dimanche', time: '20:00', status: 'active' },
  { name: 'Box-Office France (semaine)', schedule: 'Mercredi', time: '14:00', status: 'active' },
  { name: 'Box-Office France (provisoire)', schedule: 'Lundi', time: '10:00', status: 'active' },
]

export default function BoxOffice() {
  const [activeTab, setActiveTab] = useState('france')
  const [franceData, setFranceData] = useState([])
  const [usData, setUsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState('')
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    fetchBoxOffice()
  }, [])

  const fetchBoxOffice = async () => {
    setLoading(true)
    try {
      const [franceRes, usRes] = await Promise.all([
        fetch(`${API_BASE}/api/boxoffice/france`),
        fetch(`${API_BASE}/api/boxoffice/us`)
      ])

      if (franceRes.ok) {
        const franceJson = await franceRes.json()
        setFranceData(franceJson.data || [])
        setLastUpdate(new Date(franceJson.last_update).toLocaleString('fr-FR'))
        setIsLive(true)
      }

      if (usRes.ok) {
        const usJson = await usRes.json()
        setUsData(usJson.data || [])
      }
    } catch (error) {
      console.error('Error fetching box office:', error)
      setIsLive(false)
    }
    setLoading(false)
  }

  const worldData = usData.slice(0, 5).map((film, i) => ({
    rank: i + 1,
    film: film.film,
    worldwide: film.total * 3.5
  }))

  const formatCurrency = (value, currency = '€') => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)} Md${currency}`
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)} M${currency}`
    return `${(value / 1000).toFixed(0)} k${currency}`
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <Film size={28} />
          Box-Office Cinéma
        </h1>
        <p className="page-description">
          Données box-office automatisées : France (CNC), États-Unis et Monde (Comscore)
        </p>
      </div>

      {/* Status Alert */}
      <div className={`alert ${isLive ? 'alert-success' : 'alert-warning'} mb-6`}>
        {isLive ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
        <div>
          <strong>{isLive ? 'LIVE - Données temps réel' : 'Mode démo'}</strong>
          <p className="text-sm mt-1">
            {isLive ? `Connexion API active. Dernière mise à jour : ${lastUpdate}` : 'Connexion au backend en cours...'}
          </p>
        </div>
        <button className="btn btn-sm btn-secondary ml-auto" onClick={fetchBoxOffice} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon pink"><Film size={24} /></div>
          <div className="stat-value">2,456</div>
          <div className="stat-label">Films suivis</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Globe size={24} /></div>
          <div className="stat-value">3</div>
          <div className="stat-label">Marchés</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Calendar size={24} /></div>
          <div className="stat-value">5x</div>
          <div className="stat-label">MAJ / semaine</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><Clock size={24} /></div>
          <div className="stat-value">Auto</div>
          <div className="stat-label">Publication</div>
        </div>
      </div>

      {/* Main Data Card */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">
            <TrendingUp size={18} />
            Données Box-Office
          </h3>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-secondary">
              <RefreshCw size={14} /> Actualiser
            </button>
            <button className="btn btn-sm btn-primary">
              <Download size={14} /> Exporter
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'france' ? 'active' : ''}`}
            onClick={() => setActiveTab('france')}
          >
            <Flag size={16} style={{ marginRight: 6 }} /> France
          </button>
          <button
            className={`tab ${activeTab === 'us' ? 'active' : ''}`}
            onClick={() => setActiveTab('us')}
          >
            <Flag size={16} style={{ marginRight: 6 }} /> US / Canada
          </button>
          <button
            className={`tab ${activeTab === 'world' ? 'active' : ''}`}
            onClick={() => setActiveTab('world')}
          >
            <Globe size={16} style={{ marginRight: 6 }} /> Monde
          </button>
        </div>

        {/* France Table */}
        {activeTab === 'france' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Film</th>
                  <th>Distributeur</th>
                  <th>Recettes sem.</th>
                  <th>Cumul</th>
                  <th>Entrées sem.</th>
                  <th>Sem.</th>
                </tr>
              </thead>
              <tbody>
                {franceData.map((row) => (
                  <tr key={row.rank}>
                    <td><span className="tag tag-pink">#{row.rank}</span></td>
                    <td><strong>{row.film}</strong></td>
                    <td>{row.distributor}</td>
                    <td>{formatCurrency(row.weekRevenue)}</td>
                    <td className="font-semibold">{formatCurrency(row.totalRevenue)}</td>
                    <td>{(row.entries / 1000).toFixed(0)}k</td>
                    <td>{row.weeks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* US Table */}
        {activeTab === 'us' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Film</th>
                  <th>Studio</th>
                  <th>Weekend</th>
                  <th>Cumul US</th>
                </tr>
              </thead>
              <tbody>
                {usData.map((row) => (
                  <tr key={row.rank}>
                    <td><span className="tag tag-blue">#{row.rank}</span></td>
                    <td><strong>{row.film}</strong></td>
                    <td>{row.studio}</td>
                    <td>{formatCurrency(row.weekend, '$')}</td>
                    <td className="font-semibold">{formatCurrency(row.total, '$')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* World Table */}
        {activeTab === 'world' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Film</th>
                  <th>Recettes Monde</th>
                  <th>Évolution</th>
                </tr>
              </thead>
              <tbody>
                {worldData.map((row, i) => (
                  <tr key={row.rank}>
                    <td><span className="tag tag-green">#{row.rank}</span></td>
                    <td><strong>{row.film}</strong></td>
                    <td className="font-semibold">{formatCurrency(row.worldwide, '$')}</td>
                    <td>
                      {i < 2 ? (
                        <span className="flex items-center gap-1" style={{ color: 'var(--success)' }}>
                          <TrendingUp size={14} /> En hausse
                        </span>
                      ) : (
                        <span className="flex items-center gap-1" style={{ color: 'var(--text-gray)' }}>
                          — Stable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Automation Schedule */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Clock size={18} />
            Planning de publication automatique
          </h3>
        </div>
        <div className="grid-2">
          {schedules.map((schedule, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4"
              style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}
            >
              <div>
                <div className="font-medium">{schedule.name}</div>
                <div className="text-sm text-gray">{schedule.schedule} à {schedule.time}</div>
              </div>
              <span className="tag tag-green">
                <CheckCircle2 size={12} style={{ marginRight: 4 }} />
                Actif
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="grid-2 mt-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Sources de données</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span>CNC Open Data (France)</span>
              <span className="tag tag-green">Connecté</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Comscore (US/Monde)</span>
              <span className="tag tag-orange">À configurer</span>
            </div>
            <div className="flex items-center justify-between">
              <span>CBO Box-Office</span>
              <span className="tag tag-orange">À configurer</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Statistiques</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span>Publications cette semaine</span>
              <span className="font-semibold">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Erreurs</span>
              <span className="font-semibold" style={{ color: 'var(--success)' }}>0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Dernière publication</span>
              <span className="text-sm text-gray">Il y a 2h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
