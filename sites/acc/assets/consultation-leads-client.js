(function (global) {
  "use strict";

  var PROD_API = "https://crown.com.vn/api/consultation-leads";

  var VALIDATION_STYLE_ID = "crown-form-validation-css";

  function pageLang() {
    if (typeof global.currentLang === "string" && global.currentLang) {
      return global.currentLang;
    }
    var lang = document.documentElement.lang || "vi";
    return lang.slice(0, 2) === "en" ? "en" : "vi";
  }

  function copyFor(lang) {
    var en = lang === "en";
    return {
      requiredNamed: function (label) {
        return en
          ? "Please enter " + label + "."
          : "Vui lòng nhập " + label + ".";
      },
      requiredGeneric: en
        ? "This field is required."
        : "Vui lòng điền thông tin này.",
      email: en
        ? "Please enter a valid email address."
        : "Vui lòng nhập địa chỉ email hợp lệ.",
      phone: en
        ? "Please enter a valid phone number (at least 8 digits)."
        : "Vui lòng nhập số điện thoại hợp lệ (ít nhất 8 chữ số).",
    };
  }

  function injectValidationStyles() {
    if (document.getElementById(VALIDATION_STYLE_ID)) return;
    var css =
      ".contact-form .crown-field{display:flex;flex-direction:column;gap:6px;min-width:0}" +
      ".contact-form .crown-field--full{grid-column:1/-1}" +
      ".contact-form .crown-field input," +
      ".contact-form .crown-field select," +
      ".contact-form .crown-field textarea{width:100%}" +
      ".contact-form .crown-field-error{margin:0;font-size:12px;line-height:1.4;color:#8b5e55}" +
      ".contact-form input.crown-input--invalid," +
      ".contact-form select.crown-input--invalid," +
      ".contact-form textarea.crown-input--invalid{border-color:#c9a09a}";
    var style = document.createElement("style");
    style.id = VALIDATION_STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function isServiceSelect(el) {
    return (
      el.tagName === "SELECT" &&
      (el.name === "service" || el.id === "tuvanService")
    );
  }

  function serviceSelectEmpty(el) {
    return isServiceSelect(el) && !String(el.value || "").trim();
  }

  function fieldLabel(el) {
    if (el.tagName === "SELECT") {
      var placeholderOpt = el.querySelector('option[value=""]');
      if (placeholderOpt && placeholderOpt.textContent) {
        return placeholderOpt.textContent.trim();
      }
    }
    var ph = el.getAttribute("placeholder");
    if (ph) return ph.replace(/\.\.\.$/, "").replace(/…$/, "").trim();
    var aria = el.getAttribute("aria-label");
    if (aria) return aria;
    if (el.name) return el.name;
    return "";
  }

  function phoneLooksValid(value) {
    var digits = String(value).replace(/\D/g, "");
    return digits.length >= 8 && digits.length <= 15;
  }

  function errorNodeFor(el) {
    var wrap = el.closest(".crown-field");
    return wrap ? wrap.querySelector(".crown-field-error") : null;
  }

  function clearFieldState(el) {
    el.classList.remove("crown-input--invalid");
    el.removeAttribute("aria-invalid");
    var node = errorNodeFor(el);
    if (node) {
      node.textContent = "";
      node.hidden = true;
    }
  }

  function showFieldError(el, message) {
    el.classList.add("crown-input--invalid");
    el.setAttribute("aria-invalid", "true");
    var node = errorNodeFor(el);
    if (node) {
      node.textContent = message;
      node.hidden = !message;
    }
  }

  function messageForElement(el, lang) {
    var copy = copyFor(lang);
    var label = fieldLabel(el);
    if (serviceSelectEmpty(el)) {
      return label ? copy.requiredNamed(label) : copy.requiredGeneric;
    }
    var v = el.validity;
    if (v.valueMissing) {
      return label ? copy.requiredNamed(label) : copy.requiredGeneric;
    }
    if (el.type === "email" && (v.typeMismatch || v.patternMismatch)) {
      return copy.email;
    }
    if (el.type === "tel") {
      return copy.phone;
    }
    if (v.typeMismatch || v.patternMismatch) {
      return copy.requiredGeneric;
    }
    return copy.requiredGeneric;
  }

  function elementValid(el) {
    if (serviceSelectEmpty(el)) return false;
    if (el.type === "tel" && el.value.trim() && !phoneLooksValid(el.value)) {
      return false;
    }
    if (!el.willValidate) return true;
    return el.checkValidity();
  }

  function errorMessageFor(el, lang) {
    var copy = copyFor(lang);
    var msg = messageForElement(el, lang);
    if (el.type === "tel" && el.value.trim() && !phoneLooksValid(el.value)) {
      msg = copy.phone;
    }
    return msg;
  }

  function prepareContactForm(form) {
    if (!form.classList.contains("contact-form")) return false;
    if (form.getAttribute("data-crown-fields-init") === "1") return true;
    injectValidationStyles();
    form.setAttribute("novalidate", "");
    form.setAttribute("data-crown-fields-init", "1");

    var controls = form.querySelectorAll("input, select, textarea");
    Array.prototype.forEach.call(controls, function (el) {
      if (el.type === "hidden" || el.type === "submit" || el.type === "button") {
        return;
      }
      if (el.closest(".crown-field")) return;
      var wrap = document.createElement("div");
      wrap.className = "crown-field";
      if (el.tagName === "TEXTAREA") wrap.className += " crown-field--full";
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
      var hint = document.createElement("p");
      hint.className = "crown-field-error";
      hint.setAttribute("role", "alert");
      hint.hidden = true;
      wrap.appendChild(hint);
      el.addEventListener("input", function () {
        clearFieldState(el);
      });
      el.addEventListener("change", function () {
        clearFieldState(el);
      });
      el.addEventListener("blur", function () {
        var mustCheck = el.required || isServiceSelect(el);
        if (!el.value.trim() && !mustCheck) return;
        if (elementValid(el)) {
          clearFieldState(el);
          return;
        }
        showFieldError(el, errorMessageFor(el, pageLang()));
      });
    });

    var stale = form.querySelector(".crown-form-validation-summary");
    if (stale) stale.remove();
    return true;
  }

  function firstInvalidField(form) {
    var fields = form.querySelectorAll("input, select, textarea");
    var found = null;
    Array.prototype.forEach.call(fields, function (el) {
      if (found) return;
      if (el.type === "hidden" || el.type === "submit" || el.type === "button") {
        return;
      }
      if (!elementValid(el)) found = el;
    });
    return found;
  }

  function validateForm(form, lang) {
    lang = lang || pageLang();
    var usesInline =
      prepareContactForm(form) || form.classList.contains("contact-form");
    if (!usesInline) {
      return !form.reportValidity || form.reportValidity();
    }

    var fields = form.querySelectorAll("input, select, textarea");
    Array.prototype.forEach.call(fields, function (el) {
      if (el.type === "hidden" || el.type === "submit" || el.type === "button") {
        return;
      }
      clearFieldState(el);
    });

    var invalid = firstInvalidField(form);
    if (!invalid) return true;

    showFieldError(invalid, errorMessageFor(invalid, lang));
    if (invalid.focus) {
      try {
        invalid.focus({ preventScroll: true });
      } catch (_e) {
        invalid.focus();
      }
      invalid.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return false;
  }

  function clearFormValidation(form) {
    if (form.getAttribute("data-crown-fields-init") !== "1") return;
    var fields = form.querySelectorAll("input, select, textarea");
    Array.prototype.forEach.call(fields, function (el) {
      clearFieldState(el);
    });
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
    var lang = opts.lang || pageLang();
    if (!validateForm(form, lang)) {
      return Promise.resolve();
    }
    var built = buildPayload(form);
    if (!built.fullName || !built.phone || !built.email || !built.service) {
      validateForm(form, lang);
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
        clearFormValidation(form);
        notifySuccess(lang);
      })
      .catch(function () {
        notifyError(lang);
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  }

  function initContactFormsOnLoad() {
    document.addEventListener("DOMContentLoaded", function () {
      var forms = document.querySelectorAll("form.contact-form");
      Array.prototype.forEach.call(forms, function (form) {
        prepareContactForm(form);
      });
    });
  }
  initContactFormsOnLoad();

  global.CrownConsultationLeads = {
    apiUrl: apiUrl,
    buildPayload: buildPayload,
    submitFromForm: submitFromForm,
    validateForm: validateForm,
    notifySuccess: notifySuccess,
    notifyError: notifyError,
  };
})(typeof window !== "undefined" ? window : globalThis);