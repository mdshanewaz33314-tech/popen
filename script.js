"use strict";

(() => {
  const root = document.documentElement;

  // SECTION 1 — Dictionaries and shared state
  // Visible page copy lives in the HTML as .lang-en / .lang-bn pairs (no flash, works without JS).
  // This dictionary only holds strings that JavaScript itself creates.
  const dictionary = {
    en: {
      "name-placeholder": "Your name",
      "email-placeholder": "Your email",
      "message-placeholder": "Write your message",
      "form-config-error": "The contact form is temporarily unavailable. Please try again later.",
      "form-sending": "Sending your message…",
      "form-success": "Thanks — your message has been sent.",
      "form-error": "The message could not be sent. Please try again.",
      "form-network-error": "A network error occurred. Check your connection and try again.",
      "v-required": "Please fill out this field.",
      "v-email": "Please enter a valid email address.",
      "v-short": "Please enter at least {n} characters.",
      "open-menu-label": "Open menu",
      "close-menu-label": "Close menu",
      "switch-label": "বাংলা — Switch to Bengali",
      "switch-title": "বাংলা"
    },
    bn: {
      "name-placeholder": "আপনার নাম",
      "email-placeholder": "আপনার ইমেইল",
      "message-placeholder": "আপনার বার্তা লিখুন",
      "form-config-error": "যোগাযোগ ফর্মটি এখন কাজ করছে না। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।",
      "form-sending": "বার্তা পাঠানো হচ্ছে…",
      "form-success": "ধন্যবাদ — আপনার বার্তা পাঠানো হয়েছে।",
      "form-error": "বার্তাটি পাঠানো যায়নি। আবার চেষ্টা করুন।",
      "form-network-error": "নেটওয়ার্কে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",
      "v-required": "অনুগ্রহ করে এই ঘরটি পূরণ করুন।",
      "v-email": "অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।",
      "v-short": "অনুগ্রহ করে অন্তত {n}টি অক্ষর লিখুন।",
      "open-menu-label": "মেনু খুলুন",
      "close-menu-label": "মেনু বন্ধ করুন",
      "switch-label": "EN — Switch to English",
      "switch-title": "English"
    }
  };

  let language = "en";
  let revealObserver = null;
  const reduceMotion = Boolean(
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const mobileBreakpoint = window.matchMedia("(max-width: 760px)");

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_) {
      /* Storage is an optional enhancement. */
    }
  }

  function t(key) {
    return (dictionary[language] && dictionary[language][key]) || dictionary.en[key] || key;
  }

  // SECTION 2 — Language switching and accessible labels
  function renderFormStatus() {
    const status = document.getElementById("contact-form-status");
    if (status && status.dataset.key) status.textContent = t(status.dataset.key);
  }

  function setFormStatus(key, state) {
    const status = document.getElementById("contact-form-status");
    if (!status) return;
    if (!key) {
      status.textContent = "";
      delete status.dataset.key;
      delete status.dataset.state;
      return;
    }
    status.dataset.key = key;
    if (state) status.dataset.state = state;
    else delete status.dataset.state;
    status.textContent = t(key);
  }

  // Cover images carry data-alt-en / data-alt-bn.
  function syncCoverAlts(scope = document) {
    scope.querySelectorAll("img[data-alt-en][data-alt-bn]").forEach((img) => {
      const next = language === "bn" ? img.dataset.altBn : img.dataset.altEn;
      if (next) img.setAttribute("alt", next);
    });
  }

  // <title> and <meta name="description"> carry data-en / data-bn.
  function syncDocumentMeta() {
    const title = document.querySelector("title");
    if (title && title.dataset[language]) document.title = title.dataset[language];
    const description = document.querySelector('meta[name="description"]');
    if (description && description.dataset[language]) {
      description.setAttribute("content", description.dataset[language]);
    }
  }

  function applyLanguage(value) {
    language = value === "bn" ? "bn" : "en";
    root.lang = language;
    root.dataset.language = language;

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      if (dictionary[language][key]) element.setAttribute("placeholder", dictionary[language][key]);
    });

    document.querySelectorAll("#lang-toggle").forEach((button) => {
      button.setAttribute("aria-label", t("switch-label"));
      button.setAttribute("title", t("switch-title"));
    });

    storageSet("popen_language", language);
    updateMenuLabels();
    renderFormStatus();
    syncCoverAlts(document);
    syncDocumentMeta();
    // A visible validation message must not stay in the old language.
    document.querySelectorAll("#contact-form input, #contact-form textarea").forEach((f) => f.setCustomValidity(""));
  }

  function updateMenuLabels() {
    const toggle = document.getElementById("menu-toggle");
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        toggle.getAttribute("aria-expanded") === "true" ? t("close-menu-label") : t("open-menu-label")
      );
    }
  }

  function setupLanguage() {
    const preferredLanguage = storageGet("popen_language") || root.lang || "en";
    language = preferredLanguage === "bn" ? "bn" : "en";
    applyLanguage(language);

    document.querySelectorAll("#lang-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        applyLanguage(language === "en" ? "bn" : "en");
      });
    });
  }

  // SECTION 3 — Mobile menu (focus-trapped while open)
  function setupMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("nav-links");
    const overlay = document.getElementById("mobile-overlay");
    if (!toggle || !menu || !overlay) return;

    const langButton = document.getElementById("lang-toggle");
    // Everything behind the open panel becomes inert, so Tab cannot reach it.
    const background = [
      document.getElementById("main-content"),
      document.querySelector(".site-footer"),
      document.querySelector(".site-header .logo")
    ].filter(Boolean);

    let overlayTimer = 0;

    function setBackgroundInert(on) {
      background.forEach((element) => {
        if (on) element.setAttribute("inert", "");
        else element.removeAttribute("inert");
      });
    }

    function setMenu(open, returnFocus = false) {
      const isMobile = mobileBreakpoint.matches;
      const show = Boolean(open && isMobile);

      menu.classList.toggle("active", show);
      clearTimeout(overlayTimer);

      if (show) {
        overlay.hidden = false;
        // Force a reflow so the opacity transition starts from 0 instead of being skipped.
        void overlay.offsetWidth;
        overlay.classList.add("active");
      } else {
        overlay.classList.remove("active");
        overlayTimer = setTimeout(() => {
          overlay.hidden = true;
        }, reduceMotion ? 0 : 420);
      }

      toggle.setAttribute("aria-expanded", String(show));
      toggle.setAttribute("aria-label", show ? t("close-menu-label") : t("open-menu-label"));
      setBackgroundInert(show);

      if (isMobile) {
        menu.setAttribute("aria-hidden", String(!show));
        if (show) menu.removeAttribute("inert");
        else menu.setAttribute("inert", "");
        document.body.classList.toggle("menu-open", show);
        root.classList.toggle("menu-open", show);
      } else {
        menu.removeAttribute("inert");
        menu.setAttribute("aria-hidden", "false");
        document.body.classList.remove("menu-open");
        root.classList.remove("menu-open");
      }

      if (show) {
        const firstLink = menu.querySelector("a[href]");
        // The panel turns visible immediately (visibility has no delay when showing), so focus on the next frame.
        requestAnimationFrame(() => {
          if (firstLink && toggle.getAttribute("aria-expanded") === "true") {
            firstLink.focus({ preventScroll: true });
          }
        });
      } else if (returnFocus) {
        toggle.focus({ preventScroll: true });
      }
    }

    setMenu(false);

    toggle.addEventListener("click", () => {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    overlay.addEventListener("click", () => setMenu(false, true));

    // Older iOS Safari ignores body{overflow:hidden}; block touch-scrolling of the page behind the open panel.
    const blockTouchScroll = (event) => {
      if (toggle.getAttribute("aria-expanded") === "true") event.preventDefault();
    };
    overlay.addEventListener("touchmove", blockTouchScroll, { passive: false });
    menu.addEventListener("touchmove", blockTouchScroll, { passive: false });

    menu.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (toggle.getAttribute("aria-expanded") !== "true") return;

      if (event.key === "Escape") {
        setMenu(false, true);
        return;
      }
      if (event.key !== "Tab") return;

      const items = [...menu.querySelectorAll("a[href]"), langButton, toggle].filter(Boolean);
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (!items.includes(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const onResize = () => setMenu(false);
    if (mobileBreakpoint.addEventListener) {
      mobileBreakpoint.addEventListener("change", onResize);
    } else if (mobileBreakpoint.addListener) {
      mobileBreakpoint.addListener(onResize);
    }
  }

  // SECTION 4 — Scroll reveal, active-section highlight, hero motion
  function refreshReveal(scope = document) {
    const elements = scope.querySelectorAll(".reveal:not([data-reveal-ready])");
    if (!elements.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("active");
        element.dataset.revealReady = "true";
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { root: null, threshold: 0, rootMargin: "0px 0px -20px 0px" }
      );
    }

    elements.forEach((element) => {
      element.dataset.revealReady = "true";
      revealObserver.observe(element);
    });
  }

  function setupScrollSpy() {
    const links = Array.from(document.querySelectorAll('.nav-item[href^="#"]'));
    const entries = links
      .map((link) => ({
        link,
        section: document.getElementById(link.getAttribute("href").slice(1))
      }))
      .filter((item) => item.section);

    if (entries.length < 2) return;

    let ticking = false;

    function update() {
      ticking = false;
      const line = window.innerHeight * 0.35;
      let current = null;
      let currentTop = -Infinity;
      let last = entries[0];
      let lastTop = -Infinity;

      entries.forEach((item) => {
        const top = item.section.getBoundingClientRect().top;
        if (top <= line && top > currentTop) {
          current = item;
          currentTop = top;
        }
        if (top > lastTop) {
          last = item;
          lastTop = top;
        }
      });

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = last;
      if (!current) current = entries[0];

      entries.forEach((item) => {
        const on = item === current;
        item.link.classList.toggle("active", on);
        if (on) item.link.setAttribute("aria-current", "location");
        else item.link.removeAttribute("aria-current");
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  // Pauses the infinite orb animation while the hero is off-screen.
  function setupHeroMotion() {
    const hero = document.querySelector(".hero");
    if (!hero || !("IntersectionObserver" in window)) return;
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => hero.classList.toggle("is-offscreen", !entry.isIntersecting));
    }).observe(hero);
  }

  // SECTION 5 — Story cover images: retry, stall recovery, placeholder
  // The placeholder art lives in CSS (--cover-placeholder), so a cover that is slow or has failed
  // never leaves a blank box. This code keeps trying to get the real image.
  const COVER_MAX_RETRIES = 3;
  const COVER_STALL_MS = 20000;

  function setupCoverFallbacks(scope = document) {
    scope.querySelectorAll("img[data-cover-fallback]").forEach((image) => {
      if (image.dataset.coverFallbackBound === "true") return;
      image.dataset.coverFallbackBound = "true";

      const original = image.getAttribute("src");
      if (!original) return;

      let retries = 0;
      let retryTimer = 0;
      let stallTimer = 0;

      const isLoaded = () => image.complete && image.naturalWidth > 0;
      const isBroken = () => image.complete && image.naturalWidth === 0;

      function armStallTimer() {
        clearTimeout(stallTimer);
        stallTimer = setTimeout(() => {
          if (!isLoaded()) retry();
        }, COVER_STALL_MS);
      }

      function retry() {
        clearTimeout(retryTimer);
        clearTimeout(stallTimer);
        if (retries >= COVER_MAX_RETRIES) {
          image.classList.add("cover-failed");
          return;
        }
        retries += 1;
        retryTimer = setTimeout(() => {
          image.classList.remove("cover-failed");
          // A changing query string forces a fresh request instead of reusing a failed/cached one.
          image.src = original + (original.includes("?") ? "&" : "?") + "r=" + Date.now();
          armStallTimer();
        }, 1200 * retries);
      }

      image.addEventListener("load", () => {
        clearTimeout(retryTimer);
        clearTimeout(stallTimer);
        image.classList.remove("cover-failed");
      });
      image.addEventListener("error", retry);

      // Try again from scratch when the network returns or the page comes back from the back/forward cache.
      function recover() {
        if (isLoaded()) return;
        if (image.classList.contains("cover-failed") || isBroken()) {
          retries = 0;
          retry();
        }
      }
      window.addEventListener("online", recover);
      window.addEventListener("pageshow", (event) => { if (event.persisted) recover(); });
      document.addEventListener("visibilitychange", () => { if (!document.hidden) recover(); });

      if (isBroken()) retry(); // it failed before this script ran
      else if (!image.complete) armStallTimer();
    });
  }

  // SECTION 6 — Contact form validation and submission
  function validationMessage(field) {
    const v = field.validity;
    if (v.valueMissing) return t("v-required");
    if (v.typeMismatch) return t("v-email");
    if (v.tooShort) return t("v-short").replace("{n}", String(field.minLength));
    return "";
  }

  // Native `required` / `minlength` accept spaces; judge text fields by their trimmed length instead.
  function applyTrimRule(field) {
    field.setCustomValidity("");
    if (field.type === "email") return;
    const length = field.value.trim().length;
    if (field.required && length === 0) {
      field.setCustomValidity(t("v-required"));
    } else if (field.minLength > 0 && length < field.minLength) {
      field.setCustomValidity(t("v-short").replace("{n}", String(field.minLength)));
    }
  }

  function setupContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("contact-form-status");
    if (!form || !status) return;

    const fields = Array.from(form.querySelectorAll("input, textarea"));

    fields.forEach((field) => {
      field.addEventListener("invalid", () => {
        // Localise the browser's own message, but never overwrite one we set ourselves.
        if (field.validity.customError) return;
        const message = validationMessage(field);
        if (message) field.setCustomValidity(message);
      });
      field.addEventListener("input", () => applyTrimRule(field));
    });

    let sending = false;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (sending) return;

      setFormStatus(null);
      fields.forEach(applyTrimRule);
      if (!form.reportValidity()) return;

      const action = form.getAttribute("action") || "";
      const match = action.match(/^https:\/\/formspree\.io\/f\/([a-z0-9]+)\/?$/i);
      const formId = match ? match[1] : "";

      if (!formId || /^(?:yourformid|replace|formid)$/i.test(formId)) {
        // Developer detail stays in the console; visitors get a plain message.
        console.error("POpen: set a real Formspree form ID in the <form action> attribute in index.html.");
        setFormStatus("form-config-error", "error");
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');

      sending = true;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
      }
      setFormStatus("form-sending");

      const controller = typeof AbortController === "function" ? new AbortController() : null;
      const timeout = controller ? setTimeout(() => controller.abort(), 20000) : 0;

      try {
        const response = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
          signal: controller ? controller.signal : undefined
        });

        let payload = {};
        try {
          payload = await response.json();
        } catch (_) {
          /* Some error responses may not be JSON. */
        }

        if (response.ok && (!payload || !Array.isArray(payload.errors) || payload.errors.length === 0)) {
          setFormStatus("form-success", "success");
          form.reset();
        } else {
          setFormStatus("form-error", "error");
        }
      } catch (_) {
        setFormStatus("form-network-error", "error");
      } finally {
        clearTimeout(timeout);
        sending = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute("aria-busy");
        }
      }
    });
  }

  // SECTION 7 — Page initialization
  function init() {
    setupLanguage();
    setupMobileMenu();
    refreshReveal(document);
    setupScrollSpy();
    setupHeroMotion();
    setupContactForm();
    setupCoverFallbacks(document);

    document.querySelectorAll("#copyright-year").forEach((element) => {
      element.textContent = String(new Date().getFullYear());
    });

    document.body.classList.add("page-ready");
  }

  window.POPEN = window.POPEN || {};
  window.POPEN.refreshReveal = refreshReveal;
  window.POPEN.applyLanguage = applyLanguage;
  window.POPEN.refreshCoverFallbacks = setupCoverFallbacks;
  window.POPEN.syncCoverAlts = syncCoverAlts;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
