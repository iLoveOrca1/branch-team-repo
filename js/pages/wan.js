(function () {
  'use strict';

  var nav = document.getElementById('wan-nav');
  var menuButton = document.getElementById('wan-menu-btn');
  var navLinks = document.getElementById('wan-nav-links');
  var progress = document.getElementById('wan-progress');
  var year = document.getElementById('wan-year');
  var skillsToggle = document.getElementById('wan-skills-toggle');
  var extraSkills = document.querySelectorAll('[data-skill-extra]');

  if (year) year.textContent = new Date().getFullYear();

  function setMenuOpen(open) {
    if (!menuButton || !navLinks) return;
    navLinks.classList.toggle('wan-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  }

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', function () {
      setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    navLinks.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenuOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        menuButton.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (
        menuButton.getAttribute('aria-expanded') === 'true' &&
        nav &&
        !nav.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 700) setMenuOpen(false);
    });
  }

  if (skillsToggle && extraSkills.length) {
    extraSkills.forEach(function (skill) {
      skill.hidden = true;
    });
    skillsToggle.hidden = false;
    skillsToggle.addEventListener('click', function () {
      var expanded = skillsToggle.getAttribute('aria-expanded') === 'true';
      extraSkills.forEach(function (skill) {
        skill.hidden = expanded;
      });
      skillsToggle.setAttribute('aria-expanded', String(!expanded));
      skillsToggle.innerHTML = expanded
        ? 'Tampilkan semua skill <span aria-hidden="true">↓</span>'
        : 'Tampilkan lebih sedikit <span aria-hidden="true">↑</span>';
    });
  } else if (skillsToggle) {
    skillsToggle.hidden = true;
  }

  var sections = Array.prototype.slice.call(
    document.querySelectorAll('#wan-nav-links a[href^="#"]')
  )
    .map(function (link) {
      return {
        link: link,
        section: document.getElementById(link.getAttribute('href').slice(1))
      };
    })
    .filter(function (item) {
      return item.section;
    });

  var framePending = false;
  function updatePagePosition() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (progress) {
      var percentage = scrollableHeight > 0 ? Math.min(100, (scrollTop / scrollableHeight) * 100) : 0;
      progress.style.width = percentage + '%';
    }

    var current = null;
    sections.forEach(function (item) {
      if (item.section.getBoundingClientRect().top <= 140) current = item;
    });

    sections.forEach(function (item) {
      if (item === current) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });

    framePending = false;
  }

  function requestPositionUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updatePagePosition);
  }

  window.addEventListener('scroll', requestPositionUpdate, { passive: true });
  window.addEventListener('resize', requestPositionUpdate);
  updatePagePosition();
})();