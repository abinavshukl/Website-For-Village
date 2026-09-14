const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');

const SRC_TEMPLATES_DIR = path.join(__dirname, 'src', 'templates');
const SRC_PUBLIC_DIR = path.join(__dirname, 'src', 'public');
const DIST_DIR = path.join(__dirname, 'dist');

// Define the districts for programmatic SEO
const districts = [
  { id: 'lucknow', nameEn: 'Lucknow', nameHi: 'लखनऊ' },
  { id: 'kanpur', nameEn: 'Kanpur', nameHi: 'कानपुर' },
  { id: 'varanasi', nameEn: 'Varanasi', nameHi: 'वाराणसी' },
  { id: 'prayagraj', nameEn: 'Prayagraj', nameHi: 'प्रयागराज' },
  { id: 'sitapur', nameEn: 'Sitapur', nameHi: 'सीतापुर' },
  { id: 'unnao', nameEn: 'Unnao', nameHi: 'उन्नाव' },
  { id: 'ayodhya', nameEn: 'Ayodhya', nameHi: 'अयोध्या' },
  { id: 'gorakhpur', nameEn: 'Gorakhpur', nameHi: 'गोरखपुर' },
  { id: 'bareilly', nameEn: 'Bareilly', nameHi: 'बरेली' },
  { id: 'meerut', nameEn: 'Meerut', nameHi: 'मेरठ' },
  { id: 'agra', nameEn: 'Agra', nameHi: 'आगरा' },
  { id: 'aligarh', nameEn: 'Aligarh', nameHi: 'अलीगढ़' },
  { id: 'moradabad', nameEn: 'Moradabad', nameHi: 'मुरादाबाद' },
  { id: 'saharanpur', nameEn: 'Saharanpur', nameHi: 'सहारनपुर' },
  { id: 'ghaziabad', nameEn: 'Ghaziabad', nameHi: 'गाज़ियाबाद' }
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
