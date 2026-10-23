// --- 1. Filter Kategori Proyek ---
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

// --- 2. Toast Notification Helper ---
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

// --- 3. Form Kontak & Tombol Salin Email ---
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

// --- 4. Graph Cabang Rekam Jejak (SVG Commit Graph) ---
function initCommitGraph() {
  const box = document.getElementById("experience-commits");
  const svg = document.getElementById("experience-cg");
  if (!box || !svg) return;

  const C0 = "#58a6ff";
  const C3 = "#7ee787";
  const NS = "#0a0d14";

  function yOf(e0, wrap) {
    let y = 0, e = e0;
    while (e && e !== wrap) {
      y += e.offsetTop;
      e = e.offsetParent;
    }
    return y + Math.min(e0.offsetHeight / 2, 13);
  }

  function drawCommits() {
    const small = window.innerWidth <= 560;
    const x0 = small ? 6 : 8;
    const x1 = small ? 20 : 28;
    const cms = box.querySelectorAll(".cm");
    const ys = Array.from(cms).map((c) => yOf(c.querySelector("[data-a]") || c, box));
    if (!ys.length) return;

    const H = box.offsetHeight;
    const yF = ys[0] - 38;
    const yM = H - 26;
    let s = "";

    // main line
    s += `<line x1="${x0}" x2="${x0}" y1="0" y2="${H}" stroke="${C0}" stroke-width="2"/>`;
    // cabang keluar dari main, turun, lalu merge kembali ke main
    s += `<path d="M${x0} ${yF} C ${x0} ${yF + 20}, ${x1} ${yF + 10}, ${x1} ${yF + 34}" stroke="${C3}" stroke-width="2" fill="none"/>`;
    s += `<line x1="${x1}" x2="${x1}" y1="${yF + 34}" y2="${yM - 34}" stroke="${C3}" stroke-width="2"/>`;
    s += `<path d="M${x1} ${yM - 34} C ${x1} ${yM - 10}, ${x0} ${yM - 20}, ${x0} ${yM}" stroke="${C3}" stroke-width="2" fill="none"/>`;

    // node fork dan merge di main
    s += `<circle cx="${x0}" cy="${yF}" r="4" fill="${NS}" stroke="${C0}" stroke-width="2"/>`;
    s += `<circle cx="${x0}" cy="${yM}" r="4" fill="${NS}" stroke="${C0}" stroke-width="2"/>`;

    // commit node pada cabang
    ys.forEach((y) => {
      s += `<circle cx="${x1}" cy="${y}" r="4" fill="${NS}" stroke="${C3}" stroke-width="2"/>`;
    });

    svg.setAttribute("height", H);
    svg.innerHTML = s;
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      drawCommits();
    });
  }

  drawCommits();
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(schedule);
  }
}

// Jalankan fitur tambahan saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
  initProjectFilters();
  initContactActions();
  initCommitGraph();
});
