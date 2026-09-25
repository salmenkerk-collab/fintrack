# fintrack

Sven Finance, a personal household finance dashboard built as a PWA. Single `index.html`, no build step (React 18 + Babel standalone + Recharts from cdnjs).

## Features

- **Lenses** Me / Charlotte / Ours on every tab
- **Dashboard** bento instrument panel with FI, Coast FI and milestone ladder
- **Net Worth** assets and liabilities, GBP with live FX, crypto prices, per-asset "Counts toward FI" toggle
- **FIRE** FI number (spend × 1/SWR), Box 3 aware projection, Coast FI, AOW and pension bridge model
- **Budget** ING CSV import, learned categorisation rules, fixed costs, monthly compare
- **Portfolio** DEGIRO import, growth chart, Time Machine
- **Goals, Property, History** snapshots and trends
- **Cloud sync** optional Firebase sync, otherwise JSON backup / restore

## How FI progress is counted

Only assets that count toward FI feed the FIRE tab and the dashboard. Property never counts. Savings pots (emergency, travel, tyres) are excluded by default because they are earmarked money; tick "Counts toward FI" on a savings asset to include it. Stocks and crypto count unless unticked.

Coast FI is the pot that, with no new contributions, grows after Box 3 drag into the inflation adjusted FI number at target age.

## Privacy

All data stays in your browser (localStorage key `sven_finance_v1`) unless you enable cloud sync. The code on GitHub contains no financial data.

## Offline

`sw.js` precaches the app, icons and the pinned CDN libraries, so the app opens without a connection after the first visit. Sync, prices and FX need a connection.

## Deploy

1. Upload `index.html`, `sw.js`, `manifest.json`, `icon-192.png`, `icon-512.png`
2. Bump `CACHE_VERSION` in `sw.js` on every deploy, otherwise phones keep the old version
