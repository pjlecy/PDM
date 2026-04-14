/**
 * PDM Dashboard -- lightweight client-side behaviour.
 *
 * Handles sidebar navigation highlighting and basic keyboard
 * accessibility for interactive elements.
 */

(function () {
  'use strict';

  // ── Nav item switching ──────────────────────────────────

  const navItems = document.querySelectorAll('.nav__item');

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
