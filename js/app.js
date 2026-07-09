/**
 * app.js
 * Main controller: loads static data, wires up the tablist, forms,
 * settings dialog, and connects each feature module to the DOM.
 * No build step / bundler required - kept intentionally simple so the
 * whole app can be reviewed and audited file-by-file.
 */
(function () {
  'use strict';

  let STADIUMS = [];
  let LANGUAGES = [];
  let CROWD_ZONES = [];
  let currentStadium = null;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function announce(msg) {
    const region = $('#sr-status');
    if (region) region.textContent = msg;
  }

  function showResult(el, text, isError = false) {
    el.textContent = text;
    el.classList.toggle('error', isError);
  }

  function describeAiError(err) {
    if (err && err.code === 'NO_API_KEY') {
      return 'No API key configured yet. Open Settings to add your own free key, or explore the static data in the meantime.';
    }
    if (err && err.code === 'TIMEOUT') {
      return 'The request took too long and timed out. Please try again.';
    }
    if (err && err.code === 'PROVIDER_ERROR') {
      return `The AI provider returned an error (status ${err.status}). Double-check your API key in Settings.`;
    }
    return 'Something went wrong reaching the AI provider. Please try again in a moment.';
  }

  /* ---------------- Data loading ---------------- */
  async function loadData() {
    const [stadiumRes, crowdRes] = await Promise.all([
      fetch('data/stadiums.json'),
      fetch('data/crowd-feed.json'),
    ]);
    const stadiumData = await stadiumRes.json();
    const crowdData = await crowdRes.json();
    STADIUMS = stadiumData.stadiums;
    LANGUAGES = stadiumData.languages;
    CROWD_ZONES = crowdData.zones;
  }

  /* ---------------- i18n wiring ---------------- */
  function applyStaticStrings() {
    const map = {
      'app-title': 'appTitle', 'app-tagline': 'tagline', 'label-home': 'navHome',
      'label-navigate': 'navNavigate', 'label-crowd': 'navCrowd', 'label-access': 'navAccess',
      'label-transport': 'navTransport', 'label-sustain': 'navSustain', 'label-assistant': 'navAssistant',
      'label-ops': 'navOps', 'settings-label': 'settings', 'no-key-title': 'noKeyTitle', 'no-key-body': 'noKeyBody',
    };
    Object.entries(map).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = window.StadiumI18n.t(key);
    });
    $('#chat-input').placeholder = window.StadiumI18n.t('askPlaceholder');
    $('#chat-send').textContent = window.StadiumI18n.t('send');
  }

  function populateLangSelect() {
    const sel = $('#lang-select');
    sel.innerHTML = '';
    LANGUAGES.forEach((lang) => {
      const opt = document.createElement('option');
      opt.value = lang.code;
      opt.textContent = lang.label;
      sel.appendChild(opt);
    });
    sel.value = window.StadiumI18n.getLang();
    sel.addEventListener('change', () => {
      window.StadiumI18n.setLang(sel.value);
      applyStaticStrings();
      announce(`Language changed to ${sel.options[sel.selectedIndex].text}`);
    });
  }

  /* ---------------- Stadium picker ---------------- */
  function populateStadiumSelect() {
    const sel = $('#stadium-select');
    sel.innerHTML = '';
    STADIUMS.forEach((s) => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.name} — ${s.city}`;
      sel.appendChild(opt);
    });
    currentStadium = STADIUMS[0];
    sel.addEventListener('change', () => {
      currentStadium = STADIUMS.find((s) => s.id === sel.value);
      renderHome();
      renderNavForm();
      renderTransport();
    });
  }

  function renderHome() {
    const card = $('#home-stadium-card');
    if (!currentStadium) return;
    card.innerHTML = `
      <div class="card"><h3>${currentStadium.name}</h3><p>${currentStadium.city}, ${currentStadium.country}</p></div>
      <div class="card"><h3>Capacity</h3><p class="stat">${currentStadium.capacity.toLocaleString()}</p></div>
      <div class="card"><h3>Gates</h3><p class="stat">${currentStadium.gates.length}</p></div>
      <div class="card"><h3>Sustainability score</h3><p class="stat">${currentStadium.sustainabilityScore}/100</p></div>
    `;
  }

  /* ---------------- Tabs ---------------- */
  function initTabs() {
    const tabs = $all('.gate-tab');
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activateTab(tab));
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
          tabs[next].focus();
          activateTab(tabs[next]);
        }
      });
    });
  }

  function activateTab(tab) {
    $all('.gate-tab').forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    $all('.panel').forEach((p) => {
      p.hidden = p.id !== `panel-${tab.dataset.panel}`;
    });
    const panel = document.getElementById(`panel-${tab.dataset.panel}`);
    if (panel) panel.focus();
  }

  /* ---------------- Settings dialog ---------------- */
  function initSettings() {
    const backdrop = $('#settings-backdrop');
    const dialog = $('#settings-dialog');
    const providerSel = $('#provider-select');
    const keyInput = $('#api-key-input');
    let lastFocused = null;

    function open() {
      lastFocused = document.activeElement;
      providerSel.value = window.StadiumAI.getStoredProvider();
      keyInput.value = window.StadiumAI.getStoredKey();
      backdrop.hidden = false;
      dialog.hidden = false;
      providerSel.focus();
      refreshNoKeyBanner();
    }
    function close() {
      backdrop.hidden = true;
      dialog.hidden = true;
      if (lastFocused) lastFocused.focus();
    }

    $('#settings-btn').addEventListener('click', open);
    $('#no-key-cta').addEventListener('click', open);
    $('#close-settings-btn').addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !dialog.hidden) close();
    });

    $('#save-key-btn').addEventListener('click', () => {
      window.StadiumAI.setStoredProvider(providerSel.value);
      window.StadiumAI.setStoredKey(keyInput.value.trim());
      announce('API key saved to this browser.');
      refreshNoKeyBanner();
      close();
    });
    $('#clear-key-btn').addEventListener('click', () => {
      keyInput.value = '';
      window.StadiumAI.setStoredKey('');
      announce('API key removed.');
      refreshNoKeyBanner();
    });
  }

  function refreshNoKeyBanner() {
    $('#no-key-banner').hidden = window.StadiumAI.hasKey();
  }

  /* ---------------- Navigate panel ---------------- */
  function renderNavForm() {
    const sel = $('#nav-from');
    sel.innerHTML = '';
    currentStadium.gates.forEach((g) => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = `Gate ${g}`;
      sel.appendChild(opt);
    });
  }

  function initNavForm() {
    $('#nav-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const resultBox = $('#nav-result');
      const from = $('#nav-from').value;
      const to = $('#nav-to').value;
      showResult(resultBox, 'Thinking...');
      try {
        if (window.StadiumAI.hasKey()) {
          const guide = await window.StadiumNav.getAiRouteGuide(currentStadium, from, to);
          showResult(resultBox, guide);
        } else {
          showResult(resultBox, window.StadiumNav.staticFallbackGuide(currentStadium, from, to));
        }
      } catch (err) {
        showResult(resultBox, describeAiError(err), true);
      }
    });
  }

  /* ---------------- Crowd panel ---------------- */
  function renderZoneList() {
    const ranked = window.StadiumUtils.rankZonesByCongestion(CROWD_ZONES);
    const list = $('#zone-list');
    list.innerHTML = '';
    ranked.forEach((z) => {
      const li = document.createElement('li');
      li.className = `level-${z.level}`;
      li.innerHTML = `
        <span>${z.label}</span>
        <span class="zone-bar" role="img" aria-label="${z.percent}% occupied, ${z.level} congestion"><span style="width:${Math.min(z.percent, 100)}%"></span></span>
        <span class="zone-pct">${z.percent}%</span>
      `;
      list.appendChild(li);
    });
    return ranked;
  }

  function initCrowdPanel() {
    const ranked = renderZoneList();
    $('#ops-summary-btn').addEventListener('click', async () => {
      const resultBox = $('#crowd-result');
      showResult(resultBox, 'Analyzing zones...');
      try {
        const summary = await window.StadiumCrowd.getAiOpsSummary(ranked);
        showResult(resultBox, summary);
      } catch (err) {
        showResult(resultBox, describeAiError(err), true);
      }
    });
  }

  /* ---------------- Accessibility panel ---------------- */
  function renderAccessFeatures() {
    const list = $('#access-feature-list');
    list.innerHTML = '';
    window.StadiumAccess.STATIC_FEATURES.forEach((f) => {
      const li = document.createElement('li');
      li.innerHTML = `<span aria-hidden="true">${f.icon}</span><span>${f.label}</span>`;
      list.appendChild(li);
    });
  }

  function initAccessForm() {
    $('#access-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const resultBox = $('#access-result');
      const q = $('#access-question').value;
      showResult(resultBox, 'Thinking...');
      try {
        const answer = await window.StadiumAccess.getAiAccessGuide(q);
        showResult(resultBox, answer);
      } catch (err) {
        showResult(resultBox, describeAiError(err), true);
      }
    });
  }

  /* ---------------- Transport panel ---------------- */
  function renderTransport() {
    const list = $('#transport-list');
    list.innerHTML = '';
    currentStadium.transitOptions.forEach((opt) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${opt}</span>`;
      list.appendChild(li);
    });
  }

  /* ---------------- Sustainability panel ---------------- */
  function initSustainForm() {
    $('#sustain-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const resultBox = $('#sustain-result');
      const distance = parseFloat($('#sustain-distance').value);
      const mode = $('#sustain-mode').value;
      try {
        const saved = window.StadiumUtils.estimateCo2SavedGrams(distance, mode);
        const text = `Estimated CO2e saved vs. driving alone: ~${(saved / 1000).toFixed(2)} kg for this trip.`;
        showResult(resultBox, `${text}\nGenerating tips...`);
        if (window.StadiumAI.hasKey()) {
          const tips = await window.StadiumSustain.getAiTips(currentStadium, mode, saved);
          showResult(resultBox, `${text}\n\n${tips}`);
        } else {
          showResult(resultBox, text);
        }
      } catch (err) {
        showResult(resultBox, describeAiError(err), true);
      }
    });
  }

  /* ---------------- Assistant chat panel ---------------- */
  function appendChatMsg(role, text) {
    const win = $('#chat-window');
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.textContent = text;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
  }

  function initChat() {
    appendChatMsg('system', 'Ask me about gates, seating, food, transit, or anything else about your matchday.');
    $('#chat-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = $('#chat-input');
      const question = window.StadiumUtils.clampInput(input.value, 500);
      if (!question) return;
      appendChatMsg('user', question);
      input.value = '';
      try {
        const system = [
          'You are a friendly, concise assistant for FIFA World Cup 2026 fans.',
          `Current stadium context: ${currentStadium.name}, ${currentStadium.city}.`,
          'Keep answers under 100 words. If you are not sure of an exact policy, say so',
          'and suggest checking with official stadium staff or the official FIFA app.',
        ].join(' ');
        const reply = await window.StadiumAI.ask(system, question);
        appendChatMsg('ai', reply);
      } catch (err) {
        appendChatMsg('system', describeAiError(err));
      }
    });
  }

  /* ---------------- Ops console panel ---------------- */
  function initOpsConsole() {
    $('#ops-digest-btn').addEventListener('click', async () => {
      const resultBox = $('#ops-result');
      showResult(resultBox, 'Building digest...');
      try {
        const ranked = window.StadiumUtils.rankZonesByCongestion(CROWD_ZONES);
        const summary = await window.StadiumCrowd.getAiOpsSummary(ranked);
        showResult(
          resultBox,
          `SHIFT DIGEST — ${currentStadium.name}\n\n${summary}\n\nGenerated for volunteer/organizer handoff.`
        );
      } catch (err) {
        showResult(resultBox, describeAiError(err), true);
      }
    });
  }

  /* ---------------- Boot ---------------- */
  async function init() {
    window.StadiumI18n.initLang();
    try {
      await loadData();
    } catch (e) {
      announce('Could not load stadium data. Please refresh the page.');
      return;
    }
    populateLangSelect();
    populateStadiumSelect();
    applyStaticStrings();
    renderHome();
    renderNavForm();
    renderTransport();
    renderAccessFeatures();
    initTabs();
    initSettings();
    initNavForm();
    initCrowdPanel();
    initAccessForm();
    initSustainForm();
    initChat();
    initOpsConsole();
    refreshNoKeyBanner();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
