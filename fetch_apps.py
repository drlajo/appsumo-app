import json
import sys
from datetime import datetime

import requests
from bs4 import BeautifulSoup

API_URL = "https://api-public.appsumo.com/api/v2/products"
HEADERS = {"User-Agent": "Mozilla/5.0"}


def fetch_from_api():
    try:
        resp = requests.get(API_URL, timeout=10)
        if resp.ok:
            data = resp.json()
            items = data.get("products") or data.get("items") or []
            deals = []
            for item in items:
                deals.append({
                    "name": item.get("name"),
                    "description": item.get("pitch", ""),
                    "url": item.get("url"),
                    "image": item.get("cover_image")
                })
            return deals
    except Exception as e:
        print(f"API fetch failed: {e}", file=sys.stderr)
    return None


def scrape_site():
    url = "https://appsumo.com"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.ok:
            soup = BeautifulSoup(resp.text, "html.parser")
            deals = []
            for card in soup.select("[data-test='product-card']"):
                name_el = card.select_one("[data-test='product-name']")
                desc_el = card.select_one("[data-test='product-tagline']")
                link_el = card.select_one("a")
                deals.append({
                    "name": name_el.get_text(strip=True) if name_el else "",
                    "description": desc_el.get_text(strip=True) if desc_el else "",
                    "url": f"https://appsumo.com{link_el['href']}" if link_el else ""
                })
            return deals
    except Exception as e:
        print(f"Scrape failed: {e}", file=sys.stderr)
    return []


def main():
    deals = fetch_from_api()
    if deals is None:
        deals = scrape_site()
    output = {
        "generated": datetime.utcnow().isoformat() + "Z",
        "apps": deals,
    }
    with open("apps.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
