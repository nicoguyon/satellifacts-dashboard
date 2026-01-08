"""
Scheduled Tasks for Satellifacts Dashboard
Runs periodic data fetching using APScheduler
"""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
import json
import os

from data_fetchers import (
    fetch_cnc_boxoffice,
    fetch_all_stocks,
    fetch_all_news,
    cache
)

# Data storage path
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)


def save_data(filename: str, data: dict):
    """Save data to JSON file"""
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump({
            "data": data,
            "updated_at": datetime.now().isoformat()
        }, f, ensure_ascii=False, indent=2)
    print(f"[{datetime.now()}] Saved {filename}")


def load_data(filename: str) -> dict:
    """Load data from JSON file"""
    filepath = os.path.join(DATA_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"data": [], "updated_at": None}


# ============================================
# SCHEDULED TASKS
# ============================================

async def task_fetch_stocks():
    """Fetch stock prices every 15 minutes during market hours"""
    print(f"[{datetime.now()}] Running: Stock prices update")
    try:
        data = await fetch_all_stocks()
        save_data("stocks.json", data)
        cache.set("stocks", data, ttl_seconds=900)  # 15 min cache
        print(f"[{datetime.now()}] Updated {len(data)} stock prices")
    except Exception as e:
        print(f"[{datetime.now()}] Stock update failed: {e}")


async def task_fetch_boxoffice():
    """Fetch box office data daily at 10:00"""
    print(f"[{datetime.now()}] Running: Box office update")
    try:
        data = await fetch_cnc_boxoffice()
        save_data("boxoffice.json", data)
        cache.set("boxoffice", data, ttl_seconds=86400)  # 24h cache
        print(f"[{datetime.now()}] Updated {len(data)} box office entries")
    except Exception as e:
        print(f"[{datetime.now()}] Box office update failed: {e}")


async def task_fetch_news():
    """Fetch news every 30 minutes"""
    print(f"[{datetime.now()}] Running: News monitoring update")
    try:
        data = await fetch_all_news()
        save_data("news.json", data)
        cache.set("news", data, ttl_seconds=1800)  # 30 min cache
        print(f"[{datetime.now()}] Updated {len(data)} news articles")
    except Exception as e:
        print(f"[{datetime.now()}] News update failed: {e}")


async def task_generate_alerts():
    """Generate alerts from news based on priority keywords"""
    print(f"[{datetime.now()}] Running: Alert generation")
    try:
        news_data = load_data("news.json")
        articles = news_data.get("data", [])

        HIGH_PRIORITY_KEYWORDS = ["fusion", "acquisition", "droits", "exclusif", "record", "crise"]
        MEDIUM_PRIORITY_KEYWORDS = ["audience", "streaming", "lancement", "partenariat"]

        alerts = []
        for article in articles[:20]:
            title_lower = article.get("title", "").lower()

            priority = "low"
            if any(kw in title_lower for kw in HIGH_PRIORITY_KEYWORDS):
                priority = "high"
            elif any(kw in title_lower for kw in MEDIUM_PRIORITY_KEYWORDS):
                priority = "medium"

            if priority in ["high", "medium"]:
                alerts.append({
                    "id": len(alerts) + 1,
                    "title": article.get("title", ""),
                    "source": article.get("source", ""),
                    "time": article.get("published", ""),
                    "priority": priority,
                    "category": article.get("category", ""),
                    "link": article.get("link", ""),
                    "aiSummary": article.get("summary", "")[:200]
                })

        save_data("alerts.json", alerts)
        cache.set("alerts", alerts, ttl_seconds=1800)
        print(f"[{datetime.now()}] Generated {len(alerts)} alerts")
    except Exception as e:
        print(f"[{datetime.now()}] Alert generation failed: {e}")


# ============================================
# SCHEDULER SETUP
# ============================================

scheduler = AsyncIOScheduler()


def setup_scheduler():
    """Configure all scheduled tasks"""

    # Stock prices: every 15 minutes during market hours (9h-18h, Mon-Fri)
    scheduler.add_job(
        task_fetch_stocks,
        CronTrigger(day_of_week="mon-fri", hour="9-18", minute="*/15"),
        id="fetch_stocks",
        name="Fetch Stock Prices",
        replace_existing=True
    )

    # Also fetch stocks every hour outside market hours for international markets
    scheduler.add_job(
        task_fetch_stocks,
        IntervalTrigger(hours=1),
        id="fetch_stocks_hourly",
        name="Fetch Stock Prices (Hourly)",
        replace_existing=True
    )

    # Box office: daily at 10:00
    scheduler.add_job(
        task_fetch_boxoffice,
        CronTrigger(hour=10, minute=0),
        id="fetch_boxoffice",
        name="Fetch Box Office",
        replace_existing=True
    )

    # News monitoring: every 30 minutes
    scheduler.add_job(
        task_fetch_news,
        IntervalTrigger(minutes=30),
        id="fetch_news",
        name="Fetch News",
        replace_existing=True
    )

    # Alert generation: every 30 minutes (after news fetch)
    scheduler.add_job(
        task_generate_alerts,
        IntervalTrigger(minutes=30),
        id="generate_alerts",
        name="Generate Alerts",
        replace_existing=True
    )

    print("Scheduler configured with the following jobs:")
    for job in scheduler.get_jobs():
        print(f"  - {job.name}: {job.trigger}")


async def run_initial_fetch():
    """Run all fetches immediately on startup"""
    print(f"[{datetime.now()}] Running initial data fetch...")
    await task_fetch_stocks()
    await task_fetch_boxoffice()
    await task_fetch_news()
    await task_generate_alerts()
    print(f"[{datetime.now()}] Initial fetch complete!")


def start_scheduler():
    """Start the scheduler"""
    setup_scheduler()
    scheduler.start()
    print(f"[{datetime.now()}] Scheduler started!")


def stop_scheduler():
    """Stop the scheduler"""
    scheduler.shutdown()
    print(f"[{datetime.now()}] Scheduler stopped!")
