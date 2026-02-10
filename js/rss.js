(function () {
  const SOURCES = [
    {
      category: 'ia',
      categoryLabel: 'IA',
      source: 'ScienceDaily',
      url: 'https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml',
    },
    {
      category: 'ia',
      categoryLabel: 'IA',
      source: 'AI News',
      url: 'https://www.artificialintelligence-news.com/feed/',
    },
    {
      category: 'language',
      categoryLabel: 'Langages',
      source: 'Python Insider',
      url: 'https://feeds.feedburner.com/PythonInsider',
    },
    {
      category: 'language',
      categoryLabel: 'Langages',
      source: 'TypeScript Blog',
      url: 'https://devblogs.microsoft.com/typescript/feed/',
    },
    {
      category: 'cybersecurite',
      categoryLabel: 'Cybersecurite',
      source: 'The Hacker News',
      url: 'https://feeds.feedburner.com/TheHackersNews',
    },
    {
      category: 'cybersecurite',
      categoryLabel: 'Cybersecurite',
      source: 'Krebs on Security',
      url: 'https://krebsonsecurity.com/feed/',
    },
  ];

  const FALLBACK = [
    {
      title: 'IA generative et productivite developpeur',
      link: 'https://www.infoq.com/',
      category: 'ia',
      categoryLabel: 'IA',
      source: 'Fallback',
      date: new Date().toISOString(),
      image: 'ressources/assets/picture.jpg',
      description:
        'Panorama des usages utiles de l IA pour accelerer les taches de developpement.',
      timestamp: Date.now(),
    },
    {
      title: 'Accessibilite web : bonnes pratiques 2026',
      link: 'https://www.python.org/blogs/',
      category: 'language',
      categoryLabel: 'Langages',
      source: 'Fallback',
      date: new Date().toISOString(),
      image: 'ressources/assets/picture.jpeg',
      description:
        'Nouveautes Python utiles pour le developpement d applications robustes.',
      timestamp: Date.now() - 1000,
    },
    {
      title: 'Langages et frameworks: evolutions utiles pour les developpeurs',
      link: 'https://devblogs.microsoft.com/typescript/',
      category: 'language',
      categoryLabel: 'Langages',
      source: 'Fallback',
      date: new Date().toISOString(),
      image: 'ressources/assets/picture.jpeg',
      description:
        'Selection de ressources pour suivre les evolutions JavaScript, CSS, PHP et les bonnes pratiques de code.',
      timestamp: Date.now() - 2000,
    },
    {
      title: 'Securite applicative: verifier ses dependances en continu',
      link: 'https://thehackernews.com/',
      category: 'cybersecurite',
      categoryLabel: 'Cybersecurite',
      source: 'Fallback',
      date: new Date().toISOString(),
      image: 'ressources/assets/picture.png',
      description:
        'Mettre en place une veille securite efficace pour detecter rapidement les risques critiques.',
      timestamp: Date.now() - 3000,
    },
  ];

  const STORAGE_KEY = 'km_watch_memory_v3';
  const MAX_MEMORY = 600;
  const PAGE_STEP = 4;

  const feed = document.getElementById('rss-feed');
  const count = document.getElementById('rss-result-count');
  const memoryInfo = document.getElementById('watch-memory-info');
  const loadMoreButton = document.getElementById('watch-load-more');
  const clearButton = document.getElementById('watch-clear-memory');
  const filterButtons = Array.from(document.querySelectorAll('.watch-filter'));
  const searchInput = document.getElementById('rss-search');

  if (!feed) return;

  const state = {
    category: 'all',
    query: '',
    limit: PAGE_STEP,
    items: [],
  };

  const ALLOWED_CATEGORIES = ['ia', 'language', 'cybersecurite'];

  const CATEGORY_KEYWORDS = {
    ia: [
      'artificial intelligence', 'ai', 'machine learning', 'deep learning',
      'llm', 'model', 'neural', 'transformer', 'prompt', 'generative'
    ],
    language: [
      'programming language', 'language', 'javascript', 'typescript', 'python',
      'php', 'java', 'kotlin', 'rust', 'go', 'c#', 'c++', 'html', 'css',
      'framework', 'library', 'compiler', 'syntax', 'runtime', 'node'
    ],
    cybersecurite: [
      'cyber', 'security', 'infosec', 'vulnerability', 'cve', 'malware',
      'ransomware', 'exploit', 'phishing', 'zero-day', 'auth', 'breach',
      'encryption', 'security patch', 'threat', 'xss', 'sql injection'
    ],
  };

  const DEV_CORE_KEYWORDS = [
    'developer', 'development', 'developpement', 'programming', 'coding', 'code',
    'software', 'application', 'app', 'api', 'sdk', 'testing', 'debug', 'refactor',
    'open source', 'repository', 'github', 'git', 'frontend', 'backend',
    'database', 'sql', 'docker', 'kubernetes', 'devops', 'cloud'
  ];

  const GLOBAL_EXCLUDE_KEYWORDS = [
    'smartphone', 'phone', 'iphone', 'galaxy', 'pixel', 'oneplus', 'xiaomi',
    'promotion', 'promo', 'discount', 'deal', 'deals', 'coupon', 'soldes',
    'black friday', 'buy now', 'shopping'
  ];

  function clean(html) {
    return String(html || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeCategory(value) {
    const raw = String(value || '').toLowerCase().trim();

    if (raw === 'ia') return 'ia';
    if (raw === 'web' || raw === 'mobile' || raw === 'language') return 'language';
    if (raw === 'securite' || raw === 'cybersecurite' || raw === 'cybersecurity') {
      return 'cybersecurite';
    }

    return raw;
  }

  function categoryLabel(category) {
    if (category === 'ia') return 'IA';
    if (category === 'language') return 'Langages';
    if (category === 'cybersecurite') return 'Cybersecurite';
    return category;
  }

  function normalizeItem(item) {
    const timestamp = Number(item.timestamp) || new Date(item.date || 0).getTime() || 0;
    const category = normalizeCategory(item.category);

    return {
      title: String(item.title || 'Article'),
      link: String(item.link || '#'),
      category,
      categoryLabel: categoryLabel(category),
      source: String(item.source || 'Source inconnue'),
      date: String(item.date || ''),
      image: String(item.image || 'ressources/assets/picture.png'),
      description: String(item.description || ''),
      timestamp,
    };
  }

  function isDevelopmentRelated(item) {
    const text = `${item.title} ${item.description} ${item.source}`.toLowerCase();
    const category = normalizeCategory(item.category);

    if (!ALLOWED_CATEGORIES.includes(category)) return false;

    const hasGlobalExclude = GLOBAL_EXCLUDE_KEYWORDS.some((keyword) =>
      text.includes(keyword)
    );
    if (hasGlobalExclude) return false;

    const categoryTerms = CATEGORY_KEYWORDS[category] || [];
    const hasCategoryTerm = categoryTerms.some((keyword) => text.includes(keyword));
    if (!hasCategoryTerm) return false;

    if (category === 'cybersecurite') {
      return true;
    }

    const hasDevCore = DEV_CORE_KEYWORDS.some((keyword) => text.includes(keyword));
    return hasDevCore || category === 'ia';
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Date inconnue';

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  function keyOf(item) {
    return `${item.link}|${item.title}`;
  }

  function readMemory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map(normalizeItem)
        .filter(isDevelopmentRelated)
        .sort((a, b) => b.timestamp - a.timestamp);
    } catch {
      return [];
    }
  }

  function writeMemory(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_MEMORY)));
    } catch {
      // Ignore quota or access errors.
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  function mergeUnique(fresh, cached) {
    const map = new Map();
    [...fresh, ...cached].forEach((item) => {
      const normalized = normalizeItem(item);
      if (!isDevelopmentRelated(normalized)) return;
      const key = keyOf(normalized);
      if (!map.has(key)) {
        map.set(key, normalized);
      }
    });

    return Array.from(map.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_MEMORY);
  }

  function getFilteredItems() {
    const query = state.query.trim().toLowerCase();

    return state.items.filter((item) => {
      const categoryMatch =
        state.category === 'all' || item.category === state.category;
      if (!categoryMatch) return false;
      if (!query) return true;

      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query)
      );
    });
  }

  function updateMemoryInfo() {
    if (!memoryInfo) return;

    const total = state.items.length;
    if (!total) {
      memoryInfo.textContent = 'Memoire locale: vide';
      return;
    }

    const latest = state.items[0];
    memoryInfo.textContent = `Memoire locale: ${total} articles (dernier ajout: ${formatDate(
      latest.date
    )})`;
  }

  function render() {
    const filtered = getFilteredItems();
    const visible = filtered.slice(0, state.limit);
    feed.setAttribute('aria-busy', 'false');

    if (!visible.length) {
      feed.innerHTML =
        '<div class="watch-empty">Aucun article ne correspond a votre filtre.</div>';
      if (count) count.textContent = '0 resultat';
      if (loadMoreButton) loadMoreButton.hidden = true;
      updateMemoryInfo();
      document.dispatchEvent(new CustomEvent('watch:rendered'));
      return;
    }

    const html = visible
      .map((item) => {
        const description =
          item.description.length > 155
            ? `${item.description.slice(0, 155)}...`
            : item.description;

        return `
          <article class="watch-card tilt-card">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">
            <div class="watch-card-content">
              <div class="watch-meta">
                <span class="watch-badge">${escapeHtml(item.categoryLabel)}</span>
                <span>${escapeHtml(item.source)}</span>
                <span>${escapeHtml(formatDate(item.date))}</span>
              </div>
              <h3>
                <a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a>
              </h3>
              <p>${escapeHtml(description)}</p>
            </div>
          </article>
        `;
      })
      .join('');

    feed.innerHTML = `<div class="watch-grid">${html}</div>`;

    if (count) {
      count.textContent = `${visible.length}/${filtered.length} article${
        filtered.length > 1 ? 's' : ''
      } affiche${visible.length > 1 ? 's' : ''} (${state.items.length} en memoire)`;
    }

    if (loadMoreButton) {
      loadMoreButton.hidden = filtered.length <= state.limit;
    }

    updateMemoryInfo();
    document.dispatchEvent(new CustomEvent('watch:rendered'));
  }

  async function loadSource(source) {
    const endpoint =
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;

    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.items)) {
      throw new Error('Format de flux invalide');
    }

    return data.items
      .map((item) =>
        normalizeItem({
        title: item.title || 'Article',
        link: item.link || '#',
        category: source.category,
        categoryLabel: source.categoryLabel,
        source: source.source,
        date: item.pubDate || item.isoDate || '',
        image: item.thumbnail || item.enclosure?.link || 'ressources/assets/picture.png',
        description: clean(item.description || item.content || ''),
        timestamp: new Date(item.pubDate || item.isoDate || 0).getTime() || 0,
        })
      )
      .filter(isDevelopmentRelated);
  }

  async function load() {
    feed.setAttribute('aria-busy', 'true');

    const cached = readMemory();
    if (cached.length) {
      state.items = cached;
      render();
    } else {
      feed.innerHTML = '<div class="watch-empty">Chargement de la veille...</div>';
    }

    const fresh = [];
    for (let i = 0; i < SOURCES.length; i += 1) {
      const source = SOURCES[i];
      try {
        const items = await loadSource(source);
        fresh.push(...items);
      } catch {
        // Ignore source-level errors, other sources continue.
      }

      if (i < SOURCES.length - 1) {
        await sleep(250);
      }
    }

    fresh.sort((a, b) => b.timestamp - a.timestamp);

    if (!fresh.length && !cached.length) {
      state.items = FALLBACK.map(normalizeItem).filter(isDevelopmentRelated);
      render();
      return;
    }

    const merged = mergeUnique(fresh, cached);
    state.items = merged;
    writeMemory(merged);
    render();
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.category = button.dataset.category || 'all';
      state.limit = PAGE_STEP;

      filterButtons.forEach((btn) => {
        btn.classList.toggle('is-active', btn === button);
      });

      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      state.query = event.target.value || '';
      state.limit = PAGE_STEP;
      render();
    });
  }

  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', () => {
      state.limit += PAGE_STEP;
      render();
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      state.items = [];
      state.limit = PAGE_STEP;
      render();
      load();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
