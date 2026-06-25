// PRELOADER — only on initial load
window.addEventListener('load', () => { setTimeout(() => { document.getElementById('pl')?.classList.add('out') }, 1800) });

// SCROLL PROGRESS + NAV HIDE/SHOW
const spb = document.getElementById('spb');
const navEl = document.querySelector('nav');
let lastScrollY = 0;
let scrollThreshold = 80; // don't hide until user has scrolled past this
if (spb || navEl) {
    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        // Scroll progress bar
        if (spb) {
            const h = document.documentElement;
            const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
            spb.style.width = (isNaN(pct) ? 0 : pct) + '%';
        }
        // Nav hide/show on scroll direction
        if (navEl) {
            if (currentY > lastScrollY && currentY > scrollThreshold) {
                // Scrolling DOWN past threshold → hide
                navEl.classList.add('nav-hidden');
            } else {
                // Scrolling UP → show
                navEl.classList.remove('nav-hidden');
            }
            lastScrollY = currentY;
        }
    }, { passive: true });
}

// LANG
function setLang(el, langCode) { 
    document.querySelectorAll('.lb').forEach(b => b.classList.remove('on')); 
    el.classList.add('on'); 
    
    const selectField = document.querySelector(".goog-te-combo");
    if (selectField) {
        selectField.value = langCode;
        selectField.dispatchEvent(new Event('change'));
    }
}

// REVEAL — exposed globally so router.js can call it
function checkRv() {
    document.querySelectorAll('.rv,.rv-l,.rv-r').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 60) el.classList.add('vis')
    })
}
window.addEventListener('scroll', checkRv, { passive: true });
setTimeout(checkRv, 300);

// COUNT-UP — exposed globally with a reset function for SPA re-init
let counted = false;

function resetCount() {
    counted = false;
}

function startCount() {
    if (counted) return; counted = true;
    document.querySelectorAll('.ch-n[data-t]').forEach(el => {
        const t = +el.dataset.t, s = el.dataset.s || '';
        let v = 0; const step = Math.ceil(t / 60);
        const iv = setInterval(() => {
            v += step;
            if (v >= t) { v = t; clearInterval(iv); }
            el.innerHTML = v + (s ? `<span class="ch-s">${s}</span>` : '')
        }, 1600 / 60)
    })
}

const chiffresSection = document.querySelector('.chiffres-fs');
if (chiffresSection) {
    new IntersectionObserver(e => { if (e[0].isIntersecting) startCount() }, { threshold: .3 }).observe(chiffresSection);
}

// FILTERS (Publications)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.yb');
    if (!btn) return;
    
    const container = btn.closest('.yf');
    if (!container) return;
    
    container.querySelectorAll('.yb').forEach(x => x.classList.remove('on'));
    btn.classList.add('on');
    
    const targetYear = btn.getAttribute('data-year');
    if (!targetYear) return;
    
    const items = document.querySelectorAll('.pub-it');
    items.forEach(item => {
        const itemYear = item.getAttribute('data-year');
        if (targetYear === 'all' || itemYear === targetYear) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});
