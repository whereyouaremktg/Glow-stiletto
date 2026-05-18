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

  // Toggle body.glow-cart-open whenever Upcart's drawer is visible.
  // CSS uses this class to hide overlays (Smile launcher, etc) that
  // would otherwise sit on top of the cart.
  function initCartOpenWatcher() {
    var DRAWER_SELECTORS = '[id^="upcart"], [class*="upcart"], .Upcart-Cart, .upcart-cart, .upcart-drawer';
    var BODY_CLASS = 'glow-cart-open';
    var lastState = null;

    function isDrawerOpen() {
      var nodes = document.querySelectorAll(DRAWER_SELECTORS);
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        // Skip the embed/script tags injected by the app block
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'LINK') continue;
        var rect = el.getBoundingClientRect();
        if (rect.width > 100 && rect.height > 100) {
          var style = window.getComputedStyle(el);
          if (style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0.1) {
            return true;
          }
        }
      }
      return false;
    }

    function syncBodyClass() {
      var open = isDrawerOpen();
      if (open === lastState) return;
      lastState = open;
      document.body.classList.toggle(BODY_CLASS, open);
    }

    var mo = new MutationObserver(function () {
      // Throttle: run once per animation frame
      if (mo._raf) return;
      mo._raf = requestAnimationFrame(function () {
        mo._raf = null;
        syncBodyClass();
      });
    });
    mo.observe(document.body, { attributes: true, childList: true, subtree: true, attributeFilter: ['style', 'class', 'aria-hidden'] });
    syncBodyClass();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartOpenWatcher);
  } else {
    initCartOpenWatcher();
  }
})();
