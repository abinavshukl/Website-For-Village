(function () {
  "use strict";

  async function loadVoters() {
    try {
      const res = await fetch("data/voters.json");
      if (!res.ok) throw new Error("Network response was not ok");
      return await res.json();
    } catch (error) {
      console.error("Error fetching voters:", error);
      return [];
    }
  }

  function hindiToLatin(str) {
    if (!str) return "";
    const map = {
      'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
      'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh',
      'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
      'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm', 'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
      'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
      'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
      'ं': 'n', 'ँ': 'n', 'ृ': 'ri', '्': ''
    };
    let res = "";
    for (let i = 0; i < str.length; i++) {
      res += map[str[i]] || str[i];
    }
    return res.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  }

  window.copyEpic = function(epic) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(epic).then(() => {
        if (window.showToast) window.showToast("EPIC नंबर कॉपी हो गया! (Copied)");
      });
    } else {
      // Fallback if clipboard API not supported
      const tempInput = document.createElement("input");
      tempInput.value = epic;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      if (window.showToast) window.showToast("EPIC नंबर कॉपी हो गया! (Copied)");
    }
  };

  function renderVoter(voter) {
    const epicNo = voter.epicNo || voter.voterId || 'No EPIC';
    const serialNo = voter.serialNo || 'N/A';
    const name = voter.nameHindi || voter.name || 'Unknown';
    const guardian = voter.guardianHindi || voter.fatherHusbandName || 'Unknown';
    
    const nameEng = voter.nameEnglish || voter.nameEn || '';
    const guardianEng = voter.guardianEnglish || voter.fatherHusbandNameEn || '';
    
    const nameHtml = nameEng ? `${name} <br/><small style="color:#e5e7eb;font-weight:400;">${nameEng}</small>` : name;
    const guardianHtml = guardianEng ? `${guardian} <span style="color:#6b7280;font-size:0.8rem;font-weight:400;">(${guardianEng})</span>` : guardian;

    return `
      <div class="booth-card animate-in" style="margin-bottom:12px;text-align:left;">
        <div class="booth-card__header" style="padding:12px;display:flex;flex-direction:column;align-items:flex-start;">
          <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
            <div class="booth-card__badge" onclick="copyEpic('${epicNo}')" style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.25);padding:4px 10px;border-radius:6px;cursor:pointer;transition:background 0.2s;" title="Click to copy">
              <span>EPIC: ${epicNo}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </div>
            <div style="font-size:0.8rem;color:rgba(255,255,255,0.9);font-weight:600;">क्र.सं: ${serialNo}</div>
          </div>
          <div style="color:#fff;font-weight:700;font-size:1.1rem;margin-top:8px;">${nameHtml}</div>
        </div>
        <div class="booth-card__body" style="padding:12px;background:#fff;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;border-top:none;">
          <div style="font-size:0.88rem;margin-bottom:6px;"><strong>पिता/पति:</strong> ${guardianHtml}</div>
          <div style="font-size:0.88rem;margin-bottom:6px;"><strong>आयु:</strong> ${voter.age || 'N/A'} | <strong>लिंग:</strong> ${voter.gender || 'N/A'}</div>
          <div style="font-size:0.88rem;margin-bottom:6px;"><strong>मकान नं:</strong> ${voter.houseNo || 'N/A'} | <strong>वार्ड:</strong> ${voter.wardName || 'N/A'}</div>
          <div style="font-size:0.88rem;color:#047857;font-weight:600;"><strong>बूथ:</strong> ${voter.boothName || 'N/A'}</div>
          <hr style="margin:10px 0 8px 0;border:none;border-top:1px dashed #e5e7eb;" />
          <div style="text-align:right;">
             <a href="https://electoralsearch.eci.gov.in/" target="_blank" rel="noopener noreferrer" class="btn btn--outline" style="padding:4px 10px;font-size:0.8rem;display:inline-block;color:var(--color-primary);border-color:var(--color-primary);">
               🌐 NVSP पर क्रॉस-चेक करें
             </a>
          </div>
        </div>
      </div>
    `;
  }

  async function initVoterSearch() {
    const searchBtn = document.getElementById("findVoterBtn");
    const searchInput = document.getElementById("voterSearchInput");
    const resultDiv = document.getElementById("voterResult");

    if (!searchBtn || !searchInput || !resultDiv) return;

    let votersData = null;

    searchBtn.addEventListener("click", async () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        resultDiv.innerHTML = `<div class="error-card"><span class="error-icon">⚠️</span> कृपया नाम या EPIC नंबर दर्ज करें।</div>`;
        return;
      }

      resultDiv.innerHTML = `<div style="text-align:center;padding:12px;color:gray;">खोज रहा है... (Searching...)</div>`;

      if (!votersData) {
        votersData = await loadVoters();
      }

      // If query is fully english characters, clean it
      const isEnglishQuery = /^[a-z0-9\s]+$/.test(query);
      const cleanQuery = isEnglishQuery ? query.replace(/[^a-z0-9\s]/g, '') : query;
      
      const stopWords = ['son', 'of', 'wife', 'daughter', 'so', 'wo', 'do', 's/o', 'w/o', 'd/o', 'and', 'urff', 'urf', 'alias'];
      const queryWords = cleanQuery.split(' ').filter(w => w.length > 0 && !stopWords.includes(w));

      const results = votersData.filter(v => {
        const epic = v.epicNo || v.voterId || "";
        if (epic.toLowerCase().includes(cleanQuery)) return true;
        
        const nameHi = v.nameHindi || v.name || "";
        const guardianHi = v.guardianHindi || v.fatherHusbandName || "";
        const searchableHi = nameHi + " " + guardianHi;
        
        const nameEn = (v.nameEnglish || v.nameEn || "").toLowerCase();
        const guardianEn = (v.guardianEnglish || v.fatherHusbandNameEn || "").toLowerCase();
        const searchableEn = nameEn + " " + guardianEn;
        
        // Match word by word to handle transliteration edge cases (e.g. Abhinava Kumara matching abhinav kumar)
        const matchHi = queryWords.every(word => searchableHi.includes(word));
        if (matchHi) return true;
        
        if (isEnglishQuery) {
          const matchEn = queryWords.every(word => searchableEn.includes(word));
          if (matchEn) return true;
        }
        
        return false;
      });

      if (results.length === 0) {
        resultDiv.innerHTML = `<div class="error-card"><span class="error-icon">❌</span> कोई परिणाम नहीं मिला। (No results found.)</div>`;
        return;
      }

      // Limit to first 20 results
      const displayedResults = results.slice(0, 20);
      let html = displayedResults.map(renderVoter).join("");
      
      if (results.length > 20) {
        html += `<div style="text-align:center;padding:12px;font-size:0.85rem;color:gray;background:#f9fafb;border-radius:4px;">${results.length - 20} अधिक परिणाम... कृपया अधिक सटीक नाम दर्ज करें।</div>`;
      }

      resultDiv.innerHTML = html;
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchBtn.click();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initVoterSearch);
  } else {
    initVoterSearch();
  }
})();
