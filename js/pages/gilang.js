/**
 * gilang.js
 * Script interaktif untuk portofolio I Made Gilang Pradnyananda (branch gilang).
 * Terintegrasi dengan efek kursor, typewriter, progress scroll mini-map, dan interaksi form.
 */

// --- 1. Custom Cursor Follower ---
function initCustomCursor() {
  const cursor = document.getElementById("customCursor");
  const dot = document.getElementById("customCursorDot");

  if (!cursor || !dot || window.innerWidth < 768) return;

  document.body.classList.add("has-custom-cursor");

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame = 0;
  let hasPointerPosition = false;

  function followPointer() {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      animationFrame = window.requestAnimationFrame(followPointer);
    } else {
      animationFrame = 0;
    }
  }

  document.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursor.classList.add("is-visible");
    dot.classList.add("is-visible");
    dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;

    if (!hasPointerPosition) {
      currentX = targetX;
      currentY = targetY;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      hasPointerPosition = true;
    }

    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(followPointer);
    }
  });

  document.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-visible");
    dot.classList.remove("is-visible");
    hasPointerPosition = false;
  });
}

// --- 2. Dynamic Typewriter Effect ---
function initTypewriter() {
  const el = document.getElementById("typed");
  if (!el) return;

  const roles = [
    "Software Engineering Student (TRPL)",
    "Full-Stack Web Developer",
    "Clean Code & Architecture Enthusiast",
    "Branch Team Contributor",
    "Problem Solver & Builder"
  ];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    el.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentWord = roles[roleIndex];
    charIndex += isDeleting ? -1 : 1;
    el.textContent = currentWord.slice(0, charIndex);

    let speed = isDeleting ? 30 : 65;

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 1600; // jeda saat selesai mengetik kata
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 300; // jeda sebelum mulai kata baru
    }

    setTimeout(tick, speed);
  }

  tick();
}

// --- 3. Navbar Sticky & Mobile Menu ---
function initNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function onScroll() {
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 8);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("click", (e) => {
      if (navLinks.classList.contains("open") && nav && !nav.contains(e.target)) {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
}

// --- 4. Smooth Scrolling ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

// --- 5. Progress Scroll, Mini-Map Rail & Active Navigation ---
function initProgressScroll() {
  const sections = document.querySelectorAll("main section");
  const mmNodes = document.querySelectorAll(".mm-node");
  const fill = document.getElementById("mmFill");
  const branch = document.getElementById("mmBranch");
  const bar = document.getElementById("bar");
  const navLinks = document.querySelectorAll(".links a");

  if (!sections.length) return;

  const PROBE_RATIO = 0.35;
  const BOTTOM_THRESHOLD = 8;
  const BRANCH_ON_INDEX = 3; // Section projects
  let ticking = false;

  function update() {
    ticking = false;
    const vh = window.innerHeight;
    const y = window.scrollY;
    const probe = y + vh * PROBE_RATIO;
    const docH = document.documentElement.scrollHeight;

    // Cari section aktif
    let activeIndex = 0;
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      const top = rect.top + y;
      if (top <= probe) {
        activeIndex = i;
      }
    }

    if (vh + y >= docH - BOTTOM_THRESHOLD) {
      activeIndex = sections.length - 1;
    }

    // Mini-map fill height
    if (fill) {
      const sectionTop = sections[activeIndex].getBoundingClientRect().top + y;
      const sectionH = sections[activeIndex].offsetHeight || 1;
      const fraction = Math.max(0, Math.min(1, (probe - sectionTop) / sectionH));
      const total = sections.length - 1;
      const pct = total > 0 ? Math.min(1, (activeIndex + fraction) / total) : 0;
      fill.style.height = `${pct * 100}%`;
    }

    // Mini-map node states
    mmNodes.forEach((node, idx) => {
      node.classList.toggle("passed", idx <= activeIndex);
      node.classList.toggle("active", idx === activeIndex);
      if (idx === activeIndex) {
        node.setAttribute("aria-current", "true");
      } else {
        node.removeAttribute("aria-current");
      }
    });

    // Branch curve highlight
    if (branch) {
      branch.classList.toggle("on", activeIndex >= BRANCH_ON_INDEX);
    }

    // Highlight navbar link
    const currentId = sections[activeIndex]?.id;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });

    // Top navbar slim progress bar
    if (bar) {
      const maxScroll = docH - vh;
      const barPct = maxScroll > 0 ? Math.min(100, (y / maxScroll) * 100) : 0;
      bar.style.width = `${barPct}%`;
    }
  }

  function onScrollOrResize() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
  update();
}

// --- 6. Project Filter Interactivity ---
function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category") || "";
        if (filter === "all" || category.includes(filter)) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 10);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(10px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 200);
        }
      });
    });
  });
}

// --- 7. Toast Notification Utility ---
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toast.classList.add("show");

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// --- 8. Contact Form & Copy Actions ---
function initContactActions() {
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("formName")?.value || "Rekan";
      showToast(`Terima kasih ${name}! Pesan berhasil terkirim.`);
      form.reset();
    });
  }

  // Copy Email Button
  const copyBtn = document.getElementById("copyEmailBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const email = copyBtn.getAttribute("data-email") || "gilang@example.com";
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email (${email}) disalin ke clipboard!`);
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  }
}

// --- Initializer ---
document.addEventListener("DOMContentLoaded", () => {
  initCustomCursor();
  initTypewriter();
  initNav();
  initSmoothScroll();
  initProgressScroll();
  initProjectFilters();
  initContactActions();
});
