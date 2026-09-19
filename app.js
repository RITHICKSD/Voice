/* ==========================================================================
   VOXVERSE STUDIO - CORE JAVASCRIPT APP ENGINE
   Features: Multi-page view routing, Active header link underline, Audio Player Engine,
   Dark/Light Theme Toggle, LTR/RTL Toggle, Talent Roster Filter, FAQ Accordion.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initDirectionEngine();
  initNavigationEngine();
  initAudioEngine();
  initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. NAVIGATION ENGINE (Multi-Page Routing & Active Link Highlights)
   -------------------------------------------------------------------------- */
function navigateTo(pageId) {
  // Hide all page views
  const pages = document.querySelectorAll('.page-view');
  pages.forEach(page => page.classList.remove('active'));

  // Show target page
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (pageId === 'contact' && window.tryInitStudioMap) {
      setTimeout(function() {
        window.tryInitStudioMap();
        if (window.initStudioMap) window.initStudioMap();
      }, 100);
    }
  }

  // Update Header Active Underline Indicator
  updateActiveNavHighlight(pageId);

  // Close mobile nav if open
  const mainNav = document.getElementById('mainNav');
  if (mainNav) mainNav.classList.remove('active');
}

function updateActiveNavHighlight(pageId) {
  // Clear existing active items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  // Handle Home Dropdown Grouping
  if (pageId === 'home1' || pageId === 'home2') {
    const homeGroup = document.querySelector('[data-page-group="home"]');
    if (homeGroup) homeGroup.classList.add('active');
  } else {
    const activeLink = document.getElementById(`nav-${pageId}`);
    if (activeLink && activeLink.closest('.nav-item')) {
      activeLink.closest('.nav-item').classList.add('active');
    }
  }
}

function initNavigationEngine() {
  // Check hash on page load
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    navigateTo(hash);
  } else {
    navigateTo('home1'); // Default page
  }

  // Handle hash change event
  window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash) navigateTo(currentHash);
  });
}

function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mainNav');

  if (btn && nav) {
    btn.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }
}

/* --------------------------------------------------------------------------
   2. DARK / LIGHT THEME TOGGLE ENGINE
   -------------------------------------------------------------------------- */
function initThemeEngine() {
  const toggleBtns = document.querySelectorAll('.theme-toggle');
  const savedTheme = localStorage.getItem('voxverse_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('voxverse_theme', newTheme);
    });
  });
}

/* --------------------------------------------------------------------------
   3. LTR / RTL LAYOUT TOGGLE ENGINE
   -------------------------------------------------------------------------- */
function initDirectionEngine() {
  const toggleBtns = document.querySelectorAll('.dir-toggle');
  const savedDir = localStorage.getItem('voxverse_dir') || 'ltr';

  document.documentElement.setAttribute('dir', savedDir);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir');
      const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('voxverse_dir', newDir);
    });
  });
}

/* --------------------------------------------------------------------------
   4. INTERACTIVE GLOBAL AUDIO PLAYER ENGINE
   -------------------------------------------------------------------------- */
let audioElement;
let isPlaying = false;

function initAudioEngine() {
  audioElement = document.getElementById('audioEngine');
  
  if (audioElement) {
    audioElement.addEventListener('timeupdate', updatePlayerProgress);
    audioElement.addEventListener('ended', () => {
      isPlaying = false;
      updatePlayPauseIcon();
    });
  }
}

function playAudioSample(artist, title, srcUrl) {
  const player = document.getElementById('globalAudioPlayer');
  const trackTitle = document.getElementById('playerTrackTitle');
  const trackArtist = document.getElementById('playerTrackArtist');

  if (player && trackTitle && trackArtist) {
    trackTitle.textContent = title;
    trackArtist.textContent = artist;
    player.classList.remove('hidden');

    if (audioElement) {
      audioElement.src = srcUrl;
      audioElement.play().then(() => {
        isPlaying = true;
        updatePlayPauseIcon();
      }).catch(err => {
        console.log("Audio playback simulated for demo environment:", err);
        isPlaying = true;
        updatePlayPauseIcon();
      });
    }
  }
}

function togglePlayPause() {
  if (!audioElement) return;

  if (isPlaying) {
    audioElement.pause();
    isPlaying = false;
  } else {
    audioElement.play();
    isPlaying = true;
  }
  updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
  const btn = document.getElementById('playPauseBtn');
  if (btn) {
    btn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
  }
}

function updatePlayerProgress() {
  if (!audioElement) return;

  const current = audioElement.currentTime || 0;
  const duration = audioElement.duration || 30;
  const percent = (current / duration) * 100;

  const fill = document.getElementById('playerProgressFill');
  const timeCur = document.getElementById('playerCurrentTime');
  const timeTot = document.getElementById('playerTotalTime');

  if (fill) fill.style.width = `${percent}%`;
  if (timeCur) timeCur.textContent = formatTime(current);
  if (timeTot && !isNaN(duration)) timeTot.textContent = formatTime(duration);
}

function seekAudio(e) {
  const progressBar = e.currentTarget;
  const clickPosition = (e.pageX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
  if (audioElement && audioElement.duration) {
    audioElement.currentTime = clickPosition * audioElement.duration;
  }
}

function closeAudioPlayer() {
  if (audioElement) audioElement.pause();
  isPlaying = false;
  const player = document.getElementById('globalAudioPlayer');
  if (player) player.classList.add('hidden');
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/* --------------------------------------------------------------------------
   5. TALENT ROSTER FILTER LOGIC
   -------------------------------------------------------------------------- */
function filterTalentRoster() {
  const langFilter = document.getElementById('filterLanguage')?.value || 'all';
  const genderFilter = document.getElementById('filterGender')?.value || 'all';
  const toneFilter = document.getElementById('filterTone')?.value || 'all';

  const cards = document.querySelectorAll('#talentGrid .talent-card');

  cards.forEach(card => {
    const lang = card.getAttribute('data-lang');
    const gender = card.getAttribute('data-gender');
    const tone = card.getAttribute('data-tone');

    const matchLang = langFilter === 'all' || lang === langFilter;
    const matchGender = genderFilter === 'all' || gender === genderFilter;
    const matchTone = toneFilter === 'all' || tone === toneFilter;

    if (matchLang && matchGender && matchTone) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM & FAQ ACCORDION LOGIC
   -------------------------------------------------------------------------- */
function handleFormSubmit(e) {
  e.preventDefault();
  alert('Thank you for your inquiry! An executive casting producer from VoxVerse Studio will contact you within 2 hours.');
  e.target.reset();
}

function toggleFaq(element) {
  const item = element.closest('.faq-item');
  if (item) {
    item.classList.toggle('active');
  }
}

function calculateInstantEstimate() {
  const mins = parseFloat(document.getElementById('calcMins')?.value) || 1;
  const langs = parseFloat(document.getElementById('calcLangs')?.value) || 1;
  const buyout = parseFloat(document.getElementById('calcBuyout')?.value) || 1;

  const baseRatePerMin = 150;
  const total = mins * baseRatePerMin * langs * buyout;

  const display = document.getElementById('calcPriceDisplay');
  if (display) {
    display.textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

function switchLanguageTrack(langCode) {
  alert(`Switched preview audio stem to: ${langCode} Track`);
}
