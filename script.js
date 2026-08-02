"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const html = document.documentElement;
    const body = document.body;

    const welcomeScreen =
        document.getElementById("welcome-screen");

    const mainContent =
        document.getElementById("main-content");

    const themeToggle =
        document.getElementById("theme-toggle");

    const languageToggle =
        document.getElementById("lang-toggle");

    const languageLabel =
        document.getElementById("language-label");

    const menuToggle =
    document.getElementById("menu-toggle");

const menu =
    document.getElementById("nav-menu");

const menuClose =
    document.getElementById("menu-close");

const menuOverlay =
    document.getElementById("menu-overlay");

    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    const reducedMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       PAGE LOAD
       ===================================================== */

    body.classList.add("page-loaded");


    /* =====================================================
       WELCOME SCREEN
       ===================================================== */

    let welcomed = false;

    try {
        welcomed =
            sessionStorage.getItem(
                "popen_welcomed"
            ) === "true";
    } catch (error) {
        welcomed = false;
    }


    function closeWelcome() {

        if (!welcomeScreen) {

            if (mainContent) {
                mainContent.classList.remove(
                    "welcome-active"
                );
            }

            return;
        }


        welcomeScreen.classList.add("hide");


        if (mainContent) {

            mainContent.classList.remove(
                "welcome-active"
            );
        }


        try {

            sessionStorage.setItem(
                "popen_welcomed",
                "true"
            );

        } catch (error) {
            // Ignore storage errors
        }


        setTimeout(function () {

            if (welcomeScreen) {
                welcomeScreen.remove();
            }

        }, reducedMotion ? 50 : 1100);
    }


    if (
        welcomed ||
        reducedMotion
    ) {

        if (welcomeScreen) {
            welcomeScreen.remove();
        }

        if (mainContent) {
            mainContent.classList.remove(
                "welcome-active"
            );
        }

    } else {

        if (mainContent) {
            mainContent.classList.add(
                "welcome-active"
            );
        }

        setTimeout(
            closeWelcome,
            3700
        );
    }


    /* =====================================================
       THEME
       ===================================================== */

    function getTheme() {

        try {

            const saved =
                localStorage.getItem(
                    "popen_theme"
                );

            if (
                saved === "dark" ||
                saved === "light"
            ) {
                return saved;
            }

        } catch (error) {
            // Ignore
        }


        if (
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
        ) {
            return "dark";
        }


        return "light";
    }


    function applyTheme(theme) {

        const dark =
            theme === "dark";


        html.setAttribute(
            "data-theme",
            dark ? "dark" : "light"
        );


        if (themeToggle) {

            themeToggle.setAttribute(
                "aria-pressed",
                String(dark)
            );


            themeToggle.setAttribute(
                "aria-label",
                dark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        }
    }


    function saveTheme(theme) {

        try {

            localStorage.setItem(
                "popen_theme",
                theme
            );

        } catch (error) {
            // Ignore
        }
    }


    applyTheme(getTheme());


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            function () {

                const current =
                    html.getAttribute(
                        "data-theme"
                    ) || "light";


                const next =
                    current === "dark"
                        ? "light"
                        : "dark";


                applyTheme(next);

                saveTheme(next);
            }
        );
    }


    /* =====================================================
       LANGUAGE
       ===================================================== */

    const translations = {

        "menu-title": {
            en: "Menu",
            bn: "মেনু"
        },

        "nav-home": {
            en: "Home",
            bn: "হোম"
        },

        "nav-about": {
            en: "About",
            bn: "সম্পর্কে"
        },

        "nav-stories": {
            en: "Stories",
            bn: "গল্পসমূহ"
        },

        "nav-contact": {
            en: "Contact",
            bn: "যোগাযোগ"
        },

        "hero-label": {
            en: "A personal storytelling space",
            bn: "একটি ব্যক্তিগত গল্প বলার জায়গা"
        },

        "hero-title": {
            en: "Welcome to POPEN",
            bn: "POPEN-এ স্বাগতম"
        },

        "hero-subtitle": {
            en:
                "A place for stories, memories and little moments.",
            bn:
                "গল্প, স্মৃতি এবং ছোট ছোট মুহূর্তের একটি জায়গা।"
        },

        "hero-btn": {
            en: "Explore Stories",
            bn: "গল্পগুলো দেখুন"
        },

        "hero-about": {
            en: "About POPEN",
            bn: "POPEN সম্পর্কে"
        },

        "scroll": {
            en: "Scroll to explore",
            bn: "নিচে যান"
        },

        "about-title": {
            en: "About POPEN",
            bn: "POPEN সম্পর্কে"
        },

        "contact-title": {
            en: "Connect",
            bn: "যোগাযোগ"
        },

        "contact-fb-normal": {
            en: "Facebook",
            bn: "ফেসবুক"
        },

        "contact-fb-voss": {
            en: "VOSS",
            bn: "VOSS"
        },

        "contact-email": {
            en: "Email",
            bn: "ইমেইল"
        },

        "contact-official": {
            en: "Official POPEN Email",
            bn: "অফিসিয়াল POPEN ইমেইল"
        },

        "contact-soon": {
            en: "Coming soon",
            bn: "শীঘ্রই আসছে"
        }

    };


    function getLanguage() {

        try {

            const saved =
                localStorage.getItem(
                    "popen_language"
                );


            if (
                saved === "en" ||
                saved === "bn"
            ) {
                return saved;
            }

        } catch (error) {
            // Ignore
        }


        return "en";
    }


    function saveLanguage(language) {

        try {

            localStorage.setItem(
                "popen_language",
                language
            );

        } catch (error) {
            // Ignore
        }
    }


    function applyLanguage(language) {

        if (
            language !== "en" &&
            language !== "bn"
        ) {
            language = "en";
        }


        html.setAttribute(
            "lang",
            language
        );


        html.setAttribute(
            "data-language",
            language
        );


        document
            .querySelectorAll("[data-i18n]")
            .forEach(function (element) {

                const key =
                    element.getAttribute(
                        "data-i18n"
                    );


                if (
                    translations[key] &&
                    translations[key][language]
                ) {

                    element.textContent =
                        translations[key][language];
                }

            });


        if (languageLabel) {

            languageLabel.textContent =
                language === "en"
                    ? "বাংলা"
                    : "EN";
        }


        if (languageToggle) {

            languageToggle.setAttribute(
                "aria-label",
                language === "en"
                    ? "Switch to Bengali"
                    : "ইংরেজিতে পরিবর্তন করুন"
            );
        }


        saveLanguage(language);
    }


    applyLanguage(
        getLanguage()
    );


    if (languageToggle) {

        languageToggle.addEventListener(
            "click",
            function () {

                const current =
                    html.getAttribute(
                        "lang"
                    ) || "en";


                const next =
                    current === "en"
                        ? "bn"
                        : "en";


                applyLanguage(next);
            }
        );
    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    function openMenu() {

        if (!menu) {
            return;
        }


        menu.classList.add("active");


        if (menuOverlay) {
            menuOverlay.classList.add("active");
        }


        if (menuToggle) {

            menuToggle.classList.add("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "true"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Close menu"
            );
        }


        menu.setAttribute(
            "aria-hidden",
            "false"
        );


        body.classList.add(
            "menu-open"
        );
    }


    function closeMenu() {

        if (!menu) {
            return;
        }


        menu.classList.remove(
            "active"
        );


        if (menuOverlay) {

            menuOverlay.classList.remove(
                "active"
            );
        }


        if (menuToggle) {

            menuToggle.classList.remove(
                "active"
            );

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open menu"
            );
        }


        menu.setAttribute(
            "aria-hidden",
            "true"
        );


        body.classList.remove(
            "menu-open"
        );
    }


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            function () {

                const isOpen =
                    menu &&
                    menu.classList.contains(
                        "active"
                    );


                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }

            }
        );
    }


    if (menuClose) {

        menuClose.addEventListener(
            "click",
            closeMenu
        );
    }


    if (menuOverlay) {

        menuOverlay.addEventListener(
            "click",
            closeMenu
        );
    }


/* =====================================================
   MENU LINKS
   ===================================================== */

document.querySelectorAll(".menu-item").forEach(function (link) {

    link.addEventListener("click", function (event) {

        const href = link.getAttribute("href");

        if (!href) {
            return;
        }

        /* ---------------------------------------------
           SAME PAGE LINKS
           Example: #about / #contact
        --------------------------------------------- */

        if (href.startsWith("#")) {

            event.preventDefault();

            const target = document.getElementById(
                href.substring(1)
            );

            if (!target) {
                console.warn(
                    "Menu target not found:",
                    href
                );

                closeMenu();
                return;
            }

            closeMenu();

            const navbar =
                document.querySelector(".navbar");

            const navHeight =
                navbar
                    ? navbar.offsetHeight
                    : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                navHeight -
                20;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: reducedMotion
                    ? "auto"
                    : "smooth"
            });

            return;
        }

        /* ---------------------------------------------
           OTHER HTML PAGES
           Example: index.html / stories.html
        --------------------------------------------- */

        closeMenu();

        window.location.href = href;

    });

});


    /* =====================================================
       ESC KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeMenu();
            }

        }
    );


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        revealElements.forEach(
            function (element) {

                element.classList.add(
                    "active"
                );

            }
        );

    } else {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "active"
                                );


                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.1,

                    rootMargin:
                        "0px 0px -50px 0px"
                }
            );


        revealElements.forEach(
            function (element) {

                observer.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       RESIZE
       ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 700
            ) {

                closeMenu();
            }

        }
    );


    /* =====================================================
       INITIAL HASH
       ===================================================== */

    if (window.location.hash) {

        setTimeout(
            function () {

                const target =
                    document.querySelector(
                        window.location.hash
                    );


                if (!target) {
                    return;
                }


                const navbar =
                    document.querySelector(
                        ".navbar"
                    );


                const navHeight =
                    navbar
                        ? navbar.offsetHeight
                        : 0;


                const position =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    navHeight -
                    20;


                window.scrollTo({

                    top:
                        Math.max(
                            0,
                            position
                        ),

                    behavior:
                        reducedMotion
                            ? "auto"
                            : "smooth"
                });

            },
            500
        );

    }

});