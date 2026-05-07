/* Glow Beauty — minimal section interactivity
 * Handles:
 *  - glow-results-compare slider drag/range
 *  - glow-shoppable-look hotspot toggle
 * Scoped per section, idempotent on theme-editor reloads.
 */
(function () {
  'use strict';

  function initCompare(root) {
    if (root.__glowCompareBound) return;
    root.__glowCompareBound = true;
    var range = root.querySelector('[data-glow-compare-range]');
    if (!range) return;

    function setPos(value) {
      root.style.setProperty('--glow-slider-pos', value + '%');
    }
    setPos(range.value);

    range.addEventListener('input', function () {
      setPos(range.value);
    });
  }

  function initShoppable(root) {
    if (root.__glowShoppableBound) return;
    root.__glowShoppableBound = true;

    var hotspots = root.querySelectorAll('[data-glow-hotspot]');
    var cards = root.querySelectorAll('[data-glow-hotspot-card]');

    function closeAll() {
      hotspots.forEach(function (h) { h.setAttribute('aria-expanded', 'false'); });
      cards.forEach(function (c) { c.setAttribute('aria-hidden', 'true'); });
    }

    hotspots.forEach(function (hotspot) {
      hotspot.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = hotspot.getAttribute('aria-expanded') === 'true';
        var card = root.querySelector('#' + hotspot.getAttribute('aria-controls'));
        closeAll();
        if (!open && card) {
          hotspot.setAttribute('aria-expanded', 'true');
          card.setAttribute('aria-hidden', 'false');
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!root.contains(e.target)) closeAll();
    });
  }

  function initAll(scope) {
    (scope || document).querySelectorAll('[data-glow-compare]').forEach(initCompare);
    (scope || document).querySelectorAll('[data-glow-shoppable]').forEach(initShoppable);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAll(); });
  } else {
    initAll();
  }

  // Theme editor: re-init when sections are loaded/reordered
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
  document.addEventListener('shopify:section:reorder', function (e) { initAll(e.target); });
})();
