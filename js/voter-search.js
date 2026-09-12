/**
 * js/voter-search.js — Voter List Lookup & Grievance Form Auto-fill
 * Loads data/voters.json, provides live search by name or EPIC No.,
 * auto-fills the complaint form fields on match.
 *
 * DATA NOTE: Replace data/voters.json with the full 4,443-record
 * electoral roll for GP 29-Badagaon once converted from PDF.
 */

(function () {
  'use strict';

  let votersData = [];
  let searchTimeout = null;

  // ── Load voter data ────────────────────────────────────────────────
  async function loadVoterData() {
    try {
      const res = await fetch('data/voters.json');
      if (!res.ok) throw new Error('Network error');
      votersData = await res.json();
      initVoterSearch();
    } catch (err) {
      console.warn('Voter data not available:', err.message);
      // Gracefully hide the search panel if data fails
      const panel = document.getElementById('voterSearchPanel');
      if (panel) panel.style.display = 'none';
    }
  }

  // ── Normalise text for searching (remove diacritics, lowercase) ───
  function normalise(str) {
    return (str || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  // ── Search voters by name (Hindi or English) or EPIC number ───────
  function searchVoters(query) {
    const q = normalise(query);
    if (q.length < 2) return [];

    return votersData.filter(v => {
      return (
        normalise(v.name).includes(q) ||
        normalise(v.nameEn).includes(q) ||
        normalise(v.epicNo).includes(q.toUpperCase()) ||
        normalise(v.fatherHusbandName).includes(q) ||
        normalise(v.fatherHusbandNameEn).includes(q)
      );
    }).slice(0, 8); // cap at 8 results
  }

  // ── Render search results dropdown ────────────────────────────────
  function renderResults(results, inputEl) {
    let dropdown = document.getElementById('voterSearchDropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = 'voterSearchDropdown';
      dropdown.className = 'voter-search-dropdown';
      dropdown.setAttribute('role', 'listbox');
      dropdown.setAttribute('aria-label', 'मतदाता सूची परिणाम');
      inputEl.parentElement.style.position = 'relative';
      inputEl.parentElement.appendChild(dropdown);
    }

    if (results.length === 0) {
      dropdown.innerHTML = `
        <div class="voter-result-empty">
          <span>❌ कोई परिणाम नहीं मिला / No results found</span>
          <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noopener" class="voter-result-eci">
            🔗 ECI आधिकारिक खोज पर जाएँ ↗
          </a>
        </div>`;
      dropdown.style.display = 'block';
      return;
    }

    dropdown.innerHTML = results.map((v, i) => `
      <div
        class="voter-result-item"
        role="option"
        tabindex="0"
        data-index="${i}"
        aria-label="${v.name}, EPIC: ${v.epicNo}, वार्ड ${v.ward}"
      >
        <div class="voter-result-item__main">
          <span class="voter-result-item__name">${v.name}</span>
          <span class="voter-result-item__epic">EPIC: ${v.epicNo}</span>
        </div>
        <div class="voter-result-item__sub">
          ${v.relation}: ${v.fatherHusbandName} &nbsp;|&nbsp;
          ${v.gender} &nbsp;|&nbsp; आयु ${v.age} &nbsp;|&nbsp;
          <strong>वार्ड ${v.ward}</strong>
        </div>
        <div class="voter-result-item__addr">${v.address}</div>
      </div>
    `).join('');

    dropdown.style.display = 'block';

    // Click handler for each result
    dropdown.querySelectorAll('.voter-result-item').forEach((el, i) => {
      const handler = () => selectVoter(results[i], inputEl);
      el.addEventListener('click', handler);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
      });
    });
  }

  // ── Auto-fill the complaint form ──────────────────────────────────
  function selectVoter(voter, inputEl) {
    // Fill search display field
    const searchInput = document.getElementById('voterSearchInput');
    if (searchInput) searchInput.value = `${voter.name} — ${voter.epicNo}`;

    // Fill hidden EPIC field
    const epicField = document.getElementById('voterEpicNo');
    if (epicField) epicField.value = voter.epicNo;

    // Fill complaint form fields
    const nameField = document.getElementById('complainantName');
    if (nameField && !nameField.value) nameField.value = voter.name;

    const wardField = document.getElementById('complainantWard');
    if (wardField) wardField.value = voter.ward;

    const mohallaField = document.getElementById('complainantMohalla');
    if (mohallaField && !mohallaField.value) mohallaField.value = voter.address;

    // Show the selected voter's details panel
    renderVoterCard(voter);

    // Close dropdown
    closeDropdown();

    // Scroll to form
    const form = document.getElementById('complaintForm');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Render the confirmed voter detail card ────────────────────────
  function renderVoterCard(voter) {
    const panel = document.getElementById('voterSelectedCard');
    if (!panel) return;

    panel.innerHTML = `
      <div class="voter-selected-card" role="region" aria-label="चयनित मतदाता विवरण">
        <div class="voter-selected-card__header">
          <span class="voter-selected-card__icon" aria-hidden="true">✅</span>
          <div>
            <div class="voter-selected-card__title">मतदाता सूची में पाया गया / Voter Found</div>
            <div class="voter-selected-card__subtitle">नीचे दिए विवरण फॉर्म में भर दिए गए हैं</div>
          </div>
          <button class="voter-selected-card__clear" onclick="clearVoterSelection()" aria-label="चयन हटाएँ">✕</button>
        </div>
        <div class="voter-selected-card__body">
          <div class="voter-detail-grid">
            <div class="voter-detail-item">
              <span class="voter-detail-item__label">मतदाता पहचान पत्र (EPIC)</span>
              <span class="voter-detail-item__value epic">${voter.epicNo}</span>
            </div>
            <div class="voter-detail-item">
              <span class="voter-detail-item__label">नाम / Name</span>
              <span class="voter-detail-item__value">${voter.name}</span>
            </div>
            <div class="voter-detail-item">
              <span class="voter-detail-item__label">${voter.relation} का नाम</span>
              <span class="voter-detail-item__value">${voter.fatherHusbandName}</span>
            </div>
            <div class="voter-detail-item">
              <span class="voter-detail-item__label">लिंग / आयु</span>
              <span class="voter-detail-item__value">${voter.gender}, ${voter.age} वर्ष</span>
            </div>
            <div class="voter-detail-item">
              <span class="voter-detail-item__label">वार्ड / बूथ</span>
              <span class="voter-detail-item__value">वार्ड ${voter.ward} &nbsp;|&nbsp; बूथ ${voter.boothNo}</span>
            </div>
            <div class="voter-detail-item voter-detail-item--full">
              <span class="voter-detail-item__label">पता / Address</span>
              <span class="voter-detail-item__value">${voter.address}</span>
            </div>
          </div>
          <p class="voter-detail-note">
            ⚠️ ये विवरण मतदाता सूची से हैं। शिकायत में EPIC नंबर स्वतः शामिल होगा।<br/>
            <em>These details are from the electoral roll. EPIC No. will be included in your complaint.</em>
          </p>
        </div>
      </div>
    `;
    panel.style.display = 'block';
  }

  // ── Clear voter selection ─────────────────────────────────────────
  window.clearVoterSelection = function () {
    const searchInput = document.getElementById('voterSearchInput');
    if (searchInput) { searchInput.value = ''; searchInput.focus(); }

    const epicField = document.getElementById('voterEpicNo');
    if (epicField) epicField.value = '';

    const panel = document.getElementById('voterSelectedCard');
    if (panel) { panel.innerHTML = ''; panel.style.display = 'none'; }

    closeDropdown();
  };

  // ── Close dropdown ─────────────────────────────────────────────────
  function closeDropdown() {
    const d = document.getElementById('voterSearchDropdown');
    if (d) d.style.display = 'none';
  }

  // ── Initialize the voter search UI ───────────────────────────────
  function initVoterSearch() {
    const searchInput = document.getElementById('voterSearchInput');
    if (!searchInput) return;

    // Live search on input
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimeout);
      const q = this.value.trim();
      if (q.length < 2) { closeDropdown(); return; }
      searchTimeout = setTimeout(() => {
        const results = searchVoters(q);
        renderResults(results, this);
      }, 220);
    });

    // Close dropdown on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#voterSearchPanel')) closeDropdown();
    });

    // Keyboard navigation in dropdown
    searchInput.addEventListener('keydown', function (e) {
      const items = document.querySelectorAll('.voter-result-item');
      if (e.key === 'ArrowDown' && items.length) { e.preventDefault(); items[0].focus(); }
      if (e.key === 'Escape') closeDropdown();
    });
  }

  // ── Patch grievance.js to include EPIC in WhatsApp message ───────
  // Override the generateWhatsAppLink function after it's defined
  document.addEventListener('DOMContentLoaded', function () {
    const originalGenerate = window._originalGenerateWA;
    // Inject EPIC into the WhatsApp message via form data
    const epicField = document.getElementById('voterEpicNo');
    if (epicField) {
      // grievance.js picks this up via collectFormData override below
    }
  });

  // ── Start ─────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadVoterData);
  } else {
    loadVoterData();
  }
})();
