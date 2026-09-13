/**
 * Voter search deliberately does not search a local voter file. The input is
 * only a trigger for the privacy explanation and the official ECI redirect.
 * This keeps names and EPIC searches out of this static site.
 *
 * HTML contract in index.html:
 * #findVoterBtn, #voterSearchInput, and #voterResult.
 */
(function () {
  "use strict";

  function initVoterSearch() {
    const searchBtn = document.getElementById("findVoterBtn");
    const searchInput = document.getElementById("voterSearchInput");
    const resultDiv = document.getElementById("voterResult");

    if (!searchBtn || !resultDiv) return;

    searchBtn.addEventListener("click", () => {
      // Show the explanation before opening the external site. Users with
      // popup blocking still receive a usable link in this message.
      resultDiv.innerHTML = `
        <div class="booth-card animate-in" style="margin-bottom:12px;text-align:left;border:1px solid #10b981;">
          <div class="booth-card__header" style="padding:12px;background:#10b981;color:#fff;border-radius:8px 8px 0 0;">
            <div style="font-weight:700;font-size:1.1rem;display:flex;align-items:center;gap:8px;">
              <i data-lucide="shield-check" class="inline-icon"></i> नागरिक गोपनीयता सुरक्षित
            </div>
          </div>
          <div class="booth-card__body" style="padding:16px;background:#fff;border-radius:0 0 8px 8px;">
            <p style="margin:0 0 12px 0;font-size:0.9rem;color:#374151;line-height:1.6;">
              नागरिकों की निजता (Privacy) की सुरक्षा के लिए, इस वेबसाइट से स्थानीय मतदाता सूची हटा दी गई है। 
              अब आप सीधे भारत निर्वाचन आयोग (ECI) के आधिकारिक और सुरक्षित पोर्टल पर अपना नाम खोज सकते हैं।
            </p>
            <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--full" style="justify-content:center;">
              आधिकारिक NVSP पोर्टल पर जाएँ ↗
            </a>
          </div>
        </div>
      `;

      // The result card was inserted with innerHTML, so initialize its icon
      // placeholder again after the new markup enters the DOM.
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      // Open from the click handler to preserve the browser's user gesture.
      // The official portal handles the actual search and its own privacy terms.
      window.open("https://electoralsearch.eci.gov.in/", "_blank", "noopener,noreferrer");
    });

    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          searchBtn.click();
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVoterSearch);
  } else {
    initVoterSearch();
  }
})();
