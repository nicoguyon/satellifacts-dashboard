import { useState, useEffect } from 'react'
import {
  Mail, Users, BarChart3, Send, Clock, CheckCircle2,
  Eye, MousePointer, Settings, Sparkles, Filter, Edit3,
  UserCheck, Tv, Film, DollarSign, Megaphone, Building2, Copy, Download
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Profils d'abonnés avec mots-clés pour filtrer les news
const profiles = [
  { id: 'audiovisuel', name: 'Audiovisuel', icon: Tv, count: 456, color: '#3b82f6', keywords: ['tv', 'television', 'audience', 'channel', 'broadcast', 'streaming', 'netflix', 'disney', 'hbo', 'amazon'] },
  { id: 'cinema', name: 'Cinéma', icon: Film, count: 234, color: '#ec4899', keywords: ['film', 'movie', 'box office', 'cinema', 'theatrical', 'release', 'premiere', 'festival', 'oscar', 'cannes'] },
  { id: 'producteur', name: 'Producteur', icon: Building2, count: 189, color: '#8b5cf6', keywords: ['production', 'studio', 'producer', 'deal', 'greenlight', 'series', 'show'] },
  { id: 'diffuseur', name: 'Diffuseur', icon: Megaphone, count: 167, color: '#f59e0b', keywords: ['broadcast', 'network', 'channel', 'distribution', 'rights', 'license'] },
  { id: 'annonceur', name: 'Annonceur', icon: DollarSign, count: 145, color: '#10b981', keywords: ['advertising', 'ad', 'sponsor', 'brand', 'marketing', 'commercial'] },
  { id: 'financier', name: 'Financier', icon: DollarSign, count: 98, color: '#06b6d4', keywords: ['stock', 'revenue', 'earnings', 'acquisition', 'merger', 'investment', 'valuation', 'ipo'] },
]

// Données pour les graphiques
const engagementData = [
  { name: 'Audiovisuel', open: 42, click: 18 },
  { name: 'Cinéma', open: 38, click: 15 },
  { name: 'Producteur', open: 45, click: 22 },
  { name: 'Diffuseur', open: 35, click: 12 },
  { name: 'Annonceur', open: 48, click: 25 },
  { name: 'Financier', open: 52, click: 28 },
]

const recentNewsletters = [
  { name: 'Hebdo Audiovisuel #234', sent: '06/01/2025', recipients: 456, openRate: 42.3, clickRate: 18.5 },
  { name: 'Flash Cinéma', sent: '05/01/2025', recipients: 234, openRate: 38.7, clickRate: 15.2 },
  { name: 'Digest Financier', sent: '04/01/2025', recipients: 98, openRate: 52.1, clickRate: 28.4 },
]

export default function Newsletters() {
  const [selectedProfile, setSelectedProfile] = useState('audiovisuel')
  const [isGenerating, setIsGenerating] = useState(false)
  const [allNews, setAllNews] = useState([])
  const [generatedNewsletter, setGeneratedNewsletter] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/veille/news`)
      if (res.ok) {
        const data = await res.json()
        setAllNews(data.articles || [])
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    }
  }

  const filterNewsByProfile = (profileId, frenchOnly = true) => {
    const profile = profiles.find(p => p.id === profileId)

    // Priorité aux articles français
    let articles = frenchOnly
      ? allNews.filter(a => a.lang === 'fr' || !a.lang)
      : allNews

    if (!profile) return articles.slice(0, 8)

    const filtered = articles.filter(article => {
      const text = (article.title + ' ' + article.summary).toLowerCase()
      return profile.keywords.some(kw => text.includes(kw))
    })

    // Si pas assez d'articles filtrés, prendre tous les articles français
    if (filtered.length < 3) {
      return articles.slice(0, 8)
    }

    return filtered.slice(0, 8)
  }

  const getEditorialIntro = (profileName, articleCount) => {
    const intros = {
      'Audiovisuel': `Cette semaine dans l'audiovisuel, les lignes bougent. Entre reconfigurations stratégiques et nouveaux rapports de force, le secteur poursuit sa mue à grande vitesse. Tour d'horizon des ${articleCount} actualités à retenir.`,
      'Cinéma': `Le septième art ne connaît pas de répit. Des salles obscures aux plateformes, en passant par les festivals, l'actualité cinéma de cette semaine confirme les tendances de fond du marché. Décryptage en ${articleCount} points clés.`,
      'Producteur': `Côté production, la semaine écoulée aura été riche en annonces. Nouveaux projets, deals stratégiques et repositionnements : voici ce qu'il faut retenir pour garder une longueur d'avance.`,
      'Diffuseur': `Dans un paysage de la diffusion en pleine recomposition, les acteurs multiplient les initiatives. Droits, grilles, stratégies numériques : le point sur les mouvements qui façonnent le marché.`,
      'Annonceur': `Le marché publicitaire poursuit sa transformation. Entre nouveaux formats, arbitrages budgétaires et innovations créatives, voici les tendances qui dessinent le paysage pub de demain.`,
      'Financier': `Les marchés ont parlé cette semaine. Valorisations, opérations capitalistiques et résultats trimestriels : l'essentiel de l'actualité financière du secteur médias-entertainment.`
    }
    return intros[profileName] || `L'essentiel de l'actualité ${profileName.toLowerCase()} de la semaine, sélectionné par la rédaction Satellifacts.`
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedNewsletter(null)

    try {
      const res = await fetch(`${API_BASE}/api/newsletters/generate/${selectedProfile}`, {
        method: 'POST'
      })

      if (res.ok) {
        const data = await res.json()
        setGeneratedNewsletter(data.newsletter)
      } else {
        console.error('Newsletter generation failed')
      }
    } catch (error) {
      console.error('Error generating newsletter:', error)
    }

    setIsGenerating(false)
  }

  const getNewsletterText = () => {
    if (!generatedNewsletter) return ''
    const nl = generatedNewsletter

    let text = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${nl.title}
${nl.subtitle || 'La lettre professionnelle des médias et du divertissement'}
${nl.date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${nl.intro}

`

    if (nl.articles && nl.articles.length > 0) {
      nl.articles.forEach((article, i) => {
        text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▸ ${article.title}
  Source : ${article.source}

${article.summary}

  → Lire l'article : ${article.link}

`
      })
    }

    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${nl.outro}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© Satellifacts ${new Date().getFullYear()} - Tous droits réservés
Se désabonner | Gérer mes préférences`
    return text
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getNewsletterText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const text = getNewsletterText()
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-${selectedProfile}-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const previewArticles = filterNewsByProfile(selectedProfile).slice(0, 3)

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <Mail size={28} />
          Newsletters Personnalisées
        </h1>
        <p className="page-description">
          Génération automatique de newsletters adaptées aux profils abonnés
        </p>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon orange"><Users size={24} /></div>
          <div className="stat-value">1,289</div>
          <div className="stat-label">Abonnés actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Mail size={24} /></div>
          <div className="stat-value">6</div>
          <div className="stat-label">Profils configurés</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Eye size={24} /></div>
          <div className="stat-value">43%</div>
          <div className="stat-label">Taux d'ouverture moyen</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><MousePointer size={24} /></div>
          <div className="stat-value">19%</div>
          <div className="stat-label">Taux de clic moyen</div>
        </div>
      </div>

      {/* Profile Selection & Generator */}
      <div className="grid-2 mb-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <UserCheck size={18} />
              Profils abonnés
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {profiles.map((profile) => {
              const Icon = profile.icon
              return (
                <div
                  key={profile.id}
                  className={`flex items-center gap-3 p-3 ${selectedProfile === profile.id ? '' : ''}`}
                  style={{
                    background: selectedProfile === profile.id ? profile.color + '20' : 'var(--bg-dark)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: selectedProfile === profile.id ? `2px solid ${profile.color}` : '2px solid transparent'
                  }}
                  onClick={() => setSelectedProfile(profile.id)}
                >
                  <div
                    className="stat-icon"
                    style={{
                      width: 40, height: 40, marginBottom: 0,
                      background: profile.color + '30',
                      color: profile.color
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="font-medium">{profile.name}</div>
                    <div className="text-sm text-gray">{profile.count} abonnés</div>
                  </div>
                  {selectedProfile === profile.id && (
                    <CheckCircle2 size={20} style={{ color: profile.color }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Sparkles size={18} />
              Générer une newsletter
            </h3>
          </div>

          <div className="mb-4">
            <div className="input-label">Profil sélectionné</div>
            <div className="p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
              <strong>{profiles.find(p => p.id === selectedProfile)?.name}</strong>
              <span className="text-sm text-gray"> — {profiles.find(p => p.id === selectedProfile)?.count} destinataires</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="input-label">Aperçu du contenu ({allNews.length} articles disponibles)</div>
            <div className="p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px', maxHeight: '180px', overflow: 'auto' }}>
              {previewArticles.length > 0 ? previewArticles.map((article, i) => (
                <div key={i} className="flex items-start gap-2 py-2" style={{ borderBottom: i < previewArticles.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--success)', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <span className="text-sm">{article.title}</span>
                    <div className="text-xs text-gray">{article.source}</div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-gray">Chargement des articles...</div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={isGenerating || allNews.length === 0}
              style={{ flex: 1 }}
            >
              {isGenerating ? (
                <><div className="spinner"></div> Génération...</>
              ) : (
                <><Sparkles size={18} /> Générer la newsletter</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Newsletter */}
      {generatedNewsletter && (
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="card-title">
              <Mail size={18} />
              Newsletter générée - {generatedNewsletter.profile}
            </h3>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-secondary" onClick={handleCopy}>
                <Copy size={14} /> {copied ? 'Copié !' : 'Copier'}
              </button>
              <button className="btn btn-sm btn-primary" onClick={handleDownload}>
                <Download size={14} /> Télécharger .txt
              </button>
            </div>
          </div>
          <div className="p-4" style={{ background: 'var(--bg-dark)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap', maxHeight: '400px', overflow: 'auto' }}>
            {getNewsletterText()}
          </div>
        </div>
      )}

      {/* Engagement Chart */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">
            <BarChart3 size={18} />
            Engagement par profil
          </h3>
        </div>
        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: '#1e2433',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="open" fill="#3b82f6" name="Taux d'ouverture %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="click" fill="#10b981" name="Taux de clic %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Newsletters */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Clock size={18} />
            Newsletters récentes
          </h3>
          <button className="btn btn-sm btn-secondary">
            Voir tout
          </button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Newsletter</th>
                <th>Envoyée le</th>
                <th>Destinataires</th>
                <th>Ouverture</th>
                <th>Clics</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentNewsletters.map((nl, i) => (
                <tr key={i}>
                  <td><strong>{nl.name}</strong></td>
                  <td>{nl.sent}</td>
                  <td>{nl.recipients}</td>
                  <td>
                    <span className="tag tag-green">{nl.openRate}%</span>
                  </td>
                  <td>
                    <span className="tag tag-blue">{nl.clickRate}%</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-secondary">
                      <Eye size={14} /> Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="alert alert-info mt-6">
        <Sparkles size={20} />
        <div>
          <strong>Personnalisation IA</strong>
          <p className="text-sm mt-1">
            L'IA sélectionne automatiquement les articles les plus pertinents pour chaque profil
            en analysant les centres d'intérêt métier et l'historique de lecture des abonnés.
          </p>
        </div>
      </div>
    </div>
  )
}
