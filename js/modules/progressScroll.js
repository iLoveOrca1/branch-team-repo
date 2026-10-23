/**
 * progressScroll.js
 * --------------------------------------------------
 * Menghitung posisi scroll dan memperbarui:
 *  - progress bar di navbar (#bar)
 *  - mini-map fill (#mmFill) & node indicators (.mm-node)
 *  - branch highlight (#mmBranch)
 *  - active nav-link highlighting
 *
 * Dioptimasi dengan requestAnimationFrame agar tidak
 * memblokir main thread saat scroll/resize.
 * --------------------------------------------------
 */

/** Probing position: 40% dari viewport height dari atas */
const PROBE_RATIO = 0.4;

/** Toleransi piksel dari bawah halaman untuk snap ke section terakhir */
const BOTTOM_THRESHOLD = 4;

/** Index section tempat class "on" ditambahkan ke branch element */
const BRANCH_ON_INDEX = 3;

let ticking = false;

/**
 * Mengambil referensi DOM yang dibutuhkan.
 * Dikembalikan sebagai objek agar mudah di-null-check.
 */
function getElements() {
  const sections = document.querySelectorAll("main section");
  const mmNodes  = document.querySelectorAll(".mm-node");
  const fill     = document.getElementById("mmFill");
  const branch   = document.getElementById("mmBranch");
  const bar      = document.getElementById("bar");
  const navLinks = document.querySelectorAll(".links a");

  return { sections, mmNodes, fill, branch, bar, navLinks };
}

/**
 * Hitung index section aktif berdasarkan posisi scroll.
 *
 * @param {NodeListOf<Element>} sections - Semua <section> di <main>
 * @param {number} probe - Posisi "probe" (scrollY + 40% viewport)
 * @returns {number} Index section yang sedang aktif
 */
function getActiveIndex(sections, probe) {
  let active = 0;

  for (let k = 0; k < sections.length; k++) {
    const sectionTop = sections[k].getBoundingClientRect().top + window.scrollY;
    if (sectionTop <= probe) {
      active = k;
    }
  }

  return active;
}

/**
 * Hitung persentase progress berdasarkan section aktif
 * dan seberapa jauh user sudah scroll di dalam section itu.
 *
 * @param {NodeListOf<Element>} sections
 * @param {number} activeIndex
 * @param {number} probe
 * @returns {number} Nilai 0–1
 */
function calcProgress(sections, activeIndex, probe) {
  const sectionTop = sections[activeIndex].getBoundingClientRect().top + window.scrollY;
  const sectionH   = sections[activeIndex].offsetHeight || 1;
  const fraction   = Math.max(0, Math.min(1, (probe - sectionTop) / sectionH));
  const total      = sections.length - 1;

  return total > 0 ? Math.min(1, (activeIndex + fraction) / total) : 0;
}

/**
 * Frame update — dipanggil via requestAnimationFrame.
 * Memperbarui semua indikator visual berdasarkan posisi scroll saat ini.
 */
function update(els) {
  ticking = false;

  const { sections, mmNodes, fill, branch, bar, navLinks } = els;
  if (!sections.length) return;

  const vh    = window.innerHeight;
  const y     = window.scrollY;
  const probe = y + vh * PROBE_RATIO;
  const docH  = document.documentElement.scrollHeight;

  // — Tentukan section aktif —
  let activeIndex = getActiveIndex(sections, probe);

  // Snap ke section terakhir jika sudah di bawah halaman
  if (vh + y >= docH - BOTTOM_THRESHOLD) {
    activeIndex = sections.length - 1;
  }

  // — Hitung progress (0 – 1) —
  const pct = calcProgress(sections, activeIndex, probe);

  // — Update mini-map fill —
  if (fill) {
    fill.style.height = `${pct * 100}%`;
  }

  // — Update mini-map nodes —
  mmNodes.forEach((node, idx) => {
    node.classList.toggle("passed", idx <= activeIndex);
    node.classList.toggle("active", idx === activeIndex);

    if (idx === activeIndex) {
      node.setAttribute("aria-current", "true");
    } else {
      node.removeAttribute("aria-current");
    }
  });

  // — Update branch highlight —
  if (branch) {
    branch.classList.toggle("on", activeIndex >= BRANCH_ON_INDEX);
  }

  // — Highlight nav-link yang sesuai section aktif —
  const activeId = sections[activeIndex]?.id;
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });

  // — Update progress bar di navbar —
  if (bar) {
    const maxScroll = docH - vh;
    const barPct    = maxScroll > 0 ? Math.min(100, (y / maxScroll) * 100) : 0;
    bar.style.width = `${barPct}%`;
  }
}

/**
 * Request satu frame update (debounce via rAF).
 */
function requestUpdate(els) {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => update(els));
  }
}

/**
 * Inisialisasi progress-scroll tracking.
 * Dipanggil sekali setelah DOM siap.
 */
export function initProgressScroll() {
  const els = getElements();

  // Jika tidak ada section, tidak perlu tracking
  if (!els.sections.length) return;

  const onEvent = () => requestUpdate(els);

  window.addEventListener("scroll", onEvent, { passive: true });
  window.addEventListener("resize", onEvent);

  // Jalankan pertama kali untuk set state awal
  update(els);
}