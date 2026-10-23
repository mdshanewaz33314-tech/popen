"use strict";

(() => {
  const root = document.documentElement;

  // SECTION 1 — Language dictionaries and shared state
  const dictionary = {
    en: {
      "skip-link": "Skip to content",
      "main-nav-label": "Main navigation",
      "nav-home": "Home",
      "nav-about": "About",
      "nav-stories": "Stories",
      "nav-contact": "Contact",
      "hero-kicker": "STORIES · MEMORIES · LITTLE ADVENTURES",
      "hero-title": "Welcome to POpen",
      "hero-subtitle": "A place for stories, memories and little moments.",
      "hero-btn": "Explore Stories",
      "hero-about-btn": "Discover POpen",
      "stories-kicker": "THE STORY ARCHIVE",
      "view-all-stories": "View all stories",
      "about-kicker": "A LITTLE ABOUT THIS PLACE",
      "about-title": "About POpen",
      "contact-kicker": "LET'S CONNECT",
      "contact-title": "Get in touch",
      "or-connect": "Or connect directly",
      "name-label": "Name",
      "name-placeholder": "Your name",
      "email-label": "Your email",
      "email-placeholder": "Your email",
      "message-label": "Your message",
      "message-placeholder": "Write your message",
      "send-message": "Send message",
      "form-config-error": "The contact form is not connected yet. Replace the form ID in index.html with the real alphanumeric Formspree form ID.",
      "form-sending": "Sending your message…",
      "form-success": "Thanks — your message has been sent.",
      "form-error": "The message could not be sent. Please try again.",
      "form-network-error": "A network error occurred. Check your connection and try again.",
      "v-required": "Please fill out this field.",
      "v-email": "Please enter a valid email address.",
      "v-short": "Please enter at least {n} characters.",
      "open-menu-label": "Open menu",
      "close-menu-label": "Close menu"
    },
    bn: {
      "skip-link": "মূল কনটেন্টে যান",
      "main-nav-label": "প্রধান নেভিগেশন",
      "nav-home": "হোম",
      "nav-about": "সম্পর্কে",
      "nav-stories": "গল্প",
      "nav-contact": "যোগাযোগ",
      "hero-kicker": "গল্প · স্মৃতি · ছোট ছোট অভিযান",
      "hero-title": "POpen-এ স্বাগতম",
      "hero-subtitle": "গল্প, স্মৃতি এবং ছোট ছোট মুহূর্তের একটি জায়গা।",
      "hero-btn": "গল্পগুলো দেখুন",
      "hero-about-btn": "POpen সম্পর্কে জানুন",
      "stories-kicker": "গল্পের সংগ্রহ",
      "view-all-stories": "সব গল্প দেখুন",
      "about-kicker": "এই জায়গা সম্পর্কে",
      "about-title": "POpen সম্পর্কে",
      "contact-kicker": "যোগাযোগ করা যাক",
      "contact-title": "যোগাযোগ করুন",
      "or-connect": "অথবা সরাসরি যোগাযোগ করুন",
      "name-label": "নাম",
      "name-placeholder": "আপনার নাম",
      "email-label": "আপনার ইমেইল",
      "email-placeholder": "আপনার ইমেইল",
      "message-label": "আপনার বার্তা",
      "message-placeholder": "আপনার বার্তা লিখুন",
      "send-message": "বার্তা পাঠান",
      "form-config-error": "যোগাযোগ ফর্মটি এখনো সংযুক্ত নয়। index.html ফাইলে ফর্ম আইডির জায়গায় Formspree থেকে পাওয়া আসল Form ID বসান।",
      "form-sending": "বার্তা পাঠানো হচ্ছে…",
      "form-success": "ধন্যবাদ — আপনার বার্তা পাঠানো হয়েছে।",
      "form-error": "বার্তাটি পাঠানো যায়নি। আবার চেষ্টা করুন।",
      "form-network-error": "নেটওয়ার্কে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",
      "v-required": "অনুগ্রহ করে এই ঘরটি পূরণ করুন।",
      "v-email": "অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।",
      "v-short": "অনুগ্রহ করে অন্তত {n}টি অক্ষর লিখুন।",
      "open-menu-label": "মেনু খুলুন",
      "close-menu-label": "মেনু বন্ধ করুন"
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

  function syncCoverAlts(scope = document) {
    scope.querySelectorAll("img[data-alt-en][data-alt-bn]").forEach((img) => {
      const next = language === "bn" ? img.dataset.altBn : img.dataset.altEn;
      if (next) img.setAttribute("alt", next);
    });
  }

  function applyLanguage(value) {
    language = value === "bn" ? "bn" : "en";
    root.lang = language;
    root.dataset.language = language;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (!key) return;

      if (key === "hero-title") {
        // Safer than full innerHTML: only update the two known child spans
        let welcome = element.querySelector(".hero-welcome-part");
        let name = element.querySelector(".hero-name-part");

        if (!welcome || !name) {
          element.textContent = "";
          welcome = document.createElement("span");
          welcome.className = "hero-welcome-part";
          name = document.createElement("span");
          name.className = "hero-name-part";
          element.append(welcome, document.createTextNode(" "), name);
        }

        if (language === "en") {
          welcome.textContent = "Welcome to";
          name.textContent = "POpen";
        } else {
          welcome.textContent = "POpen-এ";
          name.textContent = "স্বাগতম";
        }
      } else if (dictionary[language][key]) {
        element.textContent = dictionary[language][key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      if (dictionary[language][key]) {
        element.setAttribute("placeholder", dictionary[language][key]);
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const key = element.getAttribute("data-i18n-aria");
      if (dictionary[language][key]) {
        element.setAttribute("aria-label", dictionary[language][key]);
      }
    });

    document.querySelectorAll("#language-label").forEach((label) => {
      label.textContent = language === "en" ? "বাংলা" : "EN";
    });

    document.querySelectorAll("#lang-toggle").forEach((button) => {
      button.setAttribute(
        "aria-label",
        language === "en" ? "Switch to Bengali" : "Switch to English"
      );
      button.setAttribute("title", language === "en" ? "বাংলা" : "English");
    });

    storageSet("popen_language", language);
    updateMenuLabels();
    renderFormStatus();
    syncCoverAlts(document);
  }

  function updateMenuLabels() {
    const toggle = document.getElementById("menu-toggle");
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        toggle.getAttribute("aria-expanded") === "true"
          ? t("close-menu-label")
          : t("open-menu-label")
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

  // SECTION 3 — Mobile menu
  function setupMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("nav-links");
    const overlay = document.getElementById("mobile-overlay");
    if (!toggle || !menu || !overlay) return;

    let overlayTimer = 0;
    let focusTimer = 0;

    function setMenu(open, returnFocus = false) {
      const isMobile = mobileBreakpoint.matches;
      const show = Boolean(open && isMobile);

      menu.classList.toggle("active", show);
      clearTimeout(overlayTimer);
      clearTimeout(focusTimer);

      if (show) {
        overlay.hidden = false;
        requestAnimationFrame(() => overlay.classList.add("active"));
      } else {
        overlay.classList.remove("active");
        overlayTimer = setTimeout(() => {
          overlay.hidden = true;
        }, reduceMotion ? 0 : 420);
      }

      toggle.setAttribute("aria-expanded", String(show));
      toggle.setAttribute(
        "aria-label",
        show ? t("close-menu-label") : t("open-menu-label")
      );

      if (isMobile) {
        menu.setAttribute("aria-hidden", String(!show));
        if (show) menu.removeAttribute("inert");
        else menu.setAttribute("inert", "");
        document.body.classList.toggle("menu-open", show);
      } else {
        menu.removeAttribute("inert");
        menu.setAttribute("aria-hidden", "false");
        document.body.classList.remove("menu-open");
      }

      if (show) {
        const firstLink = menu.querySelector("a[href]");
        let attempts = 0;

        const focusFirstLink = () => {
          if (!firstLink || toggle.getAttribute("aria-expanded") !== "true") return;
          firstLink.focus({ preventScroll: true });
          if (document.activeElement !== firstLink && ++attempts < 10) {
            focusTimer = setTimeout(focusFirstLink, 40);
          }
        };

        // Prefer transitionend when available; fall back to timed retries
        const onTransitionEnd = (event) => {
          if (event.target !== menu || event.propertyName !== "transform") return;
          menu.removeEventListener("transitionend", onTransitionEnd);
          focusFirstLink();
        };

        if (reduceMotion) {
          focusTimer = setTimeout(focusFirstLink, 0);
        } else {
          menu.addEventListener("transitionend", onTransitionEnd);
          // Safety net if transitionend never fires
          focusTimer = setTimeout(focusFirstLink, 520);
        }
      } else if (returnFocus) {
        toggle.focus({ preventScroll: true });
      }
    }

    setMenu(false);

    toggle.addEventListener("click", () => {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    overlay.addEventListener("click", () => setMenu(false, true));

    menu.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false, true);
      }
    });

    const onResize = () => setMenu(false);
    if (mobileBreakpoint.addEventListener) {
      mobileBreakpoint.addEventListener("change", onResize);
    } else if (mobileBreakpoint.addListener) {
      mobileBreakpoint.addListener(onResize);
    }
  }

  // SECTION 4 — Scroll reveal and active-section highlight
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
        {
          root: null,
          threshold: 0,
          rootMargin: "0px 0px -20px 0px"
        }
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

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
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

  // SECTION 5 — Image fallback and story cover handling
  function setupCoverFallbacks(scope = document) {
    // Generic fallback — no story-specific title so it works for every story
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760" role="img" aria-labelledby="title desc">
<title id="title">POpen story cover</title>
<desc id="desc">An abstract illustration in navy, blue, and antique gold.</desc>
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="#07142a"/><stop offset="1" stop-color="#16385e"/>
  </linearGradient>
  <radialGradient id="sun">
    <stop stop-color="#f5d7a0" stop-opacity=".95"/>
    <stop offset="1" stop-color="#dfaa63" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="#f2d6a1" stop-opacity=".6"/>
    <stop offset="1" stop-color="#f2d6a1" stop-opacity="0"/>
  </linearGradient>
</defs>
<rect width="1200" height="760" fill="url(#bg)"/>
<circle cx="890" cy="210" r="250" fill="url(#sun)"/>
<g opacity=".3" fill="none" stroke="#9ccaff">
  <circle cx="890" cy="210" r="160"/>
  <circle cx="890" cy="210" r="215"/>
  <circle cx="890" cy="210" r="280"/>
</g>
<path d="M0 760 430 235 1200 760Z" fill="url(#beam)" opacity=".48"/>
<path d="M0 650 360 390 520 520 740 290 1200 650V760H0Z" fill="#08152b" opacity=".65"/>
<g stroke="#c9d8eb" stroke-opacity=".22" fill="none">
  <path d="M0 620H1200M0 680H1200M0 720H1200"/>
  <path d="M120 760 460 240M280 760 550 260M1020 760 910 300M1140 760 950 300"/>
</g>
<rect x="70" y="70" width="1060" height="620" rx="26" fill="none" stroke="#e8c891" stroke-opacity=".48"/>
<text x="112" y="148" fill="#e8c891" font-family="Arial,sans-serif" font-size="20" letter-spacing="7">POPEN</text>
<text x="112" y="540" fill="#fffaf0" font-family="Georgia,serif" font-size="72">Story</text>
<text x="118" y="592" fill="#c7d5e7" font-family="Arial,sans-serif" font-size="22" letter-spacing="3">LITTLE JOURNEYS. LASTING MEMORIES.</text>
<circle cx="1085" cy="625" r="12" fill="#e8c891"/>
</svg>`;

    const fallback = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

    scope.querySelectorAll("img[data-cover-fallback]").forEach((image) => {
      if (image.dataset.coverFallbackBound === "true") return;
      image.dataset.coverFallbackBound = "true";

      image.addEventListener("error", () => {
        if (image.dataset.coverFallbackApplied === "true") return;
        image.dataset.coverFallbackApplied = "true";
        image.src = fallback;
      });

      // Image may already have failed before this script ran
      if (image.complete && image.naturalWidth === 0 && image.getAttribute("src")) {
        image.dispatchEvent(new Event("error"));
      }
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

  function setupContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("contact-form-status");
    if (!form || !status) return;

    form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("invalid", () => {
        field.setCustomValidity("");
        const message = validationMessage(field);
        if (message) field.setCustomValidity(message);
      });
      field.addEventListener("input", () => field.setCustomValidity(""));
    });

    let sending = false;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (sending) return;

      setFormStatus(null);
      if (!form.reportValidity()) return;

      const action = form.getAttribute("action") || "";
      const match = action.match(/^https:\/\/formspree\.io\/f\/([a-z0-9]+)\/?$/i);
      const formId = match ? match[1] : "";

      if (!formId || /^(?:yourformid|replace|formid)$/i.test(formId)) {
        setFormStatus("form-config-error", "error");
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const label = submitButton ? submitButton.querySelector("span") : null;

      sending = true;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
      }
      if (label) {
        label.removeAttribute("data-i18n");
        label.textContent = t("form-sending");
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

        if (
          response.ok &&
          (!payload || !Array.isArray(payload.errors) || payload.errors.length === 0)
        ) {
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
        if (label) {
          label.setAttribute("data-i18n", "send-message");
          label.textContent = t("send-message");
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
    setupContactForm();
    setupCoverFallbacks(document);
    syncCoverAlts(document);

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
