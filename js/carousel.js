(function () {
  const carousels = Array.from(document.querySelectorAll('[data-carousel]'));
  if (!carousels.length) return;

  function itemsPerView() {
    if (window.innerWidth >= 980) return 3;
    if (window.innerWidth >= 760) return 2;
    return 1;
  }

  carousels.forEach((carousel) => {
    const viewport = carousel.querySelector('.carousel-viewport');
    const track = carousel.querySelector('.carousel-track');
    const items = Array.from(carousel.querySelectorAll('.carousel-item'));
    const prev = carousel.querySelector('[data-action="prev"]');
    const next = carousel.querySelector('[data-action="next"]');
    const dotsContainer = carousel.parentElement?.querySelector('[data-carousel-dots]');

    if (!viewport || !track || !items.length || !prev || !next || !dotsContainer) return;

    let index = 0;
    let visible = itemsPerView();
    let timer = null;
    let startX = 0;

    function maxIndex() {
      return Math.max(0, items.length - visible);
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      const count = maxIndex() + 1;

      for (let i = 0; i < count; i += 1) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Aller au slide ${i + 1}`);
        dot.addEventListener('click', () => {
          index = i;
          render();
          restart();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function getGap() {
      const style = window.getComputedStyle(track);
      return Number.parseFloat(style.gap) || 0;
    }

    function render() {
      const itemWidth = items[0].getBoundingClientRect().width;
      const offset = index * (itemWidth + getGap());
      track.style.transform = `translateX(-${offset}px)`;

      prev.disabled = index <= 0;
      next.disabled = index >= maxIndex();

      const dots = Array.from(dotsContainer.querySelectorAll('button'));
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === index);
      });

      items.forEach((item, itemIndex) => {
        const hidden = itemIndex < index || itemIndex >= index + visible;
        item.setAttribute('aria-hidden', hidden ? 'true' : 'false');
      });
    }

    function goNext() {
      if (index >= maxIndex()) {
        index = 0;
      } else {
        index += 1;
      }
      render();
    }

    function goPrev() {
      if (index <= 0) {
        index = maxIndex();
      } else {
        index -= 1;
      }
      render();
    }

    function start() {
      stop();
      timer = window.setInterval(goNext, 5000);
    }

    function stop() {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    }

    function restart() {
      stop();
      start();
    }

    prev.addEventListener('click', () => {
      goPrev();
      restart();
    });

    next.addEventListener('click', () => {
      goNext();
      restart();
    });

    viewport.addEventListener('touchstart', (event) => {
      startX = event.changedTouches[0].clientX;
    }, { passive: true });

    viewport.addEventListener('touchend', (event) => {
      const endX = event.changedTouches[0].clientX;
      const delta = startX - endX;
      if (Math.abs(delta) < 45) return;
      if (delta > 0) goNext();
      else goPrev();
      restart();
    }, { passive: true });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    document.addEventListener('keydown', (event) => {
      if (!carousel.matches(':hover') && !carousel.contains(document.activeElement)) return;
      if (event.key === 'ArrowRight') {
        goNext();
        restart();
      }
      if (event.key === 'ArrowLeft') {
        goPrev();
        restart();
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const nextVisible = itemsPerView();
        if (nextVisible !== visible) {
          visible = nextVisible;
          index = Math.min(index, maxIndex());
          buildDots();
        }
        render();
      }, 120);
    });

    buildDots();
    render();
    start();
  });
})();
