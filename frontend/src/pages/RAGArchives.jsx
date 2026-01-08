import { useState } from 'react'
import {
  Search, Database, FileText, Link2, Clock, Tag, ArrowRight,
  Sparkles, BookOpen, TrendingUp, Filter, RefreshCw
} from 'lucide-react'

// Données de démonstration
const sampleArticles = [
  {
    id: 1,
    title: "TF1 et M6 : les détails de la fusion avortée",
    date: "2022-09-16",
    category: "Audiovisuel",
    excerpt: "L'Autorité de la concurrence a finalement bloqué le projet de fusion entre les deux groupes audiovisuels français...",
    relevance: 0.95,
    tags: ["TF1", "M6", "Fusion", "Concentration"]
  },
  {
    id: 2,
    title: "Canal+ accélère sur les droits sportifs internationaux",
    date: "2024-03-12",
    category: "Droits TV",
    excerpt: "Le groupe Canal+ poursuit sa stratégie d'acquisition de droits sportifs premium à l'international...",
    relevance: 0.89,
    tags: ["Canal+", "Sport", "Droits TV"]
  },
  {
    id: 3,
    title: "Netflix France : bilan de 10 ans de présence",
    date: "2024-09-15",
    category: "Streaming",
    excerpt: "Dix ans après son lancement en France, Netflix compte désormais plus de 10 millions d'abonnés...",
    relevance: 0.85,
    tags: ["Netflix", "SVOD", "France"]
  },
  {
    id: 4,
    title: "Le marché publicitaire TV en mutation",
    date: "2024-01-20",
    category: "Publicité",
    excerpt: "Face à la concurrence du digital, les régies publicitaires des chaînes historiques adaptent leur offre...",
    relevance: 0.78,
    tags: ["Publicité", "TV", "Digital"]
  },
  {
    id: 5,
    title: "France Télévisions : nouvelle stratégie numérique",
    date: "2024-05-08",
    category: "Audiovisuel",
    excerpt: "Le groupe public présente sa nouvelle plateforme de streaming gratuit france.tv...",
    relevance: 0.72,
    tags: ["France TV", "Streaming", "Service public"]
  }
]

const suggestedLinks = [
  { title: "Voir aussi : Historique des fusions audiovisuelles en France", url: "#" },
  { title: "Article connexe : Régulation des médias par l'Arcom", url: "#" },
  { title: "Dossier complet : Concentration des médias 2020-2024", url: "#" }
]

export default function RAGArchives() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setHasSearched(true)

    // Simulation de recherche
    setTimeout(() => {
      setSearchResults(sampleArticles)
      setIsSearching(false)
    }, 800)
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <Database size={28} />
          RAG Archives
        </h1>
        <p className="page-description">
          Recherche sémantique intelligente dans les archives Satellifacts.
          Trouvez des articles pertinents et des liens contextuels pour enrichir vos contenus.
        </p>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon blue"><FileText size={24} /></div>
          <div className="stat-value">15,847</div>
          <div className="stat-label">Articles indexés</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Clock size={24} /></div>
          <div className="stat-value">2014</div>
          <div className="stat-label">Depuis</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Tag size={24} /></div>
          <div className="stat-value">2,456</div>
          <div className="stat-label">Tags uniques</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><Search size={24} /></div>
          <div className="stat-value">234</div>
          <div className="stat-label">Recherches aujourd'hui</div>
        </div>
      </div>

      {/* Search Box */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">
            <Sparkles size={18} />
            Recherche sémantique IA
          </h3>
        </div>
        <div className="flex gap-3">
          <div className="search-box" style={{ flex: 1 }}>
            <Search size={20} className="search-box-icon" />
            <input
              type="text"
              className="input"
              placeholder="Ex: fusion TF1 M6, droits sportifs Canal+, Netflix France..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <><div className="spinner"></div> Recherche...</>
            ) : (
              <><Search size={18} /> Rechercher</>
            )}
          </button>
          <button className="btn btn-secondary">
            <Filter size={18} /> Filtres
          </button>
        </div>

        {/* Quick suggestions */}
        <div className="mt-4 flex gap-2">
          <span className="text-sm text-gray">Suggestions :</span>
          {['Canal+ sport', 'Netflix bilan', 'Publicité TV', 'Fusion médias'].map((s) => (
            <button
              key={s}
              className="tag tag-blue"
              style={{ cursor: 'pointer' }}
              onClick={() => { setSearchQuery(s); handleSearch() }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="grid-2">
          {/* Main Results */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <BookOpen size={18} />
                Résultats ({searchResults.length})
              </h3>
              <span className="text-sm text-gray">Triés par pertinence</span>
            </div>

            {isSearching ? (
              <div className="empty-state">
                <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 20px' }}></div>
                <p>Analyse sémantique en cours...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {searchResults.map((article) => (
                  <div
                    key={article.id}
                    className="p-4"
                    style={{
                      background: 'var(--bg-dark)',
                      borderRadius: '8px',
                      borderLeft: '3px solid var(--accent-blue)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="tag tag-blue">{article.category}</span>
                      <span className="text-xs text-gray">{article.date}</span>
                      <span className="tag tag-green" style={{ marginLeft: 'auto' }}>
                        {Math.round(article.relevance * 100)}% pertinent
                      </span>
                    </div>
                    <h4 style={{ marginBottom: 8, fontWeight: 600 }}>{article.title}</h4>
                    <p className="text-sm text-gray" style={{ marginBottom: 12 }}>
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2">
                      {article.tags.map((tag) => (
                        <span key={tag} className="tag tag-gray">{tag}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="btn btn-sm btn-secondary">
                        <Link2 size={14} /> Insérer le lien
                      </button>
                      <button className="btn btn-sm btn-secondary">
                        <FileText size={14} /> Voir l'article
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggested Links Panel */}
          <div>
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="card-title">
                  <Link2 size={18} />
                  Liens suggérés
                </h3>
              </div>
              <p className="text-sm text-gray mb-4">
                Liens contextuels recommandés par l'IA pour enrichir votre article
              </p>
              <div className="flex flex-col gap-3">
                {suggestedLinks.map((link, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3"
                    style={{ background: 'var(--bg-dark)', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <ArrowRight size={16} style={{ color: 'var(--accent-blue)' }} />
                    <span className="text-sm">{link.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <TrendingUp size={18} />
                  Tendances archives
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                {['Streaming SVOD', 'Concentration médias', 'Droits sportifs', 'IA et médias', 'Régulation Arcom'].map((trend, i) => (
                  <div key={i} className="flex items-center justify-between p-2">
                    <span className="text-sm">{trend}</span>
                    <span className="text-xs text-gray">+{Math.floor(Math.random() * 50 + 10)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initial state */}
      {!hasSearched && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Search size={32} />
            </div>
            <h3 className="empty-state-title">Commencez une recherche</h3>
            <p className="empty-state-description">
              Utilisez la recherche sémantique pour trouver des articles pertinents dans les archives Satellifacts.
              L'IA analysera le contexte pour vous suggérer les meilleurs liens.
            </p>
          </div>
        </div>
      )}

      {/* Integration Info */}
      <div className="alert alert-info mt-6">
        <Sparkles size={20} />
        <div>
          <strong>Intégration CMS</strong>
          <p className="text-sm mt-1">
            Ce module peut être intégré directement dans votre éditeur d'articles pour suggérer
            automatiquement des liens vers les archives lors de la rédaction.
          </p>
        </div>
      </div>
    </div>
  )
}
