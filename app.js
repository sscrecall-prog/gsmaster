/**
 * GS MASTER APP - MASTER APPLICATION LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const searchInput = document.getElementById('global-search');
  const searchClearBtn = document.getElementById('search-clear');
  const fontSizeBtns = document.querySelectorAll('.font-size-btn');
  const langBtns = document.querySelectorAll('.lang-btn');
  const lectureCards = Array.from(document.querySelectorAll('.lecture-row-card'));
  const subjectCards = Array.from(document.querySelectorAll('.subject-card'));

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

  // 4. Global Search Across Lectures & Subjects
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (searchClearBtn) {
        searchClearBtn.style.display = q ? 'block' : 'none';
      }

      lectureCards.forEach(card => {
        const text = card.innerText.toLowerCase();
        if (!q || text.includes(q)) {
          card.style.display = 'flex';
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
        lectureCards.forEach(c => c.style.display = 'flex');
        searchInput.focus();
      }
    });
  }
});
