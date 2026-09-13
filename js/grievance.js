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
    if (!data.guardian) errors.push("पिता/पति का नाम अनिवार्य है। / Guardian name required.");
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

  // ── Generate Links ─────────────────────────────────────────
  function getCategoryConfig(categoryValue) {
    if (typeof CONFIG === "undefined") return null;
    return CONFIG.ISSUE_CATEGORIES.find((c) => c.value === categoryValue);
  }

  function generateWhatsAppLink(data) {
    const catConfig = getCategoryConfig(data.category);
    const categoryLabel = catConfig ? catConfig.label : data.category;
    const number = catConfig && catConfig.whatsapp ? catConfig.whatsapp : "";

    const epicLine = data.epicNo ? `\n▪️ *मतदाता पहचान पत्र (EPIC):* ${data.epicNo}` : '';

    const text = `*प्रार्थना पत्र / जन-शिकायत* ⚠️\n\n`
      + `*सेवा में,*\n${catConfig && catConfig.authority ? catConfig.authority : "संबंधित अधिकारी महोदय"},\n`
      + `ग्राम पंचायत 29-बड़ागांव, विकास खण्ड 19-बेंहदर, जिला 113-हरदोई\n\n`
      + `*विषय:* ${categoryLabel} के संबंध में।\n\n`
      + `*महोदय,*\n`
      + `सविनय निवेदन है कि प्रार्थी/प्रार्थिनी *${data.name}*, पुत्र/पत्नी *${data.guardian}*, ग्राम 29-बड़ागांव का/की निवासी है। प्रार्थी का विवरण निम्न प्रकार है:\n`
      + `▪️ *नाम:* ${data.name}\n`
      + `▪️ *पिता/पति का नाम:* ${data.guardian}\n`
      + `▪️ *मोबाइल:* ${data.phone}${epicLine}\n\n`
      + `*शिकायत/समस्या का विवरण:*\n${data.description}\n\n`
      + `अतः आपसे विनम्र निवेदन है कि जनहित को दृष्टिगत रखते हुए उक्त समस्या का त्वरित निवारण कराने की कृपा करें।\n\n`
      + `*भवदीय,*\n${data.name}\nदिनांक: ${new Date().toLocaleDateString("hi-IN")}`;

    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  }

  function generateEmailLink(data) {
    const catConfig = getCategoryConfig(data.category);
    const categoryLabel = catConfig ? catConfig.label : data.category;
    const emailAddress = catConfig && catConfig.email ? catConfig.email : "gram.panchayat@example.com";

    const subject = `जन-शिकायत (ग्राम बड़ागांव): ${categoryLabel} - प्रार्थी: ${data.name}`;
    const body = generateDraftText(data);

    return `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  // ── Submit to Web3Forms (email fallback) ──────────────────────────────
  async function submitToApi(data) {
    if (typeof CONFIG === "undefined" || !CONFIG.WEB3FORMS_KEY) {
      console.warn("Web3Forms key not configured. Skipping API submission.");
      return;
    }

    const categoryLabel = CONFIG.ISSUE_CATEGORIES.find(
      (c) => c.value === data.category
    )?.label || data.category;

    const payload = {
      access_key: CONFIG.WEB3FORMS_KEY,
      subject: `ग्राम शिकायत | ${categoryLabel} | ${data.name}`,
      name: data.name,
      phone: data.phone,
      guardian: data.guardian,
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
    const catConfig = getCategoryConfig(data.category);
    const categoryLabel = catConfig ? catConfig.label : data.category;
    const authority = catConfig && catConfig.authority ? catConfig.authority : "संबंधित अधिकारी महोदय";

    const epicLine = data.epicNo
      ? `\n- मतदाता पहचान पत्र (EPIC): ${data.epicNo}`
      : '';

    return `सेवा में,
${authority},
ग्राम पंचायत 29-बड़ागांव, विकास खण्ड 19-बेंहदर, जिला 113-हरदोई

विषय: ${categoryLabel} से संबंधित शिकायत

महोदय,
मेरा नाम ${data.name} है।${epicLine}
मैं ग्राम 29-बड़ागांव का/की निवासी हूँ।

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
    const btnWhatsapp = document.getElementById("btnWhatsapp");
    const btnEmail = document.getElementById("btnEmail");
    const btnCall = document.getElementById("btnCall");
    const issueCategory = document.getElementById("issueCategory");

    if (!form) return;

    if (issueCategory) {
      issueCategory.addEventListener("change", function(e) {
        const cat = getCategoryConfig(e.target.value);
        if (!cat) {
          if (btnWhatsapp) btnWhatsapp.style.display = "none";
          if (btnEmail) btnEmail.style.display = "none";
          if (btnCall) btnCall.style.display = "none";
          return;
        }
        
        if (btnWhatsapp) btnWhatsapp.style.display = (cat.whatsapp && cat.whatsapp.length >= 10) ? "flex" : "none";
        if (btnEmail) btnEmail.style.display = (cat.email && cat.email.length > 3) ? "flex" : "none";
        
        if (btnCall) {
          if (cat.phone) {
            btnCall.style.display = "flex";
            btnCall.href = `tel:${cat.phone}`;
            btnCall.innerHTML = `📞 कॉल करें (${cat.phone})`;
          } else {
            btnCall.style.display = "none";
          }
        }
      });
    }

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

    function processSubmission(dispatchType) {
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

      // Fire API in background
      submitToApi(data).catch(console.error);

      if (dispatchType === 'whatsapp') {
        const waLink = generateWhatsAppLink(data);
        window.open(waLink, "_blank");
        if (typeof window.showToast === "function") window.showToast("शिकायत WhatsApp पर भेजी जा रही है! ✅");
      } else if (dispatchType === 'email') {
        const emailLink = generateEmailLink(data);
        window.location.href = emailLink;
        if (typeof window.showToast === "function") window.showToast("ईमेल ऐप खोला जा रहा है! 📧");
      }

      form.reset();
    }

    if (btnWhatsapp) {
      btnWhatsapp.addEventListener("click", () => processSubmission('whatsapp'));
    }
    
    if (btnEmail) {
      btnEmail.addEventListener("click", () => processSubmission('email'));
    }
  }

  function collectFormData() {
    return {
      name:        (document.getElementById('complainantName')?.value  || '').trim(),
      phone:       (document.getElementById('complainantPhone')?.value || '').trim(),
      guardian:    (document.getElementById('complainantGuardian')?.value || '').trim(),
      category:    document.getElementById('issueCategory')?.value     || '',
      description: (document.getElementById('issueDescription')?.value || '').trim(),
      epicNo:      (document.getElementById('voterEpicNo')?.value      || '').trim()  // from voter-search.js
    };
  }


  function highlightErrors(data) {
    if (!data.name) showFieldError("complainantName", "नाम अनिवार्य है।");
    if (!/^[6-9]\d{9}$/.test(data.phone)) showFieldError("complainantPhone", "वैध मोबाइल नंबर दर्ज करें।");
    if (!data.guardian) showFieldError("complainantGuardian", "पिता/पति का नाम अनिवार्य है।");
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
