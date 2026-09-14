/**
 * js/main.js — Shared UI Utilities
 * Mobile nav toggle, clipboard, toast notifications, shared init
 */

(function () {
  "use strict";

  // Shared helpers are defensive because this file is loaded on every page.
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav__link").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPage || (currentPage === "" && href === "index.html")) {
        link.classList.add("nav__link--active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function createToastContainer() {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.setAttribute("aria-live", "polite");
      container.setAttribute("aria-atomic", "true");
      document.body.appendChild(container);
    }
    return container;
  }

  window.showToast = function (message, duration = 3500) {
    const container = createToastContainer();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toast.setAttribute("role", "status");
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("toast--visible");
    });

    setTimeout(() => {
      toast.classList.remove("toast--visible");
      toast.classList.add("toast--hiding");
      setTimeout(() => toast.remove(), 400);
    }, duration);
  };

  // Copy uses the secure API when available and a temporary textarea fallback
  // for local previews and older browsers. Nothing is persisted by the site.
  // ── Copy to clipboard ─────────────────────────────────────────────────
  window.copyToClipboard = function (text, toastMessage) {
    const msg = toastMessage || "प्रारूप कॉपी हो गया! ✅";
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => window.showToast(msg))
        .catch(() => fallbackCopy(text, msg));
    } else {
      fallbackCopy(text, msg);
    }
  };

  function fallbackCopy(text, msg) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.cssText = "position:fixed;opacity:0;top:0;left:0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      window.showToast(msg);
    } catch (err) {
      window.showToast("कॉपी नहीं हो सका। कृपया मैन्युअली कॉपी करें।");
    }
    document.body.removeChild(textarea);
  }

  // ── Footer year ───────────────────────────────────────────────────────
  function updateFooterYear() {
    const el = document.getElementById("footerYear");
    if (el) el.textContent = new Date().getFullYear();
  }

  // ── Smooth scroll for anchor links ────────────────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href").slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  // ── Sticky header shadow on scroll ────────────────────────────────────
  function initStickyHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        header.classList.toggle("site-header--scrolled", !entry.isIntersecting);
      },
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 }
    );
    const sentinel = document.getElementById("headerSentinel");
    if (sentinel) observer.observe(sentinel);
  }

  // ── Print button ──────────────────────────────────────────────────────
  window.triggerPrint = function () {
    window.print();
  };

  // ── Mobile Nav Toggle ─────────────────────────────────────────────────
  function initMobileNav() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("navMenu");
    
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", !isExpanded);
        toggle.classList.toggle("toggle--active");
        nav.classList.toggle("nav--open");
      });

      nav.querySelectorAll(".nav__link").forEach(link => {
        link.addEventListener("click", () => {
          toggle.setAttribute("aria-expanded", "false");
          toggle.classList.remove("toggle--active");
          nav.classList.remove("nav--open");
        });
      });
    }
  }

  // ── Dynamic News Ticker — Multi-source, JS-driven, never-empty ─────────
  const CIVIC_FALLBACK = [
    { icon: 'home',     label: 'आवास योजना',     text: 'पीएम आवास योजना (ग्रामीण) के तहत पक्के घर के लिए ₹1.20 लाख की सहायता पाएं।', link: '' },
    { icon: 'tractor',  label: 'किसान अपडेट',    text: 'पीएम किसान सम्मान निधि की अगली किस्त के लिए e-KYC तुरंत पूरा करें, यह अनिवार्य है!', link: '' },
    { icon: 'building', label: 'ग्राम सचिवालय', text: 'आय, जाति और निवास प्रमाण पत्र सीधे अपने पंचायत भवन से बनवाएं।', link: '' },
    { icon: 'wheat',    label: 'राशन योजना',     text: 'पीएम गरीब कल्याण अन्न योजना के तहत मुफ्त राशन वितरण जारी है।', link: '' },
    { icon: 'scale',    label: 'RTI अधिकार',     text: 'RTI दाखिल करें — सूचना का अधिकार हर नागरिक का मौलिक अधिकार है।', link: 'rights.html' },
    { icon: 'file-text',label: 'जनसुनवाई',       text: 'अपनी शिकायत अब घर बैठे डिजिटल जनसुनवाई पोर्टल पर दर्ज करें।', link: '#grievanceSection' },
    { icon: 'bell',     label: 'BNS 2023',        text: 'सभी विधिक टेम्पलेट नए BNS 2023 के अनुसार अपडेट कर दिए गए हैं।', link: 'rights.html' },
    { icon: 'shield-check', label: 'जागरूकता',   text: 'अपने ग्राम पंचायत की बैठकों में भाग लें — यह आपका अधिकार और कर्तव्य है।', link: '' },
  ];

  // Local headline list used when RSS fetches are blocked by browser CORS or
  // proxy rate limits. This keeps the ticker useful without breaking the page.
  const LOCAL_NEWS_ITEMS = [
    { icon: 'newspaper', label: 'नागरिक अपडेट', text: 'उत्तर प्रदेश में सरकारी योजनाओं और नागरिक सेवाओं की समय-सीमा पर निगरानी बढ़ाई गई है।', link: 'https://up.gov.in', linkLabel: 'आधिकारिक जानकारी' },
    { icon: 'users', label: 'नागरिक अपडेट', text: 'पंचायतों में डिजिटल शिकायत प्रणाली को सरल बनाने की पहल जारी है।', link: 'https://jansunwai.up.nic.in', linkLabel: 'शिकायत पोर्टल' },
    { icon: 'shield-check', label: 'नागरिक अपडेट', text: 'नागरिकों के लिए RTI, FIR और सेवा-प्राप्ति से जुड़े नियम आसानी से समझे जा रहे हैं।', link: 'rights.html', linkLabel: 'अधिकार पढ़ें' },
    { icon: 'briefcase', label: 'नागरिक अपडेट', text: 'कृषि, रोजगार और पेंशन से जुड़े लाभार्थी दस्तावेज़ों की सत्यापन प्रक्रिया ऑनलाइन की जा रही है।', link: 'schemes.html', linkLabel: 'योजनाएँ पढ़ें' },
    { icon: 'phone', label: 'नागरिक अपडेट', text: 'स्थानीय हेल्पलाइन और आपातकालीन नए दिशा-निर्देशों के अनुसार कार्यरत हैं।', link: 'directory.html', linkLabel: 'संपर्क देखें' },
    { icon: 'map', label: 'नागरिक अपडेट', text: 'ग्राम पंचायत स्तर पर निर्वाचन, योजनाओं और सुविधाओं की सूचना को आसान भाषा में उपलब्ध कराया जा रहा है।', link: 'index.html', linkLabel: 'विस्तार से पढ़ें' },
  ];

  const NEWS_SOURCES = [
    { name: 'BBC Hindi', url: 'https://feeds.bbci.co.uk/hindi/rss.xml' },
    { name: 'DW Hindi', url: 'https://rss.dw.com/rdf/rss-hin-all' },
    { name: 'Aaj Tak', url: 'https://www.aajtak.in/rssfeeds/?id=home' },
    { name: 'News18 Hindi', url: 'https://hindi.news18.com/rss/india.xml' },
  ];
  const NEWS_LOCATIONS = {
    'hardoi-up': ['hardoi', 'हरदोई', 'uttar pradesh', 'उत्तर प्रदेश'],
    'up-state': ['uttar pradesh', 'उत्तर प्रदेश', 'up'],
    'lucknow-up': ['lucknow', 'लखनऊ', 'uttar pradesh', 'उत्तर प्रदेश'],
    'kanpur-up': ['kanpur', 'कानपुर', 'uttar pradesh', 'उत्तर प्रदेश'],
    'varanasi-up': ['varanasi', 'वाराणसी', 'uttar pradesh', 'उत्तर प्रदेश'],
    'prayagraj-up': ['prayagraj', 'इलाहाबाद', 'प्रयागराज', 'uttar pradesh', 'उत्तर प्रदेश'],
    'sitapur-up': ['sitapur', 'सीतापुर', 'uttar pradesh', 'उत्तर प्रदेश'],
    'unnao-up': ['unnao', 'उन्नाव', 'uttar pradesh', 'उत्तर प्रदेश'],
    'ayodhya-up': ['ayodhya', 'अयोध्या', 'uttar pradesh', 'उत्तर प्रदेश'],
    'gorakhpur-up': ['gorakhpur', 'गोरखपुर', 'uttar pradesh', 'उत्तर प्रदेश'],
    'bareilly-up': ['bareilly', 'बरेली', 'uttar pradesh', 'उत्तर प्रदेश'],
    'meerut-up': ['meerut', 'मेरठ', 'uttar pradesh', 'उत्तर प्रदेश'],
    'agra-up': ['agra', 'आगरा', 'uttar pradesh', 'उत्तर प्रदेश'],
    'other-up': ['uttar pradesh', 'उत्तर प्रदेश', 'up'],
  };
  const NEWS_LOCATION_STORAGE_KEY = 'selectedNewsLocation';
  const NEWS_PROXIES = [
    (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&disableCache=true`,
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&disableCache=true`,
    (url) => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
  ];

  function parseFeedItems(feedItems, sourceName) {
    return (feedItems || [])
      .slice(0, 6)
      .map((item) => ({
        icon: 'newspaper',
        label: `ताज़ा खबर • ${sourceName}`,
        text: (item.title || '').trim(),
        link: (item.link || '').trim(),
        linkLabel: 'पूरा समाचार पढ़ें',
      }))
      .filter((item) => item.text.length > 5 && /^https?:\/\//i.test(item.link));
  }

  function parseRSSXML(xmlText, sourceName) {
    const documentParser = new DOMParser();
    const feedDocument = documentParser.parseFromString(xmlText, 'text/xml');
    return parseFeedItems(
      Array.from(feedDocument.querySelectorAll('item, entry')).map((item) => ({
        title: item.querySelector('title')?.textContent || '',
        link: item.querySelector('link')?.getAttribute('href') || item.querySelector('link')?.textContent || '',
      })),
      sourceName
    );
  }

  async function fetchNewsFromSource(source) {
    const freshFeedUrl = `${source.url}${source.url.includes('?') ? '&' : '?'}_=${Date.now()}`;
    for (const proxy of NEWS_PROXIES) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      try {
        const response = await fetch(proxy(freshFeedUrl), { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) continue;
        const contentType = response.headers.get('content-type') || '';
        const payload = contentType.includes('json') ? await response.json() : null;
        const items = payload?.items
          ? parseFeedItems(payload.items, source.name)
          : payload?.contents
            ? parseRSSXML(payload.contents, source.name)
            : parseRSSXML(await response.text(), source.name);
        if (items.length > 0) return items;
      } catch (error) {
        // Another source can still succeed when a browser or proxy blocks RSS.
      } finally {
        clearTimeout(timeoutId);
      }
    }
    return [];
  }

  async function fetchNewsFromSources() {
    const sourceResults = await Promise.all(NEWS_SOURCES.map(fetchNewsFromSource));
    const seenHeadlines = new Set();
    const liveItems = sourceResults.flat().filter((item) => {
      const key = item.text.toLowerCase().replace(/\s+/g, ' ');
      if (seenHeadlines.has(key)) return false;
      seenHeadlines.add(key);
      return true;
    });
    if (liveItems.length === 0) return LOCAL_NEWS_ITEMS;

    const selectedLocation = document.getElementById('newsLocation')?.value || 'hardoi-up';
    const locationTerms = NEWS_LOCATIONS[selectedLocation] || [];
    if (locationTerms.length === 0) return liveItems.slice(0, 12);

    const matchingItems = liveItems.filter((item) => {
      const searchableText = `${item.text} ${item.label}`.toLowerCase();
      return locationTerms.some((term) => searchableText.includes(term));
    });
    return (matchingItems.length > 0 ? matchingItems : liveItems).slice(0, 12);
  }

  let tickerItems = [];
  let newsRefreshInProgress = false;

  function buildTickerSpan(item) {
    const isExternal = item.link && /^https?:\/\//i.test(item.link);
    const linkLabel = item.linkLabel || (isExternal ? 'आधिकारिक वेबसाइट' : 'विस्तार से पढ़ें');
    const targetAttributes = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    const linkHtml = item.link
      ? ` <a href="${item.link}"${targetAttributes} style="color:#93c5fd;text-decoration:underline;margin-left:4px;">${linkLabel}</a>`
      : '';
    return `<i data-lucide="${item.icon}" class="inline-icon" style="color:#eab308;margin-right:4px;"></i><strong>${item.label}:</strong> ${item.text}${linkHtml}`;
  }

  function renderMarquee() {
    const tickerContent = document.querySelector('.notice-ticker__content');
    if (!tickerContent || tickerItems.length === 0) return;

    // Render all items × 2 for seamless infinite loop
    const html = [...tickerItems, ...tickerItems]
      .map(item => `<span class="ticker-item">${buildTickerSpan(item)}</span>`)
      .join('');

    tickerContent.innerHTML = html;
    tickerContent.style.animationDuration = `${tickerItems.length * 18}s`;
    tickerContent.style.animationPlayState = 'running';

    if (window.lucide) window.lucide.createIcons();
  }

  async function initNewsTicker() {
    // Show civic fallback immediately — never empty
    tickerItems = [...CIVIC_FALLBACK];
    renderMarquee();

    // Replace the local updates only when source articles load successfully.
    const liveNews = await fetchNewsFromSources();
    if (liveNews && liveNews.length > 0) {
      tickerItems = [...liveNews];
      renderMarquee(); // Swap to live news only
      console.log(`✅ Showing ${liveNews.length} live news headlines.`);
    } else {
      console.warn('⚠️ API unavailable. Showing civic facts as fallback.');
    }

    // Recheck frequently so new headlines appear without requiring a page reload.
    setInterval(async () => {
      if (newsRefreshInProgress) return;
      newsRefreshInProgress = true;
      const freshNews = await fetchNewsFromSources();
      if (freshNews && freshNews.length > 0) {
        tickerItems = [...freshNews];
        renderMarquee();
      }
      newsRefreshInProgress = false;
    }, 10 * 1000);
  }

  function initDistrictSelector() {
    const selector = document.getElementById('districtSelector');
    if (!selector) return;
    selector.addEventListener('change', () => {
      const selected = selector.value;
      if (!selected) return;
      const basePath = selector.getAttribute('data-basepath') || '.';
      
      let targetPath = '';
      if (selected === 'hardoi') {
         targetPath = `${basePath}/index.html`;
      } else {
         targetPath = `${basePath}/${selected}/index.html`;
      }
      window.location.href = targetPath;
    });
  }


  async function fetchImpactStats() {
    try {
      let citizensCount = 1200;
      if (!sessionStorage.getItem('jaano_visited')) {
        sessionStorage.setItem('jaano_visited', 'true');
        const res = await fetch('https://countapi.mileshilliard.com/api/v1/hit/jaano_citizens_v1');
        const data = await res.json();
        citizensCount = data.value;
      } else {
        const res = await fetch('https://countapi.mileshilliard.com/api/v1/get/jaano_citizens_v1');
        const data = await res.json();
        citizensCount = data.value;
      }
      const complaintsRes = await fetch('https://countapi.mileshilliard.com/api/v1/get/jaano_complaints_v1');
      const complaintsData = await complaintsRes.json();
      
      const citizensEl = document.getElementById('stat-citizens');
      const complaintsEl = document.getElementById('stat-complaints');
      if (citizensEl) citizensEl.setAttribute('data-target', citizensCount);
      if (complaintsEl) complaintsEl.setAttribute('data-target', complaintsData.value);
    } catch (e) {
      console.warn("Counter API unavailable", e);
    }
  }

  function initImpactStats() {
    const statCards = document.querySelectorAll('.impact-stat-card__number');
    if (statCards.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.getAttribute('data-target'), 10) || 0;
          let startValue = 0;
          const duration = 2000;
          const frameRate = 30;
          const totalFrames = Math.round((duration / 1000) * frameRate);
          let frame = 0;
          
          const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentCount = Math.round(startValue + (endValue - startValue) * (1 - Math.pow(1 - progress, 3))); // easeOutCubic
            target.textContent = currentCount + "+";
            
            if (frame === totalFrames) {
              clearInterval(counter);
              target.textContent = endValue + "+";
            }
          }, 1000 / frameRate);
          
          observer.unobserve(target); // Only animate once
        }
      });
    }, { threshold: 0.5 });

    statCards.forEach(card => observer.observe(card));
  }

  function init() {
    setActiveNavLink();
    updateFooterYear();
    initSmoothScroll();
    initStickyHeader();
    initMobileNav();
    initDistrictSelector();
    initNewsTicker();
    initImpactStats();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

