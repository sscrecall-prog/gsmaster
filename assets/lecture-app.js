/**
 * Making of Constitution - Bilingual Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
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
  const langBtns = document.querySelectorAll('.lang-btn');
  const allCards = Array.from(document.querySelectorAll('.study-card'));
  const navLinks = Array.from(document.querySelectorAll('.topic-link'));

  // 1. Language Display Mode Management (Both, EN, HI)
  const savedLangMode = localStorage.getItem('moc_lang_mode') || 'all';
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
    localStorage.setItem('moc_lang_mode', mode);
  }

  // 2. Theme Management
  const savedTheme = localStorage.getItem('moc_theme') || 
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
    localStorage.setItem('moc_theme', theme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // 3. Font Size Management
  const savedFontSize = localStorage.getItem('moc_font_size') || 'normal';
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
    localStorage.setItem('moc_font_size', size);
  }

  // 4. Scroll Progress & ScrollSpy
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    if (backToTopBtn) {
      if (winScroll > 300) {
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
    const scrollPos = window.scrollY + 140;
    let currentId = '';

    allCards.forEach(card => {
      if (card.offsetTop <= scrollPos && (card.offsetTop + card.offsetHeight) > scrollPos) {
        currentId = card.id;
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  // 5. Drawer Toggle Management (Desktop & Mobile)
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('open');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  document.querySelectorAll('.app-sidebar a').forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
    }
  });

  // 6. Live Search Engine (Searches both English & Hindi)
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (searchClearBtn) {
        searchClearBtn.style.display = q ? 'block' : 'none';
      }

      allCards.forEach(card => {
        const text = card.innerText.toLowerCase();
        if (!q || text.includes(q)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchClearBtn.style.display = 'none';
        allCards.forEach(c => c.style.display = 'block');
        searchInput.focus();
      }
    });
  }
});
