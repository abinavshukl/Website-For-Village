# 29-Badagaon Gram Panchayat — Civic Portal

**ग्राम पंचायत 29-बड़ागांव, विकास खण्ड 19-बेंहदर, जिला 113-हरदोई, उत्तर प्रदेश**

A bilingual (Hindi + English) civic information portal for citizens of Gram Panchayat 29-Badagaon, hosted on GitHub Pages.

> **Important legal notice:** This is an independent, non-governmental awareness initiative. It is not an official government website, does not provide legal advice, and does not represent any government department. Information is provided for general educational purposes only. Users should verify important information with the relevant official department or a qualified legal professional.

Do not publish personal voter information, government-issued identity numbers, private phone numbers, complaint records, or other personally identifiable information in this repository or on GitHub Pages.

---

## 🗺️ Project Structure

```
.
├── index.html          ← Home: Hero, Stats, Booth Finder, Service Pillars, Grievance Form
├── rights.html         ← Citizen Rights: Panchayati Raj, RTI, MNREGA
├── schemes.html        ← Government Schemes: PM-Kisan, PMAY, Pension, Ayushman, Ration, Jansunwai
├── directory.html      ← Contacts: Admin, Police, Health, Utilities + Emergency Numbers
├── css/
│   └── styles.css      ← Full design system, animations, print rules
├── js/
│   ├── config.js       ← Global constants (⚠️ update WhatsApp number & Web3Forms key)
│   ├── main.js         ← Nav toggle, toast, clipboard, smooth scroll
│   ├── booth-finder.js ← Ward → Booth lookup (loads data/booths.json)
│   └── grievance.js    ← WhatsApp form + Web3Forms fallback
├── data/
│   ├── booths.json     ← 15-ward to booth mapping (booths 96–101)
│   ├── directory.json  ← Contacts by category (⚠️ update placeholder phone numbers)
│   └── schemes.json    ← 6 government scheme cards
├── assets/
│   └── favicon.svg     ← Panchayat emblem favicon
└── .nojekyll           ← GitHub Pages: disable Jekyll processing
```

---

## ⚖️ Legal, Privacy, and Data Policy

- Keep the independent, non-governmental disclaimer visible on every page.
- Verify laws, schemes, eligibility rules, deadlines, helplines, and contacts against current official sources before publication.
- Never publish voter rolls, EPIC numbers, Aadhaar numbers, guardian names, house numbers, ages, or other voter-linked personal data.
- Do not commit complaint submissions, form responses, API keys, access tokens, or private contact credentials.
- Client-side code cannot keep API keys secret. Keep private integrations disabled unless they use an approved server-side service.
- Clearly tell users whether a complaint is sent or only prepared as a draft.
- This portal does not guarantee that a complaint will be accepted, investigated, or resolved.

## ⚙️ Configuration (Before Deployment)

Open `js/config.js` and update:

| Field | Description |
|---|---|
| Public portal links and labels | Verify against current official sources |
| Public contact numbers | Publish only after permission or reliable official verification |
| Complaint dispatch | Keep disabled unless the destination, privacy notice, and data handling are approved |

Do not replace placeholders with guessed or unverified personal numbers. Where a contact is unavailable, show an official directory link or “information unavailable” instead of creating a non-functional `tel:`, `mailto:`, or WhatsApp link.

Before deployment, search the entire project for placeholders such as `XXXXXXXXXX`, `YOUR_`, `example.com`, fake numbers, API keys, and personal data.

---

## 🚀 Deployment (GitHub Pages)

1. Create a GitHub repository (e.g., `badagaon-gp`)
2. Push all files to the `main` branch
3. Go to **Settings → Pages → Source: Deploy from branch → main → / (root)**
4. Your site will be live at: `https://<your-username>.github.io/badagaon-gp/`

> ⚠️ The `.nojekyll` file ensures CSS/JS files are served correctly.

### Public deployment checklist

- [ ] No voter database, voter search export, or personally identifiable data is included in the published files.
- [ ] Private or research-only data files are excluded from the repository or deployment output.
- [ ] No API keys, access tokens, private email credentials, or private WhatsApp credentials are committed.
- [ ] Phone numbers, email addresses, legal claims, scheme details, and external links have been verified.
- [ ] Placeholder and fake values have been removed or rendered non-clickable.
- [ ] The independent/non-government disclaimer is visible and accurate.
- [ ] Complaint privacy wording explains what data may leave the device and where it goes.
- [ ] The site has been tested over HTTPS on mobile and desktop.
- [ ] A process exists for correcting outdated legal, contact, and scheme information.

---

## 🖨️ Print Support

The directory and rights pages include a print stylesheet (`@media print`) that:
- Hides navigation, hero, and buttons
- Expands contact cards to black-ink-friendly format
- Includes RTI letter template for printing

---

## 📱 Features

- **Bilingual**: Hindi (Devanagari) primary, English sub-labels
- **Booth Finder**: Select ward 1–15, get booth number (96–101), room, and polling station
- **Grievance Assistance**: Validate details and prepare a formal letter draft; optional dispatch must be explicitly configured and privacy-reviewed
- **Voter search for public release**: Remove the local voter database/search before deployment and link users to the official Election Commission search service instead
- **Schemes**: Filter cards by category (Agriculture / Housing / Pension / Health / Food / Grievance)
- **Directory**: Click-to-call `tel:` links, WhatsApp deep-links, emergency number panel
- **Rights**: RTI template with one-click copy, MNREGA guidance
- **Mobile-first**: Hamburger menu, responsive at 375px / 768px / 1280px
- **Print-friendly**: `window.print()` for directory and RTI template

---

## 📊 Panchayat Data

| Field | Value |
|---|---|
| Gram Panchayat | 29-Badagaon (29-बड़ागांव) |
| Development Block | 19-Behendar (19-बेंहदर) |
| District | 113-Hardoi (113-हरदोई) |
| State | Uttar Pradesh |
| Total Voters | 4,443 (Male: 2,360 / Female: 2,083) |
| Households | 704 |
| Wards | 15 |
| Polling Station | 41-Samvilian Vidyalaya Badagaon |
| Booth Range | 96–101 (6 booths) |

## Content maintenance

This portal contains information that can become outdated. Before each release, review official government websites, helpline numbers, scheme eligibility rules, legal references, and local contact details. Record the review date in the relevant content or release notes. If information is uncertain, remove the claim or link to the official source rather than presenting it as fact.

GitHub Pages is a public static host; assume every committed file can be downloaded and indexed. The maintainer is responsible for responding to privacy requests, correcting inaccurate information, and removing data that should not be public.
