# 🏟️ Stadium Companion — FIFA World Cup 2026

<p align="center">
  <img src="docs/readme-assets/football-banner.svg" alt="Stadium Companion — animated banner" width="100%">
</p>

<p>
  <img alt="Deploy status" src="https://img.shields.io/github/actions/workflow/status/code-paul-creator/stadiumgenie-ai/deploy.yml?branch=main&label=build%20%2B%20deploy&logo=githubactions">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue">
  <img alt="Size" src="https://img.shields.io/badge/size-%3C1MB-brightgreen">
  <img alt="No framework" src="https://img.shields.io/badge/stack-vanilla%20HTML%2FCSS%2FJS-orange">
  <img alt="Made for GitHub Pages" src="https://img.shields.io/badge/hosted%20on-GitHub%20Pages-181717?logo=github">
</p>

A GenAI-powered assistant for fans, organizers, volunteers, and venue staff — built to run entirely as a **free static site on GitHub Pages**, deployed by a **single GitHub Actions workflow**.

**[▶ Live demo](https://code-paul-creator.github.io/stadiumgenie-ai/)** — replace this link after your first deploy (see below).

> Fan-made demo project. Not affiliated with or endorsed by FIFA.

---

## Contents

- [What it does](#what-it-does)
- [Screenshots](#screenshots)
- [How it maps to the brief](#how-it-maps-to-the-brief)
- [Architecture](#architecture)
- [Quick start — deploy your own copy in 3 steps](#quick-start--deploy-your-own-copy-in-3-steps)
- [Add your API key](#add-your-api-key)
- [Run it locally](#run-it-locally)
- [Testing & code quality](#testing--code-quality)
- [Accessibility](#accessibility)
- [Security model](#security-model)
- [Project structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## What it does

<details open>
<summary><strong>🧭 Navigate</strong> — plain-language walking directions between any gate and any point of interest</summary>
<br>

Pick a starting gate and a destination in free text ("Section 112", "the nearest family restroom"). The AI turns the stadium's gate layout into a short, numbered walking guide. Works offline too — a clear static fallback shows even without an API key.
</details>

<details>
<summary><strong>👥 Crowd Watch</strong> — real-time-style congestion levels + AI situation summaries</summary>
<br>

Zones are ranked by occupancy percentage and color-coded (low → critical). One click asks the AI to turn the raw numbers into a short summary with concrete recommended actions ("open overflow Gate D", "add stewards to Concessions Row 1") for organizers and volunteers.
</details>

<details>
<summary><strong>♿ Accessibility</strong> — standard features list + a concierge for specific questions</summary>
<br>

Always-available static list of accessibility features (wheelchair seating, sensory-friendly rooms, interpretation on request, etc.) plus a free-text concierge for situation-specific questions.
</details>

<details>
<summary><strong>🚌 Transport</strong> — per-stadium transit options</summary>
<br>

Rail, metro, shuttle, bike valet, and rideshare zones specific to the selected venue.
</details>

<details>
<summary><strong>🌱 Sustainability</strong> — CO2e savings estimator + AI tips</summary>
<br>

Enter your distance and transport mode; get an instant, deterministic CO2e-saved estimate (no AI needed) plus optional AI-generated, city-specific sustainability tips.
</details>

<details>
<summary><strong>🌐 Multilingual assistance</strong> — 8 languages, with AI translation for free text</summary>
<br>

The whole interface ships in English, Spanish, French, Portuguese, Arabic (RTL), German, Japanese, and Hindi. Anything typed by a fan or volunteer can also be AI-translated on demand.
</details>

<details>
<summary><strong>💬 Ask Anything</strong> — general fan assistant chat</summary>
<br>

A conversational assistant for open-ended matchday questions, stadium-context-aware.
</details>

<details>
<summary><strong>📋 Ops Console</strong> — one-click shift digest for organizers/volunteers</summary>
<br>

Generates a shareable operational summary combining crowd data into a handoff-ready digest.
</details>

## Screenshots

<details open>
<summary><strong>🖼️ Click to expand / collapse the gallery</strong></summary>
<br>

| | |
|---|---|
| **Overview** — scoreboard header, gate-numbered nav | **Navigate** — gate-to-gate walking guide |
| ![Overview](docs/readme-assets/screenshots/01_overview.png) | ![Navigate](docs/readme-assets/screenshots/02_navigate.png) |
| **Crowd Watch** — ranked, color-coded occupancy | **Accessibility** — static features + concierge |
| ![Crowd Watch](docs/readme-assets/screenshots/03_crowd_watch.png) | ![Accessibility](docs/readme-assets/screenshots/04_accessibility.png) |
| **Transport** — per-stadium transit options | **Sustainability** — CO2e estimator |
| ![Transport](docs/readme-assets/screenshots/05_transport.png) | ![Sustainability](docs/readme-assets/screenshots/06_sustainability.png) |
| **Ask Anything** — general fan chat assistant | **Ops Console** — volunteer/organizer digest |
| ![Ask Anything](docs/readme-assets/screenshots/07_ask_anything.png) | ![Ops Console](docs/readme-assets/screenshots/08_ops_console.png) |
| **Settings** — bring your own API key | **العربية (RTL)** — full right-to-left layout |
| ![Settings](docs/readme-assets/screenshots/09_settings_dialog.png) | ![Arabic RTL](docs/readme-assets/screenshots/10_arabic_rtl.png) |

<p align="center"><img src="docs/readme-assets/screenshots/11_mobile_view.png" alt="Mobile view" width="280"></p>
<p align="center"><em>390px mobile viewport — header and gate nav collapse gracefully</em></p>

</details>

## How it maps to the brief

| Requirement | Where it lives |
|---|---|
| Navigation | `panel-navigate`, `js/navigation.js` |
| Crowd management | `panel-crowd`, `js/crowd.js` |
| Accessibility | `panel-access`, `js/accessibility.js` |
| Transportation | `panel-transport` |
| Sustainability | `panel-sustain`, `js/sustainability.js` |
| Multilingual assistance | `js/i18n.js` (8 languages + AI translation) |
| Operational intelligence | `panel-ops` |
| Real-time decision support | `panel-crowd` AI situation summaries |

## Architecture

```mermaid
flowchart LR
    subgraph Browser["Visitor's browser (GitHub Pages)"]
        UI[index.html + css/js]
        LS[(localStorage:\npersonal API key)]
    end
    subgraph CI["GitHub Actions"]
        Test[Lint + Unit Tests\n+ Accessibility Audit]
        Build[Build:\nstamp commit SHA,\noptional demo key]
        Deploy[Deploy to Pages]
    end
    Provider[(AI Provider API\nGemini / OpenAI-compatible)]

    Repo[(git push to main)] --> Test --> Build --> Deploy --> UI
    UI <-- reads/writes --> LS
    UI -- HTTPS request with key --> Provider
```

No server, no database, no backend proxy — the browser talks directly to the AI provider's official API. That's what makes free GitHub Pages hosting possible.

## Quick start — deploy your own copy in 3 steps

<details>
<summary><strong>⚠️ Coming from an Express-based scaffold? (has <code>server.js</code>, <code>public/</code>, <code>.env.example</code>) — read this first</strong></summary>
<br>

If your repo currently looks like this:

```
server.js
public/
.env.example
package.json
```

**this will never deploy on GitHub Pages**, no matter what secret you add — Pages only serves static files and cannot run a Node/Express process or read a `.env` file. That architecture needs a real server host (Render, Railway, Fly.io), not Pages.

To fix it, replace those files with this project's static files:

```bash
# from the root of your repo
git rm -r server.js public .env.example
git checkout <this-project's-files>   # or just copy them in via your file explorer
git add .
git commit -m "Switch to static, Pages-compatible architecture"
git push
```

Then continue with the 3 steps below — no server, no `.env`, just Pages + Actions.

</details>



1. **Fork or use this template**, then in your new repo go to **Settings → Pages** and set **Source: GitHub Actions**.
2. **Push to `main`** (or click **Actions → Test and Deploy to GitHub Pages → Run workflow**). The included workflow lints, tests, audits accessibility, then builds and deploys automatically.
3. **Open your site** at `https://YOUR-USERNAME.github.io/YOUR-REPO/`, click **⚙ Settings** in the app, and add your own AI API key (next section) — or just explore the static features without one.

That's it — no server to manage, no separate build tooling to install.

## Add your API key

The app calls the AI provider directly from your browser, so **each visitor supplies their own key**. This keeps the project free to run, keeps you in control of your own usage/spend, and means no secret ever needs to live in this repository for normal use.

### Recommended: personal key (2 minutes, no repo changes needed)

1. Get a free key:
   - **Google Gemini** (recommended, generous free tier): [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   - **OpenAI-compatible**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Open the deployed site → click **⚙ Settings** (top right).
3. Choose your provider, paste the key, click **Save**.

The key is written only to your browser's `localStorage` and sent only to the provider's official endpoint — see [Security model](#security-model). Nothing is written back to this repo or any server.

<details>
<summary><strong>Optional: shared demo key (advanced, for your own fork only)</strong></summary>
<br>

If you want *every* visitor of your deployed site to get AI answers without entering a key, you can inject one at build time via a GitHub Actions secret:

1. Get a **Gemini** API key, then in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) restrict it by **HTTP referrer** to `https://YOUR-USERNAME.github.io/*` and set a low daily quota.
2. In your repo, go to **Settings → Secrets and variables → Actions → New repository secret**.
3. Name it `GEMINI_API_KEY`, paste the restricted key, save.
4. Re-run the deploy workflow. `js/config.js` will have the key substituted in at build time.

⚠️ **This key will be visible** to anyone who views your deployed site's source or network requests — that is unavoidable for a static site. Only do this with a referrer-restricted key and a strict quota. This is why it's off by default.
</details>

## Run it locally

No build step or bundler is required — it's plain HTML/CSS/JS.

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
npm install        # dev dependencies only: eslint + jest
npm run serve       # serves the site at http://localhost:8080
```

Then open `http://localhost:8080` and add your API key in Settings as above.

## Testing & code quality

```bash
npm test        # Jest: 40+ unit tests covering utils, i18n, and data integrity
npm run lint     # ESLint: no-undef, eqeqeq, no-var, prefer-const
```

Every push and pull request runs, in order: **lint → unit tests → accessibility audit (pa11y, WCAG2AA) → build → deploy**. The deploy step only runs on `main` and only after everything else passes.

The included tests cover:
- Pure logic in `js/utils.js` (occupancy math, congestion classification, CO2e estimates, input sanitization)
- Data integrity for `data/stadiums.json` and `data/crowd-feed.json` (required fields, unique ids, valid ranges)
- Translation completeness — every language must define the same set of UI keys as English

## Accessibility

- Semantic landmarks, a skip-to-content link, and a proper `tablist`/`tabpanel` structure with arrow-key navigation
- Visible keyboard focus rings everywhere (`:focus-visible`)
- `aria-live` regions for AI responses and status announcements
- `prefers-reduced-motion` respected
- RTL layout support for Arabic
- Automated WCAG2AA audit (`pa11y`) on every CI run

## Security model

- **No secrets are committed.** `js/config.js` never contains a real key — only non-secret defaults and, optionally, a build-time substitution point for a referrer-restricted demo key.
- **Personal keys live only in the visitor's browser** (`localStorage`), never sent anywhere except the AI provider's own HTTPS endpoint.
- A `Content-Security-Policy` meta tag restricts network requests to the site's own origin plus the two supported AI provider endpoints.
- User-supplied text is length-clamped before being sent to the AI, and any AI/user text rendered as HTML is escaped (`js/utils.js#sanitizeForDisplay`).
- Dependencies are dev-only (`eslint`, `jest`) — the shipped site has **zero runtime dependencies**.

## Project structure

```
.
├── .github/workflows/deploy.yml   # lint → test → a11y audit → build → deploy
├── index.html                      # single-page app shell
├── css/styles.css
├── js/
│   ├── config.js                   # non-secret defaults (safe to commit)
│   ├── utils.js                    # pure logic (unit-tested)
│   ├── api.js                      # provider-agnostic GenAI wrapper
│   ├── i18n.js                     # 8-language UI strings + AI translation
│   ├── navigation.js
│   ├── crowd.js
│   ├── accessibility.js
│   ├── sustainability.js
│   └── app.js                      # DOM wiring / controller
├── data/                           # static demo data (stadiums, crowd feed)
├── assets/favicon.svg              # shipped to the live site
├── docs/readme-assets/             # README-only images (banner, screenshots)
│                                    # — NOT copied to the deployed site
├── tests/                          # Jest unit + data-integrity tests
├── eslint.config.js
└── package.json
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| "No API key configured yet" | Open ⚙ Settings and paste a key, or keep using the static features |
| Provider error / 4xx in the result box | Double check the key and provider match in Settings |
| Pages shows a 404 | Confirm **Settings → Pages → Source** is set to **GitHub Actions**, and that the workflow finished successfully under the **Actions** tab |
| Workflow fails on the accessibility audit step | Click into the failed step's log — `pa11y` prints the exact element and WCAG rule that failed |

## License

MIT — see [LICENSE](LICENSE).
