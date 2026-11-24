/* ==========================================================================
   Hidden Admin Panel Controller
   Triggers: #admin | ?panel=admin | Ctrl+Shift+A | Alt+Shift+Z | 5x logo tap
   Features:
     - SHA-256 Passcode Protection (default: zakovat2026, changeable in Settings)
     - Full CRUD for Questions, Games/Rounds, and Tournaments
     - Smart Bulk Question Importer (paste 12-24 questions from Telegram/Word)
     - Deploy Exporter: Download ready-to-deploy data/zakovat-data.js, Copy for GitHub,
       JSON Backup & Import (.js / .json), Draft Reset
     - Site Branding & Passcode Settings
   ========================================================================== */

window.ZakovatApp = window.ZakovatApp || {};

(function (App) {
  'use strict';

  const SESSION_KEY = 'zakovat_admin_unlocked_v1';

  const adminState = {
    isOpen: false,
    unlocked: false,
    activeTab: 'dashboard', // dashboard | questions | bulk | tournaments | deploy | settings
    qFilterGame: '',
    qFilterStatus: '',
    qSearch: '',
    bulkRaw: '',
    bulkGameId: '',
    bulkTopic: 'Umumiy',
    modal: null // { type: 'question'|'tournament'|'game', id: string|null }
  };

  function checkSessionUnlock() {
    try {
      adminState.unlocked = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch (_) {
      adminState.unlocked = false;
    }
  }

  function open() {
    checkSessionUnlock();
    adminState.isOpen = true;
    document.body.style.overflow = 'hidden';
    render();
  }

  function close() {
    adminState.isOpen = false;
    adminState.modal = null;
    document.body.style.overflow = '';
    if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search + '#/');
    }
    render();
    if (App.Public) App.Public.renderAll();
  }

  function lockOut() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (_) {}
    adminState.unlocked = false;
    adminState.modal = null;
    App.Utils.showToast('Admin panel qulflandi');
    render();
  }

  function render() {
    let mount = document.getElementById('admin-root');
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'admin-root';
      document.body.appendChild(mount);
    }

    if (!adminState.isOpen) {
      mount.innerHTML = '';
      return;
    }

    if (!adminState.unlocked) {
      renderLockScreen(mount);
    } else {
      renderWorkspace(mount);
    }
  }

  /* ========================================================================
     LOCK SCREEN
     ======================================================================== */

  function renderLockScreen(mount) {
    const { Icons } = App;
    const data = App.Store.getData();

    mount.innerHTML = `
      <div class="admin-overlay">
        <div class="admin-lock-screen">
          <div class="admin-lock-card">
            <div style="display:flex;justify-content:center;margin-bottom:16px;">
              ${Icons.zakovatLogoSvg('gold')}
            </div>
            <div class="admin-lock-badge">${Icons.get('lock')} Yashirin boshqaruv paneli</div>
            <h2 class="admin-lock-title">Admin kirish</h2>
            <p class="admin-lock-desc">
              ${App.Utils.escapeHtml(data.site.universityName)} savollar bazasini tahrirlash va yangi versiyani yuklab olish uchun parolni kiriting.
            </p>
            <form id="admin-unlock-form">
              <input
                type="password"
                id="admin-passcode-input"
                class="admin-input"
                placeholder="Admin parolini kiriting"
                autocomplete="current-password"
                autofocus
              />
              <div class="admin-lock-error" id="admin-lock-error"></div>
              <div style="display:flex;gap:10px;margin-top:14px;">
                <button type="button" class="admin-btn admin-btn-ghost" id="admin-lock-cancel" style="flex:1;">
                  Saytga qaytish
                </button>
                <button type="submit" class="admin-btn admin-btn-gold" style="flex:1.4;">
                  ${Icons.get('lock')} Kirish
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.getElementById('admin-lock-cancel').addEventListener('click', close);
    document.getElementById('admin-unlock-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('admin-passcode-input');
      const errEl = document.getElementById('admin-lock-error');
      const val = (input.value || '').trim();
      const expectedHash = App.Store.getData().adminPasscodeHash;
      const enteredHash = App.Utils.sha256(val);

      if (enteredHash === expectedHash) {
        adminState.unlocked = true;
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch (_) {}
        App.Utils.showToast('Admin panelga muvaffaqiyatli kirdingiz!', 'success');
        render();
      } else {
        errEl.textContent = "Parol noto'g'ri. Qayta urinib ko'ring.";
        input.focus();
        input.select();
      }
    });
  }

  /* ========================================================================
     ADMIN WORKSPACE SHELL
     ======================================================================== */

  function renderWorkspace(mount) {
    const { escapeHtml } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();
    const isDirty = App.Store.isDirty();

    const navTabs = [
      { id: 'dashboard', label: 'Boshqaruv', icon: 'chart', count: null },
      { id: 'questions', label: 'Savollar', icon: 'helpCircle', count: data.questions.length },
      { id: 'bulk', label: 'Ommaviy kiritish', icon: 'fileText', count: null },
      { id: 'tournaments', label: "Turnirlar va turlar", icon: 'trophy', count: data.games.length },
      { id: 'deploy', label: 'Versiya va Deploy', icon: 'rocket', count: isDirty ? '!' : null },
      { id: 'settings', label: 'Sozlamalar', icon: 'settings', count: null }
    ];

    mount.innerHTML = `
      <div class="admin-overlay">
        <header class="admin-topbar">
          <div class="admin-topbar-left">
            <span class="admin-brand-pill">${Icons.get('lock')} ZAKOVAT ADMIN</span>
            <span class="admin-dirty-badge ${isDirty ? 'dirty' : 'clean'}">
              ${isDirty ? "● Deploy qilinmagan o'zgarishlar bor" : `✓ Baza v${escapeHtml(data.version || '1.0.0')}`}
            </span>
          </div>
          <div class="admin-topbar-actions">
            <button type="button" class="admin-btn admin-btn-gold admin-btn-sm" id="topbar-quick-export">
              ${Icons.get('download')} zakovat-data.js yuklab olish
            </button>
            <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" id="topbar-preview-site">
              ${Icons.get('eye')} Saytda ko'rish
            </button>
            <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" id="topbar-lock-btn" title="Qulflash">
              ${Icons.get('lock')} Qulflash
            </button>
          </div>
        </header>

        <div class="admin-body">
          <aside class="admin-sidebar">
            ${navTabs.map((t) => `
              <button type="button" class="admin-nav-item ${adminState.activeTab === t.id ? 'active' : ''}" data-admin-tab="${t.id}">
                <span class="admin-nav-item-left">${Icons.get(t.icon)}<span>${t.label}</span></span>
                ${t.count !== null ? `<span class="admin-nav-count">${t.count}</span>` : ''}
              </button>
            `).join('')}

            <div class="admin-sidebar-footer">
              <div><strong>Versiya:</strong> v${escapeHtml(data.version || '1.0.0')}</div>
              <div><strong>Yashirin kirish:</strong> #admin, Ctrl+Shift+A yoki logoga 5 marta bosish</div>
            </div>
          </aside>

          <main class="admin-content" id="admin-content-area"></main>
        </div>

        <div id="admin-modal-mount"></div>
      </div>
    `;

    // Bind topbar & sidebar
    document.getElementById('topbar-quick-export').addEventListener('click', () => quickDownloadDeployFile());
    document.getElementById('topbar-preview-site').addEventListener('click', close);
    document.getElementById('topbar-lock-btn').addEventListener('click', lockOut);

    mount.querySelectorAll('[data-admin-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        adminState.activeTab = btn.dataset.adminTab;
        render();
      });
    });

    const contentEl = document.getElementById('admin-content-area');
    if (adminState.activeTab === 'dashboard') renderDashboardTab(contentEl);
    else if (adminState.activeTab === 'questions') renderQuestionsTab(contentEl);
    else if (adminState.activeTab === 'bulk') renderBulkTab(contentEl);
    else if (adminState.activeTab === 'tournaments') renderTournamentsTab(contentEl);
    else if (adminState.activeTab === 'deploy') renderDeployTab(contentEl);
    else if (adminState.activeTab === 'settings') renderSettingsTab(contentEl);

    if (adminState.modal) {
      renderAdminModal(document.getElementById('admin-modal-mount'));
    }
  }

  /* ========================================================================
     TAB 1: DASHBOARD
     ======================================================================== */

  function renderDashboardTab(el) {
    const { escapeHtml, formatDateTimeUz } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();
    const pubQ = data.questions.filter((q) => q.published !== false).length;
    const draftQ = data.questions.length - pubQ;
    const isDirty = App.Store.isDirty();

    el.innerHTML = `
      <div class="admin-section-head">
        <div>
          <h1 class="admin-section-title">Boshqaruv paneli</h1>
          <p class="admin-section-sub">${escapeHtml(data.site.universityName)} &bull; Oxirgi tahrir: ${formatDateTimeUz(data.updatedAt)}</p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button type="button" class="admin-btn admin-btn-gold" id="dash-add-q">${Icons.get('plus')} Yangi savol qo'shish</button>
          <button type="button" class="admin-btn admin-btn-ghost" id="dash-bulk-q">${Icons.get('fileText')} Ommaviy kiritish</button>
          <button type="button" class="admin-btn admin-btn-ghost" id="dash-add-game">${Icons.get('trophy')} Yangi tur qo'shish</button>
        </div>
      </div>

      <div class="admin-kpi-grid">
        <div class="admin-kpi-card">
          <div class="admin-kpi-label">Turnirlar</div>
          <div class="admin-kpi-val">${data.tournaments.length}</div>
        </div>
        <div class="admin-kpi-card">
          <div class="admin-kpi-label">O'yinlar / Turlar</div>
          <div class="admin-kpi-val">${data.games.length}</div>
        </div>
        <div class="admin-kpi-card">
          <div class="admin-kpi-label">E'lon qilingan savollar</div>
          <div class="admin-kpi-val">${pubQ}</div>
        </div>
        <div class="admin-kpi-card">
          <div class="admin-kpi-label">Qoralama savollar</div>
          <div class="admin-kpi-val">${draftQ}</div>
        </div>
      </div>

      <div class="admin-card gold-highlight">
        <h2 class="admin-card-title">Statik saytni yangilash va qayta deploy qilish</h2>
        <p class="admin-card-desc">
          ${isDirty
            ? "Siz kiritgan o'zgarishlar hozircha faqat ushbu brauzerda ko'rinmoqda. Barcha talabalar ko'rishi uchun <strong>data/zakovat-data.js</strong> faylini yuklab oling va saytingiz papkasidagi eski fayl o'rniga joylashtirib qayta deploy qiling."
            : "Hozirgi baza yuklangan statik fayl bilan bir xil. Yangi tur yoki savollar qo'shganingizdan so'ng yangilangan <strong>data/zakovat-data.js</strong> faylini yuklab olib qayta deploy qilishingiz mumkin."}
        </p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button type="button" class="admin-btn admin-btn-gold" id="dash-download-js">
            ${Icons.get('download')} data/zakovat-data.js yuklab olish
          </button>
          <button type="button" class="admin-btn admin-btn-ghost" id="dash-go-deploy">
            ${Icons.get('rocket')} Versiya va Deploy bo'limi
          </button>
          <button type="button" class="admin-btn admin-btn-ghost" id="dash-preview">
            ${Icons.get('eye')} O'zgarishlarni saytda tekshirish
          </button>
        </div>
      </div>

      <div class="admin-card">
        <h2 class="admin-card-title">Oxirgi qo'shilgan o'yinlar / turlar</h2>
        <p class="admin-card-desc">Tahrirlash yoki yangi savol qo'shish uchun kerakli turni tanlang.</p>
        <div class="admin-list">
          ${data.games.slice(0, 5).map((g) => {
            const cnt = App.Store.getQuestionsByGame(g.id, true).length;
            return `
              <div class="admin-row-card">
                <div class="admin-row-main">
                  <div class="admin-row-top">
                    <span class="admin-pill gold">${cnt} ta savol</span>
                    <span class="admin-pill ${g.published !== false ? 'published' : 'draft'}">${g.published !== false ? "E'lon qilingan" : 'Qoralama'}</span>
                    <span class="admin-pill">${App.Utils.formatDateUz(g.date)}</span>
                  </div>
                  <div class="admin-row-title">${escapeHtml(g.title)}</div>
                  <div class="admin-row-sub">${escapeHtml(g.description || '')}</div>
                </div>
                <div class="admin-row-actions">
                  <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" data-dash-game-qs="${escapeHtml(g.id)}">
                    Savollari (${cnt})
                  </button>
                  <button type="button" class="admin-btn admin-btn-gold admin-btn-sm" data-dash-add-q-to="${escapeHtml(g.id)}">
                    ${Icons.get('plus')} Savol
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.getElementById('dash-add-q').addEventListener('click', () => openModal('question', null));
    document.getElementById('dash-bulk-q').addEventListener('click', () => {
      adminState.activeTab = 'bulk';
      render();
    });
    document.getElementById('dash-add-game').addEventListener('click', () => openModal('game', null));
    document.getElementById('dash-download-js').addEventListener('click', () => quickDownloadDeployFile());
    document.getElementById('dash-go-deploy').addEventListener('click', () => {
      adminState.activeTab = 'deploy';
      render();
    });
    document.getElementById('dash-preview').addEventListener('click', close);

    el.querySelectorAll('[data-dash-game-qs]').forEach((btn) => {
      btn.addEventListener('click', () => {
        adminState.qFilterGame = btn.dataset.dashGameQs;
        adminState.activeTab = 'questions';
        render();
      });
    });

    el.querySelectorAll('[data-dash-add-q-to]').forEach((btn) => {
      btn.addEventListener('click', () => openModal('question', null, { gameId: btn.dataset.dashAddQTo }));
    });
  }

  /* ========================================================================
     TAB 2: QUESTIONS CRUD
     ======================================================================== */

  function renderQuestionsTab(el) {
    const { escapeHtml } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();
    const searchLower = adminState.qSearch.trim().toLowerCase();

    const filtered = data.questions.filter((q) => {
      if (adminState.qFilterGame && q.gameId !== adminState.qFilterGame) return false;
      if (adminState.qFilterStatus === 'published' && q.published === false) return false;
      if (adminState.qFilterStatus === 'draft' && q.published !== false) return false;
      if (searchLower) {
        const hay = `${q.question} ${q.answer} ${q.comment || ''} ${q.author || ''} ${q.topic || ''}`.toLowerCase();
        if (!hay.includes(searchLower)) return false;
      }
      return true;
    });

    el.innerHTML = `
      <div class="admin-section-head">
        <div>
          <h1 class="admin-section-title">Savollar boshqaruvi</h1>
          <p class="admin-section-sub">Jami ${data.questions.length} ta savol &bull; Ko'rsatilmoqda: ${filtered.length} ta</p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button type="button" class="admin-btn admin-btn-ghost" id="qtab-go-bulk">${Icons.get('fileText')} Ommaviy kiritish</button>
          <button type="button" class="admin-btn admin-btn-gold" id="qtab-new-q">${Icons.get('plus')} Yangi savol</button>
        </div>
      </div>

      <div class="admin-toolbar">
        <input type="text" class="admin-input" id="admin-q-search" value="${escapeHtml(adminState.qSearch)}" placeholder="Savol, javob yoki muallif bo'yicha qidirish..." />
        <select class="admin-select" id="admin-q-game-filter">
          <option value="">Barcha o'yinlar / turlar</option>
          ${data.games.map((g) => `<option value="${escapeHtml(g.id)}" ${adminState.qFilterGame === g.id ? 'selected' : ''}>${escapeHtml(g.title)}</option>`).join('')}
        </select>
        <select class="admin-select" id="admin-q-status-filter" style="max-width:200px;">
          <option value="">Barcha holatlar</option>
          <option value="published" ${adminState.qFilterStatus === 'published' ? 'selected' : ''}>E'lon qilingan</option>
          <option value="draft" ${adminState.qFilterStatus === 'draft' ? 'selected' : ''}>Qoralama</option>
        </select>
      </div>

      <div class="admin-list">
        ${filtered.length ? filtered.map((q) => {
          const game = App.Store.getGameById(q.gameId);
          return `
            <div class="admin-row-card">
              <div class="admin-row-main">
                <div class="admin-row-top">
                  <span class="admin-pill gold">#${q.number || '?'}</span>
                  <span class="admin-pill ${q.published !== false ? 'published' : 'draft'}">${q.published !== false ? "E'lon qilingan" : 'Qoralama'}</span>
                  ${game ? `<span class="admin-pill">${escapeHtml(game.title)}</span>` : '<span class="admin-pill">O\'yin tanlanmagan</span>'}
                  ${q.topic ? `<span class="admin-pill">${escapeHtml(q.topic)}</span>` : ''}
                  ${q.solvedBy ? `<span class="admin-pill">Topgan: ${escapeHtml(q.solvedBy)}</span>` : ''}
                </div>
                <div class="admin-row-title">${escapeHtml(q.question)}</div>
                <div class="admin-row-sub">
                  <strong style="color:#e7cca5;">Javob:</strong> ${escapeHtml(q.answer)}
                  ${q.comment ? ` &nbsp;&bull;&nbsp; <span style="opacity:0.75;">${escapeHtml(q.comment.slice(0, 120))}${q.comment.length > 120 ? '...' : ''}</span>` : ''}
                </div>
              </div>

              <div class="admin-row-actions">
                <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" data-toggle-pub="${escapeHtml(q.id)}" title="Holatni almashtirish">
                  ${q.published !== false ? 'Qoralamaga' : "E'lon qilish"}
                </button>
                <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" data-edit-q="${escapeHtml(q.id)}">
                  ${Icons.get('edit')} Tahrir
                </button>
                <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" data-del-q="${escapeHtml(q.id)}">
                  ${Icons.get('trash')}
                </button>
              </div>
            </div>
          `;
        }).join('') : `
          <div class="admin-card" style="text-align:center;padding:42px;">
            <p style="color:rgba(255,255,255,0.6);margin-bottom:14px;">Tanlangan filtr bo'yicha savollar topilmadi.</p>
            <button type="button" class="admin-btn admin-btn-gold" id="qtab-empty-add">${Icons.get('plus')} Yangi savol qo'shish</button>
          </div>
        `}
      </div>
    `;

    document.getElementById('qtab-new-q').addEventListener('click', () =>
      openModal('question', null, { gameId: adminState.qFilterGame })
    );
    document.getElementById('qtab-go-bulk').addEventListener('click', () => {
      adminState.activeTab = 'bulk';
      render();
    });
    const emptyAdd = document.getElementById('qtab-empty-add');
    if (emptyAdd) emptyAdd.addEventListener('click', () => openModal('question', null));

    const searchInp = document.getElementById('admin-q-search');
    searchInp.addEventListener('input', (e) => {
      adminState.qSearch = e.target.value;
      renderQuestionsTab(el);
      const nextInp = document.getElementById('admin-q-search');
      if (nextInp) {
        nextInp.focus();
        nextInp.setSelectionRange(nextInp.value.length, nextInp.value.length);
      }
    });

    document.getElementById('admin-q-game-filter').addEventListener('change', (e) => {
      adminState.qFilterGame = e.target.value;
      renderQuestionsTab(el);
    });

    document.getElementById('admin-q-status-filter').addEventListener('change', (e) => {
      adminState.qFilterStatus = e.target.value;
      renderQuestionsTab(el);
    });

    el.querySelectorAll('[data-edit-q]').forEach((btn) => {
      btn.addEventListener('click', () => openModal('question', btn.dataset.editQ));
    });

    el.querySelectorAll('[data-toggle-pub]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.togglePub;
        App.Store.commitChange((d) => {
          const item = d.questions.find((q) => q.id === id);
          if (item) item.published = item.published === false;
        });
        App.Utils.showToast("Savol holati o'zgartirildi");
        render();
      });
    });

    el.querySelectorAll('[data-del-q]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!confirm("Ushbu savolni o'chirishni tasdiqlaysizmi?")) return;
        const id = btn.dataset.delQ;
        App.Store.commitChange((d) => {
          d.questions = d.questions.filter((q) => q.id !== id);
        });
        App.Utils.showToast("Savol o'chirildi");
        render();
      });
    });
  }

  /* ========================================================================
     TAB 3: SMART BULK QUESTION IMPORTER
     ======================================================================== */

  function renderBulkTab(el) {
    const { escapeHtml } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();

    if (!adminState.bulkGameId && data.games.length) {
      adminState.bulkGameId = data.games[0].id;
    }

    const existingCount = adminState.bulkGameId
      ? App.Store.getQuestionsByGame(adminState.bulkGameId, true).length
      : 0;

    const previewList = App.Utils.parseBulkQuestions(adminState.bulkRaw, {
      gameId: adminState.bulkGameId,
      topic: adminState.bulkTopic,
      startNumber: existingCount + 1
    });

    el.innerHTML = `
      <div class="admin-section-head">
        <div>
          <h1 class="admin-section-title">Tezkor ommaviy savol kiritish</h1>
          <p class="admin-section-sub">Telegram yoki Word fayldagi butun bir tur (12–24 ta) savollarini bir zumda joylang</p>
        </div>
        <button type="button" class="admin-btn admin-btn-ghost" id="bulk-fill-sample">
          ${Icons.get('sparkle')} Namuna matnni qo'yish
        </button>
      </div>

      <div class="admin-card">
        <div class="admin-form-grid" style="margin-bottom:16px;">
          <div class="admin-field">
            <label class="admin-label">Qaysi o'yin / turga qo'shilsin?</label>
            <select class="admin-select" id="bulk-game-select">
              ${data.games.map((g) => `<option value="${escapeHtml(g.id)}" ${adminState.bulkGameId === g.id ? 'selected' : ''}>${escapeHtml(g.title)}</option>`).join('')}
            </select>
          </div>
          <div class="admin-field">
            <label class="admin-label">Standart mavzu</label>
            <select class="admin-select" id="bulk-topic-select">
              ${data.site.topics.map((tp) => `<option value="${escapeHtml(tp)}" ${adminState.bulkTopic === tp ? 'selected' : ''}>${escapeHtml(tp)}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="admin-field">
          <label class="admin-label">Savollar matnini joylashtiring (har bir savolni <code>---</code> bilan yoki <code>1-savol:</code> raqami bilan ajrating)</label>
          <textarea class="admin-textarea" id="bulk-textarea" style="min-height:220px;" placeholder="1-savol: Savol matni...&#10;Javob: To'g'ri javob&#10;Izoh: Qo'shimcha tushuntirish&#10;Muallif: Ism Familiya&#10;---&#10;2-savol: ...">${escapeHtml(adminState.bulkRaw)}</textarea>
          <span class="admin-help">Qo'llab-quvvatlanadigan kalit so'zlar: <code>Javob:</code>, <code>Qabul qilinadi:</code>, <code>Izoh:</code>, <code>Tarqatma:</code>, <code>Muallif:</code>, <code>Manba:</code></span>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:18px;">
          <div style="font-size:14px;color:#e7cca5;">
            Aniqlangan savollar soni: <strong>${previewList.length} ta</strong>
          </div>
          <div style="display:flex;gap:10px;">
            <button type="button" class="admin-btn admin-btn-ghost" id="bulk-clear-btn">Tozalash</button>
            <button type="button" class="admin-btn admin-btn-gold" id="bulk-import-btn" ${previewList.length ? '' : 'disabled style="opacity:0.45"'}>
              ${Icons.get('check')} ${previewList.length} ta savolni bazaga qo'shish
            </button>
          </div>
        </div>
      </div>

      ${previewList.length ? `
        <div class="admin-card">
          <h3 class="admin-card-title">Oldindan ko'rish (${previewList.length} ta savol)</h3>
          <p class="admin-card-desc">Quyidagi savollar tekshirilib, tanlangan o'yinga qo'shiladi:</p>
          ${previewList.map((q) => `
            <div class="bulk-preview-item">
              <div class="admin-row-top">
                <span class="admin-pill gold">${q.number}-savol</span>
                <span class="admin-pill">${escapeHtml(q.topic)}</span>
                ${q.author ? `<span class="admin-pill">Muallif: ${escapeHtml(q.author)}</span>` : ''}
              </div>
              <div style="font-size:14px;color:#fff;margin-bottom:6px;white-space:pre-line;">${escapeHtml(q.question)}</div>
              <div style="font-size:13px;color:#e7cca5;"><strong>Javob:</strong> ${escapeHtml(q.answer)}</div>
              ${q.accepted ? `<div style="font-size:12.5px;color:rgba(255,255,255,0.72);"><strong>Qabul qilinadi:</strong> ${escapeHtml(q.accepted)}</div>` : ''}
              ${q.comment ? `<div style="font-size:12.5px;color:rgba(255,255,255,0.65);"><strong>Izoh:</strong> ${escapeHtml(q.comment)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;

    document.getElementById('bulk-game-select').addEventListener('change', (e) => {
      adminState.bulkGameId = e.target.value;
      renderBulkTab(el);
    });
    document.getElementById('bulk-topic-select').addEventListener('change', (e) => {
      adminState.bulkTopic = e.target.value;
      renderBulkTab(el);
    });

    const ta = document.getElementById('bulk-textarea');
    ta.addEventListener('input', (e) => {
      adminState.bulkRaw = e.target.value;
      renderBulkTab(el);
      const nextTa = document.getElementById('bulk-textarea');
      if (nextTa) {
        nextTa.focus();
        nextTa.setSelectionRange(nextTa.value.length, nextTa.value.length);
      }
    });

    document.getElementById('bulk-fill-sample').addEventListener('click', () => {
      adminState.bulkRaw =
        `1-savol: Qadimgi Rimda askarlar maoshining bir qismi ushbu qimmatbaho mahsulot bilan to'langani aytiladi. Bugungi kunda ingliz tilidagi «maosh» ma'nosini bildiruvchi so'z ham aynan shu mahsulotning lotincha nomidan kelib chiqqan.\n` +
        `Diqqat savol: Bu qaysi mahsulot?\n` +
        `Javob: Tuz.\n` +
        `Qabul qilinadi: Osh tuzi.\n` +
        `Izoh: Lotincha «sal» (tuz) so'zidan «salarium» va inglizcha «salary» so'zi hosil bo'lgan.\n` +
        `Muallif: Universitet Zakovat klubi\n` +
        `---\n` +
        `2-savol: 1869-yilda Dmitriy Mendeleyev o'zining mashhur jadvalini tuzayotganda ba'zi kataklarni atayin bo'sh qoldirgan va ularning xossalarini oldindan bashorat qilgan.\n` +
        `Diqqat savol: Bo'sh qoldirilgan o'sha kataklar nimani kutib turgan edi?\n` +
        `Javob: Hali kashf etilmagan kimyoviy elementlarni.\n` +
        `Izoh: Keyinchalik galliy, skandiy va germaniy elementlari kashf etilib, Mendeleyev bashoratlari aniq tasdiqlangan.`;
      renderBulkTab(el);
    });

    document.getElementById('bulk-clear-btn').addEventListener('click', () => {
      adminState.bulkRaw = '';
      renderBulkTab(el);
    });

    document.getElementById('bulk-import-btn').addEventListener('click', () => {
      if (!previewList.length) return;
      App.Store.commitChange((d) => {
        previewList.forEach((item) => d.questions.push(item));
      });
      adminState.bulkRaw = '';
      App.Utils.showToast(`${previewList.length} ta savol muvaffaqiyatli qo'shildi!`, 'success');
      adminState.qFilterGame = adminState.bulkGameId;
      adminState.activeTab = 'questions';
      render();
    });
  }

  /* ========================================================================
     TAB 4: TOURNAMENTS & GAMES/ROUNDS MANAGER
     ======================================================================== */

  function renderTournamentsTab(el) {
    const { escapeHtml, formatDateUz } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();

    el.innerHTML = `
      <div class="admin-section-head">
        <div>
          <h1 class="admin-section-title">Turnirlar va O'yinlar (Turlar)</h1>
          <p class="admin-section-sub">Avval turnir, so'ngra uning ichida har bir o'yin/tur paketini yarating</p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button type="button" class="admin-btn admin-btn-ghost" id="ttab-add-tour">${Icons.get('plus')} Yangi turnir</button>
          <button type="button" class="admin-btn admin-btn-gold" id="ttab-add-game">${Icons.get('plus')} Yangi tur / o'yin</button>
        </div>
      </div>

      <div class="admin-card">
        <h2 class="admin-card-title">O'yinlar / Savol paketlari (${data.games.length})</h2>
        <p class="admin-card-desc">Har bir o'tkazilgan musobaqa yoki tur shu yerda saqlanadi.</p>
        <div class="admin-list">
          ${data.games.map((g) => {
            const tour = App.Store.getTournamentById(g.tournamentId);
            const cnt = App.Store.getQuestionsByGame(g.id, true).length;
            return `
              <div class="admin-row-card">
                <div class="admin-row-main">
                  <div class="admin-row-top">
                    <span class="admin-pill gold">${cnt} ta savol</span>
                    <span class="admin-pill ${g.published !== false ? 'published' : 'draft'}">${g.published !== false ? "E'lon qilingan" : 'Qoralama'}</span>
                    <span class="admin-pill">${formatDateUz(g.date)}</span>
                    ${g.category ? `<span class="admin-pill">${escapeHtml(g.category)}</span>` : ''}
                  </div>
                  <div class="admin-row-title">${escapeHtml(g.title)}</div>
                  <div class="admin-row-sub">
                    Turnir: ${escapeHtml(tour ? tour.name : '—')}
                    ${g.winnerTeam ? ` &bull; G'olib: ${escapeHtml(g.winnerTeam)}` : ''}
                    ${g.teamsPlayed ? ` &bull; ${g.teamsPlayed} jamoa` : ''}
                  </div>
                </div>
                <div class="admin-row-actions">
                  <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" data-open-game-qs="${escapeHtml(g.id)}">Savollar</button>
                  <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" data-edit-game="${escapeHtml(g.id)}">${Icons.get('edit')}</button>
                  <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" data-del-game="${escapeHtml(g.id)}">${Icons.get('trash')}</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="admin-card">
        <h2 class="admin-card-title">Turnirlar (${data.tournaments.length})</h2>
        <p class="admin-card-desc">Mavsumlar, kuboklar va fakultetlararo ligalar ro'yxati.</p>
        <div class="admin-list">
          ${data.tournaments.map((t) => {
            const gCount = data.games.filter((g) => g.tournamentId === t.id).length;
            return `
              <div class="admin-row-card">
                <div class="admin-row-main">
                  <div class="admin-row-top">
                    <span class="admin-pill gold">ID: ${escapeHtml(t.code || '—')}</span>
                    <span class="admin-pill ${t.status === 'active' ? 'published' : ''}">${t.status === 'active' ? 'Faol' : 'Yakunlangan'}</span>
                    <span class="admin-pill">${gCount} ta tur</span>
                    ${t.category ? `<span class="admin-pill">${escapeHtml(t.category)}</span>` : ''}
                  </div>
                  <div class="admin-row-title">${escapeHtml(t.name)}</div>
                  <div class="admin-row-sub">${formatDateUz(t.startDate)} — ${formatDateUz(t.endDate)} &bull; ${escapeHtml(t.location || '')}</div>
                </div>
                <div class="admin-row-actions">
                  <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" data-edit-tour="${escapeHtml(t.id)}">${Icons.get('edit')} Tahrir</button>
                  <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" data-del-tour="${escapeHtml(t.id)}">${Icons.get('trash')}</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.getElementById('ttab-add-tour').addEventListener('click', () => openModal('tournament', null));
    document.getElementById('ttab-add-game').addEventListener('click', () => openModal('game', null));

    el.querySelectorAll('[data-open-game-qs]').forEach((btn) => {
      btn.addEventListener('click', () => {
        adminState.qFilterGame = btn.dataset.openGameQs;
        adminState.activeTab = 'questions';
        render();
      });
    });

    el.querySelectorAll('[data-edit-game]').forEach((btn) => {
      btn.addEventListener('click', () => openModal('game', btn.dataset.editGame));
    });

    el.querySelectorAll('[data-del-game]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.delGame;
        const qCnt = App.Store.getQuestionsByGame(id, true).length;
        const msg = qCnt
          ? `Ushbu tur ichida ${qCnt} ta savol bor. Turni va uning barcha savollarini o'chirishni tasdiqlaysizmi?`
          : "Ushbu turni o'chirishni tasdiqlaysizmi?";
        if (!confirm(msg)) return;
        App.Store.commitChange((d) => {
          d.games = d.games.filter((g) => g.id !== id);
          d.questions = d.questions.filter((q) => q.gameId !== id);
        });
        App.Utils.showToast("Tur o'chirildi");
        render();
      });
    });

    el.querySelectorAll('[data-edit-tour]').forEach((btn) => {
      btn.addEventListener('click', () => openModal('tournament', btn.dataset.editTour));
    });

    el.querySelectorAll('[data-del-tour]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!confirm("Turnirni o'chirishni tasdiqlaysizmi? (Unga bog'langan o'yinlar saqlanib qoladi)")) return;
        const id = btn.dataset.delTour;
        App.Store.commitChange((d) => {
          d.tournaments = d.tournaments.filter((t) => t.id !== id);
        });
        App.Utils.showToast("Turnir o'chirildi");
        render();
      });
    });
  }

  /* ========================================================================
     TAB 5: VERSION & RE-DEPLOY EXPORTER (Core User Requirement)
     ======================================================================== */

  function renderDeployTab(el) {
    const { escapeHtml, bumpPatchVersion, buildDeployJsContent } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();
    const isDirty = App.Store.isDirty();
    const suggestedVersion = isDirty ? bumpPatchVersion(data.version) : (data.version || '1.0.0');
    const previewSnippet = buildDeployJsContent(data).slice(0, 950) + '\n  // ...';

    el.innerHTML = `
      <div class="admin-section-head">
        <div>
          <h1 class="admin-section-title">Versiya faylini yuklab olish va Deploy</h1>
          <p class="admin-section-sub">Kiritilgan barcha savol-javoblarni bitta statik faylga chiqaring va qayta joylang</p>
        </div>
      </div>

      <div class="admin-card gold-highlight">
        <h2 class="admin-card-title">1. Yangi versiya faylini tayyorlash</h2>
        <p class="admin-card-desc">
          Sayt 100% statik bo'lgani uchun barcha turnirlar, turlar, savollar va sozlamalar yagona <strong><code>data/zakovat-data.js</code></strong> faylida saqlanadi.
        </p>

        <div class="admin-form-grid" style="margin-bottom:18px;">
          <div class="admin-field">
            <label class="admin-label">Versiya raqami</label>
            <input type="text" class="admin-input" id="deploy-version-input" value="${escapeHtml(suggestedVersion)}" placeholder="1.0.1" />
          </div>
          <div class="admin-field">
            <label class="admin-label">Yangilanish izohi (Release note)</label>
            <input type="text" class="admin-input" id="deploy-note-input" value="${escapeHtml(data.releaseNote || '')}" placeholder="Masalan: 3-tur savollari qo'shildi" />
          </div>
        </div>

        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <button type="button" class="admin-btn admin-btn-gold" id="deploy-download-js">
            ${Icons.get('download')} zakovat-data.js yuklab olish (Deploy fayli)
          </button>
          <button type="button" class="admin-btn admin-btn-ghost" id="deploy-copy-js">
            ${Icons.get('copy')} GitHub uchun kodni nusxalash
          </button>
          <button type="button" class="admin-btn admin-btn-ghost" id="deploy-download-json">
            ${Icons.get('fileText')} zakovat-data.json (Zaxira)
          </button>
        </div>

        <div class="deploy-steps-list">
          <div class="deploy-step-box">
            <div class="deploy-step-num">1</div>
            <h4>Faylni yuklab oling</h4>
            <p>Yuqoridagi «zakovat-data.js yuklab olish» tugmasini bosing. Barcha kiritilgan savollar ichida bo'ladi.</p>
          </div>
          <div class="deploy-step-box">
            <div class="deploy-step-num">2</div>
            <h4>Eski faylni almashtiring</h4>
            <p>Loyiha papkasidagi <code>data/zakovat-data.js</code> faylini yangisi bilan almashtiring (yoki GitHub'da to'g'ridan-to'g'ri tahrirlab joylang).</p>
          </div>
          <div class="deploy-step-box">
            <div class="deploy-step-num">3</div>
            <h4>Qayta deploy qiling</h4>
            <p>GitHub Pages, Netlify, Vercel yoki Cloudflare Pages'ga qayta yuklang — bir necha soniyada sayt yangilanadi!</p>
          </div>
        </div>
      </div>

      <div class="admin-card">
        <h2 class="admin-card-title">2. Eski versiya faylini yuklash (Import)</h2>
        <p class="admin-card-desc">
          Avval yuklab olingan <code>zakovat-data.js</code> yoki <code>zakovat-data.json</code> faylini yuklab, tahrirlashni davom ettirishingiz mumkin.
        </p>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
          <label class="admin-btn admin-btn-ghost" style="cursor:pointer;">
            ${Icons.get('upload')} Fayl tanlash (.js / .json)
            <input type="file" id="deploy-import-input" accept=".js,.json,application/json,text/javascript" style="display:none;" />
          </label>
          ${isDirty ? `
            <button type="button" class="admin-btn admin-btn-danger" id="deploy-reset-draft">
              ${Icons.get('refresh')} Mahalliy qoralamani bekor qilish (v${escapeHtml(App.Store.getBaselineVersion())} ga qaytish)
            </button>` : ''}
        </div>
      </div>

      <div class="admin-card">
        <h2 class="admin-card-title">Hosil qilinadigan fayl ko'rinishi (<code>data/zakovat-data.js</code>)</h2>
        <div class="code-preview-box">${escapeHtml(previewSnippet)}</div>
      </div>
    `;

    document.getElementById('deploy-download-js').addEventListener('click', () => {
      const ver = document.getElementById('deploy-version-input').value.trim() || data.version || '1.0.1';
      const note = document.getElementById('deploy-note-input').value.trim();
      App.Store.markExportedVersion(ver, note);
      const jsContent = buildDeployJsContent(App.Store.getData());
      App.Utils.downloadFile('zakovat-data.js', jsContent, 'application/javascript;charset=utf-8');
      App.Utils.showToast(`zakovat-data.js (v${ver}) yuklab olindi! Uni data/ papkasiga joylab deploy qiling.`, 'success');
      render();
    });

    document.getElementById('deploy-copy-js').addEventListener('click', () => {
      const ver = document.getElementById('deploy-version-input').value.trim() || data.version || '1.0.1';
      const note = document.getElementById('deploy-note-input').value.trim();
      App.Store.markExportedVersion(ver, note);
      const jsContent = buildDeployJsContent(App.Store.getData());
      App.Utils.copyToClipboard(jsContent, `zakovat-data.js (v${ver}) buferga nusxalandi! Endi GitHub'ga joylashingiz mumkin.`);
      render();
    });

    document.getElementById('deploy-download-json').addEventListener('click', () => {
      const ver = document.getElementById('deploy-version-input').value.trim() || data.version || '1.0.1';
      const jsonContent = JSON.stringify(App.Store.getData(), null, 2);
      App.Utils.downloadFile(`zakovat-data-v${ver}.json`, jsonContent, 'application/json;charset=utf-8');
      App.Utils.showToast('JSON zaxira nusxasi yuklab olindi!', 'success');
    });

    document.getElementById('deploy-import-input').addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = App.Store.parseImportedFileText(reader.result);
          if (!Array.isArray(parsed.questions) || !Array.isArray(parsed.games)) {
            throw new Error("Faylda savollar yoki o'yinlar ro'yxati topilmadi.");
          }
          App.Store.replaceAllData(parsed, true);
          App.Utils.showToast(`Fayl muvaffaqiyatli yuklandi (${parsed.questions.length} ta savol)!`, 'success');
          render();
        } catch (err) {
          App.Utils.showToast(`Xatolik: ${err.message}`, 'error');
        }
      };
      reader.readAsText(file, 'utf-8');
    });

    const resetBtn = document.getElementById('deploy-reset-draft');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (!confirm("Brauzerdagi barcha deploy qilinmagan o'zgarishlar o'chiriladi va saytdagi asl faylga qaytiladi. Davom etasizmi?")) return;
        App.Store.resetLocalDraft();
        App.Utils.showToast("Mahalliy qoralama tozalandi");
        render();
      });
    }
  }

  function quickDownloadDeployFile() {
    const data = App.Store.getData();
    const ver = App.Store.isDirty() ? App.Utils.bumpPatchVersion(data.version) : (data.version || '1.0.0');
    App.Store.markExportedVersion(ver, data.releaseNote || '');
    const jsContent = App.Utils.buildDeployJsContent(App.Store.getData());
    App.Utils.downloadFile('zakovat-data.js', jsContent, 'application/javascript;charset=utf-8');
    App.Utils.showToast(`zakovat-data.js (v${ver}) yuklab olindi!`, 'success');
    render();
  }

  /* ========================================================================
     TAB 6: SITE SETTINGS & PASSCODE CHANGE
     ======================================================================== */

  function renderSettingsTab(el) {
    const { escapeHtml } = App.Utils;
    const { Icons } = App;
    const site = App.Store.getData().site;

    el.innerHTML = `
      <div class="admin-section-head">
        <div>
          <h1 class="admin-section-title">Sayt sozlamalari</h1>
          <p class="admin-section-sub">Universitet nomi, sarlavhalar, aloqa ma'lumotlari va admin parolini moslashtiring</p>
        </div>
      </div>

      <form class="admin-card" id="settings-site-form">
        <h2 class="admin-card-title">Asosiy ma'lumotlar</h2>
        <div class="admin-form-grid">
          <div class="admin-field">
            <label class="admin-label">Universitet / Klub nomi</label>
            <input type="text" class="admin-input" id="set-uni" value="${escapeHtml(site.universityName)}" required />
          </div>
          <div class="admin-field">
            <label class="admin-label">Qisqa yorliq (Logo yonida)</label>
            <input type="text" class="admin-input" id="set-short" value="${escapeHtml(site.shortLabel || '')}" />
          </div>
          <div class="admin-field full">
            <label class="admin-label">Bosh sahifa katta sarlavhasi</label>
            <input type="text" class="admin-input" id="set-hero-title" value="${escapeHtml(site.heroTitle)}" />
          </div>
          <div class="admin-field full">
            <label class="admin-label">Bosh sahifa tavsifi</label>
            <textarea class="admin-textarea" id="set-hero-sub" style="min-height:80px;">${escapeHtml(site.heroSubtitle)}</textarea>
          </div>
          <div class="admin-field full">
            <label class="admin-label">Yuqori paneldagi e'lon matni (Oltin rangli satr)</label>
            <input type="text" class="admin-input" id="set-announce" value="${escapeHtml(site.announcementText || '')}" />
          </div>
          <div class="admin-field">
            <label class="admin-label">Elektron pochta</label>
            <input type="email" class="admin-input" id="set-email" value="${escapeHtml(site.email || '')}" />
          </div>
          <div class="admin-field">
            <label class="admin-label">Telefon raqam</label>
            <input type="text" class="admin-input" id="set-phone" value="${escapeHtml(site.phone || '')}" />
          </div>
          <div class="admin-field">
            <label class="admin-label">Telegram kanal havolasi</label>
            <input type="url" class="admin-input" id="set-tg" value="${escapeHtml(site.telegramUrl || '')}" placeholder="https://t.me/..." />
          </div>
          <div class="admin-field">
            <label class="admin-label">Footer iqtibosi</label>
            <input type="text" class="admin-input" id="set-quote" value="${escapeHtml(site.quote || '')}" />
          </div>
          <div class="admin-field full">
            <label class="admin-label">Turnir toifalari (vergul bilan ajrating)</label>
            <input type="text" class="admin-input" id="set-cats" value="${escapeHtml((site.categories || []).join(', '))}" />
          </div>
          <div class="admin-field full">
            <label class="admin-label">Savol mavzulari (vergul bilan ajrating)</label>
            <input type="text" class="admin-input" id="set-topics" value="${escapeHtml((site.topics || []).join(', '))}" />
          </div>
        </div>
        <div style="margin-top:20px;display:flex;justify-content:flex-end;">
          <button type="submit" class="admin-btn admin-btn-gold">${Icons.get('check')} Sozlamalarni saqlash</button>
        </div>
      </form>

      <form class="admin-card" id="settings-pass-form">
        <h2 class="admin-card-title">Admin parolini o'zgartirish</h2>
        <p class="admin-card-desc">
          Parol SHA-256 xesh ko'rinishida saqlanadi. Parol o'zgartirilgach, yangi <code>zakovat-data.js</code> faylini yuklab olib deploy qiling.
          (Eslatma: statik saytda admin panel tashrif buyuruvchilardan yashirish uchun xizmat qiladi; haqiqiy o'zgarishlar faqat fayl qayta deploy qilinganda kuchga kiradi.)
        </p>
        <div class="admin-form-grid three-col">
          <div class="admin-field">
            <label class="admin-label">Joriy parol</label>
            <input type="password" class="admin-input" id="pass-current" required />
          </div>
          <div class="admin-field">
            <label class="admin-label">Yangi parol (kamida 4 belgi)</label>
            <input type="password" class="admin-input" id="pass-new" minlength="4" required />
          </div>
          <div class="admin-field">
            <label class="admin-label">Yangi parolni tasdiqlang</label>
            <input type="password" class="admin-input" id="pass-confirm" minlength="4" required />
          </div>
        </div>
        <div style="margin-top:18px;display:flex;justify-content:flex-end;">
          <button type="submit" class="admin-btn admin-btn-ghost">${Icons.get('lock')} Parolni yangilash</button>
        </div>
      </form>
    `;

    document.getElementById('settings-site-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const cats = document.getElementById('set-cats').value.split(',').map((s) => s.trim()).filter(Boolean);
      const topics = document.getElementById('set-topics').value.split(',').map((s) => s.trim()).filter(Boolean);

      App.Store.commitChange((d) => {
        d.site.universityName = document.getElementById('set-uni').value.trim();
        d.site.shortLabel = document.getElementById('set-short').value.trim();
        d.site.heroTitle = document.getElementById('set-hero-title').value.trim();
        d.site.heroSubtitle = document.getElementById('set-hero-sub').value.trim();
        d.site.announcementText = document.getElementById('set-announce').value.trim();
        d.site.email = document.getElementById('set-email').value.trim();
        d.site.phone = document.getElementById('set-phone').value.trim();
        d.site.telegramUrl = document.getElementById('set-tg').value.trim();
        d.site.quote = document.getElementById('set-quote').value.trim();
        if (cats.length) d.site.categories = cats;
        if (topics.length) d.site.topics = topics;
      });
      App.Utils.showToast("Sayt sozlamalari saqlandi!", 'success');
      render();
    });

    document.getElementById('settings-pass-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const cur = document.getElementById('pass-current').value.trim();
      const nw = document.getElementById('pass-new').value.trim();
      const cf = document.getElementById('pass-confirm').value.trim();
      if (App.Utils.sha256(cur) !== App.Store.getData().adminPasscodeHash) {
        App.Utils.showToast("Joriy parol noto'g'ri!", 'error');
        return;
      }
      if (nw !== cf) {
        App.Utils.showToast("Yangi parollar mos kelmadi!", 'error');
        return;
      }
      App.Store.commitChange((d) => {
        d.adminPasscodeHash = App.Utils.sha256(nw);
      });
      App.Utils.showToast("Admin paroli yangilandi! Endi zakovat-data.js faylini yuklab oling.", 'success');
      e.target.reset();
      render();
    });
  }

  /* ========================================================================
     MODALS: QUESTION / GAME / TOURNAMENT EDITOR
     ======================================================================== */

  function openModal(type, id, preset) {
    adminState.modal = { type, id: id || null, preset: preset || {} };
    render();
  }

  function closeModal() {
    adminState.modal = null;
    render();
  }

  function renderAdminModal(mount) {
    if (!mount || !adminState.modal) return;
    const { type, id, preset } = adminState.modal;

    if (type === 'question') renderQuestionModal(mount, id, preset);
    else if (type === 'game') renderGameModal(mount, id);
    else if (type === 'tournament') renderTournamentModal(mount, id);
  }

  function renderQuestionModal(mount, id, preset) {
    const { escapeHtml } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();
    const existing = id ? data.questions.find((q) => q.id === id) : null;
    const defaultGameId = existing ? existing.gameId : (preset.gameId || (data.games[0] ? data.games[0].id : ''));
    const nextNum = existing
      ? existing.number
      : (App.Store.getQuestionsByGame(defaultGameId, true).reduce((m, q) => Math.max(m, Number(q.number) || 0), 0) + 1);

    mount.innerHTML = `
      <div class="admin-modal-backdrop" id="amodal-backdrop">
        <div class="admin-modal">
          <div class="admin-modal-head">
            <h3 class="admin-modal-title">${existing ? "Savolni tahrirlash" : "Yangi savol qo'shish"}</h3>
            <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" id="amodal-close">${Icons.get('x')}</button>
          </div>

          <form id="q-editor-form">
            <div class="admin-form-grid three-col">
              <div class="admin-field" style="grid-column: span 2;">
                <label class="admin-label">O'yin / Tur</label>
                <select class="admin-select" id="qe-game" required>
                  ${data.games.map((g) => `<option value="${escapeHtml(g.id)}" ${defaultGameId === g.id ? 'selected' : ''}>${escapeHtml(g.title)}</option>`).join('')}
                </select>
              </div>
              <div class="admin-field">
                <label class="admin-label">Savol raqami</label>
                <input type="number" min="1" class="admin-input" id="qe-num" value="${nextNum}" required />
              </div>
              <div class="admin-field">
                <label class="admin-label">Mavzu</label>
                <select class="admin-select" id="qe-topic">
                  ${data.site.topics.map((tp) => `<option value="${escapeHtml(tp)}" ${(existing ? existing.topic : 'Umumiy') === tp ? 'selected' : ''}>${escapeHtml(tp)}</option>`).join('')}
                </select>
              </div>
              <div class="admin-field">
                <label class="admin-label">Qiyinlik darajasi</label>
                <select class="admin-select" id="qe-diff">
                  ${['Oson', "O'rta", 'Qiyin'].map((df) => `<option value="${df}" ${(existing ? existing.difficulty : "O'rta") === df ? 'selected' : ''}>${df}</option>`).join('')}
                </select>
              </div>
              <div class="admin-field">
                <label class="admin-label">Holati</label>
                <select class="admin-select" id="qe-pub">
                  <option value="1" ${(!existing || existing.published !== false) ? 'selected' : ''}>E'lon qilingan (Ko'rinadi)</option>
                  <option value="0" ${(existing && existing.published === false) ? 'selected' : ''}>Qoralama (Yashirin)</option>
                </select>
              </div>

              <div class="admin-field full">
                <label class="admin-label">Savol matni (SAVOL) *</label>
                <textarea class="admin-textarea" id="qe-question" required placeholder="Savol matnini kiriting...">${escapeHtml(existing ? existing.question : '')}</textarea>
              </div>

              <div class="admin-field full">
                <label class="admin-label">Rasmiy javob (JAVOB) *</label>
                <input type="text" class="admin-input" id="qe-answer" value="${escapeHtml(existing ? existing.answer : '')}" required placeholder="To'g'ri javob..." />
              </div>

              <div class="admin-field full">
                <label class="admin-label">Qabul qilinadigan variantlar (ixtiyoriy)</label>
                <input type="text" class="admin-input" id="qe-accepted" value="${escapeHtml(existing ? existing.accepted : '')}" placeholder="Masalan: sinonimlar yoki qisqa shakllar" />
              </div>

              <div class="admin-field full">
                <label class="admin-label">Izoh / Sharh (IZOH, ixtiyoriy)</label>
                <textarea class="admin-textarea" id="qe-comment" style="min-height:82px;" placeholder="Javobning mantiqiy izohi...">${escapeHtml(existing ? existing.comment : '')}</textarea>
              </div>

              <div class="admin-field full">
                <label class="admin-label">Tarqatma material matni (ixtiyoriy)</label>
                <textarea class="admin-textarea" id="qe-handout-text" style="min-height:66px;" placeholder="Agar savolda tarqatma bo'lsa matnini yozing...">${escapeHtml(existing ? existing.handoutText : '')}</textarea>
              </div>

              <div class="admin-field full">
                <label class="admin-label">Tarqatma rasmi (URL yoki kompyuterdan yuklash, ixtiyoriy)</label>
                <div style="display:flex;gap:10px;align-items:center;">
                  <input type="text" class="admin-input" id="qe-handout-img" value="${escapeHtml(existing ? existing.handoutImage : '')}" placeholder="https://... yoki o'ngdagi tugmadan yuklang" />
                  <label class="admin-btn admin-btn-ghost admin-btn-sm" style="cursor:pointer;">
                    ${Icons.get('upload')} Rasm
                    <input type="file" id="qe-img-file" accept="image/*" style="display:none;" />
                  </label>
                </div>
              </div>

              <div class="admin-field">
                <label class="admin-label">Muallif</label>
                <input type="text" class="admin-input" id="qe-author" value="${escapeHtml(existing ? existing.author : '')}" placeholder="Ism Familiya" />
              </div>
              <div class="admin-field">
                <label class="admin-label">Manba</label>
                <input type="text" class="admin-input" id="qe-source" value="${escapeHtml(existing ? existing.source : '')}" placeholder="Kitob, sayt yoki maqola" />
              </div>
              <div class="admin-field">
                <label class="admin-label">Topgan jamoalar (masalan: 14 / 28)</label>
                <input type="text" class="admin-input" id="qe-solved" value="${escapeHtml(existing ? existing.solvedBy : '')}" placeholder="14 / 28" />
              </div>
            </div>

            <div class="admin-modal-footer">
              <button type="button" class="admin-btn admin-btn-ghost" id="amodal-cancel">Bekor qilish</button>
              <button type="submit" class="admin-btn admin-btn-gold">${Icons.get('check')} Saqlash</button>
            </div>
          </form>
        </div>
      </div>
    `;

    bindModalDismiss();

    // Auto-update question number when game changes on new question
    if (!existing) {
      document.getElementById('qe-game').addEventListener('change', (e) => {
        const gQs = App.Store.getQuestionsByGame(e.target.value, true);
        const mx = gQs.reduce((m, q) => Math.max(m, Number(q.number) || 0), 0);
        document.getElementById('qe-num').value = mx + 1;
      });
    }

    // Optional handout image upload -> compact base64 data URI
    document.getElementById('qe-img-file').addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      if (f.size > 450 * 1024) {
        App.Utils.showToast("Rasm hajmi 450 KB dan kichik bo'lishi tavsiya etiladi (statik fayl yengil qolishi uchun).", 'error');
      }
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById('qe-handout-img').value = reader.result;
        App.Utils.showToast('Tarqatma rasmi yuklandi', 'success');
      };
      reader.readAsDataURL(f);
    });

    document.getElementById('q-editor-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {
        id: existing ? existing.id : App.Utils.generateId('q'),
        gameId: document.getElementById('qe-game').value,
        number: parseInt(document.getElementById('qe-num').value, 10) || 1,
        topic: document.getElementById('qe-topic').value,
        difficulty: document.getElementById('qe-diff').value,
        published: document.getElementById('qe-pub').value === '1',
        question: document.getElementById('qe-question').value.trim(),
        answer: document.getElementById('qe-answer').value.trim(),
        accepted: document.getElementById('qe-accepted').value.trim(),
        comment: document.getElementById('qe-comment').value.trim(),
        handoutText: document.getElementById('qe-handout-text').value.trim(),
        handoutImage: document.getElementById('qe-handout-img').value.trim(),
        author: document.getElementById('qe-author').value.trim(),
        source: document.getElementById('qe-source').value.trim(),
        solvedBy: document.getElementById('qe-solved').value.trim(),
        likes: existing ? (Number(existing.likes) || 0) : 0
      };

      App.Store.commitChange((d) => {
        if (existing) {
          const idx = d.questions.findIndex((q) => q.id === existing.id);
          if (idx !== -1) d.questions[idx] = payload;
        } else {
          d.questions.push(payload);
        }
      });

      App.Utils.showToast(existing ? 'Savol yangilandi!' : "Yangi savol qo'shildi!", 'success');
      closeModal();
    });
  }

  function renderGameModal(mount, id) {
    const { escapeHtml } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();
    const existing = id ? data.games.find((g) => g.id === id) : null;
    const todayStr = new Date().toISOString().slice(0, 10);

    mount.innerHTML = `
      <div class="admin-modal-backdrop" id="amodal-backdrop">
        <div class="admin-modal">
          <div class="admin-modal-head">
            <h3 class="admin-modal-title">${existing ? "O'yin / Turni tahrirlash" : "Yangi tur / o'yin yaratish"}</h3>
            <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" id="amodal-close">${Icons.get('x')}</button>
          </div>

          <form id="g-editor-form">
            <div class="admin-form-grid">
              <div class="admin-field full">
                <label class="admin-label">Tur / O'yin nomi *</label>
                <input type="text" class="admin-input" id="ge-title" value="${escapeHtml(existing ? existing.title : '')}" required placeholder="Masalan: Kuzgi mavsum 3-tur savollari" />
              </div>
              <div class="admin-field">
                <label class="admin-label">Qaysi turnirga tegishli?</label>
                <select class="admin-select" id="ge-tour">
                  ${data.tournaments.map((t) => `<option value="${escapeHtml(t.id)}" ${(existing && existing.tournamentId === t.id) ? 'selected' : ''}>${escapeHtml(t.name)}</option>`).join('')}
                </select>
              </div>
              <div class="admin-field">
                <label class="admin-label">Toifa</label>
                <select class="admin-select" id="ge-cat">
                  ${data.site.categories.map((c) => `<option value="${escapeHtml(c)}" ${(existing && existing.category === c) ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
                </select>
              </div>
              <div class="admin-field">
                <label class="admin-label">O'tkazilgan sana</label>
                <input type="date" class="admin-input" id="ge-date" value="${escapeHtml(existing ? existing.date : todayStr)}" />
              </div>
              <div class="admin-field">
                <label class="admin-label">Tur raqami</label>
                <input type="number" min="1" class="admin-input" id="ge-round" value="${existing ? (existing.roundNumber || 1) : (data.games.length + 1)}" />
              </div>
              <div class="admin-field">
                <label class="admin-label">Ishtirokchi jamoalar soni</label>
                <input type="number" min="0" class="admin-input" id="ge-teams" value="${existing ? (existing.teamsPlayed || 0) : 20}" />
              </div>
              <div class="admin-field">
                <label class="admin-label">G'olib jamoa (ixtiyoriy)</label>
                <input type="text" class="admin-input" id="ge-winner" value="${escapeHtml(existing ? existing.winnerTeam : '')}" placeholder="Jamoa nomi" />
              </div>
              <div class="admin-field">
                <label class="admin-label">Boshlovchi</label>
                <input type="text" class="admin-input" id="ge-host" value="${escapeHtml(existing ? existing.host : '')}" />
              </div>
              <div class="admin-field">
                <label class="admin-label">Muharrir / Tuzuvchi</label>
                <input type="text" class="admin-input" id="ge-editor" value="${escapeHtml(existing ? existing.editor : '')}" />
              </div>
              <div class="admin-field">
                <label class="admin-label">Paket tili</label>
                <input type="text" class="admin-input" id="ge-lang" value="${escapeHtml(existing ? (existing.language || "O'zbek") : "O'zbek")}" />
              </div>
              <div class="admin-field">
                <label class="admin-label">Holati</label>
                <select class="admin-select" id="ge-pub">
                  <option value="1" ${(!existing || existing.published !== false) ? 'selected' : ''}>E'lon qilingan</option>
                  <option value="0" ${(existing && existing.published === false) ? 'selected' : ''}>Qoralama (Yashirin)</option>
                </select>
              </div>
              <div class="admin-field full">
                <label class="admin-label">Qisqa tavsif</label>
                <textarea class="admin-textarea" id="ge-desc" style="min-height:76px;">${escapeHtml(existing ? existing.description : '')}</textarea>
              </div>
            </div>

            <div class="admin-modal-footer">
              <button type="button" class="admin-btn admin-btn-ghost" id="amodal-cancel">Bekor qilish</button>
              <button type="submit" class="admin-btn admin-btn-gold">${Icons.get('check')} Saqlash</button>
            </div>
          </form>
        </div>
      </div>
    `;

    bindModalDismiss();

    document.getElementById('g-editor-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {
        id: existing ? existing.id : App.Utils.generateId('game'),
        tournamentId: document.getElementById('ge-tour').value,
        roundNumber: parseInt(document.getElementById('ge-round').value, 10) || 1,
        title: document.getElementById('ge-title').value.trim(),
        date: document.getElementById('ge-date').value,
        category: document.getElementById('ge-cat').value,
        teamsPlayed: parseInt(document.getElementById('ge-teams').value, 10) || 0,
        winnerTeam: document.getElementById('ge-winner').value.trim(),
        host: document.getElementById('ge-host').value.trim(),
        editor: document.getElementById('ge-editor').value.trim(),
        language: document.getElementById('ge-lang').value.trim() || "O'zbek",
        published: document.getElementById('ge-pub').value === '1',
        description: document.getElementById('ge-desc').value.trim()
      };

      App.Store.commitChange((d) => {
        if (existing) {
          const idx = d.games.findIndex((g) => g.id === existing.id);
          if (idx !== -1) d.games[idx] = payload;
        } else {
          d.games.unshift(payload);
        }
      });

      App.Utils.showToast(existing ? 'Tur yangilandi!' : "Yangi tur yaratildi!", 'success');
      closeModal();
    });
  }

  function renderTournamentModal(mount, id) {
    const { escapeHtml } = App.Utils;
    const { Icons } = App;
    const data = App.Store.getData();
    const existing = id ? data.tournaments.find((t) => t.id === id) : null;
    const todayStr = new Date().toISOString().slice(0, 10);

    mount.innerHTML = `
      <div class="admin-modal-backdrop" id="amodal-backdrop">
        <div class="admin-modal">
          <div class="admin-modal-head">
            <h3 class="admin-modal-title">${existing ? "Turnirni tahrirlash" : "Yangi turnir yaratish"}</h3>
            <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" id="amodal-close">${Icons.get('x')}</button>
          </div>

          <form id="t-editor-form">
            <div class="admin-form-grid">
              <div class="admin-field full">
                <label class="admin-label">Turnir nomi *</label>
                <input type="text" class="admin-input" id="te-name" value="${escapeHtml(existing ? existing.name : '')}" required placeholder="Masalan: 2027 Bahorgi mavsum ligasi" />
              </div>
              <div class="admin-field">
                <label class="admin-label">ID kodi</label>
                <input type="text" class="admin-input" id="te-code" value="${escapeHtml(existing ? existing.code : String(101 + data.tournaments.length))}" />
              </div>
              <div class="admin-field">
                <label class="admin-label">Mavsum</label>
                <input type="text" class="admin-input" id="te-season" value="${escapeHtml(existing ? existing.season : '2026 Kuz')}" />
              </div>
              <div class="admin-field">
                <label class="admin-label">Toifa</label>
                <select class="admin-select" id="te-cat">
                  ${data.site.categories.map((c) => `<option value="${escapeHtml(c)}" ${(existing && existing.category === c) ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
                </select>
              </div>
              <div class="admin-field">
                <label class="admin-label">Holati</label>
                <select class="admin-select" id="te-status">
                  <option value="active" ${(!existing || existing.status === 'active') ? 'selected' : ''}>Faol (Davom etmoqda)</option>
                  <option value="finished" ${(existing && existing.status === 'finished') ? 'selected' : ''}>Yakunlangan</option>
                </select>
              </div>
              <div class="admin-field">
                <label class="admin-label">Boshlanish sanasi</label>
                <input type="date" class="admin-input" id="te-start" value="${escapeHtml(existing ? existing.startDate : todayStr)}" />
              </div>
              <div class="admin-field">
                <label class="admin-label">Tugash sanasi</label>
                <input type="date" class="admin-input" id="te-end" value="${escapeHtml(existing ? existing.endDate : todayStr)}" />
              </div>
              <div class="admin-field">
                <label class="admin-label">O'tkazilish joyi</label>
                <input type="text" class="admin-input" id="te-loc" value="${escapeHtml(existing ? existing.location : '')}" placeholder="Katta faollar zali" />
              </div>
              <div class="admin-field">
                <label class="admin-label">Jamoalar soni</label>
                <input type="number" min="0" class="admin-input" id="te-teams" value="${existing ? (existing.teamsCount || 0) : 24}" />
              </div>
              <div class="admin-field full">
                <label class="admin-label">Tavsif</label>
                <textarea class="admin-textarea" id="te-desc" style="min-height:76px;">${escapeHtml(existing ? existing.description : '')}</textarea>
              </div>
            </div>

            <div class="admin-modal-footer">
              <button type="button" class="admin-btn admin-btn-ghost" id="amodal-cancel">Bekor qilish</button>
              <button type="submit" class="admin-btn admin-btn-gold">${Icons.get('check')} Saqlash</button>
            </div>
          </form>
        </div>
      </div>
    `;

    bindModalDismiss();

    document.getElementById('t-editor-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {
        id: existing ? existing.id : App.Utils.generateId('tour'),
        code: document.getElementById('te-code').value.trim(),
        name: document.getElementById('te-name').value.trim(),
        season: document.getElementById('te-season').value.trim(),
        category: document.getElementById('te-cat').value,
        status: document.getElementById('te-status').value,
        startDate: document.getElementById('te-start').value,
        endDate: document.getElementById('te-end').value,
        location: document.getElementById('te-loc').value.trim(),
        teamsCount: parseInt(document.getElementById('te-teams').value, 10) || 0,
        description: document.getElementById('te-desc').value.trim()
      };

      App.Store.commitChange((d) => {
        if (existing) {
          const idx = d.tournaments.findIndex((t) => t.id === existing.id);
          if (idx !== -1) d.tournaments[idx] = payload;
        } else {
          d.tournaments.unshift(payload);
        }
      });

      App.Utils.showToast(existing ? 'Turnir yangilandi!' : "Yangi turnir qo'shildi!", 'success');
      closeModal();
    });
  }

  function bindModalDismiss() {
    const closeBtn = document.getElementById('amodal-close');
    const cancelBtn = document.getElementById('amodal-cancel');
    const backdrop = document.getElementById('amodal-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target.id === 'amodal-backdrop') closeModal();
      });
    }
  }

  App.Admin = {
    open,
    close
  };
})(window.ZakovatApp);
