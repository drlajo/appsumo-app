# App Affiliate Ratings

This repository contains a simple demo website built with HTML, JavaScript and Tailwind CSS. It lets visitors upvote or downvote applications. Data can be replaced with real AppSumo listings.

Tailwind is now built locally using the CLI so you can customize the design.

## Usage

Run `npm install` once and then `npm run build` to generate `styles.css` from Tailwind.

Open `index.html` in a browser. Votes are saved in `localStorage` so they persist for that browser.

## Updating App Data

Run `python fetch_apps.py` to download the latest AppSumo deals and generate `apps.json`. The script first tries AppSumo's public API and falls back to scraping the website using BeautifulSoup if the API is unavailable.
