/**
 * js/config.js — Global Application Constants
 * Hardoi, Uttar Pradesh (A Private Initiative)
 *
 * UPDATE THESE VALUES before deployment:
 *  - WHATSAPP_NUMBER: The 10-digit Indian mobile number for grievance dispatch
 *  - WEB3FORMS_KEY: Get free key from https://web3forms.com
 */

const CONFIG = {
  // ── Panchayat Identity ──────────────────────────────────────────────
  gpName: "29-बड़ागांव",
  gpNameEn: "Hardoi",
  block: "19-बेंहदर",
  district: "113-हरदोई",
  state: "उत्तर प्रदेश",

  // ── Demographics ─────────────────────────────────────────────────────
  totalVoters: 4443,
  maleVoters: 2360,
  femaleVoters: 2083,
  totalHouseholds: 704,
  totalWards: 15,

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

  // ── Issue Categories (Jansunwai Departments) ────────────────────────
  ISSUE_CATEGORIES: [
    { value: "revenue", label: "राजस्व (भूमि/अतिक्रमण) - Revenue (Land/Encroachment)" },
    { value: "police", label: "पुलिस (कानून व्यवस्था) - Police (Law & Order)" },
    { value: "rural", label: "ग्राम्य विकास / पंचायती राज - Rural Development / Panchayati Raj" },
    { value: "food", label: "खाद्य एवं रसद (राशन) - Food & Civil Supplies (Ration)" },
    { value: "energy", label: "ऊर्जा (बिजली) - Energy (Electricity)" },
    { value: "social", label: "समाज कल्याण (पेंशन) - Social Welfare (Pensions)" }
  ]
};

// Freeze the config to prevent accidental mutation
Object.freeze(CONFIG);
Object.freeze(CONFIG.PORTALS);
Object.freeze(CONFIG.ISSUE_CATEGORIES);
