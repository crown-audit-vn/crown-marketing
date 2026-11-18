(function (global) {
  "use strict";

  var PROD_API = "https://crown.com.vn/api/consultation-leads";

  function pageLang() {
    if (typeof global.currentLang === "string" && global.currentLang) {
      return global.currentLang;
    }
    var lang = document.documentElement.lang || "vi";
    return lang.slice(0, 2) === "en" ? "en" : "vi";
  }

  function apiUrl() {
    if (
      typeof global.CROWN_CONSULTATION_API_BASE === "string" &&
      global.CROWN_CONSULTATION_API_BASE
    ) {
      return (
        global.CROWN_CONSULTATION_API_BASE.replace(/\/$/, "") +
        "/api/consultation-leads"
      );
    }
    var host = location.hostname;
    var port = location.port;
    if (host === "localhost" || host === "127.0.0.1") {
      if (!port || port === "5000") {
        return "/api/consultation-leads";
      }
      return "http://localhost:5000/api/consultation-leads";
    }
    if (host === "crown.com.vn") {
      return "/api/consultation-leads";
    }
    return PROD_API;
  }

  function buildPayload(form) {
    var read = function (sel) {
      var el = form.querySelector(sel);
      return el && el.value ? String(el.value).trim() : "";
    };
    var textInputs = Array.prototype.slice.call(
      form.querySelectorAll('input[type="text"]')
    );
    var fullName =
      (textInputs[0] && textInputs[0].value && String(textInputs[0].value).trim()) ||
      "";
    var companyName =
      (textInputs[1] && textInputs[1].value && String(textInputs[1].value).trim()) ||
      "";
    var phone = read('input[type="tel"]');
    var email = read('input[type="email"]');
    var service = read('select[name="service"]');
    if (!service) {
      var sel = form.querySelector("select");
      service = sel && sel.value ? String(sel.value).trim() : "";
    }
    var ta = form.querySelector("textarea");
    var message = ta && ta.value ? String(ta.value).trim().slice(0, 1600) : "";
    return {
      fullName: fullName,
      companyName: companyName,
      phone: phone,
      email: email,
      message: message,
      service: service,
    };
  }

  function defaultSuccessCopy(lang) {
    return lang === "en"
      ? "Thank you! Your request was submitted successfully. Crown will contact you shortly."
      : "Cảm ơn bạn! Yêu cầu đã được gửi thành công. Crown sẽ liên hệ lại với bạn sớm.";
  }

  function defaultErrorCopy(lang) {
    return lang === "en"
      ? "Your information could not be sent. Please call 0904 501 512 or email info@crown.com.vn."
      : "Thông tin chưa gửi được. Vui lòng gọi 0904 501 512 hoặc email info@crown.com.vn.";
  }

  function notifySuccess(lang) {
    if (typeof global.crownShowEnquirySuccess === "function") {
      global.crownShowEnquirySuccess(lang);
      return;
    }
    alert(defaultSuccessCopy(lang));
  }

  function notifyError(lang) {
    if (typeof global.crownShowEnquiryError === "function") {
      global.crownShowEnquiryError(lang);
      return;
    }
    alert(defaultErrorCopy(lang));
  }

  function sourceSiteFromForm(form) {
    var fromForm = form.getAttribute("data-source-site");
    if (fromForm) return fromForm;
    if (typeof global.CROWN_CONSULTATION_SOURCE_SITE === "string") {
      return global.CROWN_CONSULTATION_SOURCE_SITE;
    }
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      return "crown.com.vn";
    }
    return location.hostname;
  }

  function submitFromForm(form, opts) {
    opts = opts || {};
    if (form.reportValidity && !form.reportValidity()) {
      return Promise.resolve();
    }
    var lang = opts.lang || pageLang();
    var built = buildPayload(form);
    if (!built.fullName || !built.phone || !built.email) {
      if (form.reportValidity) form.reportValidity();
      return Promise.resolve();
    }
    var payload = {
      fullName: built.fullName,
      companyName: built.companyName,
      phone: built.phone,
      email: built.email,
      message: built.message,
      sourceSite: opts.sourceSite || sourceSiteFromForm(form),
    };
    if (built.service) payload.service = built.service;

    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    return fetch(apiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("submit failed");
        form.reset();
        notifySuccess(lang);
      })
      .catch(function () {
        notifyError(lang);
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  }

  global.CrownConsultationLeads = {
    apiUrl: apiUrl,
    buildPayload: buildPayload,
    submitFromForm: submitFromForm,
    notifySuccess: notifySuccess,
    notifyError: notifyError,
  };
})(typeof window !== "undefined" ? window : globalThis);