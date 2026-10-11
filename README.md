# Saathi

**Amma takes her medicines. You know she did.**

Saathi helps elderly parents take their medicines on time, in their own language, and gives their children a quiet view of the week from wherever they live.

Live demo: https://chxmq.github.io/saathi/

Built for HyperBloom October 2026 (UI/UX & Web Design).

## What's in the demo
- **Amma's phone:** one big card for the next dose, tablets drawn as they look in the strip, a 72px "I took them" button, English / हिन्दी / ಕನ್ನಡ, read aloud, text up to 150%.
- **Rahul's phone:** a one-line status for today, a week grid in the prescription's own `1–0–1` notation, refills as days left, and an alert only after a dose is 30 minutes late (call or remind).
- **Add a medicine** with a `1–0–1` picker, and **share a 7-day summary** with the doctor.
- A demo clock to scrub through the day. Both phones share one state, so actions sync instantly.

## Run locally
No build step:

```sh
python3 -m http.server 8765
# open http://localhost:8765
```

## Accessibility
WCAG AA contrast, 44px+ touch targets, keyboard support with visible focus, a focus-trapped dialog, labelled week-grid marks, `lang` switching for screen readers and speech, live regions, and support for reduced-motion settings.

Medicine names are generic examples; this is a design prototype, not medical advice.
