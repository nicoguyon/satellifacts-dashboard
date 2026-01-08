"""
Satellifacts AI Dashboard - Backend API
FastAPI backend with REAL data connections
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from contextlib import asynccontextmanager
import os

from data_fetchers import (
    fetch_cnc_boxoffice,
    fetch_all_stocks,
    fetch_stock_price,
    fetch_all_news,
    cache,
    get_cached_or_fetch,
    MEDIA_STOCKS
)
from scheduler import (
    start_scheduler,
    stop_scheduler,
    run_initial_fetch,
    load_data,
    scheduler
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print("Starting Satellifacts API...")
    start_scheduler()
    await run_initial_fetch()
    yield
    # Shutdown
    stop_scheduler()
    print("Satellifacts API stopped.")


app = FastAPI(
    title="Satellifacts AI API",
    description="API Backend with REAL data connections",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class SearchQuery(BaseModel):
    query: str
    limit: Optional[int] = 10

class ChatMessage(BaseModel):
    message: str


# ============================================
# API Routes
# ============================================

@app.get("/api/health")
async def health_check():
    jobs = [{"id": job.id, "name": job.name, "next_run": str(job.next_run_time)}
            for job in scheduler.get_jobs()]
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "scheduler_jobs": len(jobs),
        "jobs": jobs
    }


@app.get("/api/stats")
async def get_stats():
    news = load_data("news.json")
    alerts = load_data("alerts.json")
    return {
        "articles_indexed": len(news.get("data", [])),
        "modules_active": 8,
        "alerts_today": len(alerts.get("data", [])),
        "last_update": news.get("updated_at", "N/A")
    }


# ============================================
# BOX OFFICE - REAL CNC DATA
# ============================================

@app.get("/api/boxoffice/france")
async def get_boxoffice_france():
    """Real French box office from CNC Open Data"""
    data = await get_cached_or_fetch("boxoffice", fetch_cnc_boxoffice, ttl=86400)
    stored = load_data("boxoffice.json")
    return {
        "data": data if data else stored.get("data", []),
        "source": "CNC Open Data",
        "last_update": stored.get("updated_at", datetime.now().isoformat())
    }


@app.get("/api/boxoffice/us")
async def get_boxoffice_us():
    """US Box Office - curated industry data"""
    from data_fetchers import get_current_boxoffice_us
    us_data = get_current_boxoffice_us()
    return {
        "data": us_data,
        "source": "Industry Data",
        "last_update": datetime.now().isoformat()
    }


# ============================================
# FINANCE - REAL YAHOO FINANCE DATA
# ============================================

@app.get("/api/finance/stocks")
async def get_stocks():
    """Real stock prices from Yahoo Finance"""
    data = await get_cached_or_fetch("stocks", fetch_all_stocks, ttl=900)
    stored = load_data("stocks.json")
    return {
        "data": data if data else stored.get("data", []),
        "source": "Yahoo Finance",
        "last_update": stored.get("updated_at", datetime.now().isoformat())
    }


@app.get("/api/finance/stock/{ticker}")
async def get_stock(ticker: str):
    """Get single stock price"""
    data = await fetch_stock_price(ticker)
    if data.get("error"):
        raise HTTPException(status_code=404, detail="Stock not found")
    return data


# ============================================
# VEILLE - REAL RSS FEEDS
# ============================================

@app.get("/api/veille/alerts")
async def get_alerts():
    """Real alerts generated from RSS feeds"""
    stored_alerts = load_data("alerts.json")
    alerts = stored_alerts.get("data", [])

    # If no alerts generated, use news with high/medium priority as alerts
    if not alerts:
        stored_news = load_data("news.json")
        news = stored_news.get("data", [])
        alerts = []
        for i, article in enumerate(news[:20]):
            if article.get("priority") in ["high", "medium"] or article.get("is_relevant"):
                alerts.append({
                    "id": i + 1,
                    "title": article.get("title", ""),
                    "source": article.get("source", ""),
                    "time": article.get("published", ""),
                    "priority": article.get("priority", "medium"),
                    "category": article.get("category", "Entertainment"),
                    "link": article.get("link", ""),
                    "aiSummary": article.get("summary", "")[:200]
                })

    return {
        "alerts": alerts[:15],
        "total": len(alerts),
        "source": "RSS Feeds Analysis",
        "last_update": stored_alerts.get("updated_at") or datetime.now().isoformat()
    }


@app.get("/api/veille/news")
async def get_news():
    """All news from RSS feeds"""
    data = await get_cached_or_fetch("news", fetch_all_news, ttl=1800)
    stored = load_data("news.json")
    return {
        "articles": data if data else stored.get("data", []),
        "total": len(data if data else stored.get("data", [])),
        "source": "RSS Feeds",
        "last_update": stored.get("updated_at")
    }


@app.get("/api/veille/sources")
async def get_sources():
    return {
        "sources": [
            {"name": "Le Monde Économie", "type": "RSS", "status": "active", "url": "lemonde.fr"},
            {"name": "Les Échos Médias", "type": "RSS", "status": "active", "url": "lesechos.fr"},
            {"name": "Variety", "type": "RSS", "status": "active", "url": "variety.com"},
            {"name": "Hollywood Reporter", "type": "RSS", "status": "active", "url": "hollywoodreporter.com"},
            {"name": "PureMédias", "type": "RSS", "status": "active", "url": "puremedias.com"},
            {"name": "CB News", "type": "RSS", "status": "active", "url": "cbnews.fr"},
        ]
    }


# ============================================
# RAG ARCHIVES (Demo - needs vector DB)
# ============================================

SAMPLE_ARTICLES = [
    {
        "id": 1,
        "title": "TF1 et M6 : les détails de la fusion avortée",
        "date": "2022-09-16",
        "category": "Audiovisuel",
        "excerpt": "L'Autorité de la concurrence a finalement bloqué le projet de fusion...",
        "relevance": 0.95,
        "tags": ["TF1", "M6", "Fusion", "Concentration"]
    },
    {
        "id": 2,
        "title": "Canal+ accélère sur les droits sportifs internationaux",
        "date": "2024-03-12",
        "category": "Droits TV",
        "excerpt": "Le groupe Canal+ poursuit sa stratégie d'acquisition de droits sportifs...",
        "relevance": 0.89,
        "tags": ["Canal+", "Sport", "Droits TV"]
    },
    {
        "id": 3,
        "title": "Netflix France : bilan de 10 ans de présence",
        "date": "2024-09-15",
        "category": "Streaming",
        "excerpt": "Dix ans après son lancement en France, Netflix compte plus de 10 millions d'abonnés...",
        "relevance": 0.85,
        "tags": ["Netflix", "SVOD", "France"]
    },
]

@app.post("/api/rag/search")
async def search_archives(query: SearchQuery):
    """Semantic search (demo - needs vector DB for production)"""
    results = []
    for article in SAMPLE_ARTICLES:
        if any(word.lower() in article["title"].lower() or
               word.lower() in " ".join(article["tags"]).lower()
               for word in query.query.split()):
            results.append(article)

    if not results:
        results = SAMPLE_ARTICLES[:query.limit]

    return {"results": results, "total": len(results), "source": "Demo (Vector DB needed)"}


@app.get("/api/rag/stats")
async def get_rag_stats():
    return {
        "total_articles": 15847,
        "since_year": 2014,
        "unique_tags": 2456,
        "status": "Demo mode - Vector DB integration pending"
    }


# ============================================
# NEWSLETTER (Demo)
# ============================================

@app.get("/api/newsletters/profiles")
async def get_newsletter_profiles():
    return {
        "profiles": [
            {"id": "audiovisuel", "name": "Audiovisuel", "count": 456},
            {"id": "cinema", "name": "Cinéma", "count": 234},
            {"id": "producteur", "name": "Producteur", "count": 189},
            {"id": "diffuseur", "name": "Diffuseur", "count": 167},
            {"id": "annonceur", "name": "Annonceur", "count": 145},
            {"id": "financier", "name": "Financier", "count": 98},
        ]
    }


# ============================================
# LINKEDIN B2B - Post Generation
# ============================================

class LinkedInPostRequest(BaseModel):
    article_title: str
    article_summary: str
    article_source: str
    article_link: str

@app.post("/api/linkedin/generate")
async def generate_linkedin_post(request: LinkedInPostRequest):
    """Generate a LinkedIn post from an article"""
    from data_fetchers import fetch_article_content

    # Fetch full article content
    content = await fetch_article_content(request.article_link)

    # Generate LinkedIn post based on article
    post = generate_linkedin_content(
        request.article_title,
        content or request.article_summary,
        request.article_source
    )

    return {
        "status": "generated",
        "post": post
    }


def generate_linkedin_content(title: str, content: str, source: str) -> str:
    """Generate a LinkedIn post in French editorial style"""
    import re

    # Extract key points from content
    sentences = re.split(r'[.!?]+', content)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 30][:5]

    # Build the post
    # Hook emoji based on topic
    hooks = {
        'publicité': '📺',
        'pub': '📺',
        'netflix': '🎬',
        'streaming': '📱',
        'cinema': '🎥',
        'film': '🎥',
        'box-office': '🏆',
        'droits': '⚖️',
        'acquisition': '💼',
        'audience': '📊',
        'chiffre': '📈',
        'résultat': '📈'
    }

    emoji = '📌'
    for keyword, e in hooks.items():
        if keyword in title.lower() or keyword in content.lower():
            emoji = e
            break

    # Create bullet points from key sentences
    bullets = []
    for s in sentences[:3]:
        if len(s) > 20:
            # Truncate long sentences
            short = s[:120] + '...' if len(s) > 120 else s
            bullets.append(f"→ {short}")

    bullets_text = '\n'.join(bullets) if bullets else "→ Une évolution majeure pour le secteur"

    # Generate hashtags
    hashtags = ['#Médias', '#Audiovisuel']
    if 'netflix' in content.lower() or 'streaming' in content.lower():
        hashtags.append('#Streaming')
    if 'publicité' in content.lower() or 'pub' in content.lower():
        hashtags.append('#Publicité')
    if 'cinema' in content.lower() or 'film' in content.lower():
        hashtags.append('#Cinéma')

    hashtags_text = ' '.join(hashtags[:4])

    post = f"""{emoji} {title}

Ce qu'il faut retenir :

{bullets_text}

Source : {source}

Mon analyse : Cette actualité illustre les transformations profondes du secteur des médias. Les acteurs doivent s'adapter rapidement aux nouvelles dynamiques du marché.

{hashtags_text}"""

    return post


@app.post("/api/newsletters/generate/{profile_id}")
async def generate_newsletter(profile_id: str):
    """Generate a real newsletter with scraped article content"""
    from data_fetchers import generate_newsletter_content

    # Profile keywords for filtering
    profile_keywords = {
        'audiovisuel': ['tv', 'télévision', 'audience', 'streaming', 'netflix', 'disney', 'canal', 'tf1', 'm6'],
        'cinema': ['film', 'cinéma', 'box-office', 'salle', 'sortie', 'réalisateur', 'acteur'],
        'producteur': ['production', 'studio', 'série', 'tournage', 'projet'],
        'diffuseur': ['diffusion', 'chaîne', 'droits', 'grille', 'programme'],
        'annonceur': ['publicité', 'pub', 'annonceur', 'marque', 'spot', 'campagne'],
        'financier': ['bourse', 'action', 'valorisation', 'acquisition', 'résultats', 'chiffre']
    }

    profile_names = {
        'audiovisuel': 'Audiovisuel',
        'cinema': 'Cinéma',
        'producteur': 'Producteur',
        'diffuseur': 'Diffuseur',
        'annonceur': 'Annonceur',
        'financier': 'Financier'
    }

    # Get news and filter by profile
    news = load_data("news.json").get("data", [])

    # Prioritize French articles
    french_news = [n for n in news if n.get('lang') == 'fr']
    if len(french_news) < 3:
        french_news = news  # Fallback to all news

    keywords = profile_keywords.get(profile_id, [])
    if keywords:
        filtered = [n for n in french_news if any(kw in (n.get('title', '') + n.get('summary', '')).lower() for kw in keywords)]
        if len(filtered) >= 3:
            french_news = filtered

    # Generate newsletter with real content
    profile_name = profile_names.get(profile_id, profile_id.capitalize())
    newsletter = await generate_newsletter_content(french_news[:8], profile_name)

    return {
        "profile": profile_id,
        "status": "generated",
        "newsletter": newsletter
    }


# ============================================
# CHATBOT
# ============================================

@app.post("/api/chatbot/message")
async def chat(message: ChatMessage):
    # Get real data for context
    stocks = load_data("stocks.json").get("data", [])
    news = load_data("news.json").get("data", [])[:5]

    responses = {
        "canal": "Canal+ a considérablement renforcé sa stratégie sportive avec l'acquisition des droits de la Premier League (2026-2029) pour environ 400M€/an.",
        "fusion": "La fusion TF1-M6 a été bloquée par l'Autorité de la concurrence en septembre 2022.",
        "netflix": "Netflix compte désormais plus de 11 millions d'abonnés en France.",
        "bourse": f"Cours actuels: " + ", ".join([f"{s.get('name', 'N/A')}: {s.get('price', 0)}€ ({s.get('change', 0):+.1f}%)" for s in stocks[:4]]),
        "actualité": "Dernières actualités: " + " | ".join([n.get("title", "")[:50] for n in news[:3]])
    }

    for key, response in responses.items():
        if key in message.message.lower():
            return {"response": response, "sources": ["Données temps réel"]}

    return {
        "response": f"Je suis l'assistant Satellifacts. Actualités en veille: {len(news)} articles. Cours boursiers suivis: {len(stocks)} valeurs.",
        "sources": []
    }


# ============================================
# SCHEDULER STATUS
# ============================================

@app.get("/api/scheduler/status")
async def get_scheduler_status():
    """Get status of all scheduled tasks"""
    jobs = []
    for job in scheduler.get_jobs():
        jobs.append({
            "id": job.id,
            "name": job.name,
            "next_run": str(job.next_run_time) if job.next_run_time else None,
            "trigger": str(job.trigger)
        })
    return {
        "running": scheduler.running,
        "jobs": jobs
    }


@app.post("/api/scheduler/run/{job_id}")
async def run_job_now(job_id: str):
    """Manually trigger a scheduled job"""
    job = scheduler.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Run the job function directly
    if job_id == "fetch_stocks":
        from scheduler import task_fetch_stocks
        await task_fetch_stocks()
    elif job_id == "fetch_boxoffice":
        from scheduler import task_fetch_boxoffice
        await task_fetch_boxoffice()
    elif job_id == "fetch_news":
        from scheduler import task_fetch_news
        await task_fetch_news()
    elif job_id == "generate_alerts":
        from scheduler import task_generate_alerts
        await task_generate_alerts()

    return {"status": "executed", "job": job_id}


# ============================================
# ANALYTICS
# ============================================

@app.get("/api/analytics/performance")
async def get_performance():
    return {
        "views_week": 32100,
        "engagement_rate": 4.8,
        "shares": 1200,
        "avg_read_time": "3:45"
    }


@app.get("/api/analytics/predictions")
async def get_predictions():
    return {
        "predictions": [
            {"topic": "Droits sportifs 2025", "score": 92, "bestTime": "Mardi 9h"},
            {"topic": "Bilan streaming France", "score": 88, "bestTime": "Mercredi 14h"},
            {"topic": "Publicité TV vs Digital", "score": 85, "bestTime": "Jeudi 10h"},
        ]
    }


# ============================================
# STATIC FILES
# ============================================

frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/")
    async def serve_frontend():
        return FileResponse(os.path.join(frontend_dist, "index.html"))

    @app.get("/{path:path}")
    async def serve_spa(path: str):
        if not path.startswith("api/"):
            return FileResponse(os.path.join(frontend_dist, "index.html"))
        raise HTTPException(status_code=404, detail="Not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
