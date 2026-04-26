# fintrack

Personal household finance dashboard — built as a PWA.

## Features

- **3 account views** — Sven (personal), Partner (personal), Joint (shared 50/50)
- **Household overview** — combined income, expenses, savings rate
- **Wealth tracker** — cash + property equity + investment portfolio = net worth
- **Goals** — big expenses, investment targets, savings milestones
- **FIRE calculator** — FI number, projection chart, milestone ages
- **ING NL CSV parser** — exact column format (Datum, Naam/Omschrijving, Af Bij, Bedrag, Mededelingen)
- **Phone sync** — export JSON snapshot on desktop, load on phone (read-only)
- **Budget limits** — set monthly caps per category with warnings
- **Transfers tagged** — joint account transfers never counted as personal expenses

## Privacy

All data stays in your browser (localStorage). No data is ever sent anywhere. The code on GitHub contains zero financial data.

## Usage

1. Host on GitHub Pages (or any static host with HTTPS)
2. Open on desktop → Upload & Manage → upload 3 ING CSVs monthly
3. Export snapshot → load on phone for read-only view

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/fintrack.git
git push -u origin main
```

Then enable GitHub Pages in repo Settings → Pages → branch: main.

## ING CSV Format

Export from ING app: Mijn ING → Betaalrekening → Exporteer → CSV

Expected columns:
- `Datum` — YYYYMMDD
- `Naam / Omschrijving` — merchant name
- `Af Bij` — `Af` (debit) or `Bij` (credit)
- `Bedrag (EUR)` — positive amount
- `Mededelingen` — transaction notes
