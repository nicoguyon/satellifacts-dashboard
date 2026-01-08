import { useState } from 'react'
import {
  Tv, Clock, Calendar, AlertTriangle, CheckCircle2, RefreshCw,
  Download, Settings, Database, TrendingUp, TrendingDown
} from 'lucide-react'

// Données de démonstration - Audiences TV
const audienceData = {
  daily: [
    { rank: 1, channel: 'TF1', program: 'JT 20H', viewers: 5420000, share: 24.8, date: '07/01/2025' },
    { rank: 2, channel: 'France 2', program: 'JT 20H', viewers: 4180000, share: 19.1, date: '07/01/2025' },
    { rank: 3, channel: 'M6', program: 'Capital', viewers: 2890000, share: 13.2, date: '07/01/2025' },
    { rank: 4, channel: 'France 3', program: 'JT 19/20', viewers: 2650000, share: 12.1, date: '07/01/2025' },
    { rank: 5, channel: 'TF1', program: 'Koh-Lanta', viewers: 4520000, share: 22.1, date: '07/01/2025' },
  ],
  weekly: [
    { rank: 1, channel: 'TF1', program: 'JT 20H (semaine)', viewers: 5180000, share: 23.5 },
    { rank: 2, channel: 'France 2', program: 'JT 20H (semaine)', viewers: 4020000, share: 18.2 },
    { rank: 3, channel: 'TF1', program: 'HPI', viewers: 8450000, share: 35.2 },
  ]
}

export default function Audiences() {
  const [activeTab, setActiveTab] = useState('daily')
  const [isConfigured, setIsConfigured] = useState(false)

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <Tv size={28} />
          Audiences Médiamat
        </h1>
        <p className="page-description">
          Automatisation de la publication des tableaux d'audiences TV (quotidien, hebdomadaire, mensuel, annuel)
        </p>
      </div>

      {/* Alert - Configuration requise */}
      <div className="alert alert-warning mb-6">
        <AlertTriangle size={20} />
        <div>
          <strong>Configuration requise</strong>
          <p className="text-sm mt-1">
            L'accès aux données Médiamétrie nécessite un contrat commercial.
            Veuillez configurer vos identifiants d'accès pour activer ce module.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon purple"><Calendar size={24} /></div>
          <div className="stat-value">Quotidien</div>
          <div className="stat-label">Médiamat J</div>
          <span className="tag tag-orange mt-2">En attente</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Calendar size={24} /></div>
          <div className="stat-value">Hebdo</div>
          <div className="stat-label">Médiamat Semaine</div>
          <span className="tag tag-orange mt-2">En attente</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Calendar size={24} /></div>
          <div className="stat-value">Mensuel</div>
          <div className="stat-label">Médiamat Mois</div>
          <span className="tag tag-orange mt-2">En attente</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Calendar size={24} /></div>
          <div className="stat-value">Annuel</div>
          <div className="stat-label">Bilan Annuel</div>
          <span className="tag tag-orange mt-2">En attente</span>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">
            <Settings size={18} />
            Configuration de l'accès Médiamétrie
          </h3>
        </div>

        <div className="grid-2">
          <div>
            <div className="input-group">
              <label className="input-label">Identifiant Médiamétrie / CBO</label>
              <input type="text" className="input" placeholder="Votre identifiant client" />
            </div>
            <div className="input-group">
              <label className="input-label">Clé API ou mot de passe</label>
              <input type="password" className="input" placeholder="••••••••••••" />
            </div>
            <div className="input-group">
              <label className="input-label">Type d'accès</label>
              <select className="input">
                <option>Sélectionner...</option>
                <option>API directe</option>
                <option>Export fichier (FTP)</option>
                <option>Portail web (scraping autorisé)</option>
              </select>
            </div>
            <button className="btn btn-primary">
              <CheckCircle2 size={18} /> Tester la connexion
            </button>
          </div>
          <div className="p-4" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
            <h4 className="font-semibold mb-3">Prérequis</h4>
            <ul style={{ listStyle: 'none' }} className="flex flex-col gap-2">
              <li className="flex items-center gap-2 text-sm">
                <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
                Contrat Médiamétrie actif
              </li>
              <li className="flex items-center gap-2 text-sm">
                <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
                Autorisation d'accès automatisé (vérifier CGU)
              </li>
              <li className="flex items-center gap-2 text-sm">
                <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
                Format de données : CSV, JSON ou XML
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Demo Data */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Database size={18} />
            Aperçu des données (démonstration)
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
            className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            Quotidien
          </button>
          <button
            className={`tab ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            Hebdomadaire
          </button>
          <button
            className={`tab ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            Mensuel
          </button>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Rang</th>
                <th>Chaîne</th>
                <th>Programme</th>
                <th>Téléspectateurs</th>
                <th>PdA</th>
                <th>Évolution</th>
              </tr>
            </thead>
            <tbody>
              {audienceData.daily.map((row, i) => (
                <tr key={i}>
                  <td><span className="tag tag-blue">#{row.rank}</span></td>
                  <td><strong>{row.channel}</strong></td>
                  <td>{row.program}</td>
                  <td>{(row.viewers / 1000000).toFixed(2)}M</td>
                  <td>{row.share}%</td>
                  <td>
                    {i % 2 === 0 ? (
                      <span className="flex items-center gap-1" style={{ color: 'var(--success)' }}>
                        <TrendingUp size={14} /> +{(Math.random() * 2).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="flex items-center gap-1" style={{ color: 'var(--error)' }}>
                        <TrendingDown size={14} /> -{(Math.random() * 2).toFixed(1)}%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="alert alert-info mt-4">
          <Clock size={18} />
          <span className="text-sm">
            Les données ci-dessus sont une démonstration. Une fois configuré, le module récupérera
            automatiquement les vraies données Médiamat et générera les tableaux pour publication.
          </span>
        </div>
      </div>

      {/* Automation Settings */}
      <div className="card mt-6">
        <div className="card-header">
          <h3 className="card-title">
            <RefreshCw size={18} />
            Automatisation
          </h3>
        </div>
        <div className="grid-2">
          <div className="flex items-center justify-between p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
            <div>
              <div className="font-medium">Publication quotidienne</div>
              <div className="text-sm text-gray">Chaque jour à 10h00</div>
            </div>
            <span className="tag tag-gray">Désactivé</span>
          </div>
          <div className="flex items-center justify-between p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
            <div>
              <div className="font-medium">Publication hebdomadaire</div>
              <div className="text-sm text-gray">Chaque lundi à 9h00</div>
            </div>
            <span className="tag tag-gray">Désactivé</span>
          </div>
        </div>
      </div>
    </div>
  )
}
