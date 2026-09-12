# 29-Badagaon Gram Panchayat — Civic Portal

**ग्राम पंचायत 29-बड़ागांव, विकास खण्ड 19-बेंहदर, जिला 113-हरदोई, उत्तर प्रदेश**

A fully accessible, bilingual (Hindi + English) civic portal for the citizens of Gram Panchayat 29-Badagaon, hosted on GitHub Pages.

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

## ⚙️ Configuration (Before Deployment)

Open `js/config.js` and update:

| Field | Description |
|---|---|
| `WHATSAPP_NUMBER` | 10-digit mobile number for grievance WhatsApp dispatch |
| `WEB3FORMS_KEY` | Free API key from [web3forms.com](https://web3forms.com) |

Open `data/directory.json` and replace all `XXXXXXXXXX` with real phone numbers.

---

## 🚀 Deployment (GitHub Pages)

1. Create a GitHub repository (e.g., `badagaon-gp`)
2. Push all files to the `main` branch
3. Go to **Settings → Pages → Source: Deploy from branch → main → / (root)**
4. Your site will be live at: `https://<your-username>.github.io/badagaon-gp/`

> ⚠️ The `.nojekyll` file ensures CSS/JS files are served correctly.

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
- **Grievance Form**: WhatsApp primary + Web3Forms email fallback, formal letter draft generator
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
