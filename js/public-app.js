/* ==========================================================================
   Public Website Controller — zakovatklubi.uz Inspired Dual-Theme SPA
   Routes:
     #/             -> Dark Luxury Editorial Homepage
     #/savollar     -> Ochiq savollar bazasi (Light Workspace)
     #/paketlar     -> Savollar paketi (Light Workspace)
     #/turnirlar    -> Turnirlar jadvali (Light Workspace)
     #/saqlanganlar -> Saqlangan savollar (Light Workspace)
     #/haqida       -> Musobaqa haqida / Qoidalar (Light Workspace)
     #admin         -> Triggers Hidden Admin Panel overlay
   ========================================================================== */

window.ZakovatApp = window.ZakovatApp || {};

(function (App) {
  'use strict';

  const state = {
    route: 'home',
    heroSlide: 0,
    mobileMenuOpen: false,
    filters: {
      category: 'Barchasi',
      query: '',
      tournamentId: '',
      gameId: '',
      topic: ''
    },
    tourFilters: {
      category: 'Barchasi',
      query: '',
      status: ''
    },
    revealedIds: new Set(),
    showAllAnswers: false,
    practice: {
      open: false,
      questions: [],
      index: 0,
      answerShown: false,
      secondsLeft: 60,
      running: false,
      timerHandle: null,
      correct: 0,
      attempted: 0,
      results: {}
    }
  };

  /* Logo 5x hidden click tracker */
  let logoClicks = [];

  function init() {
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleGlobalKeydown);

    App.Store.subscribe(() => {
      renderAll();
    });

    // Check URL search param ?panel=admin or ?admin=1
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin') || params.get('panel') === 'admin') {
      handleHashChange();
      setTimeout(() => {
        if (App.Admin) App.Admin.open();
      }, 60);
    } else {
      handleHashChange();
    }
  }

  function handleGlobalKeydown(e) {
    // Hidden Admin Panel shortcut: Ctrl + Shift + A or Alt + Shift + Z
    if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') ||
        (e.altKey && e.shiftKey && e.key.toLowerCase() === 'z')) {
      e.preventDefault();
      if (App.Admin) App.Admin.open();
    }
    if (e.key === 'Escape' && state.practice.open) {
      closePractice();
    }
  }

  function handleHashChange() {
    const rawHash = (window.location.hash || '#/').replace(/^#/, '');
    if (rawHash === 'admin' || rawHash === '/admin') {
      if (App.Admin) App.Admin.open();
      // Keep underlying view rendered cleanly
      renderAll();
      return;
    }

    const clean = rawHash.replace(/^\/+/, '').split('?')[0];
    if (!clean || clean === 'bosh-sahifa') state.route = 'home';
    else if (clean === 'savollar') state.route = 'questions';
    else if (clean === 'paketlar') state.route = 'packets';
    else if (clean === 'turnirlar') state.route = 'tournaments';
    else if (clean === 'saqlanganlar') state.route = 'bookmarks';
    else if (clean === 'haqida') state.route = 'about';
    else state.route = 'home';

    state.mobileMenuOpen = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    renderAll();
  }

  function navigate(routeHash, presetFilters) {
    if (presetFilters) {
      Object.assign(state.filters, {
        category: 'Barchasi',
        query: '',
        tournamentId: '',
        gameId: '',
        topic: ''
      }, presetFilters);
      state.showAllAnswers = false;
      state.revealedIds.clear();
    }
    if (window.location.hash === routeHash) {
      handleHashChange();
    } else {
      window.location.hash = routeHash;
    }
  }

  function handleScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;
    if (window.scrollY > 36) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }

  function renderAll() {
    const isDark = state.route === 'home';
    document.body.classList.toggle('theme-dark', isDark);
    document.body.classList.toggle('theme-light', !isDark);

    const data = App.Store.getData();
    document.title = `${data.site.universityName} — Zakovat savollar va javoblar bazasi`;

    renderHeader();
    renderMain();
    renderFooter();
    renderPracticeModal();
    handleScroll();
  }

  /* ========================================================================
     HEADER & FOOTER
     ======================================================================== */

  function renderHeader() {
    const headerEl = document.getElementById('site-header');
    if (!headerEl) return;

    const { escapeHtml } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();
    const isDark = state.route === 'home';
    const bookmarksCount = App.Store.getBookmarks().size;
    const isDirty = App.Store.isDirty();

    headerEl.className = `site-header ${isDark ? 'header-dark' : 'header-light'}${window.scrollY > 36 ? ' scrolled' : ''}`;

    const navItems = [
      { id: 'home', label: 'Bosh sahifa', hash: '#/' },
      { id: 'questions', label: 'Savollar bazasi', hash: '#/savollar' },
      { id: 'packets', label: 'Savollar paketi', hash: '#/paketlar' },
      { id: 'tournaments', label: 'Turnirlar', hash: '#/turnirlar' },
      { id: 'bookmarks', label: 'Saqlanganlar', hash: '#/saqlanganlar', badge: bookmarksCount },
      { id: 'about', label: 'Haqida', hash: '#/haqida' }
    ];

    headerEl.innerHTML = `
      <div class="header-topbar">
        <div class="container topbar-inner">
          <div class="topbar-contacts">
            ${data.site.email ? `<a href="mailto:${escapeHtml(data.site.email)}" class="topbar-contact-item">${Icons.get('mail')}<span>${escapeHtml(data.site.email)}</span></a>` : ''}
            ${data.site.phone ? `<a href="tel:${escapeHtml(data.site.phone.replace(/[^+\d]/g, ''))}" class="topbar-contact-item">${Icons.get('phone')}<span>${escapeHtml(data.site.phone)}</span></a>` : ''}
          </div>
          ${data.site.announcementText ? `
            <a href="#/savollar" class="topbar-highlight" data-action="go-latest">
              ${Icons.get('sparkle')}
              <span>${escapeHtml(data.site.announcementText)}</span>
            </a>` : '<span></span>'}
          <div class="topbar-links">
            <a href="#/savollar">Ochiq savollar</a>
            <a href="#/paketlar">Paketlar</a>
            <a href="#/haqida">Qoidalar &amp; FAQ</a>
          </div>
        </div>
      </div>

      <div class="header-main">
        <div class="container header-main-inner">
          <div class="brand-logo" id="brand-logo-trigger" title="${escapeHtml(data.site.universityName)}">
            ${Icons.zakovatLogoSvg(isDark ? 'gold' : 'mono')}
            <div class="brand-subtitle">
              <span class="brand-uni-name">${escapeHtml(data.site.universityName)}</span>
              <span class="brand-club-tag">${escapeHtml(data.site.shortLabel || "Oliy ta'lim ligasi")}</span>
            </div>
          </div>

          <nav class="main-nav" aria-label="Asosiy navigatsiya">
            ${navItems.map((item) => `
              <a href="${item.hash}" class="nav-link ${state.route === item.id ? 'active' : ''}">
                <span>${item.label}</span>
                ${item.badge > 0 ? `<span class="nav-badge">${item.badge}</span>` : ''}
              </a>
            `).join('')}
          </nav>

          <div class="header-actions">
            ${isDirty ? `
              <button type="button" class="draft-indicator-pill" id="header-draft-btn" title="Admin panelga qaytib deploy faylini yuklab olish">
                ${Icons.get('rocket')}
                <span>Qoralama</span>
              </button>` : ''}
            <button type="button" class="practice-trigger" id="header-practice-btn">
              ${Icons.get('timer')}
              <span>Mashq rejimi</span>
            </button>
            <button type="button" class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Menyuni ochish">
              ${state.mobileMenuOpen ? Icons.get('x') : Icons.get('menu')}
            </button>
          </div>
        </div>
      </div>

      <div class="mobile-drawer ${state.mobileMenuOpen ? 'open' : ''}" id="mobile-drawer">
        ${navItems.map((item) => `
          <a href="${item.hash}" class="${state.route === item.id ? 'active' : ''}">
            <span>${item.label}</span>
            ${item.badge > 0 ? `<span class="nav-badge">${item.badge}</span>` : ''}
          </a>
        `).join('')}
        <button type="button" class="btn btn-primary btn-sm" id="mobile-practice-btn" style="margin-top:6px;">
          ${Icons.get('timer')} 60 soniyalik mashq rejimi
        </button>
      </div>
    `;

    // Secret 5-tap logo listener + regular home navigation
    const logoBtn = document.getElementById('brand-logo-trigger');
    if (logoBtn) {
      logoBtn.addEventListener('click', () => {
        const now = Date.now();
        logoClicks = logoClicks.filter((t) => now - t < 2400);
        logoClicks.push(now);
        if (logoClicks.length >= 5) {
          logoClicks = [];
          if (App.Admin) App.Admin.open();
          return;
        }
        if (state.route !== 'home') {
          navigate('#/');
        }
      });
    }

    const practiceBtn = document.getElementById('header-practice-btn');
    if (practiceBtn) {
      practiceBtn.addEventListener('click', () => startPractice(App.Store.getPublishedQuestions()));
    }
    const mobilePracticeBtn = document.getElementById('mobile-practice-btn');
    if (mobilePracticeBtn) {
      mobilePracticeBtn.addEventListener('click', () => {
        state.mobileMenuOpen = false;
        startPractice(App.Store.getPublishedQuestions());
      });
    }

    const draftBtn = document.getElementById('header-draft-btn');
    if (draftBtn) {
      draftBtn.addEventListener('click', () => {
        if (App.Admin) App.Admin.open();
      });
    }

    const menuToggle = document.getElementById('mobile-menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        state.mobileMenuOpen = !state.mobileMenuOpen;
        renderHeader();
      });
    }
  }

  function renderFooter() {
    const footerEl = document.getElementById('site-footer');
    if (!footerEl) return;

    const { escapeHtml, formatDateUz } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();

    footerEl.innerHTML = `
      <div class="container">
        <div class="footer-top-row">
          <div>
            ${Icons.zakovatLogoSvg('gold')}
            <p class="footer-quote">${escapeHtml(data.site.quote)}</p>
          </div>
          <div class="footer-callout-card">
            <div>
              <h3 class="footer-callout-title">Navbatdagi o'yinga tayyorlaning!</h3>
              <p class="footer-callout-sub">
                O'tgan turlardagi barcha savollarni 60 soniyalik rasmiy taymer bilan mashq qiling yoki tayyor savol paketlarini yuklab oling.
              </p>
              <div class="footer-callout-actions">
                <button type="button" class="btn btn-primary" id="footer-practice-btn">
                  ${Icons.get('timer')} Mashqni boshlash
                </button>
                <a href="#/paketlar" class="btn btn-outline-gold">
                  ${Icons.get('book')} Savollar paketlari
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-mid-row">
          <div>
            <div class="footer-contact-lbl">Bizning telefon raqam:</div>
            <a href="tel:${escapeHtml((data.site.phone || '').replace(/[^+\d]/g, ''))}" class="footer-contact-val">${escapeHtml(data.site.phone || '—')}</a>
            <div class="footer-contact-lbl">Elektron pochta manzili:</div>
            <a href="mailto:${escapeHtml(data.site.email || '')}" class="footer-contact-val">${escapeHtml(data.site.email || '—')}</a>
            <div class="footer-contact-lbl">Ijtimoiy tarmoqlar:</div>
            <div class="footer-socials">
              ${data.site.telegramUrl ? `<a href="${escapeHtml(data.site.telegramUrl)}" target="_blank" rel="noopener" class="footer-social-btn" aria-label="Telegram">${Icons.get('send')}</a>` : ''}
              <a href="#/savollar" class="footer-social-btn" aria-label="Savollar">${Icons.get('helpCircle')}</a>
              <a href="#/turnirlar" class="footer-social-btn" aria-label="Turnirlar">${Icons.get('trophy')}</a>
            </div>
          </div>

          <div>
            <div class="footer-col-title">Savollar arxivi</div>
            <ul class="footer-links">
              <li><a href="#/savollar">Ochiq savollar bazasi</a></li>
              <li><a href="#/paketlar">Savollar paketlari</a></li>
              <li><a href="#/saqlanganlar">Saqlangan savollar</a></li>
            </ul>
          </div>

          <div>
            <div class="footer-col-title">Musobaqalar</div>
            <ul class="footer-links">
              <li><a href="#/turnirlar">Barcha turnirlar</a></li>
              <li><a href="#/" id="footer-latest-round-link">So'nggi o'yinlar</a></li>
              <li><a href="#/haqida">O'yin qoidalari</a></li>
            </ul>
          </div>

          <div>
            <div class="footer-col-title">Klub haqida</div>
            <ul class="footer-links">
              <li><a href="#/haqida">Universitet Zakovat klubi</a></li>
              <li><a href="#/haqida">Ko'p so'raladigan savollar</a></li>
              <li><a href="mailto:${escapeHtml(data.site.email || '')}">Bog'lanish</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom-row">
          <span>&copy; ${new Date().getFullYear()} ${escapeHtml(data.site.universityName)}. Barcha huquqlar himoyalangan.</span>
          <span class="footer-version-tag">Baza versiyasi: v${escapeHtml(data.version || '1.0.0')} &bull; Yangilangan: ${formatDateUz(data.updatedAt)}</span>
        </div>
      </div>
    `;

    const fpBtn = document.getElementById('footer-practice-btn');
    if (fpBtn) {
      fpBtn.addEventListener('click', () => startPractice(App.Store.getPublishedQuestions()));
    }
  }

  /* ========================================================================
     MAIN VIEW DISPATCHER
     ======================================================================== */

  function renderMain() {
    const mainEl = document.getElementById('app-main');
    if (!mainEl) return;

    if (state.route === 'home') renderHomeView(mainEl);
    else if (state.route === 'questions') renderQuestionsView(mainEl, 'database');
    else if (state.route === 'packets') renderQuestionsView(mainEl, 'packets');
    else if (state.route === 'tournaments') renderTournamentsView(mainEl);
    else if (state.route === 'bookmarks') renderBookmarksView(mainEl);
    else if (state.route === 'about') renderAboutView(mainEl);
  }

  /* ========================================================================
     VIEW 1: HOME (Dark Luxury Editorial — zakovatklubi.uz)
     ======================================================================== */

  function renderHomeView(container) {
    const { escapeHtml, formatDateUz } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();
    const games = App.Store.getPublishedGames();
    const questions = App.Store.getPublishedQuestions();
    const tournaments = data.tournaments;
    const latestGame = games[0] || null;

    const slides = [
      {
        eyebrow: `${data.site.shortLabel || "Universitet Zakovat ligasi"} • v${data.version || '1.0.0'}`,
        title: data.site.heroTitle,
        subtitle: data.site.heroSubtitle,
        primaryLabel: "Savollarni ko'rish",
        primaryAction: () => navigate('#/savollar'),
        secondaryLabel: 'Turnirlar jadvali',
        secondaryAction: () => navigate('#/turnirlar')
      },
      {
        eyebrow: latestGame ? `So'nggi tur • ${formatDateUz(latestGame.date)}` : "Ochiq savollar paketi",
        title: latestGame ? latestGame.title : "Barcha turlarning tayyor savol paketlari",
        subtitle: latestGame
          ? `${latestGame.description || "Ushbu turda berilgan barcha savollar, rasmiy javoblar va izohlar bilan tanishing."} (${App.Store.getQuestionsByGame(latestGame.id).length} ta savol)`
          : "Har bir o'yin yakunida barcha savollar va javoblar alohida paket sifatida e'lon qilinadi.",
        primaryLabel: "Ushbu tur savollari",
        primaryAction: () =>
          latestGame
            ? navigate('#/savollar', { tournamentId: latestGame.tournamentId || '', gameId: latestGame.id })
            : navigate('#/paketlar'),
        secondaryLabel: 'Barcha paketlar',
        secondaryAction: () => navigate('#/paketlar')
      },
      {
        eyebrow: "60 soniyalik Zakovat taymeri",
        title: "Jamoangiz bilan real o'yin muhitida mashq qiling",
        subtitle:
          "Savollarni javobsiz rejimda o'qing, 60 soniyalik rasmiy taymerni ishga tushiring va javoblarni birma-bir tekshirib boring.",
        primaryLabel: "Mashq rejimini ochish",
        primaryAction: () => startPractice(questions),
        secondaryLabel: "Saqlangan savollar",
        secondaryAction: () => navigate('#/saqlanganlar')
      }
    ];

    const currentSlide = slides[state.heroSlide % slides.length];

    // Topic distribution stats
    const topicCounts = {};
    questions.forEach((q) => {
      const t = q.topic || 'Umumiy';
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    });
    const topicEntries = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7);
    const maxTopicCount = topicEntries.length ? topicEntries[0][1] : 1;

    container.innerHTML = `
      <div class="home-dark-shell">
        <div class="home-ambient-orbs">
          <div class="ambient-orb ambient-orb-1"></div>
          <div class="ambient-orb ambient-orb-2"></div>
          <div class="ambient-orb ambient-orb-3"></div>
          <div class="hero-geo-lines"></div>
        </div>

        <!-- HERO SECTION -->
        <section class="zk-hero">
          <div class="container">
            <div class="zk-hero-grid">
              <div>
                <div class="hero-eyebrow">
                  ${Icons.get('sparkle')}
                  <span>${escapeHtml(currentSlide.eyebrow)}</span>
                </div>
                <h1 class="hero-title">${escapeHtml(currentSlide.title)}</h1>
                <p class="hero-subtitle">${escapeHtml(currentSlide.subtitle)}</p>
                <div class="hero-cta-row">
                  <button type="button" class="btn btn-primary btn-lg" id="hero-primary-btn">
                    ${escapeHtml(currentSlide.primaryLabel)}
                  </button>
                  <button type="button" class="btn btn-outline-gold btn-lg" id="hero-secondary-btn">
                    ${escapeHtml(currentSlide.secondaryLabel)}
                  </button>
                </div>
                <div class="hero-dash-indicators" role="tablist" aria-label="Slaydlar">
                  ${slides.map((_, idx) => `
                    <button type="button" class="hero-dash ${idx === state.heroSlide ? 'active' : ''}" data-slide="${idx}" aria-label="${idx + 1}-slayd"></button>
                  `).join('')}
                </div>
              </div>

              <div class="hero-visual-wrap">
                <div class="hero-hourglass-frame">
                  ${Icons.heroHourglassSvg()}
                  <div class="hero-stat-floating">
                    <div>
                      <div class="hero-stat-floating-num">${questions.length}</div>
                      <div class="hero-stat-floating-lbl">Rasmiy savol<br>${games.length} ta o'yinda</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- GLASSMORPHIC SEARCH PILL BAR (Exact zakovatklubi.uz signature) -->
            <form class="hero-search-bar" id="hero-search-form">
              ${Icons.trophyAccentSvg()}
              <div class="hero-search-field">
                <input type="text" class="hero-search-input" id="hero-q-input" placeholder="Savol yoki javobdan qidirish..." />
              </div>
              <div class="hero-search-field">
                <select class="hero-search-select" id="hero-tour-select" aria-label="Turnir">
                  <option value="">Barcha turnirlar</option>
                  ${tournaments.map((t) => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.name)}</option>`).join('')}
                </select>
              </div>
              <div class="hero-search-field">
                <select class="hero-search-select" id="hero-game-select" aria-label="O'yin">
                  <option value="">Barcha turlar</option>
                  ${games.map((g) => `<option value="${escapeHtml(g.id)}">${escapeHtml(g.title)}</option>`).join('')}
                </select>
              </div>
              <div class="hero-search-field">
                <select class="hero-search-select" id="hero-topic-select" aria-label="Mavzu">
                  <option value="">Barcha mavzular</option>
                  ${data.site.topics.map((tp) => `<option value="${escapeHtml(tp)}">${escapeHtml(tp)}</option>`).join('')}
                </select>
              </div>
              <button type="submit" class="hero-search-btn">QIDIRISH</button>
            </form>
          </div>
        </section>

        <!-- SO'NGGI O'YINLAR (Exact zakovatklubi.uz Dark Translucent Game Cards) -->
        <section class="home-section">
          <div class="container">
            <div class="section-header-row">
              <div class="section-heading-group">
                <div class="section-icon-dark">${Icons.get('layers')}</div>
                <div>
                  <h2 class="section-title-dark">So'nggi o'yinlar</h2>
                  <p class="section-subtitle-dark">Universitet turnirlarida yaqinda o'tkazilgan turlar va ularning savollar to'plamlari</p>
                </div>
              </div>
              <a href="#/paketlar" class="section-see-all">Barchasini ko'rish ${Icons.get('arrowRight')}</a>
            </div>

            <div class="dark-cards-grid">
              ${games.slice(0, 6).map((game) => {
                const tour = App.Store.getTournamentById(game.tournamentId);
                const qCount = App.Store.getQuestionsByGame(game.id).length;
                return `
                  <article class="zk-game-card" data-open-game="${escapeHtml(game.id)}" data-open-tour="${escapeHtml(game.tournamentId || '')}">
                    <div class="zk-game-card-head">
                      <div>
                        <div class="zk-game-card-tag">${escapeHtml(game.category || (tour ? tour.category : 'Turnir'))}</div>
                        <h3 class="zk-game-card-title">${escapeHtml(game.title)}</h3>
                        <div class="zk-game-card-date">${formatDateUz(game.date)} ${tour ? `&bull; ${escapeHtml(tour.season || tour.name)}` : ''}</div>
                      </div>
                    </div>
                    <div class="zk-score-boxes">
                      <div class="zk-score-box gold-box">
                        <span class="zk-score-label">Savollar</span>
                        <span class="zk-score-value">${qCount}</span>
                      </div>
                      <div class="zk-score-box slate-box">
                        <span class="zk-score-label">Jamoalar</span>
                        <span class="zk-score-value">${Number(game.teamsPlayed) || '—'}</span>
                      </div>
                    </div>
                    <div class="zk-game-card-footer">
                      <span>${game.winnerTeam ? `G'olib: <strong style="color:#fff">${escapeHtml(game.winnerTeam)}</strong>` : `Boshlovchi: ${escapeHtml(game.host || 'Klub')}`}</span>
                      <span class="zk-game-card-link">Ochish ${Icons.get('arrowRight')}</span>
                    </div>
                  </article>
                `;
              }).join('')}
            </div>
          </div>
        </section>

        <!-- SO'NGGI E'LON QILINGAN SAVOLLAR (Interactive Dark Preview) -->
        <section class="home-section">
          <div class="container">
            <div class="section-header-row">
              <div class="section-heading-group">
                <div class="section-icon-dark">${Icons.get('helpCircle')}</div>
                <div>
                  <h2 class="section-title-dark">So'nggi savollardan namunalar</h2>
                  <p class="section-subtitle-dark">O'zingizni sinab ko'ring — javobni ko'rish uchun tugmani bosing</p>
                </div>
              </div>
              <a href="#/savollar" class="section-see-all">Barcha savollar (${questions.length}) ${Icons.get('arrowRight')}</a>
            </div>

            <div class="dark-questions-grid">
              ${questions.slice(0, 4).map((q, idx) => {
                const game = App.Store.getGameById(q.gameId);
                const revealed = state.revealedIds.has(`home_${q.id}`);
                return `
                  <article class="zk-dark-qcard">
                    <div class="zk-dark-qcard-meta">
                      <span class="zk-dark-qnum">${q.number || idx + 1}-savol</span>
                      <span class="zk-dark-qtag">${escapeHtml(game ? game.title : '')} ${q.topic ? `&bull; ${escapeHtml(q.topic)}` : ''}</span>
                    </div>
                    <div class="zk-dark-qtext">${escapeHtml(q.question)}</div>
                    ${revealed ? `
                      <div class="zk-dark-answer-box">
                        <div><strong>JAVOB:</strong> ${escapeHtml(q.answer)}</div>
                        ${q.comment ? `<div style="margin-top:6px;color:rgba(255,255,255,0.78);font-size:13.5px;"><strong>IZOH:</strong> ${escapeHtml(q.comment)}</div>` : ''}
                      </div>` : ''}
                    <button type="button" class="zk-dark-toggle-btn" data-home-reveal="${escapeHtml(q.id)}">
                      ${revealed ? Icons.get('eyeOff') : Icons.get('eye')}
                      <span>${revealed ? 'Javobni yopish' : "Javobni ko'rish"}</span>
                    </button>
                  </article>
                `;
              }).join('')}
            </div>
          </div>
        </section>

        <!-- SO'NGGI TURNIRLAR (Exact zakovatklubi.uz Frosted Cards) -->
        <section class="home-section">
          <div class="container">
            <div class="section-header-row">
              <div class="section-heading-group">
                <div class="section-icon-dark">${Icons.get('trophy')}</div>
                <div>
                  <h2 class="section-title-dark">Turnirlar</h2>
                  <p class="section-subtitle-dark">Joriy va o'tgan mavsumlar doirasida tashkil etilgan universitet musobaqalari</p>
                </div>
              </div>
              <a href="#/turnirlar" class="section-see-all">Barchasini ko'rish ${Icons.get('arrowRight')}</a>
            </div>

            <div class="dark-tournaments-grid">
              ${tournaments.map((t) => {
                const tourGames = games.filter((g) => g.tournamentId === t.id);
                const tourQCount = tourGames.reduce((sum, g) => sum + App.Store.getQuestionsByGame(g.id).length, 0);
                return `
                  <article class="zk-tour-card" data-open-tournament="${escapeHtml(t.id)}">
                    <div class="zk-tour-card-top">
                      <div class="zk-tour-avatar">#${escapeHtml(t.code || 'Z')}</div>
                      <div>
                        <h3 class="zk-tour-name">${escapeHtml(t.name)}</h3>
                        <span class="zk-tour-status">${t.status === 'active' ? '● Davom etmoqda' : 'Yakunlangan'} &bull; ${escapeHtml(t.category || 'Liga')}</span>
                      </div>
                    </div>
                    <div class="zk-tour-metrics">
                      <div>
                        <div class="zk-tour-metric-lbl">Turlar soni</div>
                        <div class="zk-tour-metric-val">${tourGames.length} ta</div>
                      </div>
                      <div>
                        <div class="zk-tour-metric-lbl">Savollar soni</div>
                        <div class="zk-tour-metric-val">${tourQCount} ta</div>
                      </div>
                      <div>
                        <div class="zk-tour-metric-lbl">Boshlanish</div>
                        <div class="zk-tour-metric-val">${formatDateUz(t.startDate)}</div>
                      </div>
                      <div>
                        <div class="zk-tour-metric-lbl">Jamoalar</div>
                        <div class="zk-tour-metric-val">${Number(t.teamsCount) || '—'}</div>
                      </div>
                    </div>
                  </article>
                `;
              }).join('')}
            </div>
          </div>
        </section>

        <!-- UMUMIY STATISTIKA -->
        <section class="home-section" style="padding-bottom:78px;">
          <div class="container">
            <div class="section-header-row">
              <div class="section-heading-group">
                <div class="section-icon-dark">${Icons.get('chart')}</div>
                <div>
                  <h2 class="section-title-dark">Umumiy statistika</h2>
                  <p class="section-subtitle-dark">Arxivdagi barcha savollar va mavzular kesimidagi taqsimot</p>
                </div>
              </div>
            </div>

            <div class="home-stats-layout">
              <div class="stats-dark-panel">
                <h3 style="font-size:18px;font-weight:600;color:#fff;">Arxiv ko'rsatkichlari</h3>
                <div class="stats-kpi-grid">
                  <div class="stats-kpi-tile">
                    <div class="stats-kpi-num">${questions.length}</div>
                    <div class="stats-kpi-lbl">E'lon qilingan savollar</div>
                  </div>
                  <div class="stats-kpi-tile">
                    <div class="stats-kpi-num">${games.length}</div>
                    <div class="stats-kpi-lbl">O'tkazilgan turlar</div>
                  </div>
                  <div class="stats-kpi-tile">
                    <div class="stats-kpi-num">${tournaments.length}</div>
                    <div class="stats-kpi-lbl">Jami turnirlar</div>
                  </div>
                  <div class="stats-kpi-tile">
                    <div class="stats-kpi-num">${topicEntries.length}</div>
                    <div class="stats-kpi-lbl">Savol yo'nalishlari</div>
                  </div>
                </div>
              </div>

              <div class="stats-dark-panel">
                <h3 style="font-size:18px;font-weight:600;color:#fff;">Savollar soni (mavzular kesimida)</h3>
                <div class="topic-bars-chart">
                  ${topicEntries.length ? topicEntries.map(([topic, count]) => {
                    const hPct = Math.max(14, Math.round((count / maxTopicCount) * 100));
                    return `
                      <div class="topic-bar-col" title="${escapeHtml(topic)}: ${count} ta">
                        <span class="topic-bar-val">${count}</span>
                        <div class="topic-bar-pill" style="height:${hPct}%;"></div>
                        <span class="topic-bar-lbl">${escapeHtml(topic)}</span>
                      </div>
                    `;
                  }).join('') : `<p style="color:rgba(255,255,255,0.5);margin:auto;">Hozircha savollar mavjud emas</p>`}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;

    // Bind Hero CTA & Slide Indicators
    document.getElementById('hero-primary-btn').addEventListener('click', currentSlide.primaryAction);
    document.getElementById('hero-secondary-btn').addEventListener('click', currentSlide.secondaryAction);
    container.querySelectorAll('.hero-dash').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.heroSlide = Number(btn.dataset.slide) || 0;
        renderHomeView(container);
      });
    });

    // Bind Hero Glassmorphic Search Bar
    const heroTourSel = document.getElementById('hero-tour-select');
    const heroGameSel = document.getElementById('hero-game-select');
    heroTourSel.addEventListener('change', () => {
      const tid = heroTourSel.value;
      const filteredGames = tid ? games.filter((g) => g.tournamentId === tid) : games;
      heroGameSel.innerHTML = `<option value="">Barcha turlar</option>` +
        filteredGames.map((g) => `<option value="${escapeHtml(g.id)}">${escapeHtml(g.title)}</option>`).join('');
    });

    document.getElementById('hero-search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      navigate('#/savollar', {
        query: document.getElementById('hero-q-input').value.trim(),
        tournamentId: heroTourSel.value,
        gameId: heroGameSel.value,
        topic: document.getElementById('hero-topic-select').value
      });
    });

    // Bind Game & Tournament cards
    container.querySelectorAll('[data-open-game]').forEach((card) => {
      card.addEventListener('click', () => {
        navigate('#/savollar', {
          tournamentId: card.dataset.openTour || '',
          gameId: card.dataset.openGame
        });
      });
    });

    container.querySelectorAll('[data-open-tournament]').forEach((card) => {
      card.addEventListener('click', () => {
        navigate('#/savollar', { tournamentId: card.dataset.openTournament });
      });
    });

    // Bind Dark Question Preview toggles
    container.querySelectorAll('[data-home-reveal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = `home_${btn.dataset.homeReveal}`;
        if (state.revealedIds.has(key)) state.revealedIds.delete(key);
        else state.revealedIds.add(key);
        renderHomeView(container);
      });
    });
  }

  /* ========================================================================
     VIEW 2 & 3: OCHIQ SAVOLLAR BAZASI & SAVOLLAR PAKETI (Light Workspace)
     Exact zakovatklubi.uz/open-question fidelity
     ======================================================================== */

  function getFilteredQuestions() {
    const all = App.Store.getPublishedQuestions();
    const f = state.filters;
    const qLower = (f.query || '').trim().toLowerCase();

    return all.filter((q) => {
      const game = App.Store.getGameById(q.gameId);
      const tour = game ? App.Store.getTournamentById(game.tournamentId) : null;
      const cat = (game && game.category) || (tour && tour.category) || '';

      if (f.category && f.category !== 'Barchasi' && cat !== f.category) return false;
      if (f.tournamentId && (!game || game.tournamentId !== f.tournamentId)) return false;
      if (f.gameId && q.gameId !== f.gameId) return false;
      if (f.topic && q.topic !== f.topic) return false;

      if (qLower) {
        const hay = [
          q.question,
          q.answer,
          q.accepted,
          q.comment,
          q.author,
          q.topic,
          game ? game.title : '',
          tour ? tour.name : ''
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(qLower)) return false;
      }
      return true;
    });
  }

  function getFilteredPackets() {
    const games = App.Store.getPublishedGames();
    const f = state.filters;
    const qLower = (f.query || '').trim().toLowerCase();

    return games.filter((g) => {
      const tour = App.Store.getTournamentById(g.tournamentId);
      const cat = g.category || (tour && tour.category) || '';
      if (f.category && f.category !== 'Barchasi' && cat !== f.category) return false;
      if (f.tournamentId && g.tournamentId !== f.tournamentId) return false;
      if (f.gameId && g.id !== f.gameId) return false;
      if (qLower) {
        const hay = [g.title, g.description, g.host, g.editor, tour ? tour.name : ''].join(' ').toLowerCase();
        if (!hay.includes(qLower)) return false;
      }
      return true;
    });
  }

  function renderQuestionsView(container, mode) {
    const { escapeHtml, formatDateUz } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();
    const games = App.Store.getPublishedGames();
    const allQuestions = App.Store.getPublishedQuestions();
    const categories = ['Barchasi', ...data.site.categories];

    const availableGames = state.filters.tournamentId
      ? games.filter((g) => g.tournamentId === state.filters.tournamentId)
      : games;

    const filteredQuestions = mode === 'database' ? getFilteredQuestions() : [];
    const filteredPackets = mode === 'packets' ? getFilteredPackets() : [];

    // Count items per category tile
    function countForCategory(cat) {
      if (mode === 'packets') {
        if (cat === 'Barchasi') return games.length;
        return games.filter((g) => {
          const t = App.Store.getTournamentById(g.tournamentId);
          return (g.category || (t && t.category)) === cat;
        }).length;
      }
      if (cat === 'Barchasi') return allQuestions.length;
      return allQuestions.filter((q) => {
        const g = App.Store.getGameById(q.gameId);
        const t = g ? App.Store.getTournamentById(g.tournamentId) : null;
        return ((g && g.category) || (t && t.category)) === cat;
      }).length;
    }

    container.innerHTML = `
      <div class="light-page-shell">
        <div class="container">
          <!-- Header Row with Mortarboard Icon + Gold Capsule Toggle -->
          <div class="light-page-head">
            <div class="light-title-group">
              <div class="light-title-icon">${Icons.get('cap')}</div>
              <div>
                <h1 class="light-page-title">Ochiq savollar bazasi</h1>
                <p class="light-page-sub">${mode === 'packets' ? "Har bir o'yin bo'yicha to'liq savollar paketlari" : "Universitet turnirlarida o'ynalgan savollar, javoblar va izohlar"}</p>
              </div>
            </div>

            <div class="mode-capsule" role="tablist">
              <button type="button" class="mode-capsule-btn ${mode === 'packets' ? 'active' : ''}" data-switch-mode="packets">
                ${Icons.get('book')}
                <span>Savollar paketi</span>
              </button>
              <button type="button" class="mode-capsule-btn ${mode === 'database' ? 'active' : ''}" data-switch-mode="database">
                ${Icons.get('helpCircle')}
                <span>Savollar bazasi</span>
              </button>
            </div>
          </div>

          <!-- Category Tiles (Exact zakovatklubi.uz) -->
          <div class="category-tiles-grid">
            ${categories.map((cat) => `
              <button type="button" class="category-tile ${state.filters.category === cat ? 'active' : ''}" data-cat="${escapeHtml(cat)}">
                <span>${escapeHtml(cat)}</span>
                <span class="category-tile-count">${countForCategory(cat)} ta</span>
              </button>
            `).join('')}
          </div>

          <!-- Gray Rounded Archive Workspace -->
          <div class="archive-workspace-box">
            <form class="archive-filter-row" id="archive-filter-form">
              <div class="archive-search-pill">
                <div class="archive-search-cell">
                  ${Icons.get('helpCircle')}
                  <input type="text" id="filter-query" value="${escapeHtml(state.filters.query)}" placeholder="Savolni yoki javobni kiriting" />
                </div>
                <div class="archive-search-cell">
                  <select id="filter-tour" aria-label="Turnirni tanlang">
                    <option value="">Turnirni tanlang</option>
                    ${data.tournaments.map((t) => `<option value="${escapeHtml(t.id)}" ${state.filters.tournamentId === t.id ? 'selected' : ''}>${escapeHtml(t.name)}</option>`).join('')}
                  </select>
                </div>
                <div class="archive-search-cell">
                  <select id="filter-game" aria-label="O'yinni tanlang">
                    <option value="">O'yinni tanlang</option>
                    ${availableGames.map((g) => `<option value="${escapeHtml(g.id)}" ${state.filters.gameId === g.id ? 'selected' : ''}>${escapeHtml(g.title)}</option>`).join('')}
                  </select>
                </div>
                <div class="archive-search-cell">
                  <select id="filter-topic" aria-label="Mavzuni tanlang" ${mode === 'packets' ? 'disabled style="opacity:0.45"' : ''}>
                    <option value="">Mavzuni tanlang</option>
                    ${data.site.topics.map((tp) => `<option value="${escapeHtml(tp)}" ${state.filters.topic === tp ? 'selected' : ''}>${escapeHtml(tp)}</option>`).join('')}
                  </select>
                </div>
              </div>

              <button type="button" class="filter-circle-btn" id="filter-reset-btn" title="Filtrlarni tozalash">
                ${Icons.get('refresh')}
              </button>
              <button type="submit" class="archive-search-submit">
                ${Icons.get('search')}
                <span>Qidirish</span>
              </button>
            </form>

            ${mode === 'database' ? `
              <div class="archive-actions-bar">
                <div class="archive-result-meta">
                  Topildi: <strong>${filteredQuestions.length}</strong> ta savol
                </div>
                <div class="archive-action-pills">
                  <button type="button" class="btn btn-white-pill btn-sm" id="btn-export-results">
                    ${Icons.get('download')} Natijani yuklab olish
                  </button>
                  <button type="button" class="btn btn-white-pill btn-sm ${state.showAllAnswers ? 'active' : ''}" id="btn-toggle-all-answers">
                    ${state.showAllAnswers ? Icons.get('eyeOff') : Icons.get('eye')}
                    ${state.showAllAnswers ? 'Barcha javoblarni yopish' : "Barcha javoblarni ko'rish"}
                  </button>
                  <button type="button" class="btn btn-white-pill btn-sm" id="btn-practice-filtered">
                    ${Icons.get('timer')} Mashq qilish
                  </button>
                </div>
              </div>

              <div class="questions-stack">
                ${filteredQuestions.length
                  ? filteredQuestions.map((q, idx) => renderQuestionCardHtml(q, idx + 1)).join('')
                  : renderEmptyStateHtml("Savollar topilmadi", "Qidiruv so'rovi yoki tanlangan filtrlarni o'zgartirib ko'ring.")}
              </div>
            ` : `
              <div class="archive-actions-bar">
                <div class="archive-result-meta">
                  Jami: <strong>${filteredPackets.length}</strong> ta savollar paketi
                </div>
              </div>

              <div class="questions-stack">
                ${filteredPackets.length
                  ? filteredPackets.map((game, idx) => renderPacketCardHtml(game, idx + 1)).join('')
                  : renderEmptyStateHtml("Savollar paketi topilmadi", "Tanlangan toifa yoki turnir bo'yicha paket mavjud emas.")}
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    bindArchiveEvents(container, mode, filteredQuestions, filteredPackets);
  }

  function renderQuestionCardHtml(q, displayIndex) {
    const { escapeHtml } = App.Utils;
    const { Icons } = App;
    const game = App.Store.getGameById(q.gameId);
    const tour = game ? App.Store.getTournamentById(game.tournamentId) : null;
    const isRevealed = state.showAllAnswers || state.revealedIds.has(q.id);
    const isBookmarked = App.Store.getBookmarks().has(q.id);
    const isLiked = App.Store.getLikedSet().has(q.id);
    const likeCount = App.Store.getDisplayLikes(q);

    return `
      <article class="open-question-card" data-qid="${escapeHtml(q.id)}">
        <div>
          <span class="q-num-pill">${q.number || displayIndex}</span>
        </div>

        <div class="q-card-body">
          <div class="q-meta-chips">
            ${game ? `<span class="q-chip gold">${escapeHtml(game.title)}</span>` : ''}
            ${tour ? `<span class="q-chip">${escapeHtml(tour.season || tour.category || tour.name)}</span>` : ''}
            ${q.topic ? `<span class="q-chip">${escapeHtml(q.topic)}</span>` : ''}
            ${q.difficulty ? `<span class="q-chip">${escapeHtml(q.difficulty)}</span>` : ''}
            ${q.solvedBy ? `<span class="q-chip solved">Topgan: ${escapeHtml(q.solvedBy)}</span>` : ''}
          </div>

          <div class="q-label">SAVOL</div>
          <div class="q-text">${escapeHtml(q.question)}</div>

          ${q.handoutText || q.handoutImage ? `
            <div class="q-handout-box">
              <div class="q-handout-title">Tarqatma material</div>
              ${q.handoutText ? `<div class="q-handout-text">${escapeHtml(q.handoutText)}</div>` : ''}
              ${q.handoutImage ? `<img src="${escapeHtml(q.handoutImage)}" alt="Tarqatma material" class="q-handout-img" />` : ''}
            </div>` : ''}

          <button type="button" class="q-reveal-btn ${isRevealed ? 'revealed' : ''}" data-toggle-answer="${escapeHtml(q.id)}">
            ${isRevealed ? Icons.get('eyeOff') : Icons.get('eye')}
            <span>${isRevealed ? 'Javobni yopish' : "Javobni ko'rish"}</span>
          </button>

          ${isRevealed ? `
            <div class="q-answer-panel">
              <div class="q-answer-block">
                <div class="q-label">JAVOB</div>
                <div class="q-answer-main">${escapeHtml(q.answer)}</div>
              </div>
              ${q.accepted ? `
                <div class="q-answer-block">
                  <div class="q-label">QABUL QILINADI</div>
                  <div class="q-answer-sub">${escapeHtml(q.accepted)}</div>
                </div>` : ''}
              ${q.comment ? `
                <div class="q-answer-block">
                  <div class="q-label">IZOH</div>
                  <div class="q-answer-sub">${escapeHtml(q.comment)}</div>
                </div>` : ''}
              ${q.author || q.source ? `
                <div class="q-answer-credits">
                  ${q.author ? `<span><strong>Muallif:</strong> ${escapeHtml(q.author)}</span>` : ''}
                  ${q.source ? `<span><strong>Manba:</strong> ${escapeHtml(q.source)}</span>` : ''}
                </div>` : ''}
            </div>` : ''}

          <hr class="q-dashed-divider" />
        </div>

        <div class="q-card-side-actions">
          <button type="button" class="q-icon-circle ${isBookmarked ? 'active' : ''}" data-bookmark="${escapeHtml(q.id)}" title="${isBookmarked ? "Saqlanganlardan olish" : "Savolni saqlash"}">
            ${isBookmarked ? Icons.get('bookmarkFilled') : Icons.get('bookmark')}
          </button>
          <button type="button" class="q-like-pill ${isLiked ? 'active' : ''}" data-like="${escapeHtml(q.id)}" title="Yoqdi">
            ${Icons.get('thumbUp')}
            <span>${likeCount}</span>
          </button>
          <button type="button" class="q-icon-circle" data-copy-q="${escapeHtml(q.id)}" title="Savol matnini nusxalash">
            ${Icons.get('copy')}
          </button>
        </div>
      </article>
    `;
  }

  function renderPacketCardHtml(game, idx) {
    const { escapeHtml, formatDateUz } = App.Utils;
    const { Icons } = App;
    const tour = App.Store.getTournamentById(game.tournamentId);
    const qs = App.Store.getQuestionsByGame(game.id);

    return `
      <article class="packet-card">
        <div>
          <span class="q-num-pill">${idx}</span>
        </div>
        <div>
          <h3 class="packet-title">${escapeHtml(game.title)} (${formatDateUz(game.date)})</h3>
          <p class="packet-desc">${escapeHtml(game.description || (tour ? tour.name : "Universitet Zakovat turniri savollar paketi"))}</p>
          <div class="packet-meta-grid">
            <div>
              <div class="packet-meta-lbl">PAKETDAGI SAVOLLAR SONI:</div>
              <div class="packet-meta-val">${qs.length} ta</div>
            </div>
            <div>
              <div class="packet-meta-lbl">PAKETDAGI TILI:</div>
              <div class="packet-meta-val">${escapeHtml(game.language || "O'zbek")}</div>
            </div>
            ${game.editor ? `
              <div>
                <div class="packet-meta-lbl">MUHARRIR:</div>
                <div class="packet-meta-val">${escapeHtml(game.editor)}</div>
              </div>` : ''}
            ${game.winnerTeam ? `
              <div>
                <div class="packet-meta-lbl">G'OLIB JAMOA:</div>
                <div class="packet-meta-val">${escapeHtml(game.winnerTeam)}</div>
              </div>` : ''}
          </div>
          <div class="packet-bottom-row">
            <div class="packet-badges">
              <span class="packet-badge-gold">${Icons.get('book')} ${escapeHtml(game.category || (tour ? tour.category : 'Liga'))}</span>
              <span class="packet-badge-gray">${Icons.get('users')} Ishtirokchi jamoalar: ${Number(game.teamsPlayed) || 0}</span>
            </div>
            <div class="packet-actions">
              <button type="button" class="btn btn-outline-gold btn-sm" data-packet-view="${escapeHtml(game.id)}" data-packet-tour="${escapeHtml(game.tournamentId || '')}">
                ${Icons.get('eye')} Savollarni ko'rish
              </button>
              <button type="button" class="btn btn-primary btn-sm" data-packet-download="${escapeHtml(game.id)}">
                ${Icons.get('download')} Paketni yuklab olish
              </button>
            </div>
          </div>
        </div>
        <div></div>
      </article>
    `;
  }

  function bindArchiveEvents(container, mode, filteredQuestions, filteredPackets) {
    // Mode capsule switch
    container.querySelectorAll('[data-switch-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.switchMode;
        navigate(target === 'packets' ? '#/paketlar' : '#/savollar');
      });
    });

    // Category tiles
    container.querySelectorAll('[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.filters.category = btn.dataset.cat;
        renderQuestionsView(container, mode);
      });
    });

    // Filter form
    const form = document.getElementById('archive-filter-form');
    const tourSelect = document.getElementById('filter-tour');
    const gameSelect = document.getElementById('filter-game');
    const topicSelect = document.getElementById('filter-topic');
    const queryInput = document.getElementById('filter-query');

    tourSelect.addEventListener('change', () => {
      state.filters.tournamentId = tourSelect.value;
      state.filters.gameId = '';
      renderQuestionsView(container, mode);
    });

    gameSelect.addEventListener('change', () => {
      state.filters.gameId = gameSelect.value;
      renderQuestionsView(container, mode);
    });

    if (topicSelect && mode === 'database') {
      topicSelect.addEventListener('change', () => {
        state.filters.topic = topicSelect.value;
        renderQuestionsView(container, mode);
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      state.filters.query = queryInput.value.trim();
      renderQuestionsView(container, mode);
    });

    document.getElementById('filter-reset-btn').addEventListener('click', () => {
      state.filters = { category: 'Barchasi', query: '', tournamentId: '', gameId: '', topic: '' };
      renderQuestionsView(container, mode);
    });

    if (mode === 'database') {
      // Toggle all answers
      const toggleAllBtn = document.getElementById('btn-toggle-all-answers');
      if (toggleAllBtn) {
        toggleAllBtn.addEventListener('click', () => {
          state.showAllAnswers = !state.showAllAnswers;
          if (!state.showAllAnswers) state.revealedIds.clear();
          renderQuestionsView(container, mode);
        });
      }

      // Export current filtered list
      const exportBtn = document.getElementById('btn-export-results');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          if (!filteredQuestions.length) {
            App.Utils.showToast("Yuklab olish uchun savollar topilmadi", 'error');
            return;
          }
          const siteName = App.Store.getData().site.universityName;
          const html = App.Utils.buildPrintablePacketHtml(
            `${siteName} — Savollar to'plami`,
            `Tanlangan filtr bo'yicha saralangan savollar`,
            filteredQuestions,
            true
          );
          App.Utils.downloadFile('zakovat-savollar-toplami.html', html, 'text/html;charset=utf-8');
          App.Utils.showToast("Savollar to'plami (chop etishga tayyor HTML) yuklab olindi!", 'success');
        });
      }

      // Practice filtered
      const practiceBtn = document.getElementById('btn-practice-filtered');
      if (practiceBtn) {
        practiceBtn.addEventListener('click', () => startPractice(filteredQuestions));
      }

      bindQuestionCardInteractions(container, () => renderQuestionsView(container, mode));
    } else {
      // Packet cards actions
      container.querySelectorAll('[data-packet-view]').forEach((btn) => {
        btn.addEventListener('click', () => {
          navigate('#/savollar', {
            tournamentId: btn.dataset.packetTour || '',
            gameId: btn.dataset.packetView
          });
        });
      });

      container.querySelectorAll('[data-packet-download]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const game = App.Store.getGameById(btn.dataset.packetDownload);
          if (!game) return;
          const qs = App.Store.getQuestionsByGame(game.id);
          if (!qs.length) {
            App.Utils.showToast("Ushbu paketda hali savollar yo'q", 'error');
            return;
          }
          const html = App.Utils.buildPrintablePacketHtml(
            game.title,
            `${App.Utils.formatDateUz(game.date)} • Muharrir: ${game.editor || 'Klub'}`,
            qs,
            true
          );
          const slug = game.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          App.Utils.downloadFile(`${slug || 'zakovat-paket'}.html`, html, 'text/html;charset=utf-8');
          App.Utils.showToast(`"${game.title}" paketi yuklab olindi!`, 'success');
        });
      });
    }
  }

  function bindQuestionCardInteractions(container, rerenderFn) {
    container.querySelectorAll('[data-toggle-answer]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.toggleAnswer;
        if (state.showAllAnswers) {
          // Switching from "all open" to individual toggle
          state.showAllAnswers = false;
          App.Store.getPublishedQuestions().forEach((q) => {
            if (q.id !== id) state.revealedIds.add(q.id);
          });
          state.revealedIds.delete(id);
        } else {
          if (state.revealedIds.has(id)) state.revealedIds.delete(id);
          else state.revealedIds.add(id);
        }
        rerenderFn();
      });
    });

    container.querySelectorAll('[data-bookmark]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const added = App.Store.toggleBookmark(btn.dataset.bookmark);
        App.Utils.showToast(added ? "Savol «Saqlanganlar»ga qo'shildi" : "Savol saqlanganlardan olib tashlandi");
      });
    });

    container.querySelectorAll('[data-like]').forEach((btn) => {
      btn.addEventListener('click', () => {
        App.Store.toggleLike(btn.dataset.like);
      });
    });

    container.querySelectorAll('[data-copy-q]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const q = App.Store.getData().questions.find((item) => item.id === btn.dataset.copyQ);
        if (!q) return;
        const text = `${q.number ? q.number + '-savol:\n' : ''}${q.question}\n\nJavob: ${q.answer}${q.comment ? '\nIzoh: ' + q.comment : ''}`;
        App.Utils.copyToClipboard(text, 'Savol va javob nusxalandi!');
      });
    });
  }

  /* ========================================================================
     VIEW 4: TURNIRLAR (Exact zakovatklubi.uz/tournaments Light Table)
     ======================================================================== */

  function renderTournamentsView(container) {
    const { escapeHtml, formatDateUz } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();
    const games = App.Store.getPublishedGames();
    const categories = ['Barchasi', ...data.site.categories];
    const tf = state.tourFilters;
    const qLower = (tf.query || '').trim().toLowerCase();

    const filtered = data.tournaments.filter((t) => {
      if (tf.category !== 'Barchasi' && t.category !== tf.category) return false;
      if (tf.status && t.status !== tf.status) return false;
      if (qLower) {
        const hay = `${t.code || ''} ${t.name} ${t.season || ''} ${t.location || ''}`.toLowerCase();
        if (!hay.includes(qLower)) return false;
      }
      return true;
    });

    container.innerHTML = `
      <div class="light-page-shell">
        <div class="container">
          <div class="light-page-head">
            <div class="light-title-group">
              <div class="light-title-icon">${Icons.get('trophy')}</div>
              <div>
                <h1 class="light-page-title">Turnirlar</h1>
                <p class="light-page-sub">Universitetda tashkil etilgan barcha Zakovat turnirlari va mavsumlar</p>
              </div>
            </div>
          </div>

          <div class="category-tiles-grid">
            ${categories.map((cat) => {
              const cnt = cat === 'Barchasi'
                ? data.tournaments.length
                : data.tournaments.filter((t) => t.category === cat).length;
              return `
                <button type="button" class="category-tile ${tf.category === cat ? 'active' : ''}" data-tcat="${escapeHtml(cat)}">
                  <span>${escapeHtml(cat)}</span>
                  <span class="category-tile-count">${cnt} ta</span>
                </button>
              `;
            }).join('')}
          </div>

          <div class="archive-workspace-box">
            <form class="archive-filter-row" id="tour-filter-form">
              <div class="archive-search-pill" style="grid-template-columns: 1.6fr 1fr;">
                <div class="archive-search-cell">
                  ${Icons.get('trophy')}
                  <input type="text" id="tour-query-input" value="${escapeHtml(tf.query)}" placeholder="Turnir nomi yoki ID raqamini kiriting" />
                </div>
                <div class="archive-search-cell">
                  <select id="tour-status-select" aria-label="Holat">
                    <option value="">Barcha holatlar</option>
                    <option value="active" ${tf.status === 'active' ? 'selected' : ''}>Davom etmoqda</option>
                    <option value="finished" ${tf.status === 'finished' ? 'selected' : ''}>Yakunlangan</option>
                  </select>
                </div>
              </div>
              <button type="submit" class="archive-search-submit">
                ${Icons.get('search')} Qidirish
              </button>
            </form>

            <div class="tournaments-table-wrap" style="padding:0;">
              <div class="tournaments-table-head">
                <span>ID</span>
                <span>TURNIR NOMI</span>
                <span>BOSHLANISH</span>
                <span>TUGASH</span>
                <span>TURLAR</span>
                <span>SAVOLLAR</span>
                <span>HOLAT</span>
              </div>

              ${filtered.length ? filtered.map((t) => {
                const tGames = games.filter((g) => g.tournamentId === t.id);
                const tQs = tGames.reduce((sum, g) => sum + App.Store.getQuestionsByGame(g.id).length, 0);
                return `
                  <div class="tournaments-table-row" data-jump-tour="${escapeHtml(t.id)}">
                    <div><span class="tour-id-pill">${escapeHtml(t.code || '—')}</span></div>
                    <div class="tour-name-cell">
                      <div class="tour-mini-crest">ZK</div>
                      <div>
                        <div class="tour-row-title">${escapeHtml(t.name)}</div>
                        <div class="tour-row-sub">${escapeHtml(t.location || t.season || '')}</div>
                      </div>
                    </div>
                    <div>${formatDateUz(t.startDate)}</div>
                    <div>${formatDateUz(t.endDate)}</div>
                    <div><strong>${tGames.length}</strong></div>
                    <div><strong>${tQs}</strong></div>
                    <div>
                      <span class="status-badge ${t.status === 'active' ? 'active' : 'finished'}">
                        ${t.status === 'active' ? '● Faol' : 'Yakunlangan'}
                      </span>
                    </div>
                  </div>
                `;
              }).join('') : renderEmptyStateHtml("Turnirlar topilmadi", "Qidiruv parametrlarini o'zgartirib ko'ring.")}
            </div>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-tcat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.tourFilters.category = btn.dataset.tcat;
        renderTournamentsView(container);
      });
    });

    document.getElementById('tour-status-select').addEventListener('change', (e) => {
      state.tourFilters.status = e.target.value;
      renderTournamentsView(container);
    });

    document.getElementById('tour-filter-form').addEventListener('submit', (e) => {
      e.preventDefault();
      state.tourFilters.query = document.getElementById('tour-query-input').value.trim();
      renderTournamentsView(container);
    });

    container.querySelectorAll('[data-jump-tour]').forEach((row) => {
      row.addEventListener('click', () => {
        navigate('#/savollar', { tournamentId: row.dataset.jumpTour });
      });
    });
  }

  /* ========================================================================
     VIEW 5: SAQLANGAN SAVOLLAR
     ======================================================================== */

  function renderBookmarksView(container) {
    const { Icons } = App;
    const bmIds = App.Store.getBookmarks();
    const saved = App.Store.getPublishedQuestions().filter((q) => bmIds.has(q.id));

    container.innerHTML = `
      <div class="light-page-shell">
        <div class="container">
          <div class="light-page-head">
            <div class="light-title-group">
              <div class="light-title-icon">${Icons.get('bookmark')}</div>
              <div>
                <h1 class="light-page-title">Saqlangan savollar</h1>
                <p class="light-page-sub">Siz belgilab qo'ygan sara savollar (ushbu qurilma xotirasida saqlanadi)</p>
              </div>
            </div>
            ${saved.length ? `
              <div class="archive-action-pills">
                <button type="button" class="btn btn-primary btn-sm" id="bm-practice-btn">
                  ${Icons.get('timer')} Saqlanganlardan mashq
                </button>
              </div>` : ''}
          </div>

          <div class="archive-workspace-box">
            <div class="questions-stack">
              ${saved.length
                ? saved.map((q, idx) => renderQuestionCardHtml(q, idx + 1)).join('')
                : renderEmptyStateHtml("Hozircha saqlangan savollar yo'q", "Savollar bazasidagi har bir savolning o'ng burchagidagi xatcho'p tugmasini bosib, sevimli savollaringizni saqlab qo'yishingiz mumkin.")}
            </div>
          </div>
        </div>
      </div>
    `;

    const bmPrac = document.getElementById('bm-practice-btn');
    if (bmPrac) bmPrac.addEventListener('click', () => startPractice(saved));
    bindQuestionCardInteractions(container, () => renderBookmarksView(container));
  }

  /* ========================================================================
     VIEW 6: MUSOBAQA HAQIDA / QOIDALAR
     ======================================================================== */

  function renderAboutView(container) {
    const { escapeHtml } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();

    container.innerHTML = `
      <div class="light-page-shell">
        <div class="container">
          <div class="light-page-head">
            <div class="light-title-group">
              <div class="light-title-icon">${Icons.get('cap')}</div>
              <div>
                <h1 class="light-page-title">${escapeHtml(data.site.universityName)}</h1>
                <p class="light-page-sub">Intellektual o'yin qoidalari va ko'p so'raladigan savollar</p>
              </div>
            </div>
          </div>

          <div class="about-grid">
            <div class="about-card">
              <h2 style="font-size:21px;font-weight:700;">Zakovat turniri asosiy qoidalari</h2>
              <div class="about-inner-card">
                <ul class="rules-list">
                  <li><span class="rule-num">1</span><span>Har bir jamoada <strong>6 nafargacha</strong> talaba ishtirok etadi va jamoa sardori tayinlanadi.</span></li>
                  <li><span class="rule-num">2</span><span>Boshlovchi savolni o'qib bo'lgach, muhokama uchun rasmiy <strong>60 soniya</strong> (1 daqiqa) vaqt beriladi.</span></li>
                  <li><span class="rule-num">3</span><span>Vaqt yakunida qo'shimcha 10 soniya ichida javob varaqasi hakamlar yordamchisiga topshiriladi.</span></li>
                  <li><span class="rule-num">4</span><span>Har bir to'g'ri javob uchun <strong>1 ball</strong> beriladi. Bahsli holatlarda o'yin yakunida apellyatsiya kiritish mumkin.</span></li>
                  <li><span class="rule-num">5</span><span>Har bir tur tugagandan so'ng barcha savollar, rasmiy javoblar va izohlar ushbu ochiq arxivda e'lon qilinadi.</span></li>
                </ul>
              </div>
            </div>

            <div class="about-card">
              <h2 style="font-size:21px;font-weight:700;">Ko'p so'raladigan savollar</h2>
              <details class="faq-item" open>
                <summary>Yangi tur savollari qachon saytga qo'shiladi?</summary>
                <p>Har bir musobaqa yakunlangandan so'ng tahririyat tomonidan tekshirilgan rasmiy savollar va izohlar ushbu saytga joylashtiriladi.</p>
              </details>
              <details class="faq-item">
                <summary>Savollar paketini chop etish uchun yuklab olsa bo'ladimi?</summary>
                <p>Ha! «Savollar paketi» bo'limida har bir o'yinning «Paketni yuklab olish» tugmasini bosib, chiroyli formatlangan faylni yuklab olishingiz va chop etishingiz mumkin.</p>
              </details>
              <details class="faq-item">
                <summary>Mashq rejimi qanday ishlaydi?</summary>
                <p>Yuqori menyudagi «Mashq rejimi» tugmasi orqali savollar javobsiz ko'rinadi va 60 soniyalik taymer ishga tushadi — jamoa bilan tayyorgarlik ko'rish uchun juda qulay.</p>
              </details>
              <details class="faq-item">
                <summary>Klub bilan qanday bog'lanish mumkin?</summary>
                <p>Savol yoki takliflar bo'yicha <strong>${escapeHtml(data.site.email)}</strong> elektron pochtasi yoki <strong>${escapeHtml(data.site.phone)}</strong> raqami orqali murojaat qilishingiz mumkin.</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderEmptyStateHtml(title, desc) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">${App.Icons.get('helpCircle')}</div>
        <h3>${App.Utils.escapeHtml(title)}</h3>
        <p>${App.Utils.escapeHtml(desc)}</p>
      </div>
    `;
  }

  /* ========================================================================
     60-SECOND PRACTICE / SELF-QUIZ MODE
     ======================================================================== */

  function startPractice(questionsList) {
    if (!questionsList || !questionsList.length) {
      App.Utils.showToast("Mashq uchun savollar mavjud emas", 'error');
      return;
    }
    stopPracticeTimer();
    state.practice = {
      open: true,
      questions: questionsList.slice(),
      index: 0,
      answerShown: false,
      secondsLeft: 60,
      running: false,
      timerHandle: null,
      correct: 0,
      attempted: 0,
      results: {}
    };
    renderPracticeModal();
  }

  function closePractice() {
    stopPracticeTimer();
    state.practice.open = false;
    renderPracticeModal();
  }

  function stopPracticeTimer() {
    if (state.practice.timerHandle) {
      clearInterval(state.practice.timerHandle);
      state.practice.timerHandle = null;
    }
    state.practice.running = false;
  }

  function togglePracticeTimer() {
    if (state.practice.running) {
      stopPracticeTimer();
      renderPracticeModal();
      return;
    }
    if (state.practice.secondsLeft <= 0) state.practice.secondsLeft = 60;
    state.practice.running = true;
    App.Utils.playTimerTone('start');
    state.practice.timerHandle = setInterval(() => {
      state.practice.secondsLeft -= 1;
      if (state.practice.secondsLeft === 10) App.Utils.playTimerTone('tick');
      if (state.practice.secondsLeft <= 0) {
        state.practice.secondsLeft = 0;
        stopPracticeTimer();
        App.Utils.playTimerTone('end');
      }
      const badge = document.getElementById('practice-timer-display');
      if (badge) {
        const s = String(state.practice.secondsLeft).padStart(2, '0');
        badge.textContent = `00:${s}`;
        badge.parentElement.classList.toggle('warning', state.practice.secondsLeft <= 10);
      }
      if (!state.practice.running) renderPracticeModal();
    }, 1000);
    renderPracticeModal();
  }

  function renderPracticeModal() {
    let mount = document.getElementById('practice-modal-mount');
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'practice-modal-mount';
      document.body.appendChild(mount);
    }

    if (!state.practice.open) {
      mount.innerHTML = '';
      return;
    }

    const { escapeHtml } = App.Utils;
    const { Icons } = App;
    const p = state.practice;
    const q = p.questions[p.index];
    const game = q ? App.Store.getGameById(q.gameId) : null;
    const secStr = String(p.secondsLeft).padStart(2, '0');
    const marked = p.results[q.id];

    mount.innerHTML = `
      <div class="modal-backdrop" id="practice-backdrop">
        <div class="practice-modal" role="dialog" aria-modal="true" aria-label="60 soniyalik Zakovat mashq rejimi">
          <div class="practice-top">
            <div>
              <div style="font-size:12px;color:#cba672;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">
                Mashq rejimi &bull; Savol ${p.index + 1} / ${p.questions.length}
              </div>
              <div style="font-size:14px;color:rgba(255,255,255,0.65);margin-top:3px;">
                ${game ? escapeHtml(game.title) : 'Ochiq savollar'} &bull; Natija: <strong style="color:#fae8a9">${p.correct} / ${p.attempted}</strong>
              </div>
            </div>

            <div style="display:flex;align-items:center;gap:10px;">
              <div class="timer-ring-box ${p.secondsLeft <= 10 ? 'warning' : ''}">
                ${Icons.get('timer')}
                <span id="practice-timer-display">00:${secStr}</span>
              </div>
              <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" id="practice-close-btn" aria-label="Yopish">
                ${Icons.get('x')}
              </button>
            </div>
          </div>

          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
            <span class="admin-pill gold">${q.number || p.index + 1}-savol</span>
            ${q.topic ? `<span class="admin-pill">${escapeHtml(q.topic)}</span>` : ''}
            ${q.difficulty ? `<span class="admin-pill">${escapeHtml(q.difficulty)}</span>` : ''}
          </div>

          ${q.handoutText ? `
            <div style="background:rgba(203,166,114,0.14);border-left:3px solid #cba672;padding:12px 16px;border-radius:10px;margin:14px 0;font-size:14px;">
              <div style="font-size:11px;font-weight:700;color:#e7cca5;margin-bottom:4px;">TARQATMA MATERIAL</div>
              ${escapeHtml(q.handoutText)}
            </div>` : ''}

          <div class="practice-q-text">${escapeHtml(q.question)}</div>

          ${p.answerShown ? `
            <div class="practice-answer-reveal">
              <div style="font-size:11px;font-weight:700;color:#cba672;letter-spacing:0.05em;margin-bottom:4px;">RASMIY JAVOB</div>
              <div style="font-size:17px;font-weight:700;color:#fff;margin-bottom:8px;">${escapeHtml(q.answer)}</div>
              ${q.accepted ? `<div style="font-size:13.5px;color:rgba(255,255,255,0.82);margin-bottom:6px;"><strong>Qabul qilinadi:</strong> ${escapeHtml(q.accepted)}</div>` : ''}
              ${q.comment ? `<div style="font-size:13.5px;color:rgba(255,255,255,0.72);"><strong>Izoh:</strong> ${escapeHtml(q.comment)}</div>` : ''}
              <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;">
                <button type="button" class="admin-btn ${marked === true ? 'admin-btn-gold' : 'admin-btn-ghost'} admin-btn-sm" id="prac-mark-yes">
                  ${Icons.get('check')} Topdik (+1)
                </button>
                <button type="button" class="admin-btn ${marked === false ? 'admin-btn-danger' : 'admin-btn-ghost'} admin-btn-sm" id="prac-mark-no">
                  ${Icons.get('x')} Topa olmadik
                </button>
              </div>
            </div>` : ''}

          <div class="practice-controls">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="admin-btn admin-btn-gold" id="prac-timer-toggle">
                ${p.running ? 'Pauza' : (p.secondsLeft === 60 ? '60 soniyani boshlash' : 'Davom ettirish')}
              </button>
              <button type="button" class="admin-btn admin-btn-ghost" id="prac-timer-reset">
                Qayta (60s)
              </button>
              <button type="button" class="admin-btn admin-btn-ghost" id="prac-show-answer">
                ${p.answerShown ? 'Javobni yashirish' : "Javobni ko'rish"}
              </button>
            </div>

            <div style="display:flex;gap:8px;">
              <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" id="prac-prev" ${p.index === 0 ? 'disabled style="opacity:0.4"' : ''}>
                &larr; Oldingi
              </button>
              <button type="button" class="admin-btn admin-btn-gold admin-btn-sm" id="prac-next" ${p.index >= p.questions.length - 1 ? 'disabled style="opacity:0.4"' : ''}>
                Keyingi &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('practice-close-btn').addEventListener('click', closePractice);
    document.getElementById('practice-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'practice-backdrop') closePractice();
    });
    document.getElementById('prac-timer-toggle').addEventListener('click', togglePracticeTimer);
    document.getElementById('prac-timer-reset').addEventListener('click', () => {
      stopPracticeTimer();
      p.secondsLeft = 60;
      renderPracticeModal();
    });
    document.getElementById('prac-show-answer').addEventListener('click', () => {
      p.answerShown = !p.answerShown;
      if (p.answerShown) stopPracticeTimer();
      renderPracticeModal();
    });

    const markYes = document.getElementById('prac-mark-yes');
    if (markYes) {
      markYes.addEventListener('click', () => {
        if (p.results[q.id] === undefined) p.attempted += 1;
        if (p.results[q.id] !== true) p.correct += 1;
        p.results[q.id] = true;
        renderPracticeModal();
      });
    }
    const markNo = document.getElementById('prac-mark-no');
    if (markNo) {
      markNo.addEventListener('click', () => {
        if (p.results[q.id] === undefined) p.attempted += 1;
        if (p.results[q.id] === true) p.correct = Math.max(0, p.correct - 1);
        p.results[q.id] = false;
        renderPracticeModal();
      });
    }

    document.getElementById('prac-prev').addEventListener('click', () => {
      if (p.index > 0) {
        stopPracticeTimer();
        p.index -= 1;
        p.secondsLeft = 60;
        p.answerShown = false;
        renderPracticeModal();
      }
    });
    document.getElementById('prac-next').addEventListener('click', () => {
      if (p.index < p.questions.length - 1) {
        stopPracticeTimer();
        p.index += 1;
        p.secondsLeft = 60;
        p.answerShown = false;
        renderPracticeModal();
      }
    });
  }

  App.Public = {
    init,
    navigate,
    renderAll,
    startPractice
  };
})(window.ZakovatApp);
