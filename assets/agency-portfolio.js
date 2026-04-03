/**
 * Stacked project cards — GSAP port of framer-motion card stack (21st.dev style).
 * Wheel on the viewport: down = next, up = previous. Optional prev/next for keyboard/a11y.
 */
(function () {
  'use strict';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  var POSITIONS = [
    { y: 12, scale: 1, z: 3 },
    { y: -16, scale: 0.95, z: 2 },
    { y: -44, scale: 0.9, z: 1 },
  ];

  function initSection(section) {
    if (typeof gsap === 'undefined') return;

    var viewport = section.querySelector('.agency-portfolio__viewport');
    var cards = Array.prototype.slice.call(section.querySelectorAll('.agency-portfolio__card'));
    if (!viewport || cards.length === 0) return;

    var n = cards.length;
    var order;
    if (n >= 3) order = [0, 1, 2];
    else if (n === 2) order = [0, 1];
    else order = [0];

    var animating = false;
    var wheelCooldown = false;

    function layout(immediate) {
      cards.forEach(function (el, idx) {
        var pos = order.indexOf(idx);
        if (pos === -1) {
          gsap.set(el, {
            left: '50%',
            xPercent: -50,
            opacity: 0,
            scale: 0.88,
            y: 24,
            zIndex: 0,
            pointerEvents: 'none',
          });
        } else {
          var p = POSITIONS[pos] || POSITIONS[2];
          var opts = {
            left: '50%',
            xPercent: -50,
            opacity: 1,
            scale: p.scale,
            y: p.y,
            zIndex: p.z,
            pointerEvents: pos === 0 ? 'auto' : 'none',
            duration: immediate ? 0 : 0.55,
            ease: 'power3.out',
          };
          if (immediate) {
            gsap.set(el, opts);
          } else {
            gsap.to(el, opts);
          }
        }
      });
    }

    layout(true);

    function advance() {
      if (animating || n < 2) return;
      animating = true;
      var topIdx = order[0];
      var topEl = cards[topIdx];

      if (n >= 3) {
        var b = order[1];
        var c = order[2];
        gsap.to(topEl, {
          y: 340,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: function () {
            order = [b, c, (c + 1) % n];
            gsap.set(topEl, { y: POSITIONS[0].y });
            layout(true);
            animating = false;
          },
        });
      } else {
        gsap.to(topEl, {
          y: 340,
          duration: 0.45,
          ease: 'power2.in',
          onComplete: function () {
            order = [order[1], order[0]];
            gsap.set(topEl, { y: POSITIONS[0].y });
            layout(true);
            animating = false;
          },
        });
      }
    }

    function retreat() {
      if (animating || n < 2) return;
      animating = true;
      if (n >= 3) {
        var newTop = (order[0] - 1 + n) % n;
        order = [newTop, order[0], order[1]];
        layout(false);
        setTimeout(function () {
          animating = false;
        }, 600);
      } else {
        order = [order[1], order[0]];
        layout(false);
        setTimeout(function () {
          animating = false;
        }, 600);
      }
    }

    if (!prefersReducedMotion()) {
      viewport.addEventListener(
        'wheel',
        function (e) {
          if (wheelCooldown || animating) return;
          if (Math.abs(e.deltaY) < 6) return;
          e.preventDefault();
          wheelCooldown = true;
          if (e.deltaY > 0) advance();
          else retreat();
          setTimeout(function () {
            wheelCooldown = false;
          }, 520);
        },
        { passive: false }
      );
    }

    section.querySelectorAll('[data-portfolio-nav]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (animating) return;
        var dir = btn.getAttribute('data-portfolio-nav');
        if (dir === 'next') advance();
        else if (dir === 'prev') retreat();
      });
    });

  }

  function boot() {
    document.querySelectorAll('[data-agency-portfolio]').forEach(initSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
