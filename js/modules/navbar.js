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

  // Highlight menu navbar aktif sesuai section yang terlihat (Scroll Spy)
  const sections = document.querySelectorAll("main section[id]");
  const links = navLinks.querySelectorAll("a[href^='#']");

  if (sections.length && links.length) {
    function updateActiveLink() {
      const probe = window.scrollY + window.innerHeight * 0.35;
      let activeId = sections[0].id;

      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top + window.scrollY;
        if (top <= probe) {
          activeId = sec.id;
        }
      });

      // Jika sudah di paling bawah halaman, aktifkan section terakhir
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) {
        activeId = sections[sections.length - 1].id;
      }

      links.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${activeId}`);
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('resize', updateActiveLink);
    updateActiveLink();
  }
}
