const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');

const SRC_TEMPLATES_DIR = path.join(__dirname, 'src', 'templates');
const SRC_PUBLIC_DIR = path.join(__dirname, 'src', 'public');
const DIST_DIR = path.join(__dirname, 'dist');

// Define the districts for programmatic SEO
const districts = [
  { id: 'agra', nameEn: 'Agra', nameHi: 'आगरा' },
  { id: 'aligarh', nameEn: 'Aligarh', nameHi: 'अलीगढ़' },
  { id: 'ambedkar-nagar', nameEn: 'Ambedkar Nagar', nameHi: 'अम्बेडकर नगर' },
  { id: 'amethi', nameEn: 'Amethi', nameHi: 'अमेठी' },
  { id: 'amroha', nameEn: 'Amroha', nameHi: 'अमरोहा' },
  { id: 'auraiya', nameEn: 'Auraiya', nameHi: 'औरैया' },
  { id: 'ayodhya', nameEn: 'Ayodhya', nameHi: 'अयोध्या' },
  { id: 'azamgarh', nameEn: 'Azamgarh', nameHi: 'आजमगढ़' },
  { id: 'baghpat', nameEn: 'Baghpat', nameHi: 'बागपत' },
  { id: 'bahraich', nameEn: 'Bahraich', nameHi: 'बहराइच' },
  { id: 'ballia', nameEn: 'Ballia', nameHi: 'बलिया' },
  { id: 'balrampur', nameEn: 'Balrampur', nameHi: 'बलरामपुर' },
  { id: 'banda', nameEn: 'Banda', nameHi: 'बांदा' },
  { id: 'barabanki', nameEn: 'Barabanki', nameHi: 'बाराबंकी' },
  { id: 'bareilly', nameEn: 'Bareilly', nameHi: 'बरेली' },
  { id: 'basti', nameEn: 'Basti', nameHi: 'बस्ती' },
  { id: 'bhadohi', nameEn: 'Bhadohi', nameHi: 'भदोही' },
  { id: 'bijnor', nameEn: 'Bijnor', nameHi: 'बिजनौर' },
  { id: 'budaun', nameEn: 'Budaun', nameHi: 'बदायूँ' },
  { id: 'bulandshahr', nameEn: 'Bulandshahr', nameHi: 'बुलन्दशहर' },
  { id: 'chandauli', nameEn: 'Chandauli', nameHi: 'चंदौली' },
  { id: 'chitrakoot', nameEn: 'Chitrakoot', nameHi: 'चित्रकूट' },
  { id: 'deoria', nameEn: 'Deoria', nameHi: 'देवरिया' },
  { id: 'etah', nameEn: 'Etah', nameHi: 'एटा' },
  { id: 'etawah', nameEn: 'Etawah', nameHi: 'इटावा' },
  { id: 'farrukhabad', nameEn: 'Farrukhabad', nameHi: 'फर्रुखाबाद' },
  { id: 'fatehpur', nameEn: 'Fatehpur', nameHi: 'फतेहपुर' },
  { id: 'firozabad', nameEn: 'Firozabad', nameHi: 'फिरोजाबाद' },
  { id: 'gautam-buddha-nagar', nameEn: 'Gautam Buddha Nagar', nameHi: 'गौतम बुद्ध नगर' },
  { id: 'ghaziabad', nameEn: 'Ghaziabad', nameHi: 'गाज़ियाबाद' },
  { id: 'ghazipur', nameEn: 'Ghazipur', nameHi: 'गाज़ीपुर' },
  { id: 'gonda', nameEn: 'Gonda', nameHi: 'गोण्डा' },
  { id: 'gorakhpur', nameEn: 'Gorakhpur', nameHi: 'गोरखपुर' },
  { id: 'hamirpur', nameEn: 'Hamirpur', nameHi: 'हमीरपुर' },
  { id: 'hapur', nameEn: 'Hapur', nameHi: 'हापुड़' },
  { id: 'hardoi', nameEn: 'Hardoi', nameHi: 'हरदोई' },
  { id: 'hathras', nameEn: 'Hathras', nameHi: 'हाथरस' },
  { id: 'jalaun', nameEn: 'Jalaun', nameHi: 'जालौन' },
  { id: 'jaunpur', nameEn: 'Jaunpur', nameHi: 'जौनपुर' },
  { id: 'jhansi', nameEn: 'Jhansi', nameHi: 'झाँसी' },
  { id: 'kannauj', nameEn: 'Kannauj', nameHi: 'कन्नौज' },
  { id: 'kanpur-dehat', nameEn: 'Kanpur Dehat', nameHi: 'कानपुर देहात' },
  { id: 'kanpur-nagar', nameEn: 'Kanpur Nagar', nameHi: 'कानपुर नगर' },
  { id: 'kasganj', nameEn: 'Kasganj', nameHi: 'कासगंज' },
  { id: 'kaushambi', nameEn: 'Kaushambi', nameHi: 'कौशाम्बी' },
  { id: 'kheri', nameEn: 'Kheri', nameHi: 'खीरी' },
  { id: 'kushinagar', nameEn: 'Kushinagar', nameHi: 'कुशीनगर' },
  { id: 'lalitpur', nameEn: 'Lalitpur', nameHi: 'ललितपुर' },
  { id: 'lucknow', nameEn: 'Lucknow', nameHi: 'लखनऊ' },
  { id: 'maharajganj', nameEn: 'Maharajganj', nameHi: 'महराजगंज' },
  { id: 'mahoba', nameEn: 'Mahoba', nameHi: 'महोबा' },
  { id: 'mainpuri', nameEn: 'Mainpuri', nameHi: 'मैनपुरी' },
  { id: 'mathura', nameEn: 'Mathura', nameHi: 'मथुरा' },
  { id: 'mau', nameEn: 'Mau', nameHi: 'मऊ' },
  { id: 'meerut', nameEn: 'Meerut', nameHi: 'मेरठ' },
  { id: 'mirzapur', nameEn: 'Mirzapur', nameHi: 'मिर्ज़ापुर' },
  { id: 'moradabad', nameEn: 'Moradabad', nameHi: 'मुरादाबाद' },
  { id: 'muzaffarnagar', nameEn: 'Muzaffarnagar', nameHi: 'मुज़फ़्फ़रनगर' },
  { id: 'pilibhit', nameEn: 'Pilibhit', nameHi: 'पीलीभीत' },
  { id: 'pratapgarh', nameEn: 'Pratapgarh', nameHi: 'प्रतापगढ़' },
  { id: 'prayagraj', nameEn: 'Prayagraj', nameHi: 'प्रयागराज' },
  { id: 'raebareli', nameEn: 'Raebareli', nameHi: 'रायबरेली' },
  { id: 'rampur', nameEn: 'Rampur', nameHi: 'रामपुर' },
  { id: 'saharanpur', nameEn: 'Saharanpur', nameHi: 'सहारनपुर' },
  { id: 'sambhal', nameEn: 'Sambhal', nameHi: 'सम्भल' },
  { id: 'sant-kabir-nagar', nameEn: 'Sant Kabir Nagar', nameHi: 'संत कबीर नगर' },
  { id: 'shahjahanpur', nameEn: 'Shahjahanpur', nameHi: 'शाहजहाँपुर' },
  { id: 'shamli', nameEn: 'Shamli', nameHi: 'शामली' },
  { id: 'shravasti', nameEn: 'Shravasti', nameHi: 'श्रावस्ती' },
  { id: 'siddharthnagar', nameEn: 'Siddharthnagar', nameHi: 'सिद्धार्थनगर' },
  { id: 'sitapur', nameEn: 'Sitapur', nameHi: 'सीतापुर' },
  { id: 'sonbhadra', nameEn: 'Sonbhadra', nameHi: 'सोनभद्र' },
  { id: 'sultanpur', nameEn: 'Sultanpur', nameHi: 'सुल्तानपुर' },
  { id: 'unnao', nameEn: 'Unnao', nameHi: 'उन्नाव' },
  { id: 'varanasi', nameEn: 'Varanasi', nameHi: 'वाराणसी' }
];

const defaultContext = {
  districtNameHi: "हरदोई",
  districtNameEn: "Hardoi",
  basePath: "."
};

async function build() {
  try {
    console.log("Cleaning dist directory...");
    await fs.emptyDir(DIST_DIR);

    console.log("Copying public assets to dist...");
    await fs.copy(SRC_PUBLIC_DIR, DIST_DIR);

    // Get all templates
    const files = await fs.readdir(SRC_TEMPLATES_DIR);
    const templates = {};
    for (const file of files) {
      if (file.endsWith('.hbs')) {
        const source = await fs.readFile(path.join(SRC_TEMPLATES_DIR, file), 'utf-8');
        templates[file] = Handlebars.compile(source);
      }
    }

    console.log("Generating default site (Hardoi)...");
    for (const [filename, template] of Object.entries(templates)) {
      const html = template(defaultContext);
      await fs.writeFile(path.join(DIST_DIR, filename.replace('.hbs', '.html')), html);
    }

    console.log(`Generating programmatic SEO pages for ${districts.length} districts...`);
    for (const district of districts) {
      const districtDir = path.join(DIST_DIR, district.id);
      await fs.ensureDir(districtDir);
      
      const context = {
        districtNameHi: district.nameHi,
        districtNameEn: district.nameEn,
        basePath: ".."
      };

      for (const [filename, template] of Object.entries(templates)) {
        const html = template(context);
        await fs.writeFile(path.join(districtDir, filename.replace('.hbs', '.html')), html);
      }
    }

    console.log("Build complete! Output in /dist folder.");
  } catch (err) {
    console.error("Build failed:", err);
    process.exit(1);
  }
}

build();
