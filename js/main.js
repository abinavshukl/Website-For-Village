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

  // CORS-friendly Hindi RSS feeds (international/govt sources that allow proxying)
  const RSS_FEEDS = [
    'https://feeds.bbci.co.uk/hindi/rss.xml',                // BBC Hindi ✅ CORS-friendly
    'https://rss.dw.com/rdf/rss-hin-all',                    // Deutsche Welle Hindi ✅
    'https://hindi.thewire.in/feed/',                        // The Wire Hindi ✅
    'https://www.indiatimes.com/topics/uttar-pradesh/feed',  // India Times UP ✅
  ];

  // CORS proxies — allorigins first (returns JSON), raw as fallback
  const CORS_PROXIES = [
    (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  ];

  function parseRSSXML(xmlText) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'text/xml');
      const items = Array.from(doc.querySelectorAll('item')).slice(0, 6);
      return items.map(item => ({
        icon: 'zap',
        label: 'ताज़ा खबर',
        text: (item.querySelector('title')?.textContent || '').replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
        link: item.querySelector('link')?.textContent?.trim() || '',
      })).filter(item => item.text.length > 5);
    } catch (e) {
      return null;
    }
  }

  async function fetchNewsFromSources() {
    for (const feed of RSS_FEEDS) {
      for (const proxyFn of CORS_PROXIES) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000);
          const proxyUrl = proxyFn(feed);
          const response = await fetch(proxyUrl, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (!response.ok) continue;

          // allorigins wraps content in {contents: "..."}, corsproxy returns raw
          let xmlText;
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('json')) {
            const json = await response.json();
            xmlText = json.contents || json.data || '';
          } else {
            xmlText = await response.text();
          }

          if (!xmlText) continue;
          const items = parseRSSXML(xmlText);
          if (items && items.length > 0) {
            console.log(`✅ News loaded from: ${feed} via proxy`);
            return items;
          }
        } catch (e) {
          console.warn(`❌ Failed: ${feed}`, e.message);
        }
      }
    }
    return null; // All sources failed
  }

  let tickerItems = [];

  function buildTickerSpan(item) {
    const linkHtml = item.link
      ? ` <a href="${item.link}" target="_blank" rel="noopener noreferrer" style="color:#93c5fd;text-decoration:underline;margin-left:4px;">${item.link.startsWith('http') ? 'पूरा पढ़ें' : 'यहाँ देखें'}</a>`
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

    // Fetch live news in background
    const liveNews = await fetchNewsFromSources();
    if (liveNews && liveNews.length > 0) {
      tickerItems = [...liveNews];
      renderMarquee(); // Swap to live news only
      console.log(`✅ Showing ${liveNews.length} live news headlines.`);
    } else {
      console.warn('⚠️ API unavailable. Showing civic facts as fallback.');
    }

    // Auto-refresh every 30 minutes
    setInterval(async () => {
      const freshNews = await fetchNewsFromSources();
      if (freshNews && freshNews.length > 0) {
        tickerItems = [...freshNews];
        renderMarquee();
      }
    }, 30 * 60 * 1000);
  }

  function init() {
    setActiveNavLink();
    updateFooterYear();
    initSmoothScroll();
    initStickyHeader();
    initMobileNav();
    initNewsTicker();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

