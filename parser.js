// Reads the text of an Indian prescription (typed, or recognised on the phone by OCR)
// and proposes medicines in morning–afternoon–night form. Nothing here is trusted
// blindly: every result goes to a confirmation screen before it is saved.

const FORM = /^\s*(?:\d+[.)]\s*)?(tab(?:let)?s?|cap(?:sule)?s?|t|c|syp|syr(?:up)?|inj|oint|drops?)\b\.?\s*/i;
const STRENGTH = /(\d+(?:\.\d+)?)\s*(mg|mcg|µg|g|iu|ml)\b/i;
// 1-0-1, 1 – 0 – 1, ½-0-½, 1/2-0-1/2, 1+0+1 (OCR often reads 1 as l, I or |, and 0 as O)
const QTY = "(?:1\\/2|½|[0-2lI|Oo])";
const PATTERN = new RegExp(`(?:^|[^\\w/])(${QTY})\\s*[-–—+xX]\\s*(${QTY})\\s*[-–—+xX]\\s*(${QTY})(?![\\w/])`);
const FREQ = [
  [/\b(?:tds|tid|thrice(?: a day| daily)?|three times)\b/i, [1, 1, 1]],
  [/\b(?:qid|four times)\b/i, [1, 1, 1], "Four times a day: check the afternoon and evening doses with the doctor."],
  [/\b(?:bd|bid|twice(?: a day| daily)?|two times)\b/i, [1, 0, 1]],
  [/\b(?:hs|at bed ?time|bedtime|at night|night only)\b/i, [0, 0, 1]],
  [/\b(?:od|once(?: a day| daily)?|morning only|in the morning)\b/i, [1, 0, 0]],
];
const SOS = /\b(?:sos|prn|as needed|when required|if needed)\b/i;
const BEFORE = /\b(?:ac|a\/c|before (?:food|meals?|breakfast|lunch|dinner)|empty stomach|bbf|khali pet)\b/i;
const AFTER = /\b(?:pc|p\/c|after (?:food|meals?|breakfast|lunch|dinner)|with (?:food|meals?))\b/i;
const DAYS = /(?:[x×*]\s*|for\s+|\()\s*(\d{1,3})\s*(days?|d|weeks?|wks?|months?|m)\b/i;

function qty(s) {
  const t = s.replace(/[lI|]/g, "1").replace(/[Oo]/g, "0");
  return t === "1/2" || t === "½" ? 0.5 : Number(t);
}

function clean(name) {
  return name
    .replace(/[^\p{L}\p{N}+\-\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b([a-z])/g, (c) => c.toUpperCase());
}

export function parseLine(raw) {
  const line = raw.replace(/\s+/g, " ").trim();
  if (line.length < 4) return null;
  const form = line.match(FORM);
  const m = line.match(PATTERN);
  let pattern = m ? [qty(m[1]), qty(m[2]), qty(m[3])] : null;
  let note = "";
  if (!pattern) {
    for (const [re, p, n] of FREQ) if (re.test(line)) { pattern = p.slice(); note = n || ""; break; }
  }
  const sos = SOS.test(line);
  // A line is a medicine if it starts like one (Tab/Cap…) or carries a dosing schedule.
  if (!form && !pattern) return null;
  if (pattern && pattern.some((q) => Number.isNaN(q) || q > 2)) return null;

  let rest = form ? line.slice(form[0].length) : line;
  const cut = [rest.search(PATTERN), rest.search(STRENGTH), ...FREQ.map(([re]) => rest.search(re)), rest.search(BEFORE), rest.search(AFTER), rest.search(DAYS), rest.search(SOS)]
    .filter((i) => i > 0);
  const end = cut.length ? Math.min(...cut) : rest.length;
  let name = rest.slice(0, end);
  let strength = "";
  const s = rest.match(STRENGTH);
  if (s) strength = `${s[1]} ${s[2].toLowerCase().replace("µg", "mcg")}`;
  else {
    // Brand names often carry a bare number: "Telma 40", "Pan 40".
    const bare = name.match(/^(.*?\D)\s+(\d{1,4})\s*$/);
    if (bare) { name = bare[1]; strength = `${bare[2]} mg`; }
  }
  name = clean(name);
  if (!name || name.length < 2 || /^\d+$/.test(name)) return null;

  const food = BEFORE.test(line) ? "before" : AFTER.test(line) ? "after" : "any";
  const d = line.match(DAYS);
  let days = null;
  if (d) {
    const n = Number(d[1]), unit = d[2].toLowerCase();
    days = unit.startsWith("w") ? n * 7 : unit.startsWith("m") ? n * 30 : n;
  }
  const confidence = (form ? 1 : 0) + (m ? 2 : pattern ? 1 : 0) + (strength ? 1 : 0);
  return {
    name,
    strength,
    pattern: sos ? [0, 0, 0] : pattern || [1, 0, 0],
    food,
    days,
    sos,
    note: sos ? "Only when needed: Saathi won't schedule it." : note || (!pattern ? "No schedule found: check the timing." : ""),
    confidence, // 0–4: shown as "check this" below 3
    raw: line,
  };
}

export function parsePrescription(text) {
  const out = [];
  const seen = new Set();
  for (const raw of text.split(/\r?\n/)) {
    const r = parseLine(raw);
    if (!r) continue;
    const key = `${r.name.toLowerCase()}|${r.strength}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}
