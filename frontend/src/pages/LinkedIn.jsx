import { useState, useEffect } from 'react'
import {
  Linkedin, FileText, TrendingUp, Users, AlertTriangle,
  Copy, Edit3, Send, Clock, Eye, ThumbsUp, MessageSquare,
  Share2, Sparkles, CheckCircle2, ExternalLink, RefreshCw
} from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Stats LinkedIn
const linkedinStats = {
  posts: 45,
  totalViews: 125000,
  avgEngagement: 4.2,
  followers: 2340,
  leads: 89
}

export default function LinkedInModule() {
  const [articles, setArticles] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/veille/news`)
      if (res.ok) {
        const data = await res.json()
        // Filter French articles and prioritize high engagement potential
        const allArticles = data.articles || []
        const frenchArticles = allArticles.filter(a => a.lang === 'fr' || !a.lang)
        setArticles(frenchArticles.slice(0, 6))
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
    setLoading(false)
  }

  const handleGenerate = async (article) => {
    setSelectedArticle(article)
    setIsGenerating(true)
    setGeneratedContent('')

    try {
      const res = await fetch(`${API_BASE}/api/linkedin/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_title: article.title,
          article_summary: article.summary || '',
          article_source: article.source,
          article_link: article.link
        })
      })

      if (res.ok) {
        const data = await res.json()
        setGeneratedContent(data.post)
      }
    } catch (error) {
      console.error('Error generating post:', error)
      setGeneratedContent('Erreur lors de la génération du post.')
    }

    setIsGenerating(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openLinkedIn = () => {
    const text = encodeURIComponent(generatedContent)
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, '_blank')
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <Linkedin size={28} />
          LinkedIn B2B
        </h1>
        <p className="page-description">
          Transformation d'articles en posts LinkedIn et génération de leads
        </p>
      </div>

      {/* Warning */}
      <div className="alert alert-warning mb-6">
        <AlertTriangle size={20} />
        <div>
          <strong>Approche légale uniquement</strong>
          <p className="text-sm mt-1">
            Ce module permet de reformater vos articles pour LinkedIn.
            L'automatisation des connexions/messages est interdite par les CGU LinkedIn.
            Utilisez LinkedIn Ads pour la prospection.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 119, 181, 0.15)', color: '#0077b5' }}>
            <FileText size={24} />
          </div>
          <div className="stat-value">{linkedinStats.posts}</div>
          <div className="stat-label">Posts publiés</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 119, 181, 0.15)', color: '#0077b5' }}>
            <Eye size={24} />
          </div>
          <div className="stat-value">{(linkedinStats.totalViews / 1000).toFixed(0)}k</div>
          <div className="stat-label">Vues totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 119, 181, 0.15)', color: '#0077b5' }}>
            <ThumbsUp size={24} />
          </div>
          <div className="stat-value">{linkedinStats.avgEngagement}%</div>
          <div className="stat-label">Engagement moyen</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Users size={24} /></div>
          <div className="stat-value">{linkedinStats.leads}</div>
          <div className="stat-label">Leads générés</div>
        </div>
      </div>

      {/* Content Transformer */}
      <div className="grid-2 mb-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FileText size={18} />
              Articles à transformer
            </h3>
            <button className="btn btn-sm btn-secondary" onClick={fetchArticles} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <p className="text-sm text-gray mb-4">
            Sélectionnez un article pour générer un post LinkedIn
          </p>
          <div className="flex flex-col gap-3" style={{ maxHeight: '400px', overflow: 'auto' }}>
            {articles.length === 0 && !loading && (
              <div className="text-sm text-gray">Aucun article disponible</div>
            )}
            {articles.map((article, index) => (
              <div
                key={index}
                className="p-4"
                style={{
                  background: selectedArticle?.link === article.link ? 'rgba(0, 119, 181, 0.1)' : 'var(--bg-dark)',
                  borderRadius: '8px',
                  border: selectedArticle?.link === article.link ? '2px solid #0077b5' : '2px solid transparent',
                  cursor: 'pointer'
                }}
                onClick={() => handleGenerate(article)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="tag tag-blue">{article.source}</span>
                  {article.priority === 'high' && <span className="tag tag-green">Fort potentiel</span>}
                </div>
                <div className="font-medium text-sm mb-2">{article.title}</div>
                <div className="text-xs text-gray" style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {article.summary?.substring(0, 100)}...
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Sparkles size={18} />
              Post LinkedIn généré
            </h3>
          </div>

          {!selectedArticle ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Linkedin size={32} />
              </div>
              <p className="text-sm text-gray">
                Sélectionnez un article pour générer un post LinkedIn
              </p>
            </div>
          ) : isGenerating ? (
            <div className="empty-state">
              <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 20px' }}></div>
              <p>Génération du post...</p>
            </div>
          ) : (
            <>
              <div
                className="p-4 mb-4"
                style={{
                  background: 'var(--bg-dark)',
                  borderRadius: '8px',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  maxHeight: '300px',
                  overflow: 'auto'
                }}
              >
                {generatedContent}
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCopy}>
                  <Copy size={18} /> {copied ? 'Copié !' : 'Copier'}
                </button>
                <button className="btn btn-secondary" onClick={openLinkedIn}>
                  <ExternalLink size={18} /> Publier sur LinkedIn
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Best Practices */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">
            <TrendingUp size={18} />
            Bonnes pratiques LinkedIn
          </h3>
        </div>
        <div className="grid-3">
          <div className="p-4" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
            <div className="font-medium mb-2">📅 Meilleurs horaires</div>
            <div className="text-sm text-gray">
              Mardi-Jeudi, 8h-9h ou 17h-18h pour maximiser la visibilité
            </div>
          </div>
          <div className="p-4" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
            <div className="font-medium mb-2">📝 Format optimal</div>
            <div className="text-sm text-gray">
              Hook accrocheur + 3-5 bullet points + CTA + 3-5 hashtags
            </div>
          </div>
          <div className="p-4" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
            <div className="font-medium mb-2">🎯 Engagement</div>
            <div className="text-sm text-gray">
              Répondre aux commentaires dans l'heure pour booster l'algorithme
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn Ads Recommendation */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Linkedin size={18} />
            LinkedIn Ads (Recommandé pour la prospection)
          </h3>
        </div>
        <p className="text-sm text-gray mb-4">
          Pour la génération de leads B2B, utilisez LinkedIn Ads et LinkedIn Accelerate (IA native)
          plutôt que l'automatisation qui viole les CGU.
        </p>
        <div className="grid-2">
          <div className="p-4" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
            <div className="font-medium mb-2">LinkedIn Accelerate</div>
            <div className="text-sm text-gray mb-3">
              L'IA de LinkedIn crée et optimise automatiquement vos campagnes
            </div>
            <span className="tag tag-green">+121% taux de conversion</span>
          </div>
          <div className="p-4" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
            <div className="font-medium mb-2">Sponsored Content</div>
            <div className="text-sm text-gray mb-3">
              Promouvez vos articles auprès des décideurs médias
            </div>
            <span className="tag tag-blue">Ciblage précis</span>
          </div>
        </div>
        <button className="btn btn-secondary mt-4">
          <ExternalLink size={18} /> Configurer LinkedIn Ads
        </button>
      </div>
    </div>
  )
}
