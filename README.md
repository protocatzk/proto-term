# ProtoTerm

**Vollständiges CLI** für Crypto- & Aktien-Portfolio — gebaut mit [Astro](https://astro.build).

Kein klassisches Dashboard: Du startest **Programme**, die Daten im Terminal-Stil ausgeben (Tabellen, Key/Value, ASCII-Allocation-Bars).

## Programme

| Command | Beschreibung |
| :------ | :----------- |
| `portfolio` | NAV, PnL, Holdings-Tabelle, Allocation-Bars |
| `portfolio ls` / `show BTC` | Positions-Liste / Einzelposition |
| `portfolio alloc` | Nur Allocation |
| `markets` | Snapshot + Top Movers |
| `crypto ls` / `crypto show btc` | Crypto-Liste / Detail |
| `stocks ls` / `stocks show aapl` | Aktien-Liste / Detail |
| `help` / `man portfolio` | Hilfe |
| `ls` | Verfügbare Programme |
| `clear` | Screen leeren (`Ctrl+L`) |
| `echo`, `whoami`, `date`, `uname` | System-Utils |

## Bedienung

- **Prompt** unten im Terminal (Focus: `/`)
- **Tabs** oben starten Programme (ohne Full-Reload, wenn möglich)
- **↑ / ↓** Command-History
- Shareable URLs: `/`, `/markets`, `/crypto`, `/crypto/btc`, …

## Architecture

```text
src/
├── cli/
│   ├── shell.ts           # Parser + Registry + bootSession
│   ├── table.ts           # ASCII tables / bars
│   ├── types.ts
│   └── programs/          # portfolio, markets, crypto, stocks, system
├── components/
│   └── Terminal.astro     # Scrollback + Prompt (SSR boot + client shell)
├── data/                  # Mock prices & holdings
└── pages/                 # Routes boot with initialCommand
```

Neue Programme: Meta in `src/cli/programs/`, in `shell.ts` registrieren.

## Commands

| Command        | Action                        |
| :------------- | :---------------------------- |
| `yarn install` | Dependencies                  |
| `yarn dev`     | Dev server (`localhost:4321`) |
| `yarn build`   | Static build → `./dist/`      |
| `yarn preview` | Preview production build      |

## Next steps

1. Chart-Programm (`chart btc`) mit SVG-Island im Output
2. CSV/Broker-Import als `portfolio import`
3. Build-time price refresh
4. Pipelines / flags (`crypto ls --sort 24h`)
