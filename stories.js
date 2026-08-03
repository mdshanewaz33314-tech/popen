"use strict";

/*
 * ==========================================
 * POPEN STORY DATABASE
 * ==========================================
 */

const stories = [
    {
        id: "story-1",

        titleEn: "A Day's Tale",
        titleBn: "এক দিনের কথা",

        descriptionEn:
            "A spontaneous post-exam trip turns into an unforgettable adventure filled with metro rides, a swimming pool, and a struggle for 500 Taka change.",

        descriptionBn:
            "পরীক্ষা শেষের এক স্বতঃস্ফূর্ত ঘোরাঘুরি কীভাবে মেট্রো ভ্রমণ, সুইমিং পুল আর ৫০০ টাকার ভাঙতি খোঁজার এক অবিস্মরণীয় রোমাঞ্চে পরিণত হলো।",

        date: "August 1, 2026",

        coverImage: "story-1-cover.png",

        storyFile: "story-1.html"
    }

    // নতুন গল্প এখানে যোগ করবে।
];


/*
 * ==========================================
 * STORY CARD
 * ==========================================
 */

function generateStoryHTML(story) {

    if (!story || !story.storyFile) {
        return "";
    }

    return `
        <a
            href="${escapeHTML(story.storyFile)}"
            class="story-card glass-card reveal fade-up"
            aria-label="${escapeHTML(story.titleEn)}">

            <div
                class="story-card-img"
                style="background-image: url('${escapeCSSUrl(story.coverImage)}')"
                role="img"
                aria-label="${escapeHTML(story.titleEn)}">
            </div>

            <div class="story-card-content">

                <p class="story-date">
                    ${escapeHTML(story.date)}
                </p>

                <h3 class="lang-en">
                    ${escapeHTML(story.titleEn)}
                </h3>

                <h3 class="lang-bn">
                    ${escapeHTML(story.titleBn)}
                </h3>

                <p class="lang-en story-description">
                    ${escapeHTML(story.descriptionEn)}
                </p>

                <p class="lang-bn story-description">
                    ${escapeHTML(story.descriptionBn)}
                </p>

                <span class="read-more lang-en">
                    Read Story →
                </span>

                <span class="read-more lang-bn">
                    গল্পটি পড়ুন →
                </span>

            </div>

        </a>
    `;
}


/*
 * ==========================================
 * HTML SAFETY
 * ==========================================
 */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeCSSUrl(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}


/*
 * ==========================================
 * RENDER STORIES
 * ==========================================
 */

function renderStories() {

    const allStoriesGrid =
        document.getElementById("all-stories-grid");

    const latestStoriesGrid =
        document.getElementById("latest-stories-grid");

    const emptyState =
        document.getElementById("stories-empty");


    /*
     * ALL STORIES PAGE
     */

    if (allStoriesGrid) {

        if (stories.length === 0) {

            allStoriesGrid.innerHTML = "";

            if (emptyState) {
                emptyState.hidden = false;
            }

        } else {

            allStoriesGrid.innerHTML =
                stories.map(generateStoryHTML).join("");

            if (emptyState) {
                emptyState.hidden = true;
            }
        }
    }


    /*
     * HOMEPAGE
     * Show maximum 3 newest stories.
     */

    if (latestStoriesGrid) {

        const latestStories =
            stories.slice(0, 3);

        latestStoriesGrid.innerHTML =
            latestStories
                .map(generateStoryHTML)
                .join("");
    }


    /*
     * Re-run reveal animations for dynamically
     * generated cards.
     */

    /* Activate dynamically generated story cards */
document
    .querySelectorAll(".stories-grid .reveal")
    .forEach(function (element) {

        requestAnimationFrame(function () {
            element.classList.add("active");
        });

    });

}


/*
 * ==========================================
 * INITIALISE
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", () => {
    renderStories();
});
