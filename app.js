(() => {
  "use strict";

  // ---------- constants ----------
  const SLOTS = [
    { id: "m", time: 8 * 60 },
    { id: "a", time: 13 * 60 + 30 },
    { id: "n", time: 21 * 60 },
  ];
  const DUE_EARLY = 60;   // the button opens an hour before a dose
  const LATE_AFTER = 30;  // after this, a dose counts as late and Rahul is alerted
  const STORE_KEY = "saathi-demo-v1";

  const ICON = {
    m: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 18h18"/><path d="M7 18a5 5 0 0 1 10 0"/><path d="M12 8V5M5.6 11.6 4 10M18.4 11.6 20 10"/></svg>',
    a: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',
    n: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    speak: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.5L12 19V5L7.5 9.5Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M5 3.5h3.5l1.8 4.4-2.3 1.5a11 11 0 0 0 6.6 6.6l1.5-2.3 4.4 1.8V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z"/></svg>',
  };

  // ---------- words on Amma's phone ----------
  const T = {
    en: {
      locale: "en-IN", speech: "en-IN", name: "English", short: "EN",
      greet: { m: "Good morning, Amma", a: "Good afternoon, Amma", n: "Good evening, Amma" },
      slot: { m: "Morning", a: "Afternoon", n: "Night" },
      slotOf: { m: "Morning", a: "Afternoon", n: "Night" },
      at: (s, t) => `${s}, ${t}`,
      due: "Time for your medicines",
      upcoming: (t) => `Next medicines at ${t}`,
      missed: (s) => `${s} medicines not taken yet`,
      took: "I took them",
      notYet: "Not time yet",
      takenAt: (t) => `Taken at ${t}`,
      allDone: "All done for today",
      tomorrow: (s, t) => `Next: tomorrow ${s.toLowerCase()}, ${t}`,
      food: { before: "before food", after: "after food", any: "any time" },
      qty: (q) => (q === 0.5 ? "half a tablet" : q === 1 ? "1 tablet" : `${q} tablets`),
      read: "Read aloud",
      call: "Call Rahul",
      calling: "Calling Rahul…",
      later: "Today",
      count: (n) => (n === 1 ? "1 tablet" : `${n} tablets`),
      taken: "Taken",
      notTaken: "Not taken",
      saved: "Done. Rahul can see it.",
      undo: "Undo",
      nudge: "Rahul sent a reminder",
      noVoice: "Read aloud isn’t available on this device.",
      lang: "Language", size: "Text size",
    },
    hi: {
      locale: "hi-IN", speech: "hi-IN", name: "हिन्दी", short: "हिं",
      greet: { m: "सुप्रभात, अम्मा", a: "नमस्ते, अम्मा", n: "शुभ संध्या, अम्मा" },
      slot: { m: "सुबह", a: "दोपहर", n: "रात" },
      slotOf: { m: "सुबह की", a: "दोपहर की", n: "रात की" },
      at: (s, t) => `${s} ${t} बजे`,
      due: "दवाई का समय हो गया",
      upcoming: (t) => `अगली दवाई ${t} बजे`,
      missed: (s) => `${s} दवाई अभी तक नहीं ली`,
      took: "मैंने दवाई ले ली",
      notYet: "अभी समय नहीं हुआ",
      takenAt: (t) => `${t} बजे ले ली`,
      allDone: "आज की सारी दवाई हो गई",
      tomorrow: (s, t) => `अगली दवाई: कल ${s} ${t} बजे`,
      food: { before: "खाने से पहले", after: "खाने के बाद", any: "कभी भी" },
      qty: (q) => (q === 0.5 ? "आधी गोली" : q === 1 ? "1 गोली" : `${q} गोलियाँ`),
      read: "सुनाइए",
      call: "राहुल को फ़ोन करें",
      calling: "राहुल को फ़ोन लग रहा है…",
      later: "आज",
      count: (n) => (n === 1 ? "1 गोली" : `${n} गोलियाँ`),
      taken: "ले ली",
      notTaken: "नहीं ली",
      saved: "हो गया। राहुल को पता चल गया।",
      undo: "वापस लें",
      nudge: "राहुल ने याद दिलाया है",
      noVoice: "इस फ़ोन पर सुनाने की सुविधा नहीं है।",
      lang: "भाषा", size: "अक्षर का आकार",
    },
    kn: {
      locale: "kn-IN", speech: "kn-IN", name: "ಕನ್ನಡ", short: "ಕ",
      greet: { m: "ಶುಭೋದಯ, ಅಮ್ಮ", a: "ಶುಭ ಮಧ್ಯಾಹ್ನ, ಅಮ್ಮ", n: "ಶುಭ ಸಂಜೆ, ಅಮ್ಮ" },
      slot: { m: "ಬೆಳಿಗ್ಗೆ", a: "ಮಧ್ಯಾಹ್ನ", n: "ರಾತ್ರಿ" },
      slotOf: { m: "ಬೆಳಿಗ್ಗೆಯ", a: "ಮಧ್ಯಾಹ್ನದ", n: "ರಾತ್ರಿಯ" },
      at: (s, t) => `${s} ${t} ಕ್ಕೆ`,
      due: "ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳುವ ಸಮಯ",
      upcoming: (t) => `ಮುಂದಿನ ಔಷಧಿ ${t} ಕ್ಕೆ`,
      missed: (s) => `${s} ಔಷಧಿ ಇನ್ನೂ ತೆಗೆದುಕೊಂಡಿಲ್ಲ`,
      took: "ನಾನು ಔಷಧಿ ತೆಗೆದುಕೊಂಡೆ",
      notYet: "ಇನ್ನೂ ಸಮಯ ಆಗಿಲ್ಲ",
      takenAt: (t) => `${t} ಕ್ಕೆ ತೆಗೆದುಕೊಂಡಿರಿ`,
      allDone: "ಇಂದಿನ ಎಲ್ಲಾ ಔಷಧಿ ಮುಗಿಯಿತು",
      tomorrow: (s, t) => `ಮುಂದಿನದು: ನಾಳೆ ${s} ${t} ಕ್ಕೆ`,
      food: { before: "ಊಟದ ಮೊದಲು", after: "ಊಟದ ನಂತರ", any: "ಯಾವಾಗ ಬೇಕಾದರೂ" },
      qty: (q) => (q === 0.5 ? "ಅರ್ಧ ಮಾತ್ರೆ" : q === 1 ? "1 ಮಾತ್ರೆ" : `${q} ಮಾತ್ರೆಗಳು`),
      read: "ಓದಿ ಹೇಳಿ",
      call: "ರಾಹುಲ್‌ಗೆ ಕರೆ ಮಾಡಿ",
      calling: "ರಾಹುಲ್‌ಗೆ ಕರೆ ಮಾಡಲಾಗುತ್ತಿದೆ…",
      later: "ಇಂದು",
      count: (n) => (n === 1 ? "1 ಮಾತ್ರೆ" : `${n} ಮಾತ್ರೆಗಳು`),
      taken: "ತೆಗೆದುಕೊಂಡಿದೆ",
      notTaken: "ತೆಗೆದುಕೊಂಡಿಲ್ಲ",
      saved: "ಆಯಿತು. ರಾಹುಲ್‌ಗೆ ತಿಳಿಯಿತು.",
      undo: "ರದ್ದುಮಾಡಿ",
      nudge: "ರಾಹುಲ್ ನೆನಪಿಸಿದ್ದಾರೆ",
      noVoice: "ಈ ಫೋನ್‌ನಲ್ಲಿ ಓದಿ ಹೇಳುವ ಸೌಲಭ್ಯ ಇಲ್ಲ.",
      lang: "ಭಾಷೆ", size: "ಅಕ್ಷರದ ಗಾತ್ರ",
    },
  };
  const SLOT_EN = { m: "morning", a: "afternoon", n: "night" };
  const SLOT_EN_CAP = { m: "Morning", a: "Afternoon", n: "Night" };

  const PILL_COLORS = [
    { id: "white", label: "White", hex: "#FFFFFF" },
    { id: "pink", label: "Pink", hex: "#F7C6D0" },
    { id: "yellow", label: "Yellow", hex: "#F5D76E" },
    { id: "orange", label: "Orange", hex: "#F28C38" },
    { id: "blue", label: "Blue", hex: "#9EC5E8" },
  ];
  const SHAPES = [
    { id: "round", label: "Round" },
    { id: "oval", label: "Oval" },
    { id: "capsule", label: "Capsule" },
    { id: "small", label: "Small" },
  ];

  // ---------- state ----------
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayKey = (offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const dateOf = (offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offset);
    return d;
  };

  function freshState() {
    const meds = [
      { id: "met", name: "Metformin", strength: "500 mg", pattern: [1, 0, 1], food: "after", shape: "round", color: "#FFFFFF", stock: 38, purpose: "Sugar" },
      { id: "tel", name: "Telmisartan", strength: "40 mg", pattern: [1, 0, 0], food: "after", shape: "oval", color: "#F7C6D0", stock: 5, purpose: "Blood pressure" },
      { id: "pan", name: "Pantoprazole", strength: "40 mg", pattern: [1, 0, 0], food: "before", shape: "oval", color: "#F5D76E", stock: 24, purpose: "Acidity" },
      { id: "cal", name: "Calcium + D3", strength: "500 mg", pattern: [0, 1, 0], food: "after", shape: "capsule", color: "#F28C38", stock: 17, purpose: "Bones" },
      { id: "ato", name: "Atorvastatin", strength: "10 mg", pattern: [0, 0, 1], food: "after", shape: "small", color: "#FFFFFF", stock: 21, purpose: "Cholesterol" },
    ];
    // Six earlier days of history: mostly on time, two missed afternoons, one late night.
    const log = {};
    const missed = { "2a": true, "5a": true };
    const late = { "4n": 55 };
    for (let d = 1; d <= 6; d++) {
      const entry = {};
      SLOTS.forEach((s, i) => {
        if (missed[d + s.id]) return;
        const jitter = late[d + s.id] ?? ((d * 7 + i * 13) % 19) - 4;
        entry[s.id] = { at: s.time + jitter };
      });
      log[dayKey(d)] = entry;
    }
    log[dayKey(0)] = {};
    return { now: 8 * 60 + 10, meds, log, lang: "en", scale: 1, reordered: {}, nudge: null };
  }

  let state = load() || freshState();
  const ui = { tab: "elder", toast: { elder: null, care: null }, modal: null };

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      return s && s.log && s.log[dayKey(0)] ? s : null; // stale demo from another day: start fresh
    } catch { return null; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* storage unavailable: demo still works */ }
  }

  // ---------- helpers ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slotIndex = (id) => SLOTS.findIndex((s) => s.id === id);
  const medsIn = (slotId) => state.meds.filter((m) => m.pattern[slotIndex(slotId)] > 0);
  const tabletsIn = (slotId) => medsIn(slotId).reduce((n, m) => n + m.pattern[slotIndex(slotId)], 0);
  const dailyQty = (m) => m.pattern.reduce((a, b) => a + b, 0);
  const qtyText = (q) => (q === 0.5 ? "½" : String(q));

  function clock(mins, withMeridiem = true) {
    const h = Math.floor(mins / 60), m = mins % 60;
    const h12 = ((h + 11) % 12) + 1;
    const base = `${h12}:${String(m).padStart(2, "0")}`;
    return withMeridiem ? `${base} ${h < 12 ? "am" : "pm"}` : base;
  }
  const L = () => T[state.lang];
  const elderTime = (mins) => (state.lang === "en" ? clock(mins) : clock(mins, false));

  // Status of one slot on one day (offset 0 = today).
  function slotStatus(offset, slot) {
    if (!medsIn(slot.id).length) return { s: "none" };
    const rec = state.log[dayKey(offset)]?.[slot.id];
    if (rec) return { s: rec.at > slot.time + LATE_AFTER ? "late" : "taken", at: rec.at };
    if (offset > 0) return { s: "missed" };
    if (state.now < slot.time - DUE_EARLY) return { s: "upcoming" };
    if (state.now <= slot.time + LATE_AFTER) return { s: "due" };
    return { s: "missed", lateBy: state.now - slot.time };
  }

  // What Amma's phone should show right now.
  function currentSlot() {
    const started = SLOTS.filter((s) => medsIn(s.id).length && state.now >= s.time - DUE_EARLY);
    const last = started[started.length - 1];
    if (last && !state.log[dayKey(0)][last.id]) return { slot: last, ...slotStatus(0, last) };
    const next = SLOTS.find((s) => medsIn(s.id).length && state.now < s.time - DUE_EARLY && !state.log[dayKey(0)][s.id]);
    if (next) return { slot: next, s: "upcoming" };
    return { slot: null, s: "done", justTaken: last };
  }

  // ---------- actions ----------
  function take(slotId) {
    const slot = SLOTS[slotIndex(slotId)];
    const prev = state.meds.map((m) => m.stock);
    state.log[dayKey(0)][slotId] = { at: state.now };
    medsIn(slotId).forEach((m) => { m.stock = Math.max(0, m.stock - m.pattern[slotIndex(slotId)]); });
    state.nudge = null;
    toast("elder", L().saved, L().undo, () => {
      delete state.log[dayKey(0)][slotId];
      state.meds.forEach((m, i) => { if (prev[i] !== undefined) m.stock = prev[i]; });
      commit();
    });
    toast("care", `Amma took her ${SLOT_EN[slot.id]} medicines at ${clock(state.now)}.`);
    commit();
  }

  function commit() { save(); render(); }

  let toastTimers = {};
  function toast(where, msg, actionLabel, action) {
    ui.toast[where] = { msg, actionLabel, action };
    clearTimeout(toastTimers[where]);
    toastTimers[where] = setTimeout(() => { ui.toast[where] = null; renderToast(where); }, 6000);
    renderToast(where);
  }

  function speak(text) {
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") { toast("elder", L().noVoice); return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = L().speech;
    u.rate = 0.9;
    const voice = synth.getVoices().find((v) => v.lang && v.lang.replace("_", "-").toLowerCase().startsWith(L().speech.slice(0, 2)));
    if (voice) u.voice = voice;
    synth.speak(u);
  }

  // ---------- render: shell ----------
  const elderEl = document.getElementById("elder");
  const careEl = document.getElementById("care");
  [elderEl, careEl].forEach((el) => {
    el.innerHTML = '<div class="scr-body"></div><div class="toast-region" aria-live="polite"></div>';
  });

  function render() {
    const active = document.activeElement;
    const key = active && active.dataset ? active.dataset.key : null;

    renderClock();
    renderElder();
    renderCare();

    if (key) {
      const again = document.querySelector(`[data-key="${CSS.escape(key)}"]`);
      if (again && !again.disabled) again.focus({ preventScroll: true });
    }
  }

  function renderToast(where) {
    const region = (where === "elder" ? elderEl : careEl).querySelector(".toast-region");
    const t = ui.toast[where];
    if (!t) { region.innerHTML = ""; return; }
    region.innerHTML = `<div class="toast"><span>${esc(t.msg)}</span>${t.actionLabel ? `<button type="button" data-act="toast-action" data-where="${where}">${esc(t.actionLabel)}</button>` : ""}</div>`;
  }

  // ---------- render: clock ----------
  const range = document.getElementById("clock-range");
  const readout = document.getElementById("clock-readout");
  function renderClock() {
    range.value = state.now;
    const d = today.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    readout.textContent = `${d}, ${clock(state.now)}`;
    range.setAttribute("aria-valuetext", clock(state.now));
  }

  // ---------- render: Amma's phone ----------
  function pillHTML(m) {
    const second = m.shape === "capsule" ? "--pill2:#FFFFFF;" : "";
    return `<span class="pill" data-shape="${m.shape}" style="--pill:${m.color};${second}" aria-hidden="true"></span>`;
  }

  function renderElder() {
    const t = L();
    elderEl.setAttribute("lang", state.lang);
    elderEl.style.setProperty("--scale", state.scale);
    const cur = currentSlot();
    const greetSlot = state.now < 12 * 60 ? "m" : state.now < 17 * 60 ? "a" : "n";
    const dateLine = today.toLocaleDateString(t.locale, { weekday: "long", day: "numeric", month: "long" });

    let card = "";
    if (cur.s === "done") {
      const first = SLOTS.find((s) => medsIn(s.id).length);
      card = `
        <div class="now-card" data-state="done">
          <p class="now-title">${esc(t.allDone)}</p>
          <p class="taken-line">${ICON.check}<span>${first ? esc(t.tomorrow(t.slot[first.id], elderTime(first.time))) : ""}</span></p>
        </div>`;
    } else {
      const slot = cur.slot;
      const title = cur.s === "missed" ? t.missed(t.slotOf[slot.id]) : cur.s === "upcoming" ? t.upcoming(elderTime(slot.time)) : t.due;
      const cardState = cur.s === "missed" ? "missed" : cur.s === "upcoming" ? "upcoming" : "due";
      const items = medsIn(slot.id).map((m) => {
        const q = m.pattern[slotIndex(slot.id)];
        const how = [t.qty(q), m.food === "any" ? "" : t.food[m.food]].filter(Boolean).join(", ");
        return `<li>${`<span class="pill-slot">${pillHTML(m)}</span>`}<span class="pill-name">${esc(m.name)} ${esc(m.strength.replace(/\s*mg$/, ""))}<span class="pill-how">${esc(how)}</span></span></li>`;
      }).join("");
      const canTake = cur.s !== "upcoming";
      card = `
        <div class="now-card" data-state="${cardState}">
          ${state.nudge && cur.s === "missed" ? `<p class="now-when">${ICON.phone}<span>${esc(t.nudge)}</span></p>` : ""}
          <p class="now-when">${ICON[slot.id]}<span>${esc(t.at(t.slot[slot.id], elderTime(slot.time)))}</span></p>
          <h2 class="now-title">${esc(title)}</h2>
          <ul class="pill-list">${items}</ul>
          <button type="button" class="big-btn" data-act="take" data-slot="${slot.id}" data-key="take" ${canTake ? "" : "disabled"}>
            ${canTake ? ICON.check : ""}<span>${esc(canTake ? t.took : t.notYet)}</span>
          </button>
          <button type="button" class="quiet-btn" data-act="read" data-key="read">${ICON.speak}<span>${esc(t.read)}</span></button>
        </div>`;
    }

    const laterRows = SLOTS.filter((s) => medsIn(s.id).length).map((s) => {
      const st = slotStatus(0, s);
      const label = st.s === "taken" || st.s === "late" ? t.taken : st.s === "missed" ? t.notTaken : t.count(tabletsIn(s.id));
      const state = st.s === "late" ? "taken" : st.s;
      return `<li data-state="${state}"><span>${esc(t.at(t.slot[s.id], elderTime(s.time)))}</span><span class="later-count">${esc(label)}</span></li>`;
    }).join("");

    const langBtns = Object.keys(T).map((k) =>
      `<button type="button" data-act="lang" data-lang="${k}" data-key="lang-${k}" aria-pressed="${state.lang === k}" lang="${k}" aria-label="${T[k].name}">${T[k].short}</button>`).join("");
    const sizeBtns = [1, 1.25, 1.5].map((s, i) =>
      `<button type="button" data-act="scale" data-scale="${s}" data-key="scale-${i}" aria-pressed="${state.scale === s}" aria-label="${Math.round(s * 100)}%">A</button>`).join("");

    elderEl.querySelector(".scr-body").innerHTML = `
      <div class="scr-top"><span class="scr-brand">saathi</span></div>
      <div class="elder-tools">
        <div class="seg" role="group" aria-label="${esc(t.lang)}">${langBtns}</div>
        <div class="seg size-seg" role="group" aria-label="${esc(t.size)}">${sizeBtns}</div>
      </div>
      <p class="greet">${esc(t.greet[greetSlot])}<small>${esc(dateLine)}</small></p>
      ${card}
      <section class="later" aria-label="${esc(t.later)}">
        <h3>${esc(t.later)}</h3>
        <ul>${laterRows}</ul>
      </section>
      <div class="call"><button type="button" class="quiet-btn" data-act="call-rahul" data-key="call-rahul">${ICON.phone}<span>${esc(t.call)}</span></button></div>
      <div style="height:1rem"></div>`;
  }

  // ---------- render: Rahul's phone ----------
  function doseHTML(pattern) {
    const parts = pattern.map((q) => `<b ${q === 0 ? "data-zero" : ""}>${qtyText(q)}</b>`);
    const label = pattern.map((q, i) => `${qtyText(q)} ${SLOT_EN[SLOTS[i].id]}`).join(", ");
    return `<span class="dose" role="img" aria-label="${label}">${parts.join('<i aria-hidden="true">–</i>')}</span>`;
  }

  function weekStats(days = 7) {
    let due = 0, taken = 0;
    const misses = [], lates = [];
    for (let d = days - 1; d >= 0; d--) {
      SLOTS.forEach((s) => {
        const st = slotStatus(d, s);
        if (st.s === "none" || st.s === "upcoming" || st.s === "due") return;
        due++;
        if (st.s === "taken" || st.s === "late") taken++;
        if (st.s === "late") lates.push({ d, s });
        if (st.s === "missed") misses.push({ d, s });
      });
    }
    return { due, taken, misses, lates };
  }
  const shortDate = (offset) => dateOf(offset).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

  function renderCare() {
    const cur = currentSlot();
    let status, tone = "", alert = "";
    const todayMissed = SLOTS.filter((s) => slotStatus(0, s).s === "missed");

    if (cur.s === "missed") {
      const mins = state.now - cur.slot.time;
      tone = "alert";
      status = `Amma hasn’t taken her ${SLOT_EN[cur.slot.id]} medicines yet.`;
      alert = `
        <div class="alert-box" role="status">
          <p>They were due at ${clock(cur.slot.time)}, ${mins} minutes ago.${state.nudge === cur.slot.id ? " Reminder sent to her phone." : ""}</p>
          <div class="alert-actions">
            <button type="button" class="btn btn-solid" data-act="call-amma" data-key="call-amma">Call Amma</button>
            <button type="button" class="btn" data-act="nudge" data-slot="${cur.slot.id}" data-key="nudge" ${state.nudge === cur.slot.id ? "disabled" : ""}>${state.nudge === cur.slot.id ? "Reminder sent" : "Send a reminder"}</button>
          </div>
        </div>`;
    } else if (cur.s === "done") {
      const s = weekStats(1);
      status = s.misses.length ? `Amma is done for today. She missed her ${s.misses.map((m) => SLOT_EN[m.s.id]).join(" and ")} medicines.` : "Amma has taken all of today’s medicines.";
    } else if (cur.s === "due") {
      status = `Amma’s ${SLOT_EN[cur.slot.id]} medicines are due at ${clock(cur.slot.time)}.`;
    } else {
      const lastTaken = [...SLOTS].reverse().find((s) => state.log[dayKey(0)][s.id]);
      status = lastTaken
        ? `Amma took her ${SLOT_EN[lastTaken.id]} medicines at ${clock(state.log[dayKey(0)][lastTaken.id].at)}.`
        : `Amma’s first medicines are at ${clock(cur.slot.time)}.`;
    }
    if (cur.s !== "missed" && todayMissed.length && cur.s !== "done") {
      status += ` Her ${todayMissed.map((s) => SLOT_EN[s.id]).join(" and ")} dose was missed.`;
    }

    const todayRow = SLOTS.map((s) => {
      const st = slotStatus(0, s);
      const what = { taken: `Taken ${clock(st.at)}`, late: `Taken late, ${clock(st.at)}`, due: `Due ${clock(s.time)}`, upcoming: clock(s.time), missed: "Not taken", none: "Nothing" }[st.s];
      const shown = st.s === "late" ? "taken" : st.s;
      return `<div class="slot" data-state="${shown}"><b>${SLOT_EN_CAP[s.id]}</b><span>${esc(what)}</span></div>`;
    }).join("");

    const markLabel = (st, s) => {
      const name = SLOT_EN_CAP[s.id];
      return { taken: `${name}: taken at ${clock(st.at)}`, late: `${name}: taken late at ${clock(st.at)}`, missed: `${name}: missed`, due: `${name}: due now`, upcoming: `${name}: later today`, none: `${name}: no medicines` }[st.s];
    };
    let weekRows = "";
    for (let d = 6; d >= 0; d--) {
      let due = 0, got = 0;
      const cells = SLOTS.map((s) => {
        const st = slotStatus(d, s);
        if (!["none", "upcoming", "due"].includes(st.s)) { due++; if (st.s !== "missed") got++; }
        return `<td><span class="mark" data-s="${st.s}" role="img" aria-label="${esc(markLabel(st, s))}"></span></td>`;
      }).join("");
      const label = d === 0 ? "Today" : dateOf(d).toLocaleDateString("en-IN", { weekday: "short" });
      weekRows += `<tr ${d === 0 ? "data-today" : ""}><th scope="row">${label}</th>${cells}<td class="pct">${due ? `${got}/${due}` : "–"}</td></tr>`;
    }
    const ws = weekStats();

    const refills = [...state.meds].sort((a, b) => a.stock / dailyQty(a) - b.stock / dailyQty(b)).map((m) => {
      const days = Math.floor(m.stock / dailyQty(m));
      const low = days <= 7;
      const pct = Math.min(100, Math.round((days / 30) * 100));
      const action = state.reordered[m.id]
        ? `<span class="reordered">Reorder sent</span>`
        : low ? `<button type="button" class="btn btn-small" data-act="reorder" data-med="${m.id}" data-key="reorder-${m.id}">Reorder</button>` : "";
      return `<li ${low ? "data-low" : ""}>
        <div class="refill-top"><b>${esc(m.name)}</b><span><em>${days === 1 ? "1 day left" : `${days} days left`}</em> ${action}</span></div>
        <div class="bar" aria-hidden="true"><i style="width:${pct}%"></i></div>
      </li>`;
    }).join("");

    const medRows = state.meds.map((m) => `
      <li><span class="pill-slot">${pillHTML(m)}</span>
        <span><b>${esc(m.name)} ${esc(m.strength)}</b><span>${esc(m.purpose ? `${m.purpose}, ` : "")}${m.food === "any" ? "any time" : `${m.food} food`}</span></span>
        ${doseHTML(m.pattern)}</li>`).join("");

    careEl.querySelector(".scr-body").innerHTML = `
      <div class="scr-top">
        <div class="care-who"><span class="avatar" aria-hidden="true">A</span><span><b>Amma</b><span>Jayanagar, Bengaluru</span></span></div>
        <span class="scr-brand">saathi</span>
      </div>
      <p class="status" data-tone="${tone}">${esc(status)}</p>
      ${alert}
      <div class="today-row" role="list" aria-label="Today">${todayRow.replaceAll('<div class="slot"', '<div role="listitem" class="slot"')}</div>

      <section class="care-section" aria-labelledby="wk">
        <div class="care-section-head"><h3 id="wk">This week</h3><p>${ws.taken} of ${ws.due} doses taken</p></div>
        <table class="week">
          <thead><tr><th scope="col"><span class="sr-only">Day</span></th><th scope="col">Morning</th><th scope="col">Afternoon</th><th scope="col">Night</th><th scope="col" class="pct">Taken</th></tr></thead>
          <tbody>${weekRows}</tbody>
        </table>
        <div class="legend" aria-hidden="true">
          <span><i class="mark" data-s="taken"></i>Taken</span>
          <span><i class="mark" data-s="late"></i>Late</span>
          <span><i class="mark" data-s="missed"></i>Missed</span>
          <span><i class="mark" data-s="upcoming"></i>Later</span>
        </div>
      </section>

      <section class="care-section" aria-labelledby="rf">
        <div class="care-section-head"><h3 id="rf">Refills</h3><p>At today’s doses</p></div>
        <ul class="refills">${refills}</ul>
      </section>

      <section class="care-section" aria-labelledby="md">
        <div class="care-section-head"><h3 id="md">Medicines</h3><p>Morning–afternoon–night</p></div>
        <ul class="med-list">${medRows}</ul>
      </section>

      <div class="care-actions">
        <button type="button" class="btn btn-solid" data-act="add-med" data-key="add-med">Add a medicine</button>
        <button type="button" class="btn" data-act="summary" data-key="summary">Share with Amma’s doctor</button>
      </div>`;
  }

  // ---------- modals ----------
  const layer = document.getElementById("modal-layer");
  let lastFocus = null;

  function openModal(html, labelId) {
    lastFocus = document.activeElement;
    layer.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="${labelId}">${html}</div>`;
    layer.hidden = false;
    const first = layer.querySelector("input, button");
    if (first) first.focus();
  }
  function closeModal() {
    layer.hidden = true;
    layer.innerHTML = "";
    ui.modal = null;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  // Add-medicine form state lives here while the dialog is open.
  let draft = null;
  function openAddMed() {
    draft = { name: "", strength: "", pattern: [1, 0, 0], food: "after", shape: "round", color: "#FFFFFF", stock: "", errors: {} };
    ui.modal = "add";
    openModal(addMedHTML(), "add-title");
  }
  const CYCLE = [0, 1, 2, 0.5];
  function addMedHTML() {
    const e = draft.errors;
    const picker = SLOTS.map((s, i) => `
      <button type="button" data-act="cycle" data-i="${i}" data-q="${draft.pattern[i]}" aria-label="${SLOT_EN_CAP[s.id]}: ${qtyText(draft.pattern[i])} tablet${draft.pattern[i] === 1 ? "" : "s"}. Tap to change.">
        <b>${qtyText(draft.pattern[i])}</b><span>${SLOT_EN_CAP[s.id]}</span>
      </button>`).join("");
    const food = [["before", "Before food"], ["after", "After food"], ["any", "Any time"]].map(([v, l]) =>
      `<button type="button" data-act="food" data-v="${v}" aria-pressed="${draft.food === v}">${l}</button>`).join("");
    const shapes = SHAPES.map((s) =>
      `<button type="button" data-act="shape" data-v="${s.id}" aria-pressed="${draft.shape === s.id}">${s.label}</button>`).join("");
    const colors = PILL_COLORS.map((c) =>
      `<button type="button" data-act="color" data-v="${c.hex}" aria-pressed="${draft.color === c.hex}"><span class="swatch" style="--sw:${c.hex}" aria-hidden="true"></span>${c.label}</button>`).join("");
    return `
      <h2 id="add-title">Add a medicine</h2>
      <p class="sub">It shows up on Amma’s phone as soon as you save.</p>
      <form id="add-form" novalidate>
        <div class="field">
          <label for="f-name">Medicine name</label>
          <input id="f-name" type="text" autocomplete="off" value="${esc(draft.name)}" ${e.name ? 'aria-invalid="true" aria-describedby="f-name-err"' : ""} placeholder="As written on the strip">
          ${e.name ? `<p class="error" id="f-name-err">${e.name}</p>` : ""}
        </div>
        <div class="row2">
          <div class="field">
            <label for="f-strength">Strength</label>
            <input id="f-strength" type="text" autocomplete="off" value="${esc(draft.strength)}" placeholder="e.g. 5 mg">
          </div>
          <div class="field">
            <label for="f-stock">Tablets at home</label>
            <input id="f-stock" type="number" inputmode="numeric" min="0" value="${esc(draft.stock)}" ${e.stock ? 'aria-invalid="true" aria-describedby="f-stock-err"' : ""} placeholder="e.g. 30">
            ${e.stock ? `<p class="error" id="f-stock-err">${e.stock}</p>` : ""}
          </div>
        </div>
        <fieldset class="field">
          <legend>How many, and when</legend>
          <div class="dose-picker">${picker}</div>
          <p class="dose-readout">Prescription reads ${doseHTML(draft.pattern)}</p>
          ${e.pattern ? `<p class="error">${e.pattern}</p>` : ""}
        </fieldset>
        <fieldset class="field"><legend>Food</legend><div class="chips">${food}</div></fieldset>
        <fieldset class="field"><legend>What it looks like</legend>
          <div class="chips">${shapes}</div>
          <div class="chips" style="margin-top:.5rem">${colors}</div>
          <p class="hint">Amma sees this drawing next to the name. <span style="vertical-align:middle;display:inline-flex;margin-left:.35rem">${pillHTML(draft)}</span></p>
        </fieldset>
        <div class="modal-actions">
          <button type="button" class="btn" data-act="close">Cancel</button>
          <button type="submit" class="btn btn-solid">Save medicine</button>
        </div>
      </form>`;
  }
  function syncDraftFromInputs() {
    const n = layer.querySelector("#f-name"), s = layer.querySelector("#f-strength"), k = layer.querySelector("#f-stock");
    if (n) draft.name = n.value;
    if (s) draft.strength = s.value;
    if (k) draft.stock = k.value;
  }
  function rerenderAddMed(focusSel) {
    const scroll = layer.querySelector(".modal").scrollTop;
    layer.querySelector(".modal").innerHTML = addMedHTML();
    layer.querySelector(".modal").scrollTop = scroll;
    const el = focusSel && layer.querySelector(focusSel);
    if (el) el.focus();
  }
  function submitAddMed() {
    syncDraftFromInputs();
    const errors = {};
    if (!draft.name.trim()) errors.name = "Enter the medicine name as it’s printed on the strip.";
    if (!draft.pattern.some((q) => q > 0)) errors.pattern = "Choose at least one time of day.";
    const stock = draft.stock === "" ? 30 : Number(draft.stock);
    if (!Number.isFinite(stock) || stock < 0) errors.stock = "Enter a number of tablets, or leave it empty.";
    draft.errors = errors;
    if (Object.keys(errors).length) {
      rerenderAddMed(errors.name ? "#f-name" : errors.stock ? "#f-stock" : '[data-act="cycle"]');
      return;
    }
    const strength = draft.strength.trim();
    state.meds.push({
      id: `m${Date.now()}`, name: draft.name.trim(), strength, pattern: draft.pattern.slice(),
      food: draft.food, shape: draft.shape, color: draft.color, stock: Math.round(stock), purpose: "",
    });
    const name = draft.name.trim();
    closeModal();
    commit();
    toast("care", `Added ${name}. It’s on Amma’s phone now.`);
  }

  function openSummary() {
    ui.modal = "summary";
    const ws = weekStats();
    const pct = ws.due ? Math.round((ws.taken / ws.due) * 100) : 100;
    const list = (arr) => arr.map((x) => `${SLOT_EN_CAP[x.s.id]} on ${shortDate(x.d)}`).join("; ");
    const lines = [
      `Saathi summary for Amma, ${shortDate(6)} to ${shortDate(0)}`,
      ``,
      `Doses taken: ${ws.taken} of ${ws.due} (${pct}%)`,
      ws.misses.length ? `Missed: ${list(ws.misses)}` : `Missed: none`,
      ws.lates.length ? `Taken more than ${LATE_AFTER} min late: ${list(ws.lates)}` : null,
      ``,
      `Current medicines (morning–afternoon–night):`,
      ...state.meds.map((m) => `• ${m.name} ${m.strength}  ${m.pattern.map(qtyText).join("–")}, ${m.food === "any" ? "any time" : `${m.food} food`}`),
    ].filter((l) => l !== null);
    const text = lines.join("\n");
    openModal(`
      <h2 id="sum-title">Share with Amma’s doctor</h2>
      <p class="sub">A plain summary of the last 7 days. Copy it into WhatsApp or show it at the clinic.</p>
      <div class="summary" id="summary-text">${esc(text)}</div>
      <div class="modal-actions">
        <button type="button" class="btn" data-act="close">Close</button>
        <button type="button" class="btn btn-solid" data-act="copy">Copy summary</button>
      </div>`, "sum-title");
    layer.dataset.text = text;
  }

  // ---------- events ----------
  range.addEventListener("input", () => {
    state.now = Number(range.value);
    if (state.nudge && !(currentSlot().s === "missed")) state.nudge = null;
    commit();
  });

  document.getElementById("reset-demo").addEventListener("click", () => {
    state = freshState();
    ui.toast = { elder: null, care: null };
    renderToast("elder"); renderToast("care");
    commit();
  });

  document.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-act]");
    if (!btn) return;
    const act = btn.dataset.act;
    switch (act) {
      case "take": take(btn.dataset.slot); break;
      case "read": {
        const cur = currentSlot(), t = L();
        if (cur.s === "done") { speak(t.allDone); break; }
        const intro = cur.s === "missed" ? t.missed(t.slotOf[cur.slot.id]) : cur.s === "upcoming" ? t.upcoming(elderTime(cur.slot.time)) : t.due;
        const pills = medsIn(cur.slot.id).map((m) => {
          const q = m.pattern[slotIndex(cur.slot.id)];
          return `${m.name}, ${t.qty(q)}${m.food === "any" ? "" : `, ${t.food[m.food]}`}`;
        });
        speak([intro, ...pills].join(". "));
        break;
      }
      case "lang": state.lang = btn.dataset.lang; commit(); break;
      case "scale": state.scale = Number(btn.dataset.scale); commit(); break;
      case "call-rahul": toast("elder", L().calling); break;
      case "call-amma": toast("care", "Calling Amma…"); break;
      case "nudge":
        state.nudge = btn.dataset.slot;
        commit();
        toast("elder", L().nudge);
        break;
      case "reorder": {
        const m = state.meds.find((x) => x.id === btn.dataset.med);
        state.reordered[m.id] = true;
        commit();
        toast("care", `Reorder for ${m.name} sent to Sri Lakshmi Medicals.`);
        break;
      }
      case "toast-action": {
        const t = ui.toast[btn.dataset.where];
        ui.toast[btn.dataset.where] = null;
        renderToast(btn.dataset.where);
        if (t && t.action) t.action();
        break;
      }
      case "add-med": openAddMed(); break;
      case "summary": openSummary(); break;
      case "close": closeModal(); break;
      case "copy": {
        const text = layer.dataset.text || "";
        const done = () => { btn.textContent = "Copied"; };
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => { btn.textContent = "Select the text to copy"; });
        else btn.textContent = "Select the text to copy";
        break;
      }
      case "cycle": {
        syncDraftFromInputs();
        const i = Number(btn.dataset.i);
        draft.pattern[i] = CYCLE[(CYCLE.indexOf(draft.pattern[i]) + 1) % CYCLE.length];
        delete draft.errors.pattern;
        rerenderAddMed(`[data-act="cycle"][data-i="${i}"]`);
        break;
      }
      case "food": case "shape": case "color": {
        syncDraftFromInputs();
        draft[act] = btn.dataset.v;
        rerenderAddMed(`[data-act="${act}"][data-v="${CSS.escape(btn.dataset.v)}"]`);
        break;
      }
    }
  });

  layer.addEventListener("input", (ev) => {
    const el = ev.target;
    if (el.getAttribute("aria-invalid") !== "true") return;
    el.removeAttribute("aria-invalid");
    const err = layer.querySelector(`#${el.id}-err`);
    if (err) err.remove();
    if (draft) delete draft.errors[el.id === "f-name" ? "name" : "stock"];
  });
  layer.addEventListener("submit", (ev) => { ev.preventDefault(); submitAddMed(); });
  layer.addEventListener("mousedown", (ev) => { if (ev.target === layer) closeModal(); });
  document.addEventListener("keydown", (ev) => {
    if (layer.hidden) return;
    if (ev.key === "Escape") { closeModal(); return; }
    if (ev.key !== "Tab") return;
    const f = [...layer.querySelectorAll("button, input")].filter((el) => !el.disabled);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  });

  // phone switcher on small screens
  const tabs = { elder: document.getElementById("tab-elder"), care: document.getElementById("tab-care") };
  const panels = { elder: document.getElementById("phone-elder"), care: document.getElementById("phone-care") };
  function setTab(which) {
    ui.tab = which;
    Object.keys(tabs).forEach((k) => {
      tabs[k].setAttribute("aria-selected", String(k === which));
      tabs[k].tabIndex = k === which ? 0 : -1;
      panels[k].dataset.hidden = String(k !== which);
    });
  }
  Object.entries(tabs).forEach(([k, el]) => {
    el.addEventListener("click", () => setTab(k));
    el.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowRight" || ev.key === "ArrowLeft") {
        const next = k === "elder" ? "care" : "elder";
        setTab(next); tabs[next].focus();
      }
    });
  });
  setTab("elder");

  render();
})();
