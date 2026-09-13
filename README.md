# जानो अपने अधिकार (Know Your Rights)

**A private civic awareness portal** for rural citizens in Uttar Pradesh — focused on Gram Panchayat **29-बड़ागांव**, विकास खण्ड **19-बेंहदर**, जिला **113-हरदोई** (Sandila / Beniganj region).

Live site: [https://abinavshukl.github.io/jaano-apne-adhikar/](https://abinavshukl.github.io/jaano-apne-adhikar/)

> **Legal notice:** This is an independent, non-governmental educational initiative. It is not an official government website, does not give legal advice, and does not represent any department. Always verify schemes, helplines, and procedures with official sources.

---

## What exists today (as of 13 September 2026)

The site is a **fully static** vanilla HTML5 / CSS3 / ES6+ app, hosted on **GitHub Pages**. There is no backend, database, or server-side form handling.

| Area | Status |
|---|---|
| Four public pages (Home, Rights, Schemes, Directory) | Done |
| Hindi-first UI, Mukta font, Lucide icons | Done |
| First-visit legal disclaimer modal + banner on every page | Done |
| Jansunwai **local** complaint pre-drafter (copy, never submit) | Done |
| Voice input (Web Speech API, `hi-IN`) and optional Hinglish→Hindi | Done |
| Ward → booth lookup from static JSON | Done |
| Voter **name/EPIC search** | Redirects to official ECI portal (no local voter roll) |
| Hindi news ticker with civic-fact fallback | Done |
| Scheme cards from `data/schemes.json` | 6 schemes published |
| Directory from `data/directory.json` | Admin / police / health / utilities |
| Print styles for directory, rights, booth slip | Done |
| `robots.txt` + `sitemap.xml` | Done |
| GitHub Actions Pages deploy on `main` | Done |
| Analytics, cookies, tracking | Intentionally **not** added |
| Website-wide legal/privacy audit | Completed for the current build |

### Verified project status

As of this revision, the site is a working static public-interest portal for civic awareness in the Hardoi / Behandar / Badagaon area. It includes:

- a Hindi-first landing page with legal disclaimer and civic notice ticker,
- a rights and legal education section with plain-language explanations,
- scheme cards for major public welfare schemes,
- a public directory for emergency and local public-service contacts,
- a booth finder tied to static ward-to-booth data,
- a local-only grievance draft tool that never uploads complaint text,
- and a static deploy pipeline on GitHub Pages.

### Legal and privacy posture

The project intentionally maintains a non-government, non-official, educational framing. The current build states clearly that it is:

- a private initiative,
- not an official government website,
- not legal advice,
- not a backend complaint filing service,
- and not a tracker / analytics / cookie-based site.

The current state is consistent with the project’s public-interest model: general information only, verified against official portals where possible, and presented with explicit caution before action is taken.

---

## Pages

### `index.html` — Home

- Hero, legal disclaimer overlay (sessionStorage), header disclaimer strip
- Live/civic **notice ticker**
- Featured rights (RTI, FIR/BNSS, women’s rights) linking into `rights.html`
- **Elections:** NVSP redirect for voter search + **booth finder** (wards 1–15)
- Service pillars (electricity, water, youth library, seniors)
- Quick links to the other three pages
- **Jansunwai Pre-Drafter:** name, guardian, phone, optional EPIC/reference, department, jurisdiction (GP/block/tehsil/district), description → formatted Hindi draft → copy. Nothing is posted to a server.

### `rights.html` — Legal rights (Hindi, educational)

- Emergency portals: UP Police e-FIR, CM Jansunwai, 1090, 1064
- Constitutional rights (Articles 14–18, 19–22, 21, 23–24, 32/226) with simple examples
- Police / FIR / arrest (BNSS 173(4), 175(3), Zero FIR, MLC guidance)
- Women’s rights, RTI letter template (copy/print)
- Land/revenue, NFSA ration, Janhit Guarantee, education, MNREGA, Panchayati Raj

### `schemes.html` — Government schemes

Filterable cards loaded from JSON (see data inventory below). Each card has eligibility bullets, steps, and an official portal link.

### `directory.html` — Contacts

Hardcoded emergency strip (112, 1076, 1090, 1930, 1064, 1031) plus department cards from JSON (`tel:`, optional WhatsApp only when a real number exists). Print support.

---

## Data inventory (what is in the repo)

These are the **only** published datasets. Voter-roll files are gitignored (`data/voters*.json`, `data/badagaon_voters*.json`) and are **not** shipped.

### `data/booths.json`

15 ward records, all at polling station **41-संविलियन विद्यालय बड़ागांव** / 41-Samvilian Vidyalaya Badagaon.

| Wards | Booth | Room |
|---|---|---|
| 1–2 | 96 | कक्ष 1 (प्राथमिक शाखा) |
| 3–4 | 97 | कक्ष 2 (प्राथमिक शाखा) |
| 5–6 | 98 | कक्ष 3 (प्राथमिक शाखा) |
| 7–9 | 99 | कक्ष 4 (प्राथमिक शाखा) |
| 10–12 | 100 | कक्ष 5 (जूनियर शाखा) |
| 13–15 | 101 | कक्ष 6 (जूनियर शाखा) |

### `data/schemes.json` — 6 cards

1. PM किसान सम्मान निधि (`pmkisan.gov.in`)
2. PM आवास योजना ग्रामीण (`pmayg.nic.in`)
3. UP पेंशन / SSPY (`sspy-up.gov.in`)
4. आयुष्मान भारत PM-JAY (`beneficiary.nha.gov.in`)
5. UP राशन / FCS (`fcs.up.gov.in`)
6. UP जनसुनवाई (`jansunwai.up.nic.in`)

### `data/directory.json`

| Category | Entries | Notes |
|---|---|---|
| Administration | DM Hardoi, SDM Sandila, BDO Behandar, Panchayat Secretary, Lekhpal | Secretary and Lekhpal: name/phone marked unavailable |
| Police | SHO Kashimpur, SP Hardoi, 112 | |
| Utilities | Electricity 1912, tubewell operator | Operator phone unavailable |
| Health | CMO Hardoi, ANM/ASHA | ANM/ASHA phone unavailable |

### `js/config.js` (identity constants, not a database)

| Field | Value |
|---|---|
| Gram Panchayat | 29-बड़ागांव |
| Block | 19-बेंहदर |
| District | 113-हरदोई |
| State | उत्तर प्रदेश |
| Total voters (public aggregate) | 4,443 (Male 2,360 / Female 2,083) |
| Households | 704 |
| Wards | 15 |
| Issue categories for the drafter | 37 Jansunwai department labels |

Official portal URLs for PM-Kisan, PMAY-G, SSPY, Ayushman, FCS, Jansunwai, UP Police, and helplines 1076 / 1098.

---

## Scripts (behaviour, not a server)

| File | What it does now |
|---|---|
| `js/main.js` | Nav, toast, clipboard, sticky header, footer year, **RSS ticker** (BBC Hindi, DW Hindi, The Wire Hindi, India Times UP via allorigins CORS proxy; civic facts if fetch fails; refresh every 30 minutes) |
| `js/grievance.js` | Client-side validation + Hindi draft; mic; Google Input Tools transliteration; copy. **Zero data liability** — no Web3Forms / WhatsApp send |
| `js/booth-finder.js` | Loads `booths.json`, shows booth/room/station, print slip |
| `js/voter-search.js` | Privacy message + opens `https://electoralsearch.eci.gov.in/` |
| `js/config.js` | GP identity, aggregates, portal URLs, issue categories |

---

## Hosting and SEO files

```
.
├── index.html, rights.html, schemes.html, directory.html
├── css/styles.css
├── js/config.js, main.js, booth-finder.js, voter-search.js, grievance.js
├── data/booths.json, directory.json, schemes.json
├── assets/favicon.svg
├── robots.txt
├── sitemap.xml          ← four page URLs under abinavshukl.github.io/jaano-apne-adhikar/
├── .nojekyll
└── .github/workflows/pages.yml   ← deploy static tree from main
```

---

## Legal, privacy, and data policy

- Independent / non-government disclaimer on every page; first-visit modal on the home page.
- No Ashoka Chakra or official government branding.
- External links use `rel="noopener noreferrer"`.
- Do not commit voter rolls, EPIC lists, Aadhaar, complaint text, or API keys.
- The grievance tool **only prepares a draft in the browser**. Users paste it themselves on [jansunwai.up.nic.in](https://jansunwai.up.nic.in).
- This portal does not guarantee that any complaint or application will be accepted or resolved.

---

## Known gaps (honest)

- Several local contacts (sachiv, lekhpal, tubewell, ANM) are still “जानकारी उपलब्ध नहीं”.
- Scheme amounts, eligibility, and legal text can go stale; they must be re-checked against official sites before each public update.

---

## Content maintenance

Before each release, review official portals, helplines, scheme rules, and local numbers. GitHub Pages is public: every committed file can be downloaded. The maintainer is responsible for correcting errors and removing data that should not be public.
