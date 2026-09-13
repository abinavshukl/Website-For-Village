/**
 * js/grievance.js — Jansunwai (IGRS 1076) Pre-Drafter
 * Purely client-side logic (Zero Data Liability / DPDPA 2023 Compliant)
 */

(function () {
  "use strict";

  // ── Populate issue categories from CONFIG ────────────────────────────
  function populateCategoryDropdown() {
    const select = document.getElementById("issueCategory");
    if (!select || typeof CONFIG === "undefined") return;

    CONFIG.ISSUE_CATEGORIES.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.value;
      option.textContent = cat.label;
      select.appendChild(option);
    });
  }

  // ── Validate form fields ─────────────────────────────────────────────
  function validateForm(data) {
    const errors = [];
    if (!data.name.trim()) errors.push("शिकायतकर्ता का नाम अनिवार्य है।");
    if (!data.guardian.trim()) errors.push("पिता/पति का नाम अनिवार्य है।");
    if (!/^[6-9]\d{9}$/.test(data.phone)) errors.push("वैध 10 अंकों का मोबाइल नंबर दर्ज करें।");
    if (!data.category) errors.push("शिकायत का विभाग चुनें।");
    if (data.description.trim().length < 20)
      errors.push("समस्या विवरण कम से कम 20 अक्षरों में लिखें।");
    return errors;
  }

  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.add("field--error");
    let errEl = field.parentElement.querySelector(".field-error-msg");
    if (!errEl) {
      errEl = document.createElement("span");
      errEl.className = "field-error-msg";
      field.parentElement.appendChild(errEl);
    }
    errEl.textContent = message;
  }

  function clearFieldErrors() {
    document.querySelectorAll(".field--error").forEach((el) => el.classList.remove("field--error"));
    document.querySelectorAll(".field-error-msg").forEach((el) => el.remove());
  }

  function highlightErrors(data) {
    if (!data.name.trim()) showFieldError("complainantName", "नाम अनिवार्य है।");
    if (!data.guardian.trim()) showFieldError("complainantGuardian", "पिता/पति का नाम अनिवार्य है।");
    if (!/^[6-9]\d{9}$/.test(data.phone)) showFieldError("complainantPhone", "वैध 10 अंकों का मोबाइल नंबर दर्ज करें।");
    if (!data.category) showFieldError("issueCategory", "विभाग चुनें।");
    if (data.description.trim().length < 20) showFieldError("issueDescription", "कम से कम 20 अक्षरों में लिखें।");
  }

  function collectFormData() {
    return {
      name:        (document.getElementById('complainantName')?.value  || '').trim(),
      guardian:    (document.getElementById('complainantGuardian')?.value || '').trim(),
      phone:       (document.getElementById('complainantPhone')?.value || '').trim(),
      epicNo:      (document.getElementById('voterEpicNo')?.value      || '').trim(),
      referenceNo: (document.getElementById('referenceNo')?.value      || '').trim(),
      category:    document.getElementById('issueCategory')?.value     || '',
      description: (document.getElementById('issueDescription')?.value || '').trim(),
    };
  }

  // ── Generate Jansunwai Text ──────────────────────────────────────────
  function getCategoryLabel(categoryValue) {
    if (typeof CONFIG === "undefined") return categoryValue;
    const catConfig = CONFIG.ISSUE_CATEGORIES.find((c) => c.value === categoryValue);
    return catConfig ? catConfig.label : categoryValue;
  }

  function generateJansunwaiDraft(data) {
    const categoryLabel = getCategoryLabel(data.category);
    
    let draft = `विभाग: ${categoryLabel}\n`;
    
    if (data.referenceNo) {
      draft += `पूर्व संदर्भ संख्या: ${data.referenceNo}\n`;
    }
    
    draft += `\nशिकायतकर्ता का विवरण:\n`;
    draft += `नाम: ${data.name}\n`;
    draft += `पिता/पति का नाम: ${data.guardian}\n`;
    draft += `मोबाइल नंबर: ${data.phone}\n`;
    
    if (data.epicNo) {
      draft += `मतदाता पहचान पत्र (EPIC): ${data.epicNo}\n`;
    }

    draft += `\nप्रशासनिक क्षेत्र:\n`;
    draft += `ग्राम पंचायत: 29-बड़ागांव\n`;
    draft += `विकास खण्ड: 19-बेंहदर\n`;
    draft += `तहसील: संडीला\n`;
    draft += `जनपद: 113-हरदोई\n`;

    draft += `\nशिकायत का तथ्यात्मक विवरण:\n`;
    draft += `${data.description}\n`;

    return draft;
  }

  // ── Main handler ──────────────────────────────────────────────────────
  function initGrievanceForm() {
    const btnGenerate = document.getElementById("generateDraftBtn");
    const btnCopy = document.getElementById("copyDraftBtnInner");
    const outputBox = document.getElementById("draftOutputBox");
    const outputText = document.getElementById("draftOutputText");
    const jansunwaiActions = document.getElementById("jansunwaiActions");
    const errorBox = document.getElementById("formErrorBox");

    if (btnGenerate) {
      btnGenerate.addEventListener("click", function () {
        clearFieldErrors();
        const data = collectFormData();
        const errors = validateForm(data);

        if (errors.length > 0) {
          highlightErrors(data);
          if (errorBox) {
            errorBox.innerHTML = errors.map((err) => `<li>${err}</li>`).join("");
            errorBox.style.display = "block";
          }
          // Hide outputs if error
          if (outputBox) outputBox.style.display = "none";
          if (jansunwaiActions) jansunwaiActions.style.display = "none";
          return;
        }

        if (errorBox) errorBox.style.display = "none";

        const draft = generateJansunwaiDraft(data);
        if (outputText) {
          outputText.value = draft;
        }

        if (outputBox) outputBox.style.display = "block";
        if (jansunwaiActions) jansunwaiActions.style.display = "flex";
        
        // Hide the generate button to make room for actions
        btnGenerate.style.display = "none";

        if (typeof window.showToast === "function") {
          window.showToast("मसौदा तैयार है! इसे कॉपी करके जनसुनवाई पोर्टल पर पेस्ट करें।");
        }
      });
    }

    if (btnCopy && outputText) {
      btnCopy.addEventListener("click", function () {
        outputText.select();
        outputText.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(outputText.value).then(() => {
          if (typeof window.showToast === "function") {
            window.showToast("मसौदा कॉपी हो गया! ✅");
          }
        }).catch(err => {
          console.error("Failed to copy:", err);
          if (typeof window.copyToClipboard === "function") {
            window.copyToClipboard(outputText.value);
          }
        });
      });
    }
  }

  // ── Init on DOM ready ─────────────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      populateCategoryDropdown();
      initGrievanceForm();
    });
  } else {
    populateCategoryDropdown();
    initGrievanceForm();
  }
})();
