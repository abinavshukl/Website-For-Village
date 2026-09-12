/**
 * js/grievance.js — Complaint Form Handler
 * WhatsApp primary dispatch + Web3Forms email fallback
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
    if (!data.name.trim()) errors.push("नाम अनिवार्य है। / Name is required.");
    if (!/^[6-9]\d{9}$/.test(data.phone)) errors.push("वैध 10 अंकों का मोबाइल नंबर दर्ज करें।");
    if (!data.ward) errors.push("वार्ड चुनें। / Select Ward.");
    if (!data.category) errors.push("समस्या श्रेणी चुनें। / Select issue category.");
    if (data.description.trim().length < 20)
      errors.push("समस्या विवरण कम से कम 20 अक्षरों में लिखें।");
    return errors;
  }

  // ── Show inline validation error ─────────────────────────────────────
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

  // ── Generate WhatsApp message ─────────────────────────────────────────
  function generateWhatsAppLink(data) {
    const categoryLabel = CONFIG.ISSUE_CATEGORIES.find(
      (c) => c.value === data.category
    )?.label || data.category;

    const epicLine = data.epicNo ? `\n🗳️ *मतदाता EPIC:* ${data.epicNo}` : '';

    const text = [
      `🙏 *ग्राम शिकायत — बड़ागांव*`,
      `━━━━━━━━━━━━━━━━━━`,
      `👤 *नाम:* ${data.name}${epicLine}`,
      `📱 *मोबाइल:* ${data.phone}`,
      `🏘️ *वार्ड:* ${data.ward}`,
      `🏠 *मोहल्ला / मकान नं०:* ${data.mohalla || "अनिर्दिष्ट"}`,
      `📋 *समस्या श्रेणी:* ${categoryLabel}`,
      ``,
      `📝 *विवरण:*`,
      data.description,
      `━━━━━━━━━━━━━━━━━━`,
      `🗓️ दिनांक: ${new Date().toLocaleDateString("hi-IN", { day: "2-digit", month: "long", year: "numeric" })}`,
      `🌐 ग्राम पंचायत 29-बड़ागांव, विकास खण्ड 19-बेंहदर, जिला 113-हरदोई`
    ].join("\n");

    const encoded = encodeURIComponent(text);
    const number = (typeof CONFIG !== "undefined") ? CONFIG.WHATSAPP_NUMBER : "91XXXXXXXXXX";
    return `https://wa.me/${number}?text=${encoded}`;
  }

  // ── Submit to Web3Forms (email fallback) ──────────────────────────────
  async function submitToApi(data) {
    if (typeof CONFIG === "undefined" || CONFIG.WEB3FORMS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {
      console.warn("Web3Forms key not configured. Skipping API submission.");
      return;
    }

    const categoryLabel = CONFIG.ISSUE_CATEGORIES.find(
      (c) => c.value === data.category
    )?.label || data.category;

    const payload = {
      access_key: CONFIG.WEB3FORMS_KEY,
      subject: `ग्राम शिकायत | वार्ड ${data.ward} | ${categoryLabel} | ${data.name}`,
      name: data.name,
      phone: data.phone,
      ward: data.ward,
      mohalla: data.mohalla,
      category: categoryLabel,
      message: data.epicNo ? `मतदाता EPIC: ${data.epicNo}\n\n${data.description}` : data.description,
      epic_no: data.epicNo || "",
      from_name: "GP Badagaon Portal"
    };

    try {
      const response = await fetch(CONFIG.WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
    } catch (err) {
      console.error("Web3Forms submission failed:", err);
    }
  }

  // ── Copy grievance as draft text ──────────────────────────────────────
  function generateDraftText(data) {
    const categoryLabel = CONFIG.ISSUE_CATEGORIES.find(
      (c) => c.value === data.category
    )?.label || data.category;

    const epicLine = data.epicNo
      ? `\nमतदाता पहचान पत्र (EPIC): ${data.epicNo}`
      : '';

    return `सेवा में,
श्रीमान पंचायत सचिव जी,
ग्राम पंचायत 29-बड़ागांव, विकास खण्ड 19-बेंहदर, जिला 113-हरदोई

विषय: ${categoryLabel} से संबंधित शिकायत

महोदय,
मेरा नाम ${data.name} है।${epicLine}
मैं वार्ड ${data.ward}, मोहल्ला ${data.mohalla || "———"}, ग्राम बड़ागांव का/की निवासी हूँ।

समस्या: ${data.description}

अतः आपसे विनम्र निवेदन है कि उक्त समस्या का शीघ्र निराकरण कराने की कृपा करें।

दिनांक: ${new Date().toLocaleDateString("hi-IN", { day: "2-digit", month: "long", year: "numeric" })}
मोबाइल: ${data.phone}

आपका/आपकी
${data.name}`;
  }

  // ── Main form handler ─────────────────────────────────────────────────
  function initGrievanceForm() {
    const form = document.getElementById("complaintForm");
    const copyDraftBtn = document.getElementById("copyDraftBtn");
    const submitBtn = document.getElementById("grievanceSubmitBtn");

    if (!form) return;

    // Copy draft button
    if (copyDraftBtn) {
      copyDraftBtn.addEventListener("click", function () {
        const data = collectFormData();
        const draft = generateDraftText(data);
        if (typeof window.copyToClipboard === "function") {
          window.copyToClipboard(draft);
        }
      });
    }

    // Form submit
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearFieldErrors();

      const data = collectFormData();
      const errors = validateForm(data);

      if (errors.length > 0) {
        highlightErrors(data);
        const errorBox = document.getElementById("formErrorBox");
        if (errorBox) {
          errorBox.innerHTML = errors.map((err) => `<li>${err}</li>`).join("");
          errorBox.style.display = "block";
        }
        return;
      }

      const errorBox = document.getElementById("formErrorBox");
      if (errorBox) errorBox.style.display = "none";

      // Update submit button state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "भेज रहे हैं… / Sending…";
      }

      // Fire API in background (don't await — WhatsApp redirect is primary)
      submitToApi(data).catch(console.error);

      // Primary: WhatsApp redirect
      const waLink = generateWhatsAppLink(data);
      window.open(waLink, "_blank");

      // Reset form
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "WhatsApp पर भेजें / Send via WhatsApp";
      }

      // Show success toast
      if (typeof window.showToast === "function") {
        window.showToast("शिकायत WhatsApp पर भेजी गई! ✅");
      }
    });
  }

  function collectFormData() {
    return {
      name:        (document.getElementById('complainantName')?.value  || '').trim(),
      phone:       (document.getElementById('complainantPhone')?.value || '').trim(),
      ward:        document.getElementById('complainantWard')?.value   || '',
      mohalla:     (document.getElementById('complainantMohalla')?.value || '').trim(),
      category:    document.getElementById('issueCategory')?.value     || '',
      description: (document.getElementById('issueDescription')?.value || '').trim(),
      epicNo:      (document.getElementById('voterEpicNo')?.value      || '').trim()  // from voter-search.js
    };
  }


  function highlightErrors(data) {
    if (!data.name) showFieldError("complainantName", "नाम अनिवार्य है।");
    if (!/^[6-9]\d{9}$/.test(data.phone)) showFieldError("complainantPhone", "वैध मोबाइल नंबर दर्ज करें।");
    if (!data.ward) showFieldError("complainantWard", "वार्ड चुनें।");
    if (!data.category) showFieldError("issueCategory", "समस्या श्रेणी चुनें।");
    if (data.description.length < 20) showFieldError("issueDescription", "कम से कम 20 अक्षरों में लिखें।");
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
