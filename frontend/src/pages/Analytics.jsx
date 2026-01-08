import { useState } from 'react'
import {
  BarChart3, TrendingUp, Clock, Target, Zap, Calendar,
  FileText, Eye, Share2, ThumbsUp, ArrowUpRight, ArrowDownRight,
  Lightbulb, Star
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'

// Données de performance
const performanceData = [
  { date: 'Lun', views: 4500, shares: 120, engagement: 4.2 },
  { date: 'Mar', views: 5200, shares: 180, engagement: 5.1 },
  { date: 'Mer', views: 4800, shares: 150, engagement: 4.8 },
  { date: 'Jeu', views: 6100, shares: 220, engagement: 5.8 },
  { date: 'Ven', views: 5500, shares: 190, engagement: 5.2 },
  { date: 'Sam', views: 3200, shares: 80, engagement: 3.5 },
  { date: 'Dim', views: 2800, shares: 60, engagement: 3.1 },
]

const categoryPerformance = [
  { name: 'Audiovisuel', value: 35, color: '#3b82f6' },
  { name: 'Cinéma', value: 25, color: '#ec4899' },
  { name: 'Streaming', value: 20, color: '#8b5cf6' },
  { name: 'Publicité', value: 12, color: '#f59e0b' },
  { name: 'Finance', value: 8, color: '#10b981' },
]

// Prédictions IA
const predictions = [
  {
    topic: 'Droits sportifs 2025',
    score: 92,
    reason: 'Sujet tendance + historique d\'engagement élevé',
    bestTime: 'Mardi 9h',
    format: 'Analyse longue'
  },
  {
    topic: 'Bilan streaming France',
    score: 88,
    reason: 'Intérêt récurrent en début d\'année',
    bestTime: 'Mercredi 14h',
    format: 'Infographie + article'
  },
  {
    topic: 'Publicité TV vs Digital',
    score: 85,
    reason: 'Débat actuel + audiences annonceurs',
    bestTime: 'Jeudi 10h',
    format: 'Tribune/Opinion'
  },
]

// Meilleurs articles
const topArticles = [
  { title: 'Canal+ et la Premier League', views: 12500, engagement: 8.2, shares: 450 },
  { title: 'Netflix : bilan 2024', views: 9800, engagement: 7.1, shares: 320 },
  { title: 'Fusion TF1-M6 : retour sur l\'échec', views: 8900, engagement: 6.8, shares: 280 },
]

export default function Analytics() {
  const [period, setPeriod] = useState('7d')

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <BarChart3 size={28} />
          Prédiction Éditoriale
        </h1>
        <p className="page-description">
          Analyse des performances et recommandations IA pour optimiser votre stratégie éditoriale
        </p>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon blue"><Eye size={24} /></div>
          <div className="stat-value">32.1k</div>
          <div className="stat-label">Vues cette semaine</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} /> +12%
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><ThumbsUp size={24} /></div>
          <div className="stat-value">4.8%</div>
          <div className="stat-label">Taux d'engagement</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} /> +0.5%
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Share2 size={24} /></div>
          <div className="stat-value">1.2k</div>
          <div className="stat-label">Partages</div>
          <div className="stat-change positive">
            <ArrowUpRight size={14} /> +18%
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><Clock size={24} /></div>
          <div className="stat-value">3:45</div>
          <div className="stat-label">Temps de lecture moyen</div>
          <div className="stat-change negative">
            <ArrowDownRight size={14} /> -0:15
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">
            <TrendingUp size={18} />
            Performance des contenus
          </h3>
          <div className="tabs" style={{ marginBottom: 0, background: 'transparent', padding: 0 }}>
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                className={`tab ${period === p ? 'active' : ''}`}
                onClick={() => setPeriod(p)}
                style={{ padding: '6px 12px' }}
              >
                {p === '7d' ? '7 jours' : p === '30d' ? '30 jours' : '90 jours'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: '#1e2433',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="views" stroke="#3b82f6" fill="url(#colorViews)" name="Vues" />
              <Line type="monotone" dataKey="shares" stroke="#10b981" name="Partages" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Predictions & Categories */}
      <div className="grid-2 mb-6">
        {/* Predictions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Lightbulb size={18} />
              Recommandations IA
            </h3>
            <span className="tag tag-green">Prédictions</span>
          </div>
          <p className="text-sm text-gray mb-4">
            Sujets à fort potentiel basés sur l'analyse des performances passées
          </p>
          <div className="flex flex-col gap-4">
            {predictions.map((pred, i) => (
              <div
                key={i}
                className="p-4"
                style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{pred.topic}</div>
                  <div className="flex items-center gap-1">
                    <Star size={14} style={{ color: '#f59e0b' }} />
                    <span className="font-semibold">{pred.score}%</span>
                  </div>
                </div>
                <div className="text-sm text-gray mb-2">{pred.reason}</div>
                <div className="flex gap-2">
                  <span className="tag tag-blue">
                    <Clock size={10} style={{ marginRight: 4 }} />
                    {pred.bestTime}
                  </span>
                  <span className="tag tag-purple">
                    <FileText size={10} style={{ marginRight: 4 }} />
                    {pred.format}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Target size={18} />
              Performance par catégorie
            </h3>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1e2433',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {categoryPerformance.map((cat, i) => (
              <span key={i} className="flex items-center gap-2 text-sm">
                <span style={{ width: 12, height: 12, background: cat.color, borderRadius: 3 }}></span>
                {cat.name} ({cat.value}%)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top Articles & Best Times */}
      <div className="grid-2">
        {/* Top Articles */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Star size={18} />
              Meilleurs articles (7 jours)
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {topArticles.map((article, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3"
                style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}
              >
                <span className="tag tag-blue">#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div className="font-medium text-sm">{article.title}</div>
                  <div className="flex gap-3 text-xs text-gray mt-1">
                    <span><Eye size={10} /> {(article.views / 1000).toFixed(1)}k vues</span>
                    <span><ThumbsUp size={10} /> {article.engagement}%</span>
                    <span><Share2 size={10} /> {article.shares}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Publishing Times */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Calendar size={18} />
              Meilleurs créneaux de publication
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Mardi 9h00</div>
                  <div className="text-sm text-gray">Engagement optimal</div>
                </div>
                <span className="tag tag-green">+42% vues</span>
              </div>
            </div>
            <div className="p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Jeudi 14h00</div>
                  <div className="text-sm text-gray">Fort taux de partage</div>
                </div>
                <span className="tag tag-blue">+35% partages</span>
              </div>
            </div>
            <div className="p-3" style={{ background: 'var(--bg-dark)', borderRadius: '8px' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Mercredi 10h00</div>
                  <div className="text-sm text-gray">Temps de lecture élevé</div>
                </div>
                <span className="tag tag-purple">+28% temps</span>
              </div>
            </div>
          </div>

          <div className="alert alert-info mt-4" style={{ margin: 0 }}>
            <Zap size={16} />
            <span className="text-sm">
              Ces recommandations sont basées sur 6 mois de données
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="alert alert-info mt-6">
        <Zap size={20} />
        <div>
          <strong>Prédiction IA</strong>
          <p className="text-sm mt-1">
            L'IA analyse les performances passées (taux d'ouverture, temps de lecture, partages)
            pour recommander les meilleurs horaires, angles et formats de publication.
            Précision estimée : 80% selon les benchmarks.
          </p>
        </div>
      </div>
    </div>
  )
}
