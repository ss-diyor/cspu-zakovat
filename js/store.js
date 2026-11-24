/* ==========================================================================
   State & Persistence Store
   - Loads static baseline from window.ZAKOVAT_DATA (data/zakovat-data.js)
   - Overlays localStorage admin edits so organizers can preview before deploy
   - Persists visitor bookmarks and likes locally in browser
   ========================================================================== */

window.ZakovatApp = window.ZakovatApp || {};

(function (App) {
  'use strict';

  const DRAFT_KEY = 'zakovat_uni_admin_draft_v1';
  const BOOKMARKS_KEY = 'zakovat_uni_bookmarks_v1';
  const LIKES_KEY = 'zakovat_uni_likes_v1';

  const baselineData = JSON.parse(JSON.stringify(window.ZAKOVAT_DATA || {
    version: '1.0.0',
    releaseNote: '',
    updatedAt: new Date().toISOString(),
    adminPasscodeHash: 'c72e907f3d0116444f0dab6c22dd78bcf23961ffa3f607dc02e51354b9dcacb7',
    site: {
      universityName: 'Universitet Zakovat Klubi',
      shortLabel: "Oliy ta'lim ligasi",
      heroTitle: 'Universitet Zakovat turniri savollar va javoblar arxivi',
      heroSubtitle: "Musobaqalarda o'ynalgan savollar va javoblar bazasi.",
      quote: "Ilm tufayli inson o'zi sevgan ish bilan shug'ullanishi mumkin.",
      announcementText: '',
      email: 'zakovat@universitet.uz',
      phone: '+998 (71) 200-00-00',
      telegramUrl: '',
      instagramUrl: '',
      youtubeUrl: '',
      categories: ['Oliy liga', 'Fakultetlararo', 'Rektor kubogi', 'Yangi avlod', 'Blitz'],
      topics: ['Mantiq', 'Tarix', 'Adabiyot', 'Fan va texnika', "San'at", 'Geografiya', 'Sport', 'Umumiy']
    },
    tournaments: [],
    games: [],
    questions: []
  }));

  let currentData = null;
  let hasLocalDraft = false;
  let listeners = [];

  function loadInitialData() {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && Array.isArray(parsed.questions) && Array.isArray(parsed.games)) {
          currentData = normalizeData(parsed);
          hasLocalDraft = true;
          return;
        }
      }
    } catch (_) {
      /* fallback to baseline */
    }
    currentData = normalizeData(JSON.parse(JSON.stringify(baselineData)));
    hasLocalDraft = false;
  }

  function normalizeData(data) {
    data.site = Object.assign({}, baselineData.site, data.site || {});
    if (!Array.isArray(data.site.categories) || !data.site.categories.length) {
      data.site.categories = ['Oliy liga', 'Fakultetlararo', 'Rektor kubogi', 'Yangi avlod', 'Blitz'];
    }
    if (!Array.isArray(data.site.topics) || !data.site.topics.length) {
      data.site.topics = ['Mantiq', 'Tarix', 'Adabiyot', 'Fan va texnika', "San'at", 'Geografiya', 'Sport', 'Umumiy'];
    }
    data.tournaments = Array.isArray(data.tournaments) ? data.tournaments : [];
    data.games = Array.isArray(data.games) ? data.games : [];
    data.questions = Array.isArray(data.questions) ? data.questions : [];
    return data;
  }

  function getData() {
    if (!currentData) loadInitialData();
    return currentData;
  }

  function isDirty() {
    return hasLocalDraft;
  }

  function commitChange(mutatorFn) {
    const data = getData();
    mutatorFn(data);
    data.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      hasLocalDraft = true;
    } catch (e) {
      App.Utils.showToast("Brauzer xotirasiga saqlashda xatolik (fayl hajmi katta bo'lishi mumkin).", 'error');
    }
    notify();
  }

  function replaceAllData(newData, markAsDraft) {
    currentData = normalizeData(JSON.parse(JSON.stringify(newData)));
    currentData.updatedAt = currentData.updatedAt || new Date().toISOString();
    if (markAsDraft !== false) {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(currentData));
        hasLocalDraft = true;
      } catch (_) {}
    }
    notify();
  }

  function resetLocalDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (_) {}
    currentData = normalizeData(JSON.parse(JSON.stringify(baselineData)));
    hasLocalDraft = false;
    notify();
  }

  function markExportedVersion(newVersion, releaseNote) {
    commitChange((d) => {
      if (newVersion) d.version = newVersion.trim();
      if (releaseNote !== undefined) d.releaseNote = releaseNote.trim();
    });
  }

  /* Helpers for relationships */
  function getTournamentById(id) {
    return getData().tournaments.find((t) => t.id === id) || null;
  }

  function getGameById(id) {
    return getData().games.find((g) => g.id === id) || null;
  }

  function getPublishedGames() {
    return getData().games
      .filter((g) => g.published !== false)
      .slice()
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  }

  function getPublishedQuestions() {
    const data = getData();
    const publishedGameIds = new Set(data.games.filter((g) => g.published !== false).map((g) => g.id));
    return data.questions.filter((q) => q.published !== false && (!q.gameId || publishedGameIds.has(q.gameId)));
  }

  function getQuestionsByGame(gameId, includeDrafts) {
    return getData().questions
      .filter((q) => q.gameId === gameId && (includeDrafts || q.published !== false))
      .slice()
      .sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0));
  }

  /* Visitor Bookmarks & Likes (localStorage) */
  function getBookmarks() {
    try {
      return new Set(JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]'));
    } catch (_) {
      return new Set();
    }
  }

  function toggleBookmark(qId) {
    const set = getBookmarks();
    const added = !set.has(qId);
    if (added) set.add(qId);
    else set.delete(qId);
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(Array.from(set)));
    } catch (_) {}
    notify();
    return added;
  }

  function getLikedSet() {
    try {
      return new Set(JSON.parse(localStorage.getItem(LIKES_KEY) || '[]'));
    } catch (_) {
      return new Set();
    }
  }

  function toggleLike(qId) {
    const set = getLikedSet();
    const liked = !set.has(qId);
    if (liked) set.add(qId);
    else set.delete(qId);
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(Array.from(set)));
    } catch (_) {}
    notify();
    return liked;
  }

  function getDisplayLikes(q) {
    const base = Number(q.likes) || 0;
    return base + (getLikedSet().has(q.id) ? 1 : 0);
  }

  function subscribe(fn) {
    listeners.push(fn);
  }

  function notify() {
    listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error(err);
      }
    });
  }

  /* Parse uploaded .js or .json data file */
  function parseImportedFileText(text) {
    const trimmed = String(text || '').trim();
    if (!trimmed) throw new Error("Fayl bo'sh.");

    // Direct JSON
    if (trimmed.startsWith('{')) {
      return JSON.parse(trimmed);
    }

    // JS format: window.ZAKOVAT_DATA = { ... };
    const startIdx = trimmed.indexOf('{');
    const endIdx = trimmed.lastIndexOf('}');
    if (startIdx !== -1 && endIdx > startIdx) {
      const jsonSlice = trimmed.slice(startIdx, endIdx + 1);
      return JSON.parse(jsonSlice);
    }
    throw new Error("Fayl formati noto'g'ri. data/zakovat-data.js yoki .json faylini tanlang.");
  }

  loadInitialData();

  App.Store = {
    getData,
    getBaselineVersion: () => baselineData.version || '1.0.0',
    isDirty,
    commitChange,
    replaceAllData,
    resetLocalDraft,
    markExportedVersion,
    getTournamentById,
    getGameById,
    getPublishedGames,
    getPublishedQuestions,
    getQuestionsByGame,
    getBookmarks,
    toggleBookmark,
    getLikedSet,
    toggleLike,
    getDisplayLikes,
    parseImportedFileText,
    subscribe
  };
})(window.ZakovatApp);
