(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 0.7 });

  /* ═══════════════════════════════════════════════════
     1. HERO — Code-editor visual
     ═══════════════════════════════════════════════════ */

  var hero = gsap.timeline({ delay: 0.25 });

  // Intro content (text side) — staggered fade up
  hero.from('.intro-content > *', {
    y: 28,
    opacity: 0,
    duration: 0.65,
    stagger: 0.09,
    ease: 'power3.out'
  });

  // Glows
  hero.to('.iv-glow', {
    opacity: 1,
    duration: 1,
    stagger: 0.12
  }, '-=0.4');

  // Code window — slide up + subtle 3D
  hero.to('.iv-window', {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration: 0.85,
    ease: 'back.out(1.2)'
  }, '-=0.7');

  // Code lines — typewriter stagger
  hero.to('.iv-line', {
    opacity: 1,
    x: 0,
    duration: 0.4,
    stagger: 0.1,
    ease: 'power2.out'
  }, '-=0.3');

  // Blinking cursor
  hero.to('.iv-cursor', {
    opacity: 1,
    duration: 0.2
  }, '-=0.1');

  // Floating tags
  hero.to('.iv-float', {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    stagger: 0.12,
    ease: 'back.out(2.5)'
  }, '-=0.3');

  // Continuous animations — glows drift
  gsap.to('.iv-glow--a', {
    x: 16, y: -10,
    duration: 5.5,
    repeat: -1, yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.iv-glow--b', {
    x: -12, y: 8,
    duration: 6.5,
    repeat: -1, yoyo: true,
    ease: 'sine.inOut'
  });

  // Floating tags — gentle hover
  gsap.to('.iv-float--a', {
    y: -6, rotation: 2,
    duration: 3,
    repeat: -1, yoyo: true,
    ease: 'sine.inOut',
    delay: 1
  });

  gsap.to('.iv-float--b', {
    y: 5, rotation: -1.5,
    duration: 3.5,
    repeat: -1, yoyo: true,
    ease: 'sine.inOut',
    delay: 1.5
  });

  gsap.to('.iv-float--c', {
    y: -4, rotation: 1,
    duration: 2.8,
    repeat: -1, yoyo: true,
    ease: 'sine.inOut',
    delay: 2
  });

  // Blinking cursor
  gsap.to('.iv-cursor', {
    opacity: 0,
    duration: 0.5,
    repeat: -1, yoyo: true,
    ease: 'steps(1)',
    delay: 1.5
  });

  // Window subtle float
  gsap.to('.iv-window', {
    y: -5,
    duration: 4,
    repeat: -1, yoyo: true,
    ease: 'sine.inOut',
    delay: 2
  });

  /* ═══════════════════════════════════════════════════
     2. SECTION REVEALS — ScrollTrigger
     ═══════════════════════════════════════════════════ */

  // Generic reveal for .reveal containers (replaces CSS reveal + IntersectionObserver)
  gsap.utils.toArray('.reveal').forEach(function (el) {
    // Skip the hero — it's handled above
    if (el.closest('.intro')) return;

    gsap.from(el, {
      y: 30,
      opacity: 0,
      duration: 0.65,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    });
  });

  /* ═══════════════════════════════════════════════════
     3. ABOUT PANELS — stagger on scroll
     ═══════════════════════════════════════════════════ */

  var aboutPanels = gsap.utils.toArray('.about-panel');
  if (aboutPanels.length) {
    gsap.from(aboutPanels, {
      y: 24,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-grid',
        start: 'top 80%',
        once: true
      }
    });
  }

  /* ═══════════════════════════════════════════════════
     4. PROJECT CARDS — fade up
     ═══════════════════════════════════════════════════ */

  gsap.utils.toArray('.project-entry').forEach(function (card) {
    gsap.from(card, {
      y: 20,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        once: true
      }
    });
  });

  /* ═══════════════════════════════════════════════════
     5. SKILL CARDS — stagger scale-in
     ═══════════════════════════════════════════════════ */

  var skillCards = gsap.utils.toArray('.skill-card');
  if (skillCards.length) {
    gsap.from(skillCards, {
      scale: 0.85,
      opacity: 0,
      duration: 0.45,
      stagger: 0.07,
      ease: 'back.out(1.6)',
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 82%',
        once: true
      }
    });
  }

  /* ═══════════════════════════════════════════════════
     6. EXPERIENCE — slide from left
     ═══════════════════════════════════════════════════ */

  var expSummary = document.querySelector('.exp-summary');
  if (expSummary) {
    gsap.from(expSummary, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: expSummary,
        start: 'top 82%',
        once: true
      }
    });
  }

  gsap.utils.toArray('.exp-item').forEach(function (item, i) {
    gsap.from(item, {
      x: 30,
      opacity: 0,
      duration: 0.55,
      delay: i * 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        once: true
      }
    });
  });

  /* ═══════════════════════════════════════════════════
     7. CERTIFICATIONS — reveal
     ═══════════════════════════════════════════════════ */

  gsap.utils.toArray('.cert-card').forEach(function (card) {
    gsap.from(card, {
      y: 22,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        once: true
      }
    });
  });

  /* ═══════════════════════════════════════════════════
     8. WATCH CARDS — animated on render event
     ═══════════════════════════════════════════════════ */

  function animateWatchCards() {
    var cards = gsap.utils.toArray('.watch-card');
    if (!cards.length) return;

    gsap.from(cards, {
      y: 16,
      opacity: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  document.addEventListener('watch:rendered', animateWatchCards);
  animateWatchCards();

  /* ═══════════════════════════════════════════════════
     9. CONTACT FORM — scale reveal
     ═══════════════════════════════════════════════════ */

  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    gsap.from(contactForm, {
      y: 24,
      scale: 0.97,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: contactForm,
        start: 'top 85%',
        once: true
      }
    });
  }

  /* ═══════════════════════════════════════════════════
     10. SECTION HEADINGS — underline sweep
     ═══════════════════════════════════════════════════ */

  gsap.utils.toArray('.section-head h2').forEach(function (h2) {
    gsap.from(h2, {
      '--underline-scale': 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: h2,
        start: 'top 85%',
        once: true
      }
    });
  });

  /* ═══════════════════════════════════════════════════
     11. HEADER — hide on scroll down, show on scroll up
     ═══════════════════════════════════════════════════ */

  var header = document.querySelector('.site-header');
  if (header) {
    ScrollTrigger.create({
      start: 'top top',
      end: 99999,
      onUpdate: function (self) {
        if (self.direction === -1) {
          gsap.to(header, { y: 0, duration: 0.3, ease: 'power2.out' });
        } else if (self.scroll() > 300) {
          gsap.to(header, { y: -100, duration: 0.3, ease: 'power2.in' });
        }
      }
    });
  }

})();
