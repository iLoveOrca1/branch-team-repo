/* Interaksi portofolio I Kadek Oka Santika
   Navbar dan terminal interaktif. Tanpa library, tanpa variabel global. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GITHUB = 'https://github.com/okaSantikaa';
  var REPO = GITHUB + '/branch-team-repo';
  var SECTIONS = { home: 'oka-home', about: 'oka-about', skills: 'oka-skills', projects: 'oka-projects', journey: 'oka-journey', contact: 'oka-contact' };

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    initNav();
    initTerminal();
  });

  /* Navbar: menu mobile, progress scroll, tautan aktif, tahun footer */
  function initNav() {
    var nav = document.getElementById('oka-nav');
    var btn = document.getElementById('oka-menu-btn');
    var links = document.getElementById('oka-nav-links');
    var bar = document.getElementById('oka-progress');
    var year = document.getElementById('oka-year');
    if (year) year.textContent = new Date().getFullYear();

    function setMenu(open) {
      if (!btn || !links) return;
      links.classList.toggle('oka-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    }

    if (btn && links) {
      btn.addEventListener('click', function () { setMenu(!links.classList.contains('oka-open')); });
      links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && links.classList.contains('oka-open')) { setMenu(false); btn.focus(); }
      });
      document.addEventListener('click', function (e) {
        if (links.classList.contains('oka-open') && nav && !nav.contains(e.target)) setMenu(false);
      });
      window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });
    }

    var items = [];
    if (links) {
      links.querySelectorAll('a[href^="#"]').forEach(function (a) {
        var s = document.getElementById(a.getAttribute('href').slice(1));
        if (s) items.push({ a: a, s: s });
      });
    }

    var ticking = false;
    function update() {
      var top = window.pageYOffset || document.documentElement.scrollTop;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (max > 0 ? Math.min(100, top / max * 100) : 0) + '%';

      var activeId = null;
      items.forEach(function (it) {
        if (it.s.getBoundingClientRect().top - 120 <= 0) activeId = it.s.id;
      });
      if (max > 0 && top >= max - 4 && items.length) activeId = items[items.length - 1].s.id;

      items.forEach(function (it) {
        var on = it.s.id === activeId;
        it.a.classList.toggle('oka-active', on);
        if (on) it.a.setAttribute('aria-current', 'true'); else it.a.removeAttribute('aria-current');
      });
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* Terminal interaktif */
  function initTerminal() {
    var out = document.getElementById('oka-term-out');
    var form = document.getElementById('oka-term-form');
    var input = document.getElementById('oka-term-input');
    var chips = document.getElementById('oka-chips');
    if (!out || !form || !input) return;

    var PS = 'oka@denpasar:~$';
    var history = [];
    var histPos = 0;
    var autoplaying = false;

    function scrollDown() { out.scrollTop = out.scrollHeight; }

    // Satu baris output. Isi bisa teks, atau objek {pre, t, href, cls}.
    function line(c, cls) {
      var d = document.createElement('div');
      if (typeof c === 'object' && c.cls) cls = c.cls;
      d.className = 'oka-line' + (cls ? ' ' + cls : '');
      if (typeof c === 'string') {
        if (c === '') d.className = 'oka-gap'; else d.textContent = c;
      } else {
        if (c.pre) d.appendChild(document.createTextNode(c.pre));
        if (c.href) {
          var a = document.createElement('a');
          a.href = c.href; a.textContent = c.t; a.target = '_blank'; a.rel = 'noopener noreferrer';
          d.appendChild(a);
        } else {
          d.appendChild(document.createTextNode(c.t || ''));
        }
      }
      out.appendChild(d);
    }
    function print(lines, cls) { lines.forEach(function (l) { line(l, cls); }); scrollDown(); }

    function echo(text) {
      var d = document.createElement('div');
      d.className = 'oka-line';
      var p = document.createElement('span');
      p.className = 'oka-ps'; p.textContent = PS;
      d.appendChild(p);
      d.appendChild(document.createTextNode(text));
      out.appendChild(d);
    }

    function go(id) {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }

    var art = [
      '██  ██  ██  ',
      '  ██  ██  ██',
      '██  ██  ██  ',
      '  ██  ██  ██',
      '██  ██  ██  ',
      '  ██  ██  ██'
    ];

    var commands = {
      help: { d: 'daftar perintah', run: function () {
        return [
          'whoami      siapa saya',
          'neofetch    ringkasan singkat',
          'skills      yang sedang dipelajari',
          'projects    proyek dan eksplorasi',
          'contact     cara menghubungi saya',
          'goto <x>    pindah ke bagian: ' + Object.keys(SECTIONS).join(', '),
          'open <x>    buka github atau repo',
          'clear       bersihkan layar',
          '',
          { t: 'Tab melengkapi perintah, panah atas/bawah membuka riwayat.', cls: 'oka-dim' }
        ];
      } },
      whoami: { run: function () {
        return ['I Kadek Oka Santika', 'Mahasiswa Sistem Informasi semester 1, Undiksha Denpasar.', 'Sedang membangun dasar pemrograman dan logika.'];
      } },
      neofetch: { run: function () {
        var info = [
          'oka@denpasar',
          '------------',
          'kampus   Undiksha, Denpasar',
          'prodi    Sistem Informasi',
          'bahasa   Python, C++, JavaScript',
          'status   belajar, semester 1'
        ];
        return art.map(function (a, i) { return a + '   ' + info[i]; });
      } },
      skills: { run: function () {
        return [
          'python      dasar pemrograman, percabangan, perulangan, data sederhana',
          'c++         algoritma dan struktur program lewat latihan di terminal',
          'javascript  interaksi halaman web dan DOM'
        ];
      } },
      projects: { run: function () {
        return [
          '1. Portofolio Bootcamp (HTML, CSS, JavaScript, GitHub)',
          '   ketik "open repo" untuk melihat repository.',
          '2. Eksperimen Smart Lamp (Arduino, LDR, RTC, DHT22)',
          '   eksperimen pembelajaran, belum dirilis.'
        ];
      } },
      contact: { run: function () {
        return [
          { pre: 'github   ', t: 'github.com/okaSantikaa', href: GITHUB },
          'lokasi   Denpasar, Bali, Indonesia'
        ];
      } },
      goto: { run: function (args) {
        var key = (args[0] || '').toLowerCase();
        if (!SECTIONS[key]) return [{ t: 'pakai: goto <' + Object.keys(SECTIONS).join('|') + '>', cls: 'oka-err' }];
        go(SECTIONS[key]);
        return ['menuju ' + key + '...'];
      } },
      open: { run: function (args) {
        var key = (args[0] || '').toLowerCase();
        var url = key === 'github' ? GITHUB : key === 'repo' ? REPO : null;
        if (!url) return [{ t: 'pakai: open <github|repo>', cls: 'oka-err' }];
        if (autoplaying) return ['(dibatalkan)'];
        window.open(url, '_blank', 'noopener');
        return ['membuka ' + key + ' di tab baru...'];
      } },
      clear: { run: function () { out.textContent = ''; return []; } }
    };

    var names = Object.keys(commands);

    function exec(raw) {
      var text = raw.trim();
      echo(raw);
      if (!text) { scrollDown(); return; }
      var parts = text.split(/\s+/);
      var name = parts[0].toLowerCase();
      var args = parts.slice(1);

      if (name === 'sudo') {
        print([{ t: 'oka tidak ada di daftar sudoers. Tapi ngobrol boleh, ketik contact.', cls: 'oka-err' }]);
      } else if (commands[name]) {
        var result = commands[name].run(args);
        result.forEach(function (r) { line(r); });
        scrollDown();
      } else {
        print([{ t: 'perintah tidak dikenal: ' + name + '. Ketik help.', cls: 'oka-err' }]);
      }
    }

    function submit(raw) {
      if (raw.trim()) { history.push(raw); }
      histPos = history.length;
      exec(raw);
    }

    // Aktifkan mode interaktif
    out.textContent = '';
    form.hidden = false;
    if (chips) chips.hidden = false;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value;
      input.value = '';
      submit(v);
    });

    input.addEventListener('keydown', function (e) {
      if (autoplaying) { autoplaying = false; input.value = ''; }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (histPos > 0) { histPos--; input.value = history[histPos]; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (histPos < history.length - 1) { histPos++; input.value = history[histPos]; }
        else { histPos = history.length; input.value = ''; }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        var v = input.value.trim().toLowerCase();
        if (!v || v.indexOf(' ') !== -1) return;
        var m = names.filter(function (n) { return n.indexOf(v) === 0; });
        if (m.length === 1) input.value = m[0] + (m[0] === 'goto' || m[0] === 'open' ? ' ' : '');
      }
    });

    out.addEventListener('click', function () {
      if (!window.getSelection().toString()) input.focus({ preventScroll: true });
    });

    if (chips) {
      chips.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-cmd]');
        if (!b) return;
        autoplaying = false;
        input.value = '';
        submit(b.getAttribute('data-cmd'));
      });
    }

    // Momen utama saat halaman dibuka: perintah whoami diketik sendiri
    function finishIntro() {
      autoplaying = false;
      input.value = '';
      exec('whoami');
      print(['', { t: 'Ketik help untuk melihat perintah lain.', cls: 'oka-dim' }]);
    }

    if (reduce) {
      finishIntro();
    } else {
      autoplaying = true;
      var word = 'whoami';
      var i = 0;
      var step = function () {
        if (!autoplaying) return;
        if (i <= word.length) {
          input.value = word.slice(0, i++);
          setTimeout(step, 95);
        } else {
          setTimeout(function () { if (autoplaying) finishIntro(); }, 400);
        }
      };
      setTimeout(step, 700);
    }
  }
})();
