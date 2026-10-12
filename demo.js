// The judges' tour: both phones on one page, one shared state, and a clock to scrub the day.
import {
  S, SLOTS, SLOT_EN, L, clock, dayKey, todayLog, medsIn, slotIndex, currentSlot,
  mountScreen, toast, renderToast, renderElder, renderCare, openAddMed, openSummary,
  installModalKeys, speak, readAloudText, withFocus, startOfToday,
} from "./core.js";

const STORE_KEY = "saathi-demo-v2";

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

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && s.log && s.log[dayKey(0)] ? s : null; // a demo saved on another day starts fresh
  } catch { return null; }
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S.state)); } catch { /* storage unavailable: demo still works */ }
}

S.today = startOfToday();
S.state = load() || freshState();

const elder = mountScreen(document.getElementById("elder"));
const care = mountScreen(document.getElementById("care"));
const range = document.getElementById("clock-range");
const readout = document.getElementById("clock-readout");

function render() {
  withFocus(() => {
    range.value = S.state.now;
    const d = S.today.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    readout.textContent = `${d}, ${clock(S.state.now)}`;
    range.setAttribute("aria-valuetext", clock(S.state.now));
    renderElder(elder, { name: L().amma, caregiver: "Rahul" });
    renderCare(care, { name: "Amma", place: "Jayanagar, Bengaluru" });
  });
}
function commit() { save(); render(); }

function take(slotId) {
  const prev = S.state.meds.map((m) => m.stock);
  todayLog()[slotId] = { at: S.state.now };
  medsIn(slotId).forEach((m) => { m.stock = Math.max(0, m.stock - m.pattern[slotIndex(slotId)]); });
  S.state.nudge = null;
  toast(elder, L().saved("Rahul"), L().undo, () => {
    delete todayLog()[slotId];
    S.state.meds.forEach((m, i) => { if (prev[i] !== undefined) m.stock = prev[i]; });
    commit();
  });
  toast(care, `Amma took her ${SLOT_EN[slotId]} medicines at ${clock(S.state.now)}.`);
  commit();
}

range.addEventListener("input", () => {
  S.state.now = Number(range.value);
  if (S.state.nudge && currentSlot().s !== "missed") S.state.nudge = null;
  commit();
});

document.getElementById("reset-demo").addEventListener("click", () => {
  S.state = freshState();
  elder.toast = care.toast = null;
  renderToast(elder); renderToast(care);
  commit();
});

document.addEventListener("click", (ev) => {
  const btn = ev.target.closest("[data-act]");
  if (!btn || btn.closest("#modal-layer")) return;
  switch (btn.dataset.act) {
    case "take": take(btn.dataset.slot); break;
    case "read": speak(readAloudText(), () => toast(elder, L().noVoice)); break;
    case "lang": S.state.lang = btn.dataset.lang; commit(); break;
    case "scale": S.state.scale = Number(btn.dataset.scale); commit(); break;
    case "call-carer": toast(elder, L().calling("Rahul")); break;
    case "call-elder": toast(care, "Calling Amma…"); break;
    case "nudge":
      S.state.nudge = btn.dataset.slot;
      commit();
      toast(elder, L().nudge("Rahul"));
      break;
    case "reorder": {
      const m = S.state.meds.find((x) => x.id === btn.dataset.med);
      S.state.reordered[m.id] = true;
      commit();
      toast(care, `Reorder for ${m.name} sent to Sri Lakshmi Medicals.`);
      break;
    }
    case "add-med":
      openAddMed((meds) => {
        S.state.meds.push(...meds);
        commit();
        toast(care, meds.length === 1 ? `Added ${meds[0].name}. It’s on Amma’s phone now.` : `Added ${meds.length} medicines. They’re on Amma’s phone now.`);
      });
      break;
    case "summary": openSummary("Amma"); break;
  }
});

// phone switcher on small screens
const tabs = { elder: document.getElementById("tab-elder"), care: document.getElementById("tab-care") };
const panels = { elder: document.getElementById("phone-elder"), care: document.getElementById("phone-care") };
function setTab(which) {
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
installModalKeys();
render();
