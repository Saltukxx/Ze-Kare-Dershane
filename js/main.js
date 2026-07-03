(function () {
    'use strict';

    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js-ready');

    const navbar = document.getElementById('navbar');

    function syncNavHeight() {
        if (!navbar) {
            return;
        }
        document.documentElement.style.setProperty('--nav-height', navbar.offsetHeight + 'px');
    }

    syncNavHeight();
    window.addEventListener('resize', syncNavHeight, { passive: true });
    window.addEventListener('load', syncNavHeight);

    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');
    const yearEl = document.getElementById('year');
    const fadeElements = document.querySelectorAll('.fade-in');
    const navAnchors = navLinks.querySelectorAll('a');

    yearEl.textContent = new Date().getFullYear();

    function handleScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }

    function closeMobileMenu() {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        if (navBackdrop) {
            navBackdrop.classList.remove('visible');
            navBackdrop.hidden = true;
        }
    }

    function openMobileMenu() {
        navLinks.classList.add('open');
        navToggle.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
        if (navBackdrop) {
            navBackdrop.hidden = false;
            navBackdrop.classList.add('visible');
        }
    }

    navToggle.addEventListener('click', function () {
        if (navLinks.classList.contains('open')) {
            closeMobileMenu();
            return;
        }
        openMobileMenu();
        syncNavHeight();
    });

    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMobileMenu);
    }

    navAnchors.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target)) {
            closeMobileMenu();
        }
    });

    function updateActiveLink() {
        const scrollPos = window.scrollY + 120;
        let current = '';

        document.querySelectorAll('section[id], header[id], footer[id]').forEach(function (section) {
            if (scrollPos >= section.offsetTop) {
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(function (link) {
            const isActive = link.getAttribute('href') === '#' + current;
            link.classList.toggle('active', isActive && !link.classList.contains('nav-cta'));
        });
    }

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    fadeElements.forEach(function (el) {
        observer.observe(el);
    });

    window.addEventListener('scroll', function () {
        handleScroll();
        updateActiveLink();
    }, { passive: true });

    handleScroll();
    updateActiveLink();
})();
