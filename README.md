# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![GTA VI trophies](https://img.shields.io/badge/trophies-55-blue)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Offline](https://img.shields.io/badge/offline-yes-green)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline web app that guides and tracks all **55 PlayStation 5 trophies** of **Grand Theft Auto VI** (1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden). Entry for the [make.fun bounty "Build the best GTA 6 trophy guide"](https://make.fun/bounty/gta6-trophy-guide-01).

## What it does

- **Tracker** — every trophy with its official name, description and grade; tick it off and progress is saved in the browser (localStorage), with **export / import** of progress as JSON.
- **Filters** — by kind (story, missable, collectibles, activities, online), by grade, by earned/remaining, plus full-text search.
- **Spoiler-safe mode** — hides the names, descriptions and guides of story trophies until you earn them (on by default).
- **Roadmap to the Platinum** — five stages in order: story, stranger strands, activities & skill, collectibles & exploration, cleanup & 100%.
- **One missable trophy, flagged** — Positive Mental Attitude (meditate at all 18 spots); the Chapter 1 balcony spot is reported to disappear after Chapter 1, and the game is reported to have no mission replay, so the guide tells you to keep a manual save at the start of every chapter.
- **A cited guide for every trophy** — each guide is written in our own words and names its source beside it. Claims that could not be verified from two independent sources are tagged `[unverified]`.
- **Fully offline** — static files under `app/`, no network requests at run time.

## Sources

Names, descriptions and grades: Exophase + PSNProfiles (they agree on all 55), and GamesRadar+ / Press Start / PC Gamer (18 Nov 2026). Setting and characters: Rockstar Games Trailer 2 (6 May 2025). Missable / no-replay / cheats rules: GTABase + PowerPyx. Platinum estimate (~200 hours, unverified): Output Lag + GTAScoop. See the Sources section inside the app for the full list.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no dependencies. Any static file server works with `app/` at its root.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored `vendor/makefun-frontend.ts`.

## License

MIT — see [LICENSE](LICENSE). Unofficial fan guide, not affiliated with Rockstar Games, Sony or PlayStation. No Rockstar logo or artwork is used.
