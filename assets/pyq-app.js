/**
 * Polity Lecture-1 Premium Study Notes
 * Interactive Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const progressBar = document.getElementById('progress-bar');
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear');
  const menuToggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('app-sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const backToTopBtn = document.getElementById('back-to-top');
  const fontSizeBtns = document.querySelectorAll('.font-size-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const starredCountEl = document.getElementById('starred-count');
  const allCards = Array.from(document.querySelectorAll('.question-card'));
  const gridBtns = Array.from(document.querySelectorAll('.pyq-grid-btn'));

  // State
  let bookmarks = JSON.parse(localStorage.getItem('polity_bookmarks') || '[]');
  let activeFilter = 'all'; // 'all' | 'starred'
  let searchQuery = '';

  // --------------------------------------------------------------------------
  // 1. Theme Management
  // --------------------------------------------------------------------------
  const savedTheme = localStorage.getItem('polity_theme') || 
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
    localStorage.setItem('polity_theme', theme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Font Size Management
  // --------------------------------------------------------------------------
  const savedFontSize = localStorage.getItem('polity_font_size') || 'normal';
  applyFontSize(savedFontSize);

  fontSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.getAttribute('data-size');
      applyFontSize(size);
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
    localStorage.setItem('polity_font_size', size);
  }

  // --------------------------------------------------------------------------
  // 3. Scroll Progress & Back to Top & ScrollSpy
  // --------------------------------------------------------------------------
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    if (backToTopBtn) {
      if (winScroll > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    updateActiveNav();
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let currentId = '';

    allCards.forEach(card => {
      if (card.offsetTop <= scrollPos && (card.offsetTop + card.offsetHeight) > scrollPos) {
        currentId = card.id;
      }
    });

    if (currentId) {
      gridBtns.forEach(btn => {
        if (btn.getAttribute('href') === `#${currentId}`) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 4. Mobile Drawer / Sidebar
  // --------------------------------------------------------------------------
  if (menuToggleBtn && sidebar && sidebarBackdrop) {
    menuToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarBackdrop.classList.toggle('open');
    });

    sidebarBackdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarBackdrop.classList.remove('open');
    });

    // Close on navigation link click (mobile)
    document.querySelectorAll('.app-sidebar a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 860) {
          sidebar.classList.remove('open');
          sidebarBackdrop.classList.remove('open');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Bookmarks / Star Management
  // --------------------------------------------------------------------------
  function updateBookmarkUI() {
    // Update question cards
    allCards.forEach(card => {
      const qNum = card.getAttribute('data-q');
      const bmBtn = card.querySelector('.btn-bookmark');
      if (bookmarks.includes(qNum)) {
        if (bmBtn) {
          bmBtn.classList.add('bookmarked');
          bmBtn.innerHTML = '★';
          bmBtn.title = 'Remove Bookmark';
        }
      } else {
        if (bmBtn) {
          bmBtn.classList.remove('bookmarked');
          bmBtn.innerHTML = '☆';
          bmBtn.title = 'Bookmark Question';
        }
      }
    });

    // Update sidebar grid
    gridBtns.forEach(btn => {
      const qNum = btn.getAttribute('data-q');
      if (bookmarks.includes(qNum)) {
        btn.classList.add('bookmarked');
      } else {
        btn.classList.remove('bookmarked');
      }
    });

    // Update counter
    if (starredCountEl) {
      starredCountEl.textContent = bookmarks.length;
    }

    localStorage.setItem('polity_bookmarks', JSON.stringify(bookmarks));
  }

  // Initial update
  updateBookmarkUI();

  // Attach card bookmark handlers
  allCards.forEach(card => {
    const bmBtn = card.querySelector('.btn-bookmark');
    const qNum = card.getAttribute('data-q');
    if (bmBtn) {
      bmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bookmarks.includes(qNum)) {
          bookmarks = bookmarks.filter(n => n !== qNum);
        } else {
          bookmarks.push(qNum);
        }
        updateBookmarkUI();
        if (activeFilter === 'starred') {
          applyFilterAndSearch();
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 6. Filtering & Live Search Engine
  // --------------------------------------------------------------------------
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      applyFilterAndSearch();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (searchClearBtn) {
        searchClearBtn.style.display = searchQuery ? 'block' : 'none';
      }
      applyFilterAndSearch();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
        searchClearBtn.style.display = 'none';
        applyFilterAndSearch();
        searchInput.focus();
      }
    });
  }

  function applyFilterAndSearch() {
    let visibleCount = 0;

    allCards.forEach(card => {
      const qNum = card.getAttribute('data-q');
      const textContent = card.innerText.toLowerCase();
      
      const matchesFilter = activeFilter === 'all' || (activeFilter === 'starred' && bookmarks.includes(qNum));
      const matchesSearch = !searchQuery || textContent.includes(searchQuery);

      if (matchesFilter && matchesSearch) {
        card.classList.remove('is-hidden');
        if (searchQuery) {
          card.classList.add('highlight-search');
        } else {
          card.classList.remove('highlight-search');
        }
        visibleCount++;
      } else {
        card.classList.add('is-hidden');
        card.classList.remove('highlight-search');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Copy to Clipboard
  // --------------------------------------------------------------------------
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const card = btn.closest('.question-card');
      if (!card) return;
      
      const qText = card.querySelector('.question-text')?.innerText || '';
      const shift = card.querySelector('.q-shift-badge')?.innerText || '';
      const options = Array.from(card.querySelectorAll('.option-item')).map(opt => opt.innerText.trim()).join('\n');
      const explanation = card.querySelector('.explanation-content')?.innerText || '';
      
      const copyText = `POLITY PYQ\n${shift}\n\n${qText}\n\n${options}\n\nEXPLANATION:\n${explanation}`;
      
      try {
        await navigator.clipboard.writeText(copyText);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '✓';
        btn.style.color = 'var(--success)';
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.style.color = '';
        }, 1800);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    });
  });
});
