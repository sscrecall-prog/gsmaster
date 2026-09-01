/**
 * GS MASTER APP - MASTER APPLICATION LOGIC
 * Ultra-Modern Interactive Hub Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const searchInput = document.getElementById('global-search');
  const searchClearBtn = document.getElementById('search-clear');
  const searchContainer = document.querySelector('.search-container');
  const fontSizeBtns = document.querySelectorAll('.font-size-btn');
  const langBtns = document.querySelectorAll('.lang-btn');
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const viewModeBtns = document.querySelectorAll('.view-mode-btn');
  const lecturesList = document.querySelector('.lectures-list');
  const lectureCards = Array.from(document.querySelectorAll('.lecture-row-card'));
  const dockItems = document.querySelectorAll('.dock-item');

  // 1. Language Display Mode Management
  const savedLangMode = localStorage.getItem('gs_lang_mode') || 'all';
  applyLangMode(savedLangMode);

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyLangMode(btn.getAttribute('data-lang'));
    });
  });

  function applyLangMode(mode) {
    htmlEl.setAttribute('data-lang-mode', mode);
    langBtns.forEach(b => {
      if (b.getAttribute('data-lang') === mode) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
    localStorage.setItem('gs_lang_mode', mode);
  }

  // 2. Theme Management (Light / Dark)
  const savedTheme = localStorage.getItem('gs_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlEl.setAttribute('data-theme', 'dark');
      if (themeToggleBtn) themeToggleBtn.innerHTML = '☀️';
      if (themeToggleBtn) themeToggleBtn.title = 'Switch to Light Mode';
    } else {
      htmlEl.removeAttribute('data-theme');
      if (themeToggleBtn) themeToggleBtn.innerHTML = '🌙';
      if (themeToggleBtn) themeToggleBtn.title = 'Switch to Dark Mode';
    }
    localStorage.setItem('gs_theme', theme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // 3. Font Size Management
  const savedFontSize = localStorage.getItem('gs_font_size') || 'normal';
  applyFontSize(savedFontSize);

  fontSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyFontSize(btn.getAttribute('data-size'));
    });
  });

  function applyFontSize(size) {
    htmlEl.classList.remove('font-normal', 'font-large', 'font-xlarge');
    htmlEl.classList.add(`font-${size}`);
    fontSizeBtns.forEach(b => {
      if (b.getAttribute('data-size') === size) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
    localStorage.setItem('gs_font_size', size);
  }

  // 4. Category Filter Tabs
  let activeFilter = 'all';

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      filterLectures();
    });
  });

  // 5. Global Search Across Lectures
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (searchClearBtn) {
        searchClearBtn.style.display = searchInput.value.trim() ? 'flex' : 'none';
      }
      filterLectures();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchClearBtn.style.display = 'none';
        filterLectures();
        searchInput.focus();
      }
    });
  }

  function filterLectures() {
    const query = (searchInput?.value || '').trim().toLowerCase();

    lectureCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || 'all';
      const matchesCategory = (activeFilter === 'all') || (cardCategory === activeFilter);
      const text = card.innerText.toLowerCase();
      const matchesSearch = !query || text.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // 6. View Mode Switcher (Card vs Compact Mode)
  const savedViewMode = localStorage.getItem('gs_view_mode') || 'card';
  applyViewMode(savedViewMode);

  viewModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyViewMode(btn.getAttribute('data-view') || 'card');
    });
  });

  function applyViewMode(mode) {
    if (lecturesList) {
      if (mode === 'compact') {
        lecturesList.classList.add('compact-mode');
      } else {
        lecturesList.classList.remove('compact-mode');
      }
    }
    viewModeBtns.forEach(b => {
      if (b.getAttribute('data-view') === mode) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
    localStorage.setItem('gs_view_mode', mode);
  }

  // 7. Keyboard Shortcuts (Press "/" or "Ctrl+K" to search)
  document.addEventListener('keydown', (e) => {
    if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchContainer) searchContainer.classList.add('mobile-open');
      searchInput?.focus();
    }
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput?.blur();
      if (searchContainer) searchContainer.classList.remove('mobile-open');
    }
  });

  // 8. Mobile Bottom Navigation Dock Handlers
  dockItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const action = item.getAttribute('data-action');
      if (action === 'search') {
        e.preventDefault();
        if (searchContainer) {
          searchContainer.classList.toggle('mobile-open');
          if (searchContainer.classList.contains('mobile-open')) {
            searchInput?.focus();
          }
        }
      } else if (action === 'theme') {
        e.preventDefault();
        const current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      } else if (action === 'view') {
        e.preventDefault();
        const currentMode = lecturesList?.classList.contains('compact-mode') ? 'compact' : 'card';
        applyViewMode(currentMode === 'compact' ? 'card' : 'compact');
      }
    });
  });
});
