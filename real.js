// The real app: one phone, one role. Amma's phone is the source of truth and publishes
// only what she agreed to share, sealed with a key that never leaves the two phones.
import {
  S, SLOTS, SLOT_EN, T, L, ICON, LATE_AFTER, esc, clock, dayKey, todayLog, medsIn, slotIndex, currentSlot,
  mountScreen, toast, renderElder, renderCare, openAddMed, openSummary, openModal, closeModal,
  installModalKeys, speak, readAloudText, withFocus, startOfToday, minutesNow, pillHTML, doseHTML, elderTime,
} from "./core.js";
import * as sync from "./sync.js";

const KEY = "saathi-app-v1";
const screen = mountScreen(document.getElementById("screen"));

// ---------- persistence ----------
const blank = () => ({
  role: null, h: null, paused: false, consent: { names: false, manage: false },
  profile: { name: "", caregiver: "" },
  state: { meds: [], log: {}, lang: "en", scale: 1 },
  notified: {}, nudge: null,
  care: { myName: "", label: "", reordered: {}, everHad: false, nudged: {} },
});
let db = load();
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...blank(), ...JSON.parse(raw) }; } catch { /* private mode */ }
  return blank();
}
function persist() {
  // keep 60 days of history on the phone
  const keys = Object.keys(db.state.log).sort();
  keys.slice(0, Math.max(0, keys.length - 60)).forEach((k) => delete db.state.log[k]);
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* storage full or blocked: keep running in memory */ }
}

let view = "home";
let snapshot = null;     // caregiver: last snapshot from Amma's phone
let snapError = "";
let unsubs = [];

// ---------- clock ----------
function tick() {
  const today = startOfToday();
  if (today.getTime() !== S.today.getTime()) S.today = today;
  if (S.state) S.state.now = minutesNow();
}

// ---------- Amma's side ----------
function elderState() {
  S.state = { ...db.state, now: minutesNow(), reordered: {}, nudge: db.nudge };
  db.state = S.state; // same object: edits through S.state persist
}

function snapshotForFamily() {
  if (db.paused) return { v: 1, name: db.profile.name, paused: true, lastSeen: Date.now() };
  const recent = {};
  for (let d = 0; d < 8; d++) if (db.state.log[dayKey(d)]) recent[dayKey(d)] = db.state.log[dayKey(d)];
  const meds = db.state.meds.map((m, i) => (db.consent.names ? m : {
    id: m.id, name: `Medicine ${String.fromCharCode(65 + (i % 26))}`, strength: "", pattern: m.pattern, food: m.food,
    shape: "round", color: "#FFFFFF", stock: m.stock, purpose: "",
  }));
  return { v: 1, name: db.profile.name, consent: db.consent, meds, log: recent, nudge: db.nudge, since: db.state.since, lastSeen: Date.now() };
}

let pubTimer = null;
function publishSoon() {
  if (db.role !== "elder" || !db.h) return;
  clearTimeout(pubTimer);
  pubTimer = setTimeout(() => sync.publish(db.h, snapshotForFamily()).catch(() => {}), 600);
}

function commit() { persist(); publishSoon(); render(); }

function startElderSync() {
  stopSync();
  if (!db.h) return;
  sync.watchInbox(db.h, (msg) => {
    const t = L();
    if (msg.type === "hello" && msg.name) {
      db.profile.caregiver = String(msg.name).slice(0, 40);
      commit();
      if (view === "pair") toast(screen, t.paired(db.profile.caregiver));
    } else if (msg.type === "nudge" && SLOTS.some((s) => s.id === msg.slot)) {
      db.nudge = msg.slot;
      S.state.nudge = msg.slot;
      commit();
      toast(screen, t.nudge(carer()));
      notify(t.nudge(carer()), readAloudText());
    } else if (msg.type === "addMeds" && db.consent.manage && Array.isArray(msg.meds)) {
      db.state.meds.push(...msg.meds.slice(0, 20).map(cleanMed));
      commit();
    }
  }).then((u) => unsubs.push(u)).catch(() => {});
  publishSoon();
}
function cleanMed(m) {
  const n = (x) => (Number.isFinite(Number(x)) ? Math.max(0, Math.min(Number(x), 2)) : 0);
  return {
    id: String(m.id || `m${Date.now()}`).slice(0, 40), name: String(m.name || "Medicine").slice(0, 60), strength: String(m.strength || "").slice(0, 20),
    pattern: [n(m.pattern?.[0]), n(m.pattern?.[1]), n(m.pattern?.[2])], food: ["before", "after", "any"].includes(m.food) ? m.food : "any",
    shape: ["round", "oval", "capsule", "small"].includes(m.shape) ? m.shape : "round",
    color: /^#[0-9A-Fa-f]{6}$/.test(m.color) ? m.color : "#FFFFFF", stock: Math.max(0, Math.min(Number(m.stock) || 30, 999)), purpose: "",
  };
}
const carer = () => db.profile.caregiver || (L() === T.en ? "your family" : L() === T.hi ? "परिवार" : "ಕುಟುಂಬ");

function take(slotId) {
  const prev = S.state.meds.map((m) => m.stock);
  todayLog()[slotId] = { at: S.state.now };
  medsIn(slotId).forEach((m) => { m.stock = Math.max(0, m.stock - m.pattern[slotIndex(slotId)]); });
  db.nudge = null; S.state.nudge = null;
  toast(screen, L().saved(db.h && !db.paused ? db.profile.caregiver : ""), L().undo, () => {
    delete todayLog()[slotId];
    S.state.meds.forEach((m, i) => { if (prev[i] !== undefined) m.stock = prev[i]; });
    commit();
  });
  commit();
}

// Reminders: shown while Saathi is open or installed and running. (True background push would need a server that can read the schedule, and we chose not to have one.)
function notify(title, body) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const opts = { body, icon: "icons/icon-192.png", badge: "icons/icon-192.png", tag: "saathi-dose", lang: S.state.lang };
  navigator.serviceWorker?.getRegistration().then((r) => (r ? r.showNotification(title, opts) : new Notification(title, opts))).catch(() => {});
}
function checkReminders() {
  if (db.role !== "elder") return;
  for (const s of SLOTS) {
    if (!medsIn(s.id).length || todayLog()[s.id]) continue;
    const k = `${dayKey(0)}-${s.id}`;
    if (S.state.now >= s.time && S.state.now <= s.time + LATE_AFTER + 60 && !db.notified[k]) {
      db.notified[k] = true;
      persist();
      notify(L().due, readAloudText());
    }
  }
}

function elderFooter() {
  const t = L();
  const needPerm = "Notification" in window && Notification.permission === "default";
  return `
    <div class="call elder-menu">
      <button type="button" class="quiet-btn" data-act="my-meds" data-key="my-meds">${ICON.list}<span>${esc(t.myMeds)}</span></button>
      <button type="button" class="quiet-btn" data-act="privacy" data-key="privacy">${ICON.eye}<span>${esc(t.whoSees)}</span></button>
      ${db.h ? "" : `<button type="button" class="quiet-btn" data-act="pair" data-key="pair">${ICON.phone}<span>${esc(t.share)}</span></button>`}
      ${needPerm ? `<button type="button" class="quiet-btn" data-act="perm" data-key="perm">${esc(t.remindersOn)}</button>` : ""}
    </div>`;
}
function privacyChip() {
  const t = L();
  const text = !db.h ? t.onlyHere : db.paused ? t.paused : db.profile.caregiver ? t.sharedWith(db.profile.caregiver) : t.waiting;
  return `<button type="button" class="privacy-chip" data-act="privacy" data-key="chip">${db.h && !db.paused ? ICON.eye : ICON.lock}<span>${esc(text)}</span></button>`;
}

function langTools() {
  const t = L();
  const langBtns = Object.keys(T).map((k) =>
    `<button type="button" data-act="lang" data-lang="${k}" data-key="lang-${k}" aria-pressed="${S.state.lang === k}" lang="${k}" aria-label="${T[k].name}">${T[k].short}</button>`).join("");
  return `<div class="elder-tools"><div class="seg" role="group" aria-label="${esc(t.lang)}">${langBtns}</div></div>`;
}

function renderWelcome() {
  const t = L();
  screen.el.setAttribute("lang", S.state.lang);
  screen.body.innerHTML = `
    <div class="scr-top"><span class="scr-brand">saathi</span></div>
    ${langTools()}
    <div class="sheet">
      <h1 class="sheet-title">${esc(t.welcome)}</h1>
      <div class="role-list">
        <button type="button" class="role-btn" data-act="role-elder">${ICON.check}<span>${esc(t.roleElder)}</span></button>
        <button type="button" class="role-btn" data-act="role-care">${ICON.phone}<span>${esc(t.roleCare)}</span></button>
      </div>
      <p class="sheet-note">${ICON.lock} Saathi has no accounts, no ads and no trackers. Your medicines stay on your phone unless you choose to share them.</p>
      <p class="sheet-note"><a href="./">See the guided demo</a></p>
    </div>`;
}

function renderSetup() {
  const t = L();
  screen.el.setAttribute("lang", S.state.lang);
  screen.body.innerHTML = `
    <div class="scr-top"><span class="scr-brand">saathi</span></div>
    ${langTools()}
    <form class="sheet" id="setup-form">
      <label class="sheet-title" for="s-name">${esc(t.nameQ)}</label>
      <input id="s-name" class="big-input" type="text" autocomplete="off" value="${esc(db.profile.name || t.amma)}" maxlength="30">
      <button type="submit" class="big-btn">${esc(t.next)}</button>
    </form>`;
}

function renderMeds() {
  const t = L();
  screen.el.setAttribute("lang", S.state.lang);
  const rows = db.state.meds.map((m) => `
    <li><span class="pill-slot">${pillHTML(m)}</span>
      <span><b>${esc(m.name)}${m.strength ? ` ${esc(m.strength)}` : ""}</b><span>${esc(t.food[m.food])}</span></span>
      ${doseHTML(m.pattern)}
      <button type="button" class="btn btn-small" data-act="remove-med" data-med="${esc(m.id)}">${esc(t.remove)}</button></li>`).join("");
  screen.body.innerHTML = `
    <div class="scr-top"><button type="button" class="back" data-act="home" data-key="back">← ${esc(t.back)}</button><span class="scr-brand">saathi</span></div>
    <div class="sheet">
      <h1 class="sheet-title">${esc(t.myMeds)}</h1>
      ${rows ? `<ul class="med-list med-list-elder">${rows}</ul>` : `<p class="sheet-note">${esc(t.noMeds)}</p>`}
      <button type="button" class="big-btn" data-act="add-med" data-key="add-med">${esc(t.addMeds)}</button>
    </div>`;
}

function toggle(id, label, on) {
  return `<label class="toggle"><input type="checkbox" data-consent="${id}" ${on ? "checked" : ""}><span class="toggle-ui" aria-hidden="true"></span><span>${esc(label)}</span></label>`;
}
function renderPrivacy() {
  const t = L();
  screen.el.setAttribute("lang", S.state.lang);
  const who = db.profile.caregiver;
  screen.body.innerHTML = `
    <div class="scr-top"><button type="button" class="back" data-act="home" data-key="back">← ${esc(t.back)}</button><span class="scr-brand">saathi</span></div>
    <div class="sheet">
      <h1 class="sheet-title">${esc(t.privTitle)}</h1>
      ${!db.h ? `
        <p class="sheet-lead">${ICON.lock} ${esc(t.onlyHere)}</p>
        <button type="button" class="big-btn" data-act="pair">${esc(t.share)}</button>` : `
        <p class="sheet-lead">${ICON.eye} ${esc(who ? t.privAlways(who) : t.prePair)}</p>
        <div class="toggles">
          ${toggle("names", who ? t.privNames(who) : t.namesFamily, db.consent.names)}
          ${who ? toggle("manage", t.privManage(who), db.consent.manage) : ""}
        </div>
        <p class="sheet-note">${ICON.lock} ${esc(t.privServer(who || carer()))}</p>
        <button type="button" class="quiet-btn" data-act="${db.paused ? "resume" : "pause"}">${esc(db.paused ? t.resume : t.pause)}</button>
        <button type="button" class="quiet-btn" data-act="stop">${esc(t.stop(who || carer()))}</button>`}
      <button type="button" class="quiet-btn danger" data-act="wipe">${esc(t.wipe)}</button>
    </div>`;
}

async function renderPair() {
  const t = L();
  screen.el.setAttribute("lang", S.state.lang);
  if (!db.h) { db.h = await sync.newHousehold(); persist(); startElderSync(); }
  const link = sync.pairLink(db.h);
  let svg = "";
  try {
    const qr = window.qrcode(0, "M");
    qr.addData(link); qr.make();
    svg = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
  } catch { svg = ""; }
  const who = db.profile.caregiver;
  screen.body.innerHTML = `
    <div class="scr-top"><button type="button" class="back" data-act="home" data-key="back">← ${esc(t.back)}</button><span class="scr-brand">saathi</span></div>
    <div class="sheet">
      <h1 class="sheet-title">${esc(t.share)}</h1>
      <p class="sheet-lead">${esc(t.prePair)}</p>
      <div class="toggles">${toggle("names", t.namesFamily, db.consent.names)}</div>
      <div class="qr" role="img" aria-label="QR code to pair a family member’s phone">${svg}</div>
      <p class="sheet-note">${esc(t.pairHint)}</p>
      <p class="pair-state" aria-live="polite">${who ? `${ICON.check} ${esc(t.paired(who))}` : esc(t.waiting)}</p>
      <button type="button" class="quiet-btn" data-act="copy-link">${esc(t.copyLink)}</button>
      <p class="sheet-note small">${esc(t.linkWarn)}</p>
      ${who ? `<button type="button" class="big-btn" data-act="home">${esc(t.done)}</button>` : ""}
    </div>`;
  screen.body.querySelector('[data-act="copy-link"]').onclick = (ev) => {
    navigator.clipboard?.writeText(link).then(() => { ev.currentTarget.textContent = t.copied; }, () => {});
  };
}

function confirmWipe() {
  const t = L();
  openModal(`
    <div lang="${S.state.lang}">
      <h2 id="wipe-title">${esc(t.wipe)}?</h2>
      <p class="sub">${esc(t.wipeConfirm)}</p>
      <p class="error" id="wipe-err" hidden></p>
      <div class="modal-actions">
        <button type="button" class="btn" data-mact="close">${esc(t.keep)}</button>
        <button type="button" class="btn btn-danger" data-mact="wipe-yes">${esc(t.wipeYes)}</button>
      </div>
    </div>`, "wipe-title");
  document.getElementById("modal-layer").onclick = async (ev) => {
    const b = ev.target.closest("[data-mact]");
    if (!b) return;
    if (b.dataset.mact === "close") { closeModal(); return; }
    b.disabled = true;
    try {
      if (db.h) await sync.wipe(db.h);
      stopSync();
      try { localStorage.removeItem(KEY); } catch { /* nothing stored */ }
      db = blank();
      closeModal();
      boot();
    } catch {
      const e = document.getElementById("wipe-err");
      e.hidden = false;
      e.textContent = "Couldn’t reach Saathi’s server, so nothing was deleted yet. Connect to the internet and try again.";
      b.disabled = false;
    }
  };
}

// ---------- the family's side ----------
function careState() {
  const snap = snapshot;
  S.state = {
    now: minutesNow(), lang: "en", scale: 1,
    meds: snap && !snap.paused ? snap.meds || [] : [],
    log: snap && !snap.paused ? snap.log || {} : {},
    reordered: db.care.reordered, nudge: snap?.nudge || null, since: snap?.since,
  };
}
function ago(ms) {
  const m = Math.round((Date.now() - ms) / 60000);
  return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} days ago`;
}
function startCareSync() {
  stopSync();
  sync.watchSnapshot(db.h, (snap) => {
    snapError = "";
    if (snap) { snapshot = snap; db.care.everHad = true; persist(); }
    else snapshot = db.care.everHad ? { gone: true } : null;
    render();
  }, (e) => { snapError = e.message || "Couldn’t connect."; render(); }).then((u) => unsubs.push(u)).catch(() => {});
}
function stopSync() { unsubs.forEach((u) => { try { u(); } catch { /* already closed */ } }); unsubs = []; }

function renderCareSetup() {
  screen.el.setAttribute("lang", "en");
  screen.body.innerHTML = `
    <div class="scr-top"><span class="scr-brand">saathi</span></div>
    <form class="sheet" id="care-form">
      <h1 class="sheet-title">You’re pairing with a family member’s phone</h1>
      <p class="sheet-lead">${ICON.lock} You’ll see what they choose to share. Everything is locked with a key that exists only on your two phones.</p>
      <div class="field"><label for="c-me">Your name, as they know you</label><input id="c-me" type="text" required maxlength="40" value="${esc(db.care.myName)}" placeholder="e.g. Rahul"></div>
      <div class="field"><label for="c-them">What do you call them?</label><input id="c-them" type="text" required maxlength="30" value="${esc(db.care.label)}" placeholder="e.g. Amma"></div>
      <p class="error" id="care-err" hidden></p>
      <button type="submit" class="big-btn">Pair phones</button>
    </form>`;
}

function renderCareHome() {
  const label = db.care.label || "Amma";
  const forget = `<button type="button" class="btn" data-act="forget">Remove ${esc(label)} from this phone</button>`;
  if (!snapshot || snapshot.gone || snapshot.paused) {
    S.state = { now: minutesNow(), lang: "en", scale: 1, meds: [], log: {}, reordered: {}, nudge: null };
    const msg = snapError ? `Couldn’t reach Saathi: ${snapError}`
      : !snapshot ? `Paired. Waiting for ${label}’s phone to send its first update…`
      : snapshot.gone ? `${label} stopped sharing, or deleted their data.`
      : `${label} has paused sharing.`;
    renderCare(screen, { name: label, place: snapshot?.lastSeen ? `Last update ${ago(snapshot.lastSeen)}` : "", statusOverride: msg, canAdd: false, canSummary: false, canCall: false, extraActions: forget });
    return;
  }
  careState();
  renderCare(screen, {
    name: label,
    place: `Last update from ${label}’s phone ${ago(snapshot.lastSeen)}`,
    canCall: false, canAdd: !!snapshot.consent?.manage, hideNames: !snapshot.consent?.names, extraActions: forget,
  });
}

// ---------- routing ----------
function render() {
  tick();
  withFocus(() => {
    if (!db.role) { S.state = S.state || { ...db.state, now: minutesNow() }; renderWelcome(); return; }
    if (db.role === "elder") {
      elderState();
      if (!db.profile.name) return renderSetup();
      if (view === "meds") return renderMeds();
      if (view === "privacy") return renderPrivacy();
      if (view === "pair") return void renderPair();
      return renderElder(screen, { name: db.profile.name, caregiver: carer(), top: privacyChip(), footer: elderFooter() });
    }
    if (!db.care.myName) return renderCareSetup();
    renderCareHome();
  });
}

function boot() {
  S.today = startOfToday();
  S.state = { ...db.state, now: minutesNow(), reordered: {}, nudge: null };
  const join = sync.readPairLink(location.hash);
  if (join) {
    history.replaceState(null, "", location.pathname); // the key must not linger in the address bar
    if (db.role === "elder" && db.h) {
      toast(screen, "This phone is already set up as the one taking medicines. Use another phone to pair.");
    } else {
      db = { ...blank(), role: "care", h: join, care: { ...blank().care, myName: db.care.myName } };
      persist();
    }
  }
  view = "home";
  if (db.role === "elder") startElderSync();
  if (db.role === "care" && db.care.myName) startCareSync();
  render();
}

// ---------- events ----------
document.addEventListener("click", (ev) => {
  const btn = ev.target.closest("[data-act]");
  if (!btn || btn.closest("#modal-layer")) return;
  const t = L();
  switch (btn.dataset.act) {
    case "role-elder": db.role = "elder"; persist(); render(); break;
    case "role-care":
      openModal(`
        <h2 id="howto">Pair with their phone</h2>
        <p class="sub">On their phone, open Saathi and tap <b>Share with family</b>. Then scan the QR code with this phone’s camera. Saathi opens and pairs by itself.</p>
        <div class="modal-actions"><button type="button" class="btn btn-solid" data-mact="close">OK</button></div>`, "howto");
      document.getElementById("modal-layer").onclick = (e) => { if (e.target.closest('[data-mact="close"]')) closeModal(); };
      break;
    case "lang": S.state.lang = btn.dataset.lang; db.state.lang = btn.dataset.lang; persist(); render(); break;
    case "scale": S.state.scale = Number(btn.dataset.scale); persist(); render(); break;
    case "take": take(btn.dataset.slot); break;
    case "read": speak(readAloudText(), () => toast(screen, t.noVoice)); break;
    case "home": view = "home"; render(); break;
    case "my-meds": view = "meds"; render(); break;
    case "privacy": view = "privacy"; render(); break;
    case "pair": view = "pair"; render(); break;
    case "perm": Notification.requestPermission().then(render); break;
    case "pause": db.paused = true; commit(); break;
    case "resume": db.paused = false; commit(); break;
    case "stop":
      sync.wipe(db.h).catch(() => {}).finally(() => {
        stopSync(); db.h = null; db.profile.caregiver = ""; db.paused = false; db.consent = { names: false, manage: false };
        commit();
      });
      break;
    case "wipe": confirmWipe(); break;
    case "remove-med":
      db.state.meds = db.state.meds.filter((m) => m.id !== btn.dataset.med);
      commit();
      break;
    case "add-med":
      if (db.role === "elder") {
        openAddMed((meds) => { db.state.meds.push(...meds); commit(); toast(screen, t.saved("")); },
          { subtitle: "It shows up on this phone right away." });
      } else {
        const label = db.care.label || "Amma";
        openAddMed((meds) => {
          sync.send(db.h, { type: "addMeds", meds }).then(() => toast(screen, `Sent to ${label}’s phone.`), () => toast(screen, "Couldn’t send. Check your connection."));
        }, { subtitle: `It appears on ${label}’s phone, because ${label} allowed you to manage medicines.` });
      }
      break;
    // family side
    case "nudge":
      sync.send(db.h, { type: "nudge", slot: btn.dataset.slot }).then(
        () => toast(screen, `Reminder sent to ${db.care.label || "Amma"}’s phone.`),
        () => toast(screen, "Couldn’t send. Check your connection."));
      btn.disabled = true;
      break;
    case "reorder": {
      db.care.reordered[btn.dataset.med] = true; persist(); render();
      toast(screen, "Marked as reordered.");
      break;
    }
    case "summary": careState(); openSummary(db.care.label || "Amma", !snapshot?.consent?.names); break;
    case "forget":
      stopSync();
      try { localStorage.removeItem(KEY); } catch { /* nothing stored */ }
      db = blank(); snapshot = null; boot();
      break;
  }
});

document.addEventListener("change", (ev) => {
  const c = ev.target.closest("[data-consent]");
  if (!c) return;
  db.consent[c.dataset.consent] = c.checked;
  commit();
});

document.addEventListener("submit", (ev) => {
  ev.preventDefault();
  if (ev.target.id === "setup-form") {
    const v = ev.target.querySelector("#s-name").value.trim();
    db.profile.name = v || L().amma;
    db.state.since = db.state.since || dayKey(0);
    commit();
  } else if (ev.target.id === "care-form") {
    const me = ev.target.querySelector("#c-me").value.trim();
    const them = ev.target.querySelector("#c-them").value.trim();
    const err = ev.target.querySelector("#care-err");
    if (!me || !them) { err.hidden = false; err.textContent = "Fill in both names so the two phones recognise each other."; return; }
    db.care.myName = me; db.care.label = them; persist();
    sync.send(db.h, { type: "hello", name: me }).catch(() => {});
    startCareSync();
    render();
  }
});

setInterval(() => { tick(); if (!document.hidden) { render(); checkReminders(); } }, 20000);
setInterval(publishSoon, 5 * 60 * 1000); // "last update" heartbeat for the family
document.addEventListener("visibilitychange", () => { if (!document.hidden) { tick(); render(); checkReminders(); } });

if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
installModalKeys();
boot();
checkReminders();
