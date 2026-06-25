/**
 * SPA Router — AJAX page loading without full page reload.
 * Intercepts internal link clicks, fetches page content via AJAX,
 * and injects the HTML into #page-content.
 */
(function () {
    'use strict';

    const contentEl = document.getElementById('page-content');
    if (!contentEl) return; // Not on public layout

    // Routes that should be handled by the SPA router (public pages only)
    const SPA_ROUTES = ['/', '/qui-sommes-nous', '/axes', '/projets', '/formations', '/publications', '/evenements'];

    let isNavigating = false;

    // ─── HELPERS ───────────────────────────────────────────────

    /** Check if a URL should be handled by the SPA router */
    function isSpaRoute(url) {
        try {
            const u = new URL(url, window.location.origin);
            // Only handle same-origin, public routes (not /admin, not external)
            if (u.origin !== window.location.origin) return false;
            return SPA_ROUTES.includes(u.pathname);
        } catch { return false; }
    }

    /** Show/hide the loading bar */
    function showLoader() {
        const loader = document.getElementById('ajax-loader');
        if (loader) loader.classList.add('active');
    }
    function hideLoader() {
        const loader = document.getElementById('ajax-loader');
        if (loader) {
            loader.classList.add('done');
            setTimeout(() => {
                loader.classList.remove('active', 'done');
            }, 400);
        }
    }

    /** Update the active link in the navbar */
    function updateNav(currentPage) {
        document.querySelectorAll('.nlinks a').forEach(a => {
            a.classList.remove('act');
            const href = a.getAttribute('href');
            // Map href to currentPage key
            const map = {
                '/': 'home',
                '/axes': 'axes',
                '/projets': 'projets',
                '/formations': 'formations',
                '/publications': 'publications',
                '/evenements': 'events'
            };
            if (map[href] === currentPage) {
                a.classList.add('act');
            }
        });
    }

    /** Re-initialize page-specific JS after content injection */
    function reinitPage() {
        // Re-run reveal animations
        if (typeof checkRv === 'function') {
            // Reset all reveal elements so they animate in fresh
            contentEl.querySelectorAll('.rv,.rv-l,.rv-r').forEach(el => el.classList.remove('vis'));
            setTimeout(checkRv, 50);
        }

        // Re-init count-up if chiffres section exists
        if (typeof resetCount === 'function') resetCount();
        const chSec = contentEl.querySelector('.chiffres-fs');
        if (chSec && typeof startCount === 'function') {
            new IntersectionObserver(e => { if (e[0].isIntersecting) startCount(); }, { threshold: .3 }).observe(chSec);
        }

        // Re-init slider if hero exists
        if (contentEl.querySelector('.hero-slider') && typeof initSlider === 'function') {
            initSlider();
        }

        // Scroll progress bar reset
        window.dispatchEvent(new Event('scroll'));
    }

    // ─── NAVIGATION ───────────────────────────────────────────

    /** Navigate to a URL via AJAX */
    function navigateTo(url, pushState = true) {
        if (isNavigating) return;
        isNavigating = true;
        showLoader();

        fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            // Fade out old content
            contentEl.style.opacity = '0';
            contentEl.style.transform = 'translateY(12px)';

            setTimeout(() => {
                // Inject new HTML
                contentEl.innerHTML = data.html;

                // Update browser title
                document.title = data.title;

                // Update active nav
                updateNav(data.currentPage);

                // Push to browser history
                if (pushState) {
                    history.pushState({ url, title: data.title, currentPage: data.currentPage }, data.title, url);
                }

                // Scroll to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Fade in new content
                requestAnimationFrame(() => {
                    contentEl.style.opacity = '1';
                    contentEl.style.transform = 'none';
                });

                // Re-initialize page-specific JS
                reinitPage();

                hideLoader();
                isNavigating = false;
            }, 200); // Match CSS transition duration
        })
        .catch(err => {
            console.error('SPA navigation error:', err);
            // Fallback to traditional navigation
            window.location.href = url;
        });
    }

    // ─── EVENT LISTENERS ──────────────────────────────────────

    /** Intercept clicks on internal links */
    document.addEventListener('click', function (e) {
        // Find closest anchor tag
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');

        // Skip: external links, admin links, hash-only links, modifier keys
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        if (link.getAttribute('target') === '_blank') return;

        // Build full URL to check
        const fullUrl = new URL(href, window.location.origin).href;

        if (isSpaRoute(fullUrl)) {
            e.preventDefault();
            // Don't navigate if we're already on this page
            if (new URL(fullUrl).pathname === window.location.pathname) return;
            navigateTo(href);
        }
    });

    /** Handle browser back/forward */
    window.addEventListener('popstate', function (e) {
        if (e.state && e.state.url) {
            navigateTo(e.state.url, false);
        } else {
            // Fallback: navigate to current URL
            navigateTo(window.location.pathname, false);
        }
    });

    /** Store initial state in history */
    history.replaceState(
        { url: window.location.pathname, title: document.title, currentPage: '' },
        document.title,
        window.location.pathname
    );

    // ─── CSS TRANSITIONS ──────────────────────────────────────
    // Add transition styles to content container
    contentEl.style.transition = 'opacity .2s ease, transform .2s ease';

})();
