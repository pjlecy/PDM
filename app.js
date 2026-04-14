/**
 * PDM Dashboard -- lightweight client-side behaviour.
 *
 * Handles sidebar navigation highlighting, dark-mode toggle,
 * search interaction, and basic keyboard accessibility for
 * interactive elements.
 */

(function () {
  'use strict';

  // ── Nav item switching ──────────────────────────────────

  var navItems = document.querySelectorAll('.nav__item');

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      navItems.forEach(function (nav) {
        nav.classList.remove('nav__item--active');
        nav.removeAttribute('aria-current');
      });
      item.classList.add('nav__item--active');
      item.setAttribute('aria-current', 'page');
    });
  });

  // ── Dark mode toggle ───────────────────────────────────

  var THEME_KEY = 'pdm-theme';
  var toggle = document.querySelector('.theme-toggle');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    var label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    if (toggle) {
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);
    }
  }

  // Restore saved preference or respect OS setting
  var saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ── Search keyboard shortcut (Ctrl/Cmd + K) ────────────

  var searchInput = document.getElementById('vault-search');

  if (searchInput) {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  // ── Keyboard support for card buttons ───────────────────

  var cards = document.querySelectorAll('.card');

  cards.forEach(function (card) {
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
})();
