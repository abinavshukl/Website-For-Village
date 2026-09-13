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
    { value: "revenue", label: "राजस्व (Revenue / Land / Encroachment)" },
    { value: "home", label: "गृह एवं गोपन / पुलिस (Home & Confidential / Police)" },
    { value: "panchayati_raj", label: "पंचायती राज (Panchayati Raj)" },
    { value: "rural_dev", label: "ग्राम्य विकास (Rural Development)" },
    { value: "food_supply", label: "खाद्य एवं रसद (Food & Civil Supplies / Ration)" },
    { value: "energy", label: "ऊर्जा (Energy / Electricity)" },
    { value: "social_welfare", label: "समाज कल्याण (Social Welfare / Pensions)" },
    { value: "medical_health", label: "चिकित्सा स्वास्थ्य एवं परिवार कल्याण (Health & Family Welfare)" },
    { value: "basic_education", label: "बेसिक शिक्षा (Basic Education)" },
    { value: "secondary_education", label: "माध्यमिक शिक्षा (Secondary Education)" },
    { value: "higher_education", label: "उच्च शिक्षा (Higher Education)" },
    { value: "pwd", label: "लोक निर्माण विभाग (Public Works Department - PWD)" },
    { value: "irrigation", label: "सिंचाई एवं जल संसाधन (Irrigation & Water Resources)" },
    { value: "minor_irrigation", label: "लघु सिंचाई (Minor Irrigation)" },
    { value: "agriculture", label: "कृषि (Agriculture)" },
    { value: "animal_husbandry", label: "पशुधन (Animal Husbandry)" },
    { value: "dairy", label: "दुग्ध विकास (Dairy Development)" },
    { value: "women_welfare", label: "महिला कल्याण (Women Welfare)" },
    { value: "child_development", label: "बाल विकास एवं पुष्टाहार (Child Development & Nutrition)" },
    { value: "divyangjan", label: "दिव्यांगजन सशक्तिकरण (Divyangjan Empowerment)" },
    { value: "minority_welfare", label: "अल्पसंख्यक कल्याण (Minority Welfare)" },
    { value: "backward_class", label: "पिछड़ा वर्ग कल्याण (Backward Class Welfare)" },
    { value: "labor", label: "श्रम (Labour & Employment)" },
    { value: "transport", label: "परिवहन (Transport)" },
    { value: "urban_dev", label: "नगर विकास (Urban Development)" },
    { value: "housing", label: "आवास एवं शहरी नियोजन (Housing & Urban Planning)" },
    { value: "forest", label: "वन एवं वन्य जीव (Forest & Wildlife)" },
    { value: "environment", label: "पर्यावरण (Environment)" },
    { value: "excise", label: "आबकारी (Excise)" },
    { value: "stamp_registration", label: "स्टाम्प एवं निबन्धन (Stamp & Registration)" },
    { value: "revenue_tax", label: "वाणिज्य कर / GST (Commercial Tax)" },
    { value: "culture", label: "संस्कृति (Culture)" },
    { value: "tourism", label: "पर्यटन (Tourism)" },
    { value: "youth_welfare", label: "युवा कल्याण (Youth Welfare)" },
    { value: "sports", label: "खेलकूद (Sports)" },
    { value: "cmo", label: "मुख्यमंत्री कार्यालय (Chief Minister Office)" },
    { value: "other", label: "अन्य विभाग (Other Department)" }
  ]
};

// Freeze the config to prevent accidental mutation
Object.freeze(CONFIG);
Object.freeze(CONFIG.PORTALS);
Object.freeze(CONFIG.ISSUE_CATEGORIES);
