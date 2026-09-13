/**
 * js/main.js — Shared UI Utilities
 * Mobile nav toggle, clipboard, toast notifications, shared init
 */

(function () {
  "use strict";



  // ── Active nav link ───────────────────────────────────────────────────
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

  // ── Toast notification ────────────────────────────────────────────────
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

  // ── Sticky header shadow on scroll ───────────────────────────────────
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

  // ── Init all ─────────────────────────────────────────────────────────

  // ── Dynamic News Ticker (with Offline Fallback) ────────────────────────
  async function initNewsTicker() {
    const tickerContent = document.querySelector('.notice-ticker__content');
    if (!tickerContent) return;

    // Save the built-in educational facts as fallback
    const fallbackHTML = tickerContent.innerHTML;

    try {
      // Free RSS to JSON API for UP Local News (Amar Ujala UP RSS)
      const rssUrl = encodeURIComponent('https://www.amarujala.com/rss/uttar-pradesh.xml');
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
      
      // Timeout fetch after 5 seconds so it doesn't hang forever
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        let newHtml = '';
        // Inject top 4 breaking news items
        const items = data.items.slice(0, 4);
        items.forEach(item => {
          let title = item.title.trim();
          newHtml += `<span><i data-lucide="zap" class="inline-icon" style="color:#eab308;"></i> <strong>ताज़ा खबर:</strong> ${title} <a href="${item.link}" target="_blank" rel="noopener noreferrer" style="color:var(--color-primary);text-decoration:underline;margin-left:4px;">पूरा पढ़ें</a></span>`;
        });
        
        tickerContent.innerHTML = newHtml;
        if (window.lucide) window.lucide.createIcons();
      } else {
        throw new Error('No news items found');
      }
    } catch (error) {
      console.warn("Live news fetch failed (offline or API down). Showing built-in civic facts.", error.message);
      tickerContent.innerHTML = fallbackHTML; // Fallback to safe local content
      if (window.lucide) window.lucide.createIcons();
    }
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
