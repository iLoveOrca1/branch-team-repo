function scrollToSection(selector) {
  const target = document.querySelector(selector);
  if (!target) return false;

  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });

  return true;
}


// window.addEventListener("scroll", onScroll, { passive: true });

export function initSmoothScroll() {
  const navLinks = document.getElementById('navLinks');
  const toggle = document.getElementById('navToggle');

  if (!navLinks) return;

  // satu listener untuk semua link (event delegation)
  navLinks.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const didScroll = scrollToSection(link.getAttribute('href'));
    if (!didScroll) return;

    e.preventDefault();

    // tutup menu mobile setelah klik
    navLinks.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
}


