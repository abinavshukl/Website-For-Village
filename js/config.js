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
    { value: "bijli",       label: "बिजली समस्या (Electricity)", authority: "श्रीमान अधिशाषी अभियंता (विद्युत/MVVNL)", whatsapp: "", email: "customercare.mvvnl@gmail.com", phone: "1912" },
    { value: "sadak",       label: "सड़क / नाली (Road / Drain)", authority: "श्रीमान खंड विकास अधिकारी (BDO)", whatsapp: "", email: "cdohar@nic.in", phone: "1076" },
    { value: "pani",        label: "पेयजल / हैंडपंप (Drinking Water)", authority: "श्रीमान अधिशाषी अभियंता (जल निगम)", whatsapp: "", email: "", phone: "1076" },
    { value: "pension",     label: "पेंशन / सरकारी योजना (Pension)", authority: "श्रीमान जिला समाज कल्याण अधिकारी", whatsapp: "", email: "dswohar@nic.in", phone: "1076" },
    { value: "ration",      label: "राशन / कोटेदार (Ration / PDS)", authority: "श्रीमान जिला पूर्ति अधिकारी (DSO)", whatsapp: "", email: "dsohar@nic.in", phone: "1076" },
    { value: "police",      label: "कानून व्यवस्था / पुलिस (Law & Order)", authority: "श्रीमान थाना प्रभारी / पुलिस अधीक्षक (SP)", whatsapp: "", email: "sphar-up@nic.in", phone: "112" },
    { value: "health",      label: "स्वास्थ्य / अस्पताल (Health / Medical)", authority: "श्रीमान मुख्य चिकित्सा अधिकारी (CMO)", whatsapp: "", email: "cmohardoi@gmail.com", phone: "108" },
    { value: "education",   label: "शिक्षा / विद्यालय (Education / School)", authority: "श्रीमान खंड शिक्षा अधिकारी (BEO / BSA)", whatsapp: "", email: "bsahardoi@gmail.com", phone: "1076" },
    { value: "revenue",     label: "राजस्व / जमीन पैमाइश (Revenue / Land)", authority: "श्रीमान उप जिलाधिकारी महोदय (SDM)", whatsapp: "", email: "sdmsadar-har@nic.in", phone: "1076" },
    { value: "agriculture", label: "कृषि / खाद-बीज (Agriculture)", authority: "श्रीमान उप कृषि निदेशक (DDA)", whatsapp: "", email: "ddagrihar@nic.in", phone: "1076" },
    { value: "animal",      label: "पशुपालन / आवारा पशु (Animal Husbandry)", authority: "श्रीमान मुख्य पशु चिकित्सा अधिकारी (CVO)", whatsapp: "", email: "cvohar@nic.in", phone: "1076" },
    { value: "anganwadi",   label: "आंगनवाड़ी / बाल विकास (Anganwadi)", authority: "श्रीमान बाल विकास परियोजना अधिकारी (CDPO)", whatsapp: "", email: "cdpohar@nic.in", phone: "1076" },
    { value: "bhrashtachar",label: "भ्रष्टाचार (Corruption)", authority: "श्रीमान जिलाधिकारी महोदय (DM)", whatsapp: "", email: "dmhar@nic.in", phone: "1064" },
    { value: "swachh",      label: "स्वच्छता / कचरा (Sanitation / Waste)", authority: "श्रीमान जिला पंचायत राज अधिकारी (DPRO)", whatsapp: "", email: "dprohar@nic.in", phone: "1076" },
    { value: "other",       label: "अन्य (Other)", authority: "श्रीमान पंचायत सचिव / ग्राम प्रधान जी", whatsapp: "910000000000", email: "", phone: "" } // Example of local whatsapp fallback
  ]
};

// Freeze the config to prevent accidental mutation
Object.freeze(CONFIG);
Object.freeze(CONFIG.PORTALS);
Object.freeze(CONFIG.ISSUE_CATEGORIES);
