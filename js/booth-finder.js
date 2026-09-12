/**
 * js/booth-finder.js — Ward-to-Booth Lookup
 * Loads data/booths.json and renders booth info on ward selection.
 */

(function () {
  "use strict";

  let boothsData = [];

  // ── Fetch booth data ──────────────────────────────────────────────────
  async function loadBooths() {
    try {
      const response = await fetch("data/booths.json");
      if (!response.ok) throw new Error("Network error");
      boothsData = await response.json();
      initBoothFinder();
    } catch (err) {
      console.error("Booth data load failed:", err);
      const container = document.getElementById("boothResult");
      if (container) {
        container.innerHTML = `<div class="error-card">
          <span class="error-icon">⚠️</span>
          <p>डेटा लोड करने में समस्या हुई। पृष्ठ रिफ्रेश करें।<br>
          <small>Data could not be loaded. Please refresh the page.</small></p>
        </div>`;
      }
    }
  }

  // ── Initialize dropdown & event listener ─────────────────────────────
  function initBoothFinder() {
    const select = document.getElementById("wardSelect");
    const btn = document.getElementById("findBoothBtn");
    if (!select) return;

    select.addEventListener("change", handleWardChange);
    if (btn) btn.addEventListener("click", handleWardChange);
  }

  // ── Handle ward selection ─────────────────────────────────────────────
  function handleWardChange() {
    const select = document.getElementById("wardSelect");
    const wardNum = parseInt(select.value, 10);
    const container = document.getElementById("boothResult");
    if (!container) return;

    if (!wardNum) {
      container.innerHTML = "";
      container.classList.remove("visible");
      return;
    }

    const entry = boothsData.find((b) => b.ward === wardNum);
    if (!entry) {
      container.innerHTML = `<div class="error-card">
        <span class="error-icon">⚠️</span>
        <p>वार्ड ${wardNum} का डेटा नहीं मिला।<br><small>No data found for Ward ${wardNum}.</small></p>
      </div>`;
      container.classList.add("visible");
      return;
    }

    container.innerHTML = renderBoothCard(entry);
    container.classList.add("visible");

    // Animate in
    requestAnimationFrame(() => {
      container.querySelector(".booth-card").classList.add("animate-in");
    });
  }

  // ── Render booth result card ──────────────────────────────────────────
  function renderBoothCard(entry) {
    return `
      <div class="booth-card" role="region" aria-label="Booth information for ward ${entry.ward}">
        <div class="booth-card__header">
          <div class="booth-card__badge">बूथ / Booth</div>
          <div class="booth-card__number">${entry.boothNumber}</div>
        </div>
        <div class="booth-card__body">
          <div class="booth-info-row">
            <span class="booth-info-icon">🏫</span>
            <div>
              <div class="booth-info-label">मतदान स्थल / Polling Station</div>
              <div class="booth-info-value">${entry.pollingStation}</div>
              <div class="booth-info-value-en">${entry.pollingStationEn}</div>
            </div>
          </div>
          <div class="booth-info-row">
            <span class="booth-info-icon">🚪</span>
            <div>
              <div class="booth-info-label">कक्ष / Room</div>
              <div class="booth-info-value">${entry.room}</div>
              <div class="booth-info-value-en">${entry.roomEn}</div>
            </div>
          </div>
          <div class="booth-info-row">
            <span class="booth-info-icon">👥</span>
            <div>
              <div class="booth-info-label">सम्बद्ध वार्ड / Associated Wards</div>
              <div class="booth-info-value">${entry.associatedWards}</div>
              <div class="booth-info-value-en">${entry.associatedWardsEn}</div>
            </div>
          </div>
        </div>
        <div class="booth-card__footer">
          <button class="btn btn--outline btn--sm" onclick="window.printBoothInfo('${entry.ward}', '${entry.boothNumber}', '${entry.room}', '${entry.pollingStation}')">
            🖨️ प्रिंट करें / Print
          </button>
        </div>
      </div>
    `;
  }

  // ── Print booth information ───────────────────────────────────────────
  window.printBoothInfo = function (ward, booth, room, station) {
    const win = window.open("", "_blank", "width=600,height=400");
    win.document.write(`
      <!DOCTYPE html><html lang="hi"><head>
      <meta charset="UTF-8">
      <title>बूथ जानकारी - वार्ड ${ward}</title>
      <style>
        body { font-family: 'Mukta', 'Mangal', sans-serif; padding: 32px; color: #111; }
        h1 { color: #065f46; font-size: 1.4rem; margin-bottom: 4px; }
        .sub { color: #555; font-size: 0.9rem; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 10px 12px; border-bottom: 1px solid #ddd; vertical-align: top; }
        td:first-child { font-weight: 700; width: 40%; color: #065f46; }
        .footer { margin-top: 24px; font-size: 0.8rem; color: #888; }
      </style>
      </head><body>
      <h1>ग्राम पंचायत 29-बड़ागांव</h1>
      <div class="sub">जिला: 113-हरदोई | विकास खण्ड: 19-बेंहदर</div>
      <table>
        <tr><td>आपका वार्ड</td><td>वार्ड ${ward}</td></tr>
        <tr><td>बूथ संख्या</td><td>${booth}</td></tr>
        <tr><td>कक्ष</td><td>${room}</td></tr>
        <tr><td>मतदान स्थल</td><td>${station}</td></tr>
      </table>
      <div class="footer">यह पर्ची 41-संविलियन विद्यालय बड़ागांव में मतदान के लिए है।</div>
      <script>window.onload = function() { window.print(); window.close(); }<\/script>
      </body></html>
    `);
    win.document.close();
  };

  // ── Init on DOM ready ─────────────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadBooths);
  } else {
    loadBooths();
  }
})();
