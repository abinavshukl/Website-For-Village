/**
 * Voter search deliberately does not search a local voter file. It opens the
 * official UP State Election Commission Panchayat search instead.
 *
 * HTML contract in index.html:
 * #findVoterBtn and #voterResult.
 */
(function () {
  "use strict";

  const SEC_VOTER_SEARCH_URL = "https://sec.up.nic.in/site/PRIVoters.aspx";

  function initVoterSearch() {
    const searchBtn = document.getElementById("findVoterBtn");
    const resultDiv = document.getElementById("voterResult");

    if (!searchBtn || !resultDiv) return;

    searchBtn.addEventListener("click", () => {
      // The SEC form requires location dropdowns and a captcha, so its
      // cross-origin ASP.NET form cannot be submitted by this static site.
      resultDiv.innerHTML = `
        <div class="booth-card animate-in" style="margin-bottom:12px;text-align:left;border:1px solid #10b981;">
          <div class="booth-card__header" style="padding:12px;background:#10b981;color:#fff;border-radius:8px 8px 0 0;">
            <div style="font-weight:700;font-size:1.1rem;display:flex;align-items:center;gap:8px;">
              <i data-lucide="external-link" class="inline-icon"></i> आधिकारिक पंचायत मतदाता खोज
            </div>
          </div>
          <div class="booth-card__body" style="padding:16px;background:#fff;border-radius:0 0 8px 8px;">
            <p style="margin:0 0 12px 0;font-size:0.9rem;color:#374151;line-height:1.6;">
              अगले सरकारी पेज पर <strong>हरदोई → बेंहदर → बड़ागांव</strong> चुनें। अपना नाम, पिता / पति का नाम और captcha वहीं भरें।
              यह वेबसाइट आपकी व्यक्तिगत जानकारी नहीं मांगती या सहेजती नहीं है।
            </p>
            <a href="${SEC_VOTER_SEARCH_URL}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--full" style="justify-content:center;">
              SEC पंचायत मतदाता खोज खोलें ↗
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
      window.open(SEC_VOTER_SEARCH_URL, "_blank", "noopener,noreferrer");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVoterSearch);
  } else {
    initVoterSearch();
  }
})();
