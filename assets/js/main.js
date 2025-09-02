(() => {
    // Language toggle
    const links = document.querySelectorAll('nav a');
    const toggleButton = document.getElementById('lang-toggle');
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
        if (toggleButton) {
            toggleButton.textContent = isFrench ? 'EN' : 'FR';
            toggleButton.setAttribute('aria-label', isFrench ? 'Switch to English' : 'Passer en français');
            toggleButton.setAttribute('aria-pressed', String(isFrench)); // optional for assistive tech
        }
    }

    updateLanguageDisplay();

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            isFrench = !isFrench;
            updateLanguageDisplay();

            // remove focus so the button doesn't remain visually "pressed"
            // but we still preserve keyboard focus when the user tabs to it (focus-visible)
            toggleButton.blur();
        });

        // optional: ensure touch/pointer interactions don't leave focus stuck
        toggleButton.addEventListener('pointerup', () => toggleButton.blur());
        toggleButton.addEventListener('touchend', () => toggleButton.blur());
    }

    // Cursor-aura (smoothed) for project cards, nav pills and the language toggle
    const auraTargets = document.querySelectorAll('.project-card, header nav a, #lang-toggle');

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
})();


