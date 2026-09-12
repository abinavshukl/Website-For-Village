/**
 * js/config.js — Global Application Constants
 * Gram Panchayat 29-Badagaon, Block Behendar, District Hardoi, UP
 *
 * UPDATE THESE VALUES before deployment:
 *  - WHATSAPP_NUMBER: The 10-digit Indian mobile number for grievance dispatch
 *  - WEB3FORMS_KEY: Get free key from https://web3forms.com
 */

const CONFIG = {
  // ── Panchayat Identity ──────────────────────────────────────────────
  gpName: "29-बड़ागांव",
  gpNameEn: "29-Badagaon",
  block: "19-बेंहदर",
  district: "113-हरदोई",
  state: "उत्तर प्रदेश",

  // ── Demographics ─────────────────────────────────────────────────────
  totalVoters: 4443,
  maleVoters: 2360,
  femaleVoters: 2083,
  totalHouseholds: 704,
  totalWards: 15,

  // ── Contact / WhatsApp ───────────────────────────────────────────────
  // Replace with actual 10-digit mobile number (without country code)
  WHATSAPP_NUMBER: "91XXXXXXXXXX",

  // ── Web3Forms (serverless email fallback) ────────────────────────────
  // Get your free access key from https://web3forms.com
  WEB3FORMS_KEY: "YOUR_WEB3FORMS_ACCESS_KEY",
  WEB3FORMS_ENDPOINT: "https://api.web3forms.com/submit",

  // ── Official Portal Links ────────────────────────────────────────────
  PORTALS: {
    pmKisan:    "https://pmkisan.gov.in",
    pmAway:     "https://pmayg.nic.in",
    upPension:  "https://sspy-up.gov.in",
    ayushman:   "https://beneficiary.nha.gov.in",
    fcs:        "https://fcs.up.gov.in",
    jansunwai:  "https://jansunwai.up.nic.in",
    upPolice:   "https://uppolice.gov.in",
    cmHelpline: "tel:1076",
    childLine:  "tel:1098"
  },

  // ── Issue Categories (for grievance form) ───────────────────────────
  ISSUE_CATEGORIES: [
    { value: "bijli",     label: "बिजली समस्या (Electricity)" },
    { value: "sadak",     label: "सड़क / नाली (Road / Drain)" },
    { value: "pani",      label: "पेयजल / हैंडपंप (Drinking Water)" },
    { value: "pension",   label: "पेंशन / सरकारी योजना (Pension / Scheme)" },
    { value: "ration",    label: "राशन / PDS (Ration / PDS)" },
    { value: "bhrashtachar", label: "भ्रष्टाचार (Corruption)" },
    { value: "swachh",    label: "स्वच्छता / कचरा (Sanitation / Waste)" },
    { value: "other",     label: "अन्य (Other)" }
  ]
};

// Freeze the config to prevent accidental mutation
Object.freeze(CONFIG);
Object.freeze(CONFIG.PORTALS);
Object.freeze(CONFIG.ISSUE_CATEGORIES);
