(async function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let motion;
  try {
    motion = await import('https://cdn.jsdelivr.net/npm/motion@latest/+esm');
  } catch {
    return;
  }

  const { animate, inView, stagger } = motion;
  const easeOut = [0.22, 1, 0.36, 1];

  if (document.querySelector('.intro-content')) {
    animate('.intro-content > *',
      { opacity: [0, 1], y: [22, 0] },
      { duration: 0.68, delay: stagger(0.08), easing: easeOut }
    );
  }

  if (document.querySelector('.intro-motion')) {
    animate('.intro-motion',
      { opacity: [0, 1], x: [26, 0], scale: [0.98, 1] },
      { duration: 0.82, delay: 0.08, easing: easeOut }
    );

    animate('.intro-motion-shape-a',
      { y: [0, -10, 0], rotate: [0, 1.2, 0] },
      { duration: 6.5, repeat: Infinity, easing: 'ease-in-out' }
    );

    animate('.intro-motion-shape-b',
      { y: [0, 8, 0], rotate: [0, -1.1, 0] },
      { duration: 7.2, repeat: Infinity, easing: 'ease-in-out' }
    );

    animate('.intro-motion-shape-c',
      { scaleX: [1, 1.08, 1], opacity: [0.86, 1, 0.86] },
      { duration: 5.8, repeat: Infinity, easing: 'ease-in-out' }
    );

    animate('.intro-motion-glow-a',
      { x: [0, 12, 0], y: [0, -8, 0], opacity: [0.45, 0.62, 0.45] },
      { duration: 9, repeat: Infinity, easing: 'ease-in-out' }
    );

    animate('.intro-motion-glow-b',
      { x: [0, -10, 0], y: [0, 8, 0], opacity: [0.38, 0.56, 0.38] },
      { duration: 10, repeat: Infinity, easing: 'ease-in-out' }
    );
  }

  const revealOnce = (selector, fromY) => {
    inView(selector, (element) => {
      if (element.dataset.motionDone === 'true') return;
      element.dataset.motionDone = 'true';
      animate(
        element,
        { opacity: [0, 1], y: [fromY, 0] },
        { duration: 0.55, easing: easeOut }
      );
    }, { amount: 0.2 });
  };

  revealOnce('.project-entry', 18);
  revealOnce('.cert-card', 20);
  revealOnce('.exp-item', 18);

  function animateWatchCards() {
    const cards = Array.from(document.querySelectorAll('.watch-card'));
    if (!cards.length) return;

    animate(cards,
      { opacity: [0, 1], y: [14, 0] },
      { duration: 0.45, delay: stagger(0.06), easing: easeOut }
    );
  }

  document.addEventListener('watch:rendered', animateWatchCards);
  animateWatchCards();
})();
