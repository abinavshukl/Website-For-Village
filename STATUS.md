# Project status — जानो अपने अधिकार

Last documented: **13 September 2026**. This file records the verified state of the repository as currently built. It is a status summary, not a roadmap.

## Delivered

1. **Brand and legal framing** — The site consistently presents itself as a private civic-awareness initiative, not an official government portal. Legal disclaimer language is repeated across major pages and the first-visit modal remains in place.
2. **Static GitHub Pages app** — Four public HTML pages, one CSS file, five JavaScript files, and three JSON data files are present. Deployment workflow is managed via GitHub Pages.
3. **Civic tools on the home page**
   - Booth finder: wards 1–15 mapped to booths 96–101 at 41-Samvilian Vidyalaya Badagaon.
   - Voter search: no local roll is hosted; users are routed to ECI Electoral Search.
   - Jansunwai pre-drafter: local-only complaint draft generation with copy support, Hindi voice input, and optional Hinglish transliteration.
4. **Rights library** — Constitutional rights in plain Hindi, FIR/police workflow, women’s rights, RTI information, land/ration, Janhit Guarantee, MNREGA, and Panchayati Raj notes.
5. **Scheme library** — Six published scheme cards: PM-Kisan, PMAY-G, UP pension, Ayushman, FCS ration, and Jansunwai.
6. **Directory** — Emergency numbers and public service contacts are displayed from static JSON data. Unverified local lines remain blank rather than invented.
7. **News ticker** — Civic Hindi updates appear immediately; live Hindi RSS runs when a CORS proxy succeeds and falls back to local civic fact text.
8. **Privacy and data posture** — No local voter database is hosted, no analytics/cookies are used, and grievance data is not uploaded to a backend.
9. **Discoverability files** — `robots.txt`, `sitemap.xml`, Open Graph/Twitter metadata, and JSON-LD schema are shipped for discoverability and indexing.
10. **Website-wide legal audit** — The current build has been audited for official-branding, legal advice risk, privacy handling, and public information accuracy.

## Data counts (source of truth = JSON)

| Dataset | Count |
|---|---|
| Booth / ward rows | 15 |
| Distinct booth numbers | 6 (96–101) |
| Scheme cards | 6 |
| Directory contacts | 12 (5 admin + 3 police + 2 utilities + 2 health) |
| Drafter departments in CONFIG | 37 |
| Public pages | 4 |

Public demographic **aggregates** in config (not a voter list): 4,443 voters, 704 households, and 15 wards.

## Explicitly out of scope (current build)

- Node / Python / PHP server backend
- Database-backed complaint management
- Local voter database hosting or search
- Tracking pixels, cookies, or analytics
- Official government branding or endorsement
- Automatic WhatsApp / Email / Web3Forms complaint submission

## Current compliance and legal framing

The site currently maintains a cautious, educational-only stance:

- It is a private civic awareness initiative.
- It is not a government portal or legal service provider.
- It does not offer legal representation or guaranteed outcomes.
- It does not submit private complaint text to any remote service.
- It asks users to verify important legal and entitlement claims with official sources before acting.

This is the correct posture for the current build and is consistent with the project’s educational mission.

## Content status

- Unverified local contact lines remain intentionally unavailable rather than invented.
- The website is intentionally local-only and does not upload user complaint text anywhere.
- The project continues to rely on official source verification for scheme updates and legal references.
