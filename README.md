# ProtoTerm

**CLI-style Portfolio App** für Crypto & Aktien — gebaut mit [Astro](https://astro.build) als möglichst statische Site.

Terminal-UI mit echten grafischen Charts (SVG-Donuts für Asset Allocation), Tabs oben als Fallback für Markt-Views, und einer Command-Bar unten.

## Features

- **Portfolio Dashboard** (`/`) — NAV, PnL, Holdings-Tabelle, Allocation by class/symbol
- **Markets** (`/markets`) — Snapshot, Top Movers
- **Crypto / Stocks** — Listen + Detailseiten (Fallback-Tabs)
- **Command bar** — `help`, `portfolio`, `crypto btc`, `stocks aapl`, `goto /…`
- **Static SVG pie charts** — kein Chart-Framework nötig
- Mock-Daten unter `src/data/`

## Stack

- Astro 7 (SSG / zero-JS by default)
- Monospace CLI theme (JetBrains Mono)
- Vanilla JS nur für Suche + Command bar
- Optional später: Svelte/React Islands für interaktive Charts

## Structure

```text
src/
├── components/   Terminal chrome, charts, tables, command bar
├── data/         Portfolio, crypto, stocks, pie geometry, formatters
├── layouts/      BaseLayout (term shell)
├── pages/        portfolio, markets, crypto, stocks
└── styles/       global.css (CLI theme)
```

## Commands

| Command        | Action                         |
| :------------- | :----------------------------- |
| `yarn install` | Dependencies                   |
| `yarn dev`     | Dev server (`localhost:4321`)  |
| `yarn build`   | Static build → `./dist/`       |
| `yarn preview` | Preview production build       |

```sh
# background dev (project convention)
astro dev --background
```

## In-app CLI

Focus with `/`, then e.g.:

```text
help
portfolio
markets
crypto btc
stocks aapl
goto /markets
ls
```

## Next steps

1. Broker/CSV import → Holdings füllen
2. Build-time price refresh (CoinGecko, etc.)
3. Performance-Chart Island (Sparkline / equity curve)
4. Watchlist + `localStorage` Island
5. Multi-portfolio / accounts
