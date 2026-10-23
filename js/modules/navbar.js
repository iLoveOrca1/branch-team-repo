export function initNavbar() {
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;
  // Buka/tutup tombol hamburger
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
  // Otomatis tutup menu saat link diklik
  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a[href^="#"]')) {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}
