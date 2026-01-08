import { useState, useRef, useEffect } from 'react'
import {
  MessageSquare, Send, Sparkles, Database, FileText,
  ThumbsUp, ThumbsDown, Copy, ExternalLink, Zap, Bot, User
} from 'lucide-react'

// Réponses de démonstration
const demoResponses = {
  'canal+ sport': `D'après les archives Satellifacts, **Canal+** a considérablement renforcé sa stratégie sportive ces dernières années :

📊 **Acquisitions récentes de droits :**
- Premier League (2026-2029) : ~400M€/an
- Ligue 1 (2024-2029) : Accord avec DAZN
- Top 14 Rugby : Droits exclusifs prolongés

📈 **Stratégie :**
Canal+ mise sur le sport premium comme levier de recrutement et de rétention face à la concurrence des plateformes SVOD.

**Sources :** Articles Satellifacts du 15/12/2024, 03/01/2025`,

  'fusion tf1 m6': `La **fusion TF1-M6** a été un dossier majeur de l'audiovisuel français :

📅 **Chronologie :**
- Mai 2021 : Annonce du projet de fusion
- Septembre 2022 : Refus de l'Autorité de la concurrence
- Motif : Position dominante sur le marché publicitaire TV

⚖️ **Arguments clés :**
L'Autorité a estimé que l'entité fusionnée aurait représenté 70% du marché publicitaire TV, créant un déséquilibre majeur.

📰 **Couverture Satellifacts :** 47 articles sur ce sujet depuis 2021.

**Sources :** Dossier spécial Fusion TF1-M6, Archives 2021-2022`,

  'default': `Je suis l'assistant expert Satellifacts. Je peux vous aider sur :

• **Actualités médias** : audiovisuel, cinéma, streaming
• **Données marché** : audiences, box-office, finances
• **Historique** : archives depuis 2014
• **Analyses** : tendances et perspectives du secteur

Posez-moi une question sur l'industrie des médias !`
}

const suggestedQuestions = [
  'Quelle est la stratégie sport de Canal+ ?',
  'Historique de la fusion TF1-M6',
  'Évolution du marché SVOD en France',
  'Dernières acquisitions de droits TV'
]

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Bonjour ! Je suis l\'assistant expert Satellifacts. Je peux répondre à vos questions sur l\'industrie des médias en m\'appuyant sur nos archives et données. Comment puis-je vous aider ?',
      sources: []
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulation de réponse
    setTimeout(() => {
      let response = demoResponses.default
      const lowerInput = input.toLowerCase()

      if (lowerInput.includes('canal') && lowerInput.includes('sport')) {
        response = demoResponses['canal+ sport']
      } else if (lowerInput.includes('fusion') || (lowerInput.includes('tf1') && lowerInput.includes('m6'))) {
        response = demoResponses['fusion tf1 m6']
      }

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: response,
        sources: ['Archives Satellifacts', 'Base RAG']
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">
          <MessageSquare size={28} />
          Chatbot Expert Médias
        </h1>
        <p className="page-description">
          Assistant IA spécialisé dans l'industrie des médias, alimenté par les archives Satellifacts
        </p>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-icon blue"><Database size={24} /></div>
          <div className="stat-value">15,847</div>
          <div className="stat-label">Articles sources</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Zap size={24} /></div>
          <div className="stat-value">RAG</div>
          <div className="stat-label">Technologie</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><MessageSquare size={24} /></div>
          <div className="stat-value">1,234</div>
          <div className="stat-label">Questions traitées</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><ThumbsUp size={24} /></div>
          <div className="stat-value">94%</div>
          <div className="stat-label">Satisfaction</div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="card" style={{ height: 'calc(100vh - 380px)', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
        {/* Messages */}
        <div className="chat-messages" style={{ flex: 1, overflowY: 'auto' }}>
          {messages.map((message) => (
            <div key={message.id} className={`chat-message ${message.type}`}>
              <div className="chat-avatar">
                {message.type === 'bot' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div>
                <div
                  className="chat-bubble"
                  style={{
                    whiteSpace: 'pre-wrap'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: message.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                  }}
                />
                {message.sources && message.sources.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {message.sources.map((source, i) => (
                      <span key={i} className="tag tag-gray text-xs">
                        <FileText size={10} style={{ marginRight: 4 }} />
                        {source}
                      </span>
                    ))}
                  </div>
                )}
                {message.type === 'bot' && message.id > 1 && (
                  <div className="flex gap-2 mt-2">
                    <button className="btn btn-sm btn-secondary" style={{ padding: '4px 8px' }}>
                      <ThumbsUp size={12} />
                    </button>
                    <button className="btn btn-sm btn-secondary" style={{ padding: '4px 8px' }}>
                      <ThumbsDown size={12} />
                    </button>
                    <button className="btn btn-sm btn-secondary" style={{ padding: '4px 8px' }}>
                      <Copy size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-message">
              <div className="chat-avatar">
                <Bot size={18} />
              </div>
              <div className="chat-bubble">
                <div className="flex items-center gap-2">
                  <div className="spinner"></div>
                  <span>Recherche dans les archives...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="p-4" style={{ borderTop: '1px solid var(--border-color)' }}>
            <div className="text-sm text-gray mb-2">Questions suggérées :</div>
            <div className="flex gap-2 flex-wrap">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  className="tag tag-blue"
                  style={{ cursor: 'pointer' }}
                  onClick={() => { setInput(q); }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="chat-input-area">
          <input
            type="text"
            className="input"
            placeholder="Posez votre question sur l'industrie des médias..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="alert alert-info mt-6">
        <Sparkles size={20} />
        <div>
          <strong>Fonctionnalité Premium</strong>
          <p className="text-sm mt-1">
            Ce chatbot utilise la technologie RAG pour répondre en s'appuyant sur les archives Satellifacts.
            Les réponses sont sourcées et vérifiables.
          </p>
        </div>
      </div>
    </div>
  )
}
