/**
 * Agency homepage — GSAP + ScrollTrigger (counters, reveals, staggers).
 * Content is fixed in Liquid; no customizer-driven animation targets.
 */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.agency-dev [data-agency-anim], .agency-dev-stagger-item').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('[data-agency-counter] .agency-dev-stat__value').forEach(function (el) {
      var root = el.closest('[data-agency-counter]');
      if (!root) return;
      var t = root.getAttribute('data-target');
      if (t) el.textContent = t;
    });
    return;
  }

  function initCounters() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.utils.toArray('[data-agency-counter]').forEach(function (root) {
      var valueEl = root.querySelector('.agency-dev-stat__value');
      if (!valueEl) return;
      var target = parseFloat(root.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      var obj = { val: 0 };
      gsap.fromTo(
        root,
        { opacity: 0, y: 56, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.to(obj, {
        val: target,
        duration: 2.4,
        ease: 'power2.out',
        delay: 0.15,
        scrollTrigger: {
          trigger: root,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        onUpdate: function () {
          valueEl.textContent = String(Math.round(obj.val));
        },
        onComplete: function () {
          valueEl.textContent = String(Math.round(target));
        },
      });
    });
  }

  function boot() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    var hero = document.querySelector('.agency-dev-hero--v2');
    if (hero) {
      var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from('.agency-dev-hero__glow-orb', { opacity: 0, duration: 1.1, ease: 'power2.out' }, 0)
        .from('.agency-dev-hero__eyebrow', { opacity: 0, y: 28, duration: 0.65 }, 0.15)
        .from(
          '.agency-dev-hero__title-line--accent',
          { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)', duration: 0.85 },
          0.22
        )
        .from(
          '.agency-dev-hero__title-line--main',
          { opacity: 0, y: 64, scale: 0.94, duration: 1.05 },
          0.32
        )
        .from('.agency-dev-hero__lead', { opacity: 0, y: 36, duration: 0.75 }, 0.48)
        .from('.agency-dev-hero__actions .agency-dev-btn', { opacity: 0, y: 28, stagger: 0.12, duration: 0.6 }, 0.58);

      gsap.to('.agency-dev-hero__mesh--v2', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to('.agency-dev-hero__grid--v2', {
        yPercent: 4,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    gsap.utils.toArray('.agency-dev-reveal').forEach(function (el) {
      gsap.from(el, {
        opacity: 0,
        y: 48,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });

    gsap.utils.toArray('.agency-dev-stagger').forEach(function (container) {
      var kids = container.querySelectorAll('.agency-dev-stagger-item');
      if (!kids.length) return;
      if (container.closest('.agency-dev-stats')) return;

      gsap.from(kids, {
        opacity: 0,
        y: 56,
        rotateX: -6,
        transformOrigin: '50% 0%',
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 86%',
          toggleActions: 'play none none none',
        },
      });
    });

    var stepsRoot = document.querySelector('[data-agency-steps]');
    if (stepsRoot) {
      var steps = stepsRoot.querySelectorAll('.agency-dev-step--v2');
      gsap.from(steps, {
        opacity: 0,
        x: function (i, t) {
          return t.closest('[dir="rtl"]') ? -48 : 48;
        },
        duration: 0.7,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: stepsRoot,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    }

    var quotesRoot = document.querySelector('[data-agency-quotes]');
    if (quotesRoot) {
      var cards = quotesRoot.querySelectorAll('.agency-dev-quote__card--v2');
      gsap.from(cards, {
        opacity: 0,
        y: 72,
        scale: 0.96,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: quotesRoot,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    var bento = document.querySelector('[data-agency-bento]');
    if (bento) {
      gsap.from(bento.querySelectorAll('.agency-dev-card--v2'), {
        opacity: 0,
        y: 40,
        duration: 0.65,
        stagger: { each: 0.1, from: 'start' },
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bento,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    }

    var ctaGlow = document.querySelector('[data-agency-cta-glow]');
    if (ctaGlow) {
      gsap.to(ctaGlow, {
        boxShadow:
          '0 0 0 1px rgba(150, 190, 69, 0.45), 0 0 60px rgba(150, 190, 69, 0.2), 0 24px 80px rgba(0,0,0,0.35)',
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    initCounters();

    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
