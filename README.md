# Saathi

**Amma takes her medicines. You know she did.**

Saathi helps elderly parents take their medicines on time, in their own language, and lets their family see that they did, **without the server ever being able to read what they take.**

- **Guided demo** (both phones side by side, with a clock to scrub through a day): https://chxmq.github.io/saathi/
- **The real app** (one phone each, paired by QR code): https://chxmq.github.io/saathi/app.html

Built for HyperBloom October 2026 (UI/UX & Web Design). Runs entirely on free tiers.

## What it does
- **Amma's phone:** one big card for the next dose, tablets drawn the way they look in the strip, a 72px "I took them" button, English / हिन्दी / ಕನ್ನಡ, read aloud, text up to 150%, and dose reminders.
- **Scan a prescription on the phone:** OCR (Tesseract, WebAssembly) runs on the device, and a parser for Indian prescription shorthand (`1-0-1`, `½-0-½`, OD/BD/TDS/HS/SOS, AC/PC, "x 30 days") proposes medicines for a person to confirm. **The photo is never uploaded.**
- **The family's phone:** a one-line status for today, a week grid in the prescription's own `1–0–1` notation, refills as days left, an alert only after a dose is 30 minutes late, a reminder button, and a 7-day summary for the doctor.

## Privacy by design
| Principle | How |
|---|---|
| Amma decides | Before pairing, she sees in her own language what her family will see. Medicine names are **private by default**, and letting family manage medicines is a separate opt-in. She can pause, stop sharing, or delete everything. |
| End-to-end encryption | The pairing QR code carries a 256-bit AES-GCM key in the URL fragment, which browsers never send to a server. Firestore stores only `{c: ciphertext, iv, t}` ([rules](firebase/firestore.rules)). |
| Data minimisation | Amma's phone is the source of truth and publishes only what she consented to: the last 8 days, with medicine names replaced by "Medicine A, B…" unless she allows them. |
| Erasure | "Delete everything" removes the household from the server and the phone; the family's phone sees it disappear. |
| No third parties | No accounts, ads, analytics or trackers. Fonts, OCR engine and QR library are served from this site. The Firebase web key only works from this site, and only for Firestore. |

Designed around the principles of India's DPDP Act (consent, purpose limitation, erasure). This is a design prototype, not a certified medical device or legal compliance claim.

## How it fits together
```
Amma's phone ──sealed snapshot──▶ Firestore /h/{householdId}/s/state ──▶ family's phone
Amma's phone ◀──sealed inbox───── Firestore /h/{householdId}/in/*    ◀── family's phone
         (key lives only in the two phones, from the QR code)
```
Static site (GitHub Pages) with vanilla ES modules and no build step. `core.js` holds the shared logic and views, `demo.js` the guided tour, `real.js` the paired app, `sync.js` encryption and relay, `parser.js` prescription parsing, and `sw.js` offline support and reminders.

## Run locally
```sh
python3 -m http.server 8765
# demo: http://localhost:8765   app: http://localhost:8765/app.html
```

## Honest limits
- Reminders fire while Saathi is open or installed and running. True background push would need a server that knows the schedule, which we chose not to have.
- OCR works best on printed prescriptions in good light. Every scanned medicine is shown for confirmation before it's saved.

Medicine names in the demo are generic examples; this is not medical advice.
