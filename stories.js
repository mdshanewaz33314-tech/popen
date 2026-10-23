"use strict";

(() => {
  const storyList = [
    {
      id: "story-1",
      titleEn: "A Day's Tale",
      titleBn: "এক দিনের কথা",
      descriptionEn: "A spontaneous post-exam trip turns into an unforgettable adventure filled with metro rides, a swimming pool, and a struggle for 500 Taka change.",
      descriptionBn: "পরীক্ষা শেষের এক স্বতঃস্ফূর্ত ঘোরাঘুরি কীভাবে মেট্রো ভ্রমণ, সুইমিং পুল আর ৫০০ টাকার ভাঙতি খোঁজার এক অবিস্মরণীয় রোমাঞ্চে পরিণত হলো।",
      dateEn: "August 1, 2026",
      dateBn: "১ আগস্ট, ২০২৬",
      // ISO date for reliable sorting (newest first)
      dateISO: "2026-08-01",
      coverImage: "./story-1-cover.jpg",
      storyFile: "./story-1.html",
      altEn: "A Day's Tale cover illustration",
      altBn: "এক দিনের কথা গল্পের প্রচ্ছদ"
    }
  ];

  // Newest stories first
  storyList.sort((a, b) => (b.dateISO || "").localeCompare(a.dateISO || ""));

  const escapeHTML = (value) => String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  function cardMarkup(story, headingTag = "h3") {
    const altEn = escapeHTML(story.altEn || `${story.titleEn} cover`);
    const altBn = escapeHTML(story.altBn || `${story.titleBn} প্রচ্ছদ`);

    return `<a href="${escapeHTML(story.storyFile)}" class="story-card glass-card" data-story-id="${escapeHTML(story.id)}">
      <div class="story-card-media">
        <img
          src="${escapeHTML(story.coverImage)}"
          alt="${altEn}"
          class="story-card-img"
          data-cover-fallback
          data-alt-en="${altEn}"
          data-alt-bn="${altBn}"
          loading="lazy"
          decoding="async"
          width="1536"
          height="857"
        >
      </div>
      <div class="story-card-content">
        <p class="story-date">
          <span class="lang-en">${escapeHTML(story.dateEn)}</span>
          <span class="lang-bn">${escapeHTML(story.dateBn)}</span>
        </p>
        <${headingTag} class="lang-en">${escapeHTML(story.titleEn)}</${headingTag}>
        <${headingTag} class="lang-bn">${escapeHTML(story.titleBn)}</${headingTag}>
        <p class="lang-en story-description">${escapeHTML(story.descriptionEn)}</p>
        <p class="lang-bn story-description">${escapeHTML(story.descriptionBn)}</p>
        <span class="read-more lang-en">Read story <span aria-hidden="true">→</span></span>
        <span class="read-more lang-bn">গল্পটি পড়ুন <span aria-hidden="true">→</span></span>
      </div>
    </a>`;
  }

  function render() {
    const grids = [
      { id: "all-stories-grid", heading: "h2" },
      { id: "latest-stories-grid", heading: "h3" }
    ];
    let found = 0;

    grids.forEach(({ id, heading }) => {
      const target = document.getElementById(id);
      if (!target) return;
      found += 1;
      target.innerHTML = storyList.map((story) => cardMarkup(story, heading)).join("");
    });

    if (!found && typeof console !== "undefined" && console.warn) {
      console.warn("[POpen] stories.js: no story grid found on this page");
    }

    const empty = document.getElementById("stories-empty");
    if (empty) empty.hidden = storyList.length > 0;

    if (window.POPEN) {
      if (typeof window.POPEN.refreshReveal === "function") {
        window.POPEN.refreshReveal(document);
      }
      if (typeof window.POPEN.refreshCoverFallbacks === "function") {
        window.POPEN.refreshCoverFallbacks(document);
      }
      // Keep image alt text in sync with current language
      if (typeof window.POPEN.syncCoverAlts === "function") {
        window.POPEN.syncCoverAlts(document);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }
})();
