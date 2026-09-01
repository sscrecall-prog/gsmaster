/**
 * GS MASTER APP - BILINGUAL LECTURE INTERACTIVE ENGINE
 * Ultra-Modern Reading & Navigation Engine
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
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const backToTopBtn = document.getElementById('back-to-top');
  const fontSizeBtns = document.querySelectorAll('.font-size-btn');
  const langBtns = document.querySelectorAll('.lang-btn');
  const allCards = Array.from(document.querySelectorAll('.study-card'));
  const navLinks = Array.from(document.querySelectorAll('.topic-link'));

  // 1. Language Display Mode Management (Both, EN, HI)
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
  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('open');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
  }

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });

  // 6. Search Filter Inside Lecture
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (searchClearBtn) {
        searchClearBtn.style.display = q ? 'flex' : 'none';
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

  // 7. Clipboard Copy Toast Notification
  const toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.textContent = '✨ Copied to Clipboard!';
  document.body.appendChild(toast);

  function showToast(msg) {
    toast.textContent = msg || '✨ Copied to Clipboard!';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  document.querySelectorAll('.badge-tag, .offer-plan-title').forEach(el => {
    el.title = 'Click to copy text';
    el.addEventListener('click', () => {
      const textToCopy = el.innerText;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`📋 Copied: "${textToCopy.slice(0, 25)}..."`);
        });
      }
    });
  });

  // 8. Auto-Inject Floating Thumb Navigation on Mobile
  if (!document.querySelector('.floating-mobile-nav')) {
    const floatBar = document.createElement('div');
    floatBar.className = 'floating-mobile-nav';
    floatBar.innerHTML = `
      <a href="../../index.html" class="floating-nav-btn" title="Back to Dashboard">🏠 Hub</a>
      <button class="floating-nav-btn" id="mobile-toc-btn">📖 विषय सूची</button>
      <button class="floating-nav-btn" id="mobile-font-btn">A+ Font</button>
    `;
    document.body.appendChild(floatBar);

    document.getElementById('mobile-toc-btn')?.addEventListener('click', openSidebar);
    document.getElementById('mobile-font-btn')?.addEventListener('click', () => {
      const curSize = htmlEl.classList.contains('font-xlarge') ? 'normal' : 
                      htmlEl.classList.contains('font-large') ? 'xlarge' : 'large';
      applyFontSize(curSize);
      showToast(`🔤 Font Size: ${curSize.toUpperCase()}`);
    });
  }
});
