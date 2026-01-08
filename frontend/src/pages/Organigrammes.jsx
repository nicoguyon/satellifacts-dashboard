import { useState } from 'react'
import {
  Users, Building2, AlertTriangle, Shield, Search, Filter,
  UserCheck, Mail, Phone, Linkedin, ExternalLink, Lock
} from 'lucide-react'

// Données de démonstration limitées (données publiques uniquement)
const publicData = [
  {
    company: 'TF1 Group',
    ceo: 'Rodolphe Belmer',
    role: 'Président-Directeur Général',
    since: '2022',
    source: 'Rapport annuel 2024',
    public: true
  },
  {
    company: 'Groupe M6',
    ceo: 'Nicolas de Tavernost',
    role: 'Président du Directoire',
    since: '2000',
    source: 'Rapport annuel 2024',
    public: true
  },
  {
    company: 'France Télévisions',
    ceo: 'Delphine Ernotte',
    role: 'Présidente',
    since: '2015',
    source: 'Site officiel',
    public: true
  },
  {
    company: 'Canal+ Group',
    ceo: 'Maxime Saada',
    role: 'Président du Directoire',
    since: '2018',
    source: 'Rapport Vivendi 2024',
    public: true
  },
  {
    company: 'Radio France',
    ceo: 'Sibyle Veil',
    role: 'Présidente-Directrice Générale',
    since: '2018',
    source: 'Site officiel',
    public: true
  }
]

export default function Organigrammes() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <Users size={28} />
          Organigrammes
        </h1>
        <p className="page-description">
          Base de données des dirigeants des groupes de médias
        </p>
      </div>

      {/* RGPD Warning */}
      <div className="alert alert-error mb-6">
        <Shield size={20} />
        <div>
          <strong>Module en attente - Conformité RGPD requise</strong>
          <p className="text-sm mt-1">
            La collecte et le traitement des données personnelles des dirigeants nécessitent :
          </p>
          <ul className="text-sm mt-2" style={{ marginLeft: 20, listStyleType: 'disc' }}>
            <li>Une base légale conforme au RGPD (consentement ou intérêt légitime documenté)</li>
            <li>L'information des personnes concernées (Article 14 RGPD)</li>
            <li>Le respect du droit d'opposition et de suppression</li>
            <li>Un avis juridique préalable recommandé</li>
          </ul>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon orange"><Building2 size={24} /></div>
          <div className="stat-value">5</div>
          <div className="stat-label">Groupes (données publiques)</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><UserCheck size={24} /></div>
          <div className="stat-value">5</div>
          <div className="stat-label">Dirigeants (PDG uniquement)</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><Lock size={24} /></div>
          <div className="stat-value">Bloqué</div>
          <div className="stat-label">Enrichissement LinkedIn</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><AlertTriangle size={24} /></div>
          <div className="stat-value">En attente</div>
          <div className="stat-label">Validation juridique</div>
        </div>
      </div>

      {/* Available Public Data */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">
            <UserCheck size={18} />
            Données publiques disponibles
          </h3>
          <span className="tag tag-green">Sources officielles uniquement</span>
        </div>

        <div className="search-box mb-4">
          <Search size={20} className="search-box-icon" />
          <input
            type="text"
            className="input"
            placeholder="Rechercher une entreprise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Groupe</th>
                <th>Dirigeant</th>
                <th>Fonction</th>
                <th>Depuis</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {publicData
                .filter(d => d.company.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((row, i) => (
                <tr key={i}>
                  <td><strong>{row.company}</strong></td>
                  <td>{row.ceo}</td>
                  <td>{row.role}</td>
                  <td>{row.since}</td>
                  <td>
                    <span className="tag tag-green">
                      {row.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* What's Blocked */}
      <div className="grid-2 mb-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ color: 'var(--error)' }}>
              <Lock size={18} />
              Fonctionnalités bloquées
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
              <Linkedin size={20} style={{ color: 'var(--error)' }} />
              <div>
                <div className="font-medium">Enrichissement LinkedIn</div>
                <div className="text-sm text-gray">CGU LinkedIn interdisent le scraping</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
              <Mail size={20} style={{ color: 'var(--error)' }} />
              <div>
                <div className="font-medium">Emails professionnels</div>
                <div className="text-sm text-gray">Consentement requis (RGPD Art. 6)</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
              <Phone size={20} style={{ color: 'var(--error)' }} />
              <div>
                <div className="font-medium">Téléphones directs</div>
                <div className="text-sm text-gray">Données personnelles sensibles</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
              <Users size={20} style={{ color: 'var(--error)' }} />
              <div>
                <div className="font-medium">Organigrammes complets (N-1, N-2)</div>
                <div className="text-sm text-gray">Volume de données personnelles trop important</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ color: 'var(--success)' }}>
              <Shield size={18} />
              Alternatives légales
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
              <ExternalLink size={20} style={{ color: 'var(--success)' }} />
              <div>
                <div className="font-medium">Infogreffe / RCS</div>
                <div className="text-sm text-gray">Mandataires sociaux officiels</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
              <ExternalLink size={20} style={{ color: 'var(--success)' }} />
              <div>
                <div className="font-medium">SocieteInfo (API INPI/INSEE)</div>
                <div className="text-sm text-gray">Données légales sous licence</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
              <ExternalLink size={20} style={{ color: 'var(--success)' }} />
              <div>
                <div className="font-medium">Rapports annuels publics</div>
                <div className="text-sm text-gray">PDG et membres du conseil</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
              <ExternalLink size={20} style={{ color: 'var(--success)' }} />
              <div>
                <div className="font-medium">Fournisseurs B2B (Kompass, Ellisphere)</div>
                <div className="text-sm text-gray">Données commerciales licenciées</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Required */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <AlertTriangle size={18} />
            Actions requises pour activer ce module
          </h3>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="tag tag-orange">1</span>
            <div>
              <div className="font-medium">Consulter un avocat RGPD</div>
              <div className="text-sm text-gray">Définir la base légale et les mesures de conformité</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="tag tag-orange">2</span>
            <div>
              <div className="font-medium">Choisir une source de données légale</div>
              <div className="text-sm text-gray">Infogreffe, SocieteInfo, ou fournisseur B2B licencié</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="tag tag-orange">3</span>
            <div>
              <div className="font-medium">Définir le périmètre des données</div>
              <div className="text-sm text-gray">Se limiter aux mandataires sociaux et données publiques</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="tag tag-orange">4</span>
            <div>
              <div className="font-medium">Mettre en place les droits RGPD</div>
              <div className="text-sm text-gray">Droit d'accès, rectification, suppression pour les personnes concernées</div>
            </div>
          </div>
        </div>
        <button className="btn btn-secondary mt-4" disabled>
          <Lock size={18} /> Module désactivé - Validation juridique requise
        </button>
      </div>
    </div>
  )
}
