(() => {
    // ======================
    // Language toggle
    // ======================

    // Elements with class "lang" and either "en" or "fr" will be shown/hidden based on the current language
    // Navigation links have data attributes for both languages
    // The button-toggle button switches languages
    const links = document.querySelectorAll('nav a');
    const langToggle = document.getElementById('lang-toggle');
    let isFrench = (navigator.language || navigator.userLanguage || '').startsWith('fr');

    function updateLanguageDisplay() {
        document.querySelectorAll('.lang').forEach(el => {
            const show = el.classList.contains('fr') ? isFrench : !isFrench;
            el.style.display = show ? '' : 'none';
        });

        links.forEach(link => {
            link.textContent = isFrench ? link.dataset.fr : link.dataset.en;
        });

        // show the opposite language on the button (if site is English -> show "FR", and vice-versa)
        if (langToggle) {
            langToggle.textContent = isFrench ? 'EN' : 'FR';
            langToggle.setAttribute('aria-label', isFrench ? 'Switch to English' : 'Passer en français');
            langToggle.setAttribute('aria-pressed', String(isFrench)); // optional for assistive tech
        }
    }

    // Initial display update
    updateLanguageDisplay();

    // Toggle language on button click
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            isFrench = !isFrench;
            // Call the update function again to refresh the display
            updateLanguageDisplay();

            // remove focus so the button doesn't remain visually "pressed"
            // but we still preserve keyboard focus when the user tabs to it (focus-visible)
            langToggle.blur();
        });

        // ensure touch/pointer interactions don't leave focus stuck
        langToggle.addEventListener('pointerup', () => langToggle.blur());
        langToggle.addEventListener('touchend', () => langToggle.blur());
    }

    // ======================
    // Cursor aura effect
    // ======================

    // Cursor-aura (smoothed) for project cards, nav pills and the button toggle
    const auraTargets = document.querySelectorAll('.project-card, header nav a, .button-toggle');

    const getClientXY = e => {
        if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: e.clientX, y: e.clientY };
    };

    // Initialize aura effect on an element
    function initAura(el) {
        let targetX = 0, targetY = 0;
        let curX = 0, curY = 0;
        let rafId = null;
        const SMOOTH = 0.16;

        const setVars = (x, y) => {
            // use px for absolute positioning on smaller elements; fallback to percent if needed
            el.style.setProperty('--x', `${x}px`);
            el.style.setProperty('--y', `${y}px`);
        };

        const loop = () => {
            curX += (targetX - curX) * SMOOTH;
            curY += (targetY - curY) * SMOOTH;
            setVars(curX, curY);

            if (Math.abs(targetX - curX) + Math.abs(targetY - curY) > 0.3) {
                rafId = requestAnimationFrame(loop);
            } else {
                rafId = null;
            }
        };

        const onPointerMove = e => {
            const rect = el.getBoundingClientRect();
            const pos = getClientXY(e);
            if (pos.x == null || pos.y == null) return;

            targetX = pos.x - rect.left;
            targetY = pos.y - rect.top;

            if (!rafId) rafId = requestAnimationFrame(loop);
        };

        const onEnter = e => {
            el.classList.add('is-hovered');
            onPointerMove(e);
        };

        const onLeave = () => {
            el.classList.remove('is-hovered');
        };

        el.addEventListener('mousemove', onPointerMove);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);

        el.addEventListener('touchstart', onEnter, { passive: true });
        el.addEventListener('touchmove', onPointerMove, { passive: true });
        el.addEventListener('touchend', onLeave);
    }

    auraTargets.forEach(initAura);

    // ======================
    // Mobile nav toggle
    // ======================

    // Toggle the "nav-open" class on the header when the nav toggle button is clicked
    // This class controls the visibility of the nav menu on small screens
    const navToggle = document.getElementById('nav-toggle');
    const headerEl = document.querySelector('header');
    const bodyEl = document.body;

    if (navToggle && headerEl) {
        navToggle.addEventListener('click', () => {
            const open = headerEl.classList.toggle('nav-open');
            bodyEl.classList.toggle('nav-open', open); // for backdrop effect
            navToggle.setAttribute('aria-expanded', String(open));
        });

        // close menu when a nav link is clicked
        const navEl = document.querySelector('header nav');
        if (navEl) {
            navEl.addEventListener('click', (e) => {
                if (e.target && e.target.tagName === 'A') {
                    headerEl.classList.remove('nav-open');
                    bodyEl.classList.remove('nav-open');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.blur();
                }
            });
        }
        navToggle.addEventListener('pointerup', () => navToggle.blur());
        navToggle.addEventListener('touchend', () => navToggle.blur());
    }
})();


