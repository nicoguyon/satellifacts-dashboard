import { useState, useEffect } from 'react'
import {
  TrendingUp, TrendingDown, DollarSign, Building2, Globe,
  RefreshCw, Download, Calendar, BarChart3, Activity, Wifi, WifiOff
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const API_BASE = 'http://localhost:8000'

// Données pour le graphique (historique)
const chartData = [
  { date: 'Jan', vivendi: 9.8, tf1: 8.5, m6: 14.2 },
  { date: 'Fév', vivendi: 10.1, tf1: 8.8, m6: 14.5 },
  { date: 'Mar', vivendi: 9.9, tf1: 8.6, m6: 14.3 },
  { date: 'Avr', vivendi: 10.3, tf1: 9.0, m6: 14.8 },
  { date: 'Mai', vivendi: 10.0, tf1: 8.7, m6: 14.6 },
  { date: 'Juin', vivendi: 10.2, tf1: 8.9, m6: 14.9 },
  { date: 'Juil', vivendi: 10.45, tf1: 8.92, m6: 14.85 },
]

export default function Finance() {
  const [selectedPeriod, setSelectedPeriod] = useState('1M')
  const [stockData, setStockData] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [isLive, setIsLive] = useState(false)
  const [error, setError] = useState(null)

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/api/finance/stocks`)
      if (response.ok) {
        const data = await response.json()
        setStockData(data.data || [])
        setLastUpdate(data.last_update)
        setIsLive(true)
        setError(null)
      } else {
        throw new Error('API Error')
      }
    } catch (err) {
      console.error('Failed to fetch stocks:', err)
      setIsLive(false)
      setError('Backend non connecté - données de démo')
      // Fallback to demo data
      setStockData([
        { name: 'Vivendi', ticker: 'VIV.PA', price: 10.45, change: 2.3, marketCap: '11.2B EUR', sector: 'Médias' },
        { name: 'TF1', ticker: 'TFI.PA', price: 8.92, change: -0.8, marketCap: '1.9B EUR', sector: 'TV' },
        { name: 'M6 Métropole', ticker: 'MMT.PA', price: 14.85, change: 1.2, marketCap: '1.8B EUR', sector: 'TV' },
        { name: 'Netflix', ticker: 'NFLX', price: 945.20, change: 4.2, marketCap: '410B USD', sector: 'Streaming' },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStocks()
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchStocks, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">
              <TrendingUp size={28} />
              Données Financières
            </h1>
            <p className="page-description">
              Suivi des cours de bourse et données financières des groupes de médias cotés
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isLive ? (
              <span className="tag tag-green"><Wifi size={12} /> LIVE - Yahoo Finance</span>
            ) : (
              <span className="tag tag-orange"><WifiOff size={12} /> Données démo</span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning mb-4">
          <WifiOff size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Market Overview */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon green"><Building2 size={24} /></div>
          <div className="stat-value">{stockData.length}</div>
          <div className="stat-label">Entreprises suivies</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Globe size={24} /></div>
          <div className="stat-value">3</div>
          <div className="stat-label">Marchés (Paris, NYSE, NASDAQ)</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Activity size={24} /></div>
          <div className="stat-value">15 min</div>
          <div className="stat-label">Fréquence MAJ</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><Calendar size={24} /></div>
          <div className="stat-value">Q4</div>
          <div className="stat-label">Prochains résultats</div>
        </div>
      </div>

      {/* Chart */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">
            <BarChart3 size={18} />
            Évolution des cours - Médias France
          </h3>
          <div className="tabs" style={{ marginBottom: 0, background: 'transparent', padding: 0 }}>
            {['1S', '1M', '3M', '1A'].map((p) => (
              <button
                key={p}
                className={`tab ${selectedPeriod === p ? 'active' : ''}`}
                onClick={() => setSelectedPeriod(p)}
                style={{ padding: '6px 12px' }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVivendi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTf1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
              <Area type="monotone" dataKey="vivendi" stroke="#3b82f6" fill="url(#colorVivendi)" name="Vivendi" />
              <Area type="monotone" dataKey="tf1" stroke="#10b981" fill="url(#colorTf1)" name="TF1" />
              <Line type="monotone" dataKey="m6" stroke="#f59e0b" name="M6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock Table */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">
            <DollarSign size={18} />
            Cours en temps réel
            {lastUpdate && (
              <span className="text-xs text-gray" style={{ marginLeft: 12, fontWeight: 400 }}>
                MAJ: {new Date(lastUpdate).toLocaleTimeString('fr-FR')}
              </span>
            )}
          </h3>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-secondary" onClick={fetchStocks} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spinner' : ''} /> Actualiser
            </button>
            <button className="btn btn-sm btn-primary">
              <Download size={14} /> Exporter
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Entreprise</th>
                <th>Ticker</th>
                <th>Cours</th>
                <th>Variation</th>
                <th>Cap. boursière</th>
                <th>Secteur</th>
              </tr>
            </thead>
            <tbody>
              {loading && stockData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                  </td>
                </tr>
              ) : (
                stockData.map((stock, i) => (
                  <tr key={i}>
                    <td><strong>{stock.name}</strong></td>
                    <td><span className="tag tag-gray">{stock.ticker}</span></td>
                    <td className="font-semibold">
                      {stock.currency === 'USD' ? '$' : '€'}{typeof stock.price === 'number' ? stock.price.toFixed(2) : stock.price}
                    </td>
                    <td>
                      <span className="flex items-center gap-1"
                        style={{ color: stock.change >= 0 ? 'var(--success)' : 'var(--error)' }}>
                        {stock.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {stock.change >= 0 ? '+' : ''}{typeof stock.change === 'number' ? stock.change.toFixed(2) : stock.change}%
                      </span>
                    </td>
                    <td>{stock.marketCap}</td>
                    <td><span className="tag tag-blue">{stock.sector}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="alert alert-info">
        <Activity size={20} />
        <div>
          <strong>Source : Yahoo Finance API</strong>
          <p className="text-sm mt-1">
            Données temps réel des marchés. Les cours sont mis à jour automatiquement toutes les 15 minutes
            pendant les heures d'ouverture des marchés. Tâche planifiée active.
          </p>
        </div>
      </div>
    </div>
  )
}
