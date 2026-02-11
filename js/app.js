(function () {
  const q = (selector, scope = document) => scope.querySelector(selector);
  const qa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function initMenu() {
    const button = q('.menu-toggle');
    const nav = q('.main-nav');
    if (!button || !nav) return;

    const close = () => {
      nav.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    };

    button.addEventListener('click', () => {
      const willOpen = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
    });

    qa('a', nav).forEach((link) => {
      link.addEventListener('click', close);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 980) close();
    });
  }

  function initTyping() {
    const target = q('.typing');
    if (!target) return;

    const words = [
      'Apprenti développeur',
      'En formation en BTS SIO',
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = words[wordIndex];

      if (deleting) {
        charIndex -= 1;
      } else {
        charIndex += 1;
      }

      target.textContent = current.slice(0, Math.max(0, charIndex));

      let delay = deleting ? 40 : 75;

      if (!deleting && charIndex >= current.length) {
        deleting = true;
        delay = 1400;
      } else if (deleting && charIndex <= 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 350;
      }

      window.setTimeout(tick, delay);
    }

    tick();
  }

  function initReveal() {
    const items = qa('.reveal');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
  }

  function initTiltCards() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function bind(card) {
      if (!card || card.dataset.tiltReady === 'true') return;
      card.dataset.tiltReady = 'true';

      if (reduceMotion) return;

      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.transform =
          `perspective(1200px) rotateX(${(-py * 1.8).toFixed(2)}deg) rotateY(${(px * 1.8).toFixed(2)}deg) translateY(-2px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    }

    function refresh() {
      qa('.tilt-card').forEach(bind);
    }

    refresh();
    document.addEventListener('watch:rendered', refresh);
  }

  function initSkills() {
    const section = q('#range');
    const bars = qa('.skill-bar span');
    if (!section || !bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        bars.forEach((bar) => {
          const level = bar.closest('.skill-card')?.style.getPropertyValue('--level') || '0%';
          bar.style.width = level.trim();
        });

        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
  }

  function initFooterYear() {
    const year = q('#year');
    if (year) {
      year.textContent = String(new Date().getFullYear());
    }
  }

  function initProjectCatalog() {
    const catalog = q('[data-project-catalog]');
    if (!catalog) return;

    const cards = qa('[data-project-card]', catalog);
    if (!cards.length) return;

    const typeFilter = q('[data-filter="type"]', catalog);
    const domainFilter = q('[data-filter="domain"]', catalog);
    const techFilter = q('[data-filter="tech"]', catalog);
    const statusFilter = q('[data-filter="status"]', catalog);
    const queryFilter = q('[data-filter="query"]', catalog);
    const countTarget = q('[data-project-count]', catalog);
    const emptyTarget = q('[data-project-empty]', catalog);
    const loadMoreButton = q('#project-load-more', catalog);
    const PAGE_STEP = 4;
    let visibleLimit = PAGE_STEP;

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function cardMatches(card) {
      const selectedType = normalize(typeFilter?.value || 'all');
      const selectedDomain = normalize(domainFilter?.value || 'all');
      const selectedTech = normalize(techFilter?.value || 'all');
      const selectedStatus = normalize(statusFilter?.value || 'all');
      const query = normalize(queryFilter?.value || '');

      const type = normalize(card.dataset.type);
      const domain = normalize(card.dataset.domain);
      const status = normalize(card.dataset.status);
      const tech = normalize(card.dataset.tech);
      const text = normalize(card.textContent);

      if (selectedType !== 'all' && type !== selectedType) return false;
      if (selectedDomain !== 'all' && domain !== selectedDomain) return false;
      if (selectedStatus !== 'all' && status !== selectedStatus) return false;
      if (selectedTech !== 'all' && !tech.includes(selectedTech)) return false;
      if (query && !text.includes(query)) return false;

      return true;
    }

    function render() {
      const matching = cards.filter(cardMatches);
      const visibleSet = new Set(matching.slice(0, visibleLimit));

      cards.forEach((card) => {
        const show = visibleSet.has(card);
        card.hidden = !show;
        card.setAttribute('aria-hidden', show ? 'false' : 'true');
      });

      const visible = Math.min(matching.length, visibleLimit);

      if (countTarget) {
        countTarget.textContent = `${visible}/${matching.length} projet${
          matching.length > 1 ? 's' : ''
        } affiche${visible > 1 ? 's' : ''}`;
      }

      if (emptyTarget) {
        emptyTarget.hidden = matching.length > 0;
      }

      if (loadMoreButton) {
        loadMoreButton.hidden = matching.length <= visibleLimit;
      }
    }

    [typeFilter, domainFilter, techFilter, statusFilter].forEach((field) => {
      field?.addEventListener('change', () => {
        visibleLimit = PAGE_STEP;
        render();
      });
    });

    queryFilter?.addEventListener('input', () => {
      visibleLimit = PAGE_STEP;
      render();
    });

    loadMoreButton?.addEventListener('click', () => {
      visibleLimit += PAGE_STEP;
      render();
    });

    render();
  }

  initMenu();
  initTyping();
  initReveal();
  initTiltCards();
  initSkills();
  initProjectCatalog();
  initFooterYear();
})();
