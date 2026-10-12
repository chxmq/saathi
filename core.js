// Shared by the judges' demo (demo.js) and the real paired app (real.js):
// schedule logic, the words on Amma's phone, and the two phone views.

export const SLOTS = [
  { id: "m", time: 8 * 60 },
  { id: "a", time: 13 * 60 + 30 },
  { id: "n", time: 21 * 60 },
];
export const DUE_EARLY = 60;  // the button opens an hour before a dose
export const LATE_AFTER = 30; // after this, a dose counts as late and the caregiver is alerted

export const ICON = {
  m: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 18h18"/><path d="M7 18a5 5 0 0 1 10 0"/><path d="M12 8V5M5.6 11.6 4 10M18.4 11.6 20 10"/></svg>',
  a: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',
  n: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  speak: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.5L12 19V5L7.5 9.5Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M5 3.5h3.5l1.8 4.4-2.3 1.5a11 11 0 0 0 6.6 6.6l1.5-2.3 4.4 1.8V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2"/><circle cx="4.5" cy="12" r="1.2"/><circle cx="4.5" cy="18" r="1.2"/></svg>',
};

// ---------- words on Amma's phone ----------
export const T = {
  en: {
    locale: "en-IN", speech: "en-IN", name: "English", short: "EN", amma: "Amma",
    greet: { m: (n) => `Good morning, ${n}`, a: (n) => `Good afternoon, ${n}`, n: (n) => `Good evening, ${n}` },
    slot: { m: "Morning", a: "Afternoon", n: "Night" },
    slotOf: { m: "Morning", a: "Afternoon", n: "Night" },
    at: (s, t) => `${s}, ${t}`,
    due: "Time for your medicines",
    upcoming: (t) => `Next medicines at ${t}`,
    missed: (s) => `${s} medicines not taken yet`,
    took: "I took them",
    notYet: "Not time yet",
    allDone: "All done for today",
    tomorrow: (s, t) => `Next: tomorrow ${s.toLowerCase()}, ${t}`,
    food: { before: "before food", after: "after food", any: "any time" },
    qty: (q) => (q === 0.5 ? "half a tablet" : q === 1 ? "1 tablet" : `${q} tablets`),
    read: "Read aloud",
    call: (n) => `Call ${n}`,
    calling: (n) => `Calling ${n}…`,
    later: "Today",
    count: (n) => (n === 1 ? "1 tablet" : `${n} tablets`),
    taken: "Taken",
    notTaken: "Not taken",
    saved: (n) => (n ? `Done. ${n} can see it.` : "Done."),
    undo: "Undo",
    nudge: (n) => `${n} sent a reminder`,
    noVoice: "Read aloud isn’t available on this device.",
    lang: "Language", size: "Text size",
    noMeds: "No medicines yet",
    addMeds: "Add medicines",
    myMeds: "My medicines",
    whoSees: "Who can see this",
    sharedWith: (n) => `${n} can see if you took your medicines`,
    onlyHere: "Only on this phone",
    paused: "Sharing is paused",
    privTitle: "Who can see your medicines?",
    privAlways: (n) => `${n} can see whether you took each dose.`,
    privNames: (n) => `Let ${n} see the names of my medicines`,
    privManage: (n) => `Let ${n} add or change my medicines`,
    privServer: (n) => `Saathi’s server only keeps locked data. Only your phone and ${n}’s phone have the key.`,
    pause: "Pause sharing", resume: "Start sharing again",
    stop: (n) => `Stop sharing with ${n}`,
    wipe: "Delete everything",
    wipeConfirm: "This deletes your medicines and history from this phone and from Saathi’s server. It can’t be undone.",
    wipeYes: "Yes, delete everything",
    keep: "Keep it",
    share: "Share with family",
    pairHint: "Ask your son or daughter to scan this with their phone camera.",
    waiting: "Waiting for them to scan…",
    paired: (n) => `Connected to ${n}`,
    done: "Done",
    remindersOn: "Turn on reminders",
    nameQ: "What should Saathi call you?",
    next: "Continue",
    close: "Close",
    prePair: "Your family will see whether you took each dose. Medicine names stay private unless you allow it below.",
    namesFamily: "Let my family see the names of my medicines",
    welcome: "Saathi helps you take your medicines on time.",
    roleElder: "This is my phone. The medicines are mine.",
    roleCare: "I look after someone. Pair with their phone.",
    linkWarn: "Anyone with this link can see what you share. Only send it to family.",
    copyLink: "Copy link",
    copied: "Copied",
    remove: "Remove",
    back: "Back",
  },
  hi: {
    locale: "hi-IN", speech: "hi-IN", name: "हिन्दी", short: "हिं", amma: "अम्मा",
    greet: { m: (n) => `सुप्रभात, ${n}`, a: (n) => `नमस्ते, ${n}`, n: (n) => `शुभ संध्या, ${n}` },
    slot: { m: "सुबह", a: "दोपहर", n: "रात" },
    slotOf: { m: "सुबह की", a: "दोपहर की", n: "रात की" },
    at: (s, t) => `${s} ${t} बजे`,
    due: "दवाई का समय हो गया",
    upcoming: (t) => `अगली दवाई ${t} बजे`,
    missed: (s) => `${s} दवाई अभी तक नहीं ली`,
    took: "मैंने दवाई ले ली",
    notYet: "अभी समय नहीं हुआ",
    allDone: "आज की सारी दवाई हो गई",
    tomorrow: (s, t) => `अगली दवाई: कल ${s} ${t} बजे`,
    food: { before: "खाने से पहले", after: "खाने के बाद", any: "कभी भी" },
    qty: (q) => (q === 0.5 ? "आधी गोली" : q === 1 ? "1 गोली" : `${q} गोलियाँ`),
    read: "सुनाइए",
    call: (n) => `${n} को फ़ोन करें`,
    calling: (n) => `${n} को फ़ोन लग रहा है…`,
    later: "आज",
    count: (n) => (n === 1 ? "1 गोली" : `${n} गोलियाँ`),
    taken: "ले ली",
    notTaken: "नहीं ली",
    saved: (n) => (n ? `हो गया। ${n} को पता चल गया।` : "हो गया।"),
    undo: "वापस लें",
    nudge: (n) => `${n} ने याद दिलाया है`,
    noVoice: "इस फ़ोन पर सुनाने की सुविधा नहीं है।",
    lang: "भाषा", size: "अक्षर का आकार",
    noMeds: "अभी कोई दवाई नहीं",
    addMeds: "दवाई जोड़ें",
    myMeds: "मेरी दवाइयाँ",
    whoSees: "यह कौन देख सकता है",
    sharedWith: (n) => `${n} देख सकते हैं कि आपने दवाई ली या नहीं`,
    onlyHere: "सिर्फ़ इस फ़ोन पर",
    paused: "शेयर करना रुका हुआ है",
    privTitle: "आपकी दवाई कौन देख सकता है?",
    privAlways: (n) => `${n} देख सकते हैं कि आपने हर खुराक ली या नहीं।`,
    privNames: (n) => `${n} को मेरी दवाइयों के नाम दिखाएँ`,
    privManage: (n) => `${n} मेरी दवाइयाँ जोड़ या बदल सकें`,
    privServer: (n) => `Saathi का सर्वर सिर्फ़ ताले में बंद डेटा रखता है। चाबी सिर्फ़ आपके और ${n} के फ़ोन में है।`,
    pause: "शेयर करना रोकें", resume: "फिर से शेयर करें",
    stop: (n) => `${n} के साथ शेयर करना बंद करें`,
    wipe: "सब कुछ मिटाएँ",
    wipeConfirm: "इससे आपकी दवाइयाँ और इतिहास इस फ़ोन और Saathi के सर्वर से मिट जाएँगे। इसे वापस नहीं लाया जा सकता।",
    wipeYes: "हाँ, सब मिटाएँ",
    keep: "रहने दें",
    share: "परिवार के साथ शेयर करें",
    pairHint: "अपने बेटे या बेटी से कहें कि वे इसे अपने फ़ोन के कैमरे से स्कैन करें।",
    waiting: "स्कैन होने का इंतज़ार…",
    paired: (n) => `${n} से जुड़ गया`,
    done: "हो गया",
    remindersOn: "याद दिलाना चालू करें",
    nameQ: "Saathi आपको क्या कहकर बुलाए?",
    next: "आगे बढ़ें",
    close: "बंद करें",
    prePair: "आपके परिवार को दिखेगा कि आपने हर खुराक ली या नहीं। दवाइयों के नाम तब तक निजी रहेंगे जब तक आप नीचे अनुमति न दें।",
    namesFamily: "परिवार को मेरी दवाइयों के नाम दिखाएँ",
    welcome: "Saathi आपको समय पर दवाई लेने में मदद करता है।",
    roleElder: "यह मेरा फ़ोन है। दवाइयाँ मेरी हैं।",
    roleCare: "किसी अपने की देखभाल के लिए: उनके फ़ोन से जोड़ें।",
    linkWarn: "यह लिंक जिसके पास होगा, वह आपकी शेयर की हुई जानकारी देख सकेगा। इसे सिर्फ़ परिवार को भेजें।",
    copyLink: "लिंक कॉपी करें",
    copied: "कॉपी हो गया",
    remove: "हटाएँ",
    back: "वापस",
  },
  kn: {
    locale: "kn-IN", speech: "kn-IN", name: "ಕನ್ನಡ", short: "ಕ", amma: "ಅಮ್ಮ",
    greet: { m: (n) => `ಶುಭೋದಯ, ${n}`, a: (n) => `ಶುಭ ಮಧ್ಯಾಹ್ನ, ${n}`, n: (n) => `ಶುಭ ಸಂಜೆ, ${n}` },
    slot: { m: "ಬೆಳಿಗ್ಗೆ", a: "ಮಧ್ಯಾಹ್ನ", n: "ರಾತ್ರಿ" },
    slotOf: { m: "ಬೆಳಿಗ್ಗೆಯ", a: "ಮಧ್ಯಾಹ್ನದ", n: "ರಾತ್ರಿಯ" },
    at: (s, t) => `${s} ${t} ಕ್ಕೆ`,
    due: "ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳುವ ಸಮಯ",
    upcoming: (t) => `ಮುಂದಿನ ಔಷಧಿ ${t} ಕ್ಕೆ`,
    missed: (s) => `${s} ಔಷಧಿ ಇನ್ನೂ ತೆಗೆದುಕೊಂಡಿಲ್ಲ`,
    took: "ನಾನು ಔಷಧಿ ತೆಗೆದುಕೊಂಡೆ",
    notYet: "ಇನ್ನೂ ಸಮಯ ಆಗಿಲ್ಲ",
    allDone: "ಇಂದಿನ ಎಲ್ಲಾ ಔಷಧಿ ಮುಗಿಯಿತು",
    tomorrow: (s, t) => `ಮುಂದಿನದು: ನಾಳೆ ${s} ${t} ಕ್ಕೆ`,
    food: { before: "ಊಟದ ಮೊದಲು", after: "ಊಟದ ನಂತರ", any: "ಯಾವಾಗ ಬೇಕಾದರೂ" },
    qty: (q) => (q === 0.5 ? "ಅರ್ಧ ಮಾತ್ರೆ" : q === 1 ? "1 ಮಾತ್ರೆ" : `${q} ಮಾತ್ರೆಗಳು`),
    read: "ಓದಿ ಹೇಳಿ",
    call: (n) => `${n}ಗೆ ಕರೆ ಮಾಡಿ`,
    calling: (n) => `${n}ಗೆ ಕರೆ ಮಾಡಲಾಗುತ್ತಿದೆ…`,
    later: "ಇಂದು",
    count: (n) => (n === 1 ? "1 ಮಾತ್ರೆ" : `${n} ಮಾತ್ರೆಗಳು`),
    taken: "ತೆಗೆದುಕೊಂಡಿದೆ",
    notTaken: "ತೆಗೆದುಕೊಂಡಿಲ್ಲ",
    saved: (n) => (n ? `ಆಯಿತು. ${n}ಗೆ ತಿಳಿಯಿತು.` : "ಆಯಿತು."),
    undo: "ರದ್ದುಮಾಡಿ",
    nudge: (n) => `${n} ನೆನಪಿಸಿದ್ದಾರೆ`,
    noVoice: "ಈ ಫೋನ್‌ನಲ್ಲಿ ಓದಿ ಹೇಳುವ ಸೌಲಭ್ಯ ಇಲ್ಲ.",
    lang: "ಭಾಷೆ", size: "ಅಕ್ಷರದ ಗಾತ್ರ",
    noMeds: "ಇನ್ನೂ ಯಾವುದೇ ಔಷಧಿ ಇಲ್ಲ",
    addMeds: "ಔಷಧಿ ಸೇರಿಸಿ",
    myMeds: "ನನ್ನ ಔಷಧಿಗಳು",
    whoSees: "ಇದನ್ನು ಯಾರು ನೋಡಬಹುದು",
    sharedWith: (n) => `ನೀವು ಔಷಧಿ ತೆಗೆದುಕೊಂಡಿರಾ ಎಂದು ${n} ನೋಡಬಹುದು`,
    onlyHere: "ಈ ಫೋನ್‌ನಲ್ಲಿ ಮಾತ್ರ",
    paused: "ಹಂಚಿಕೆ ನಿಲ್ಲಿಸಲಾಗಿದೆ",
    privTitle: "ನಿಮ್ಮ ಔಷಧಿಗಳನ್ನು ಯಾರು ನೋಡಬಹುದು?",
    privAlways: (n) => `ನೀವು ಪ್ರತಿ ಡೋಸ್ ತೆಗೆದುಕೊಂಡಿರಾ ಎಂದು ${n} ನೋಡಬಹುದು.`,
    privNames: (n) => `ನನ್ನ ಔಷಧಿಗಳ ಹೆಸರುಗಳನ್ನು ${n} ನೋಡಲಿ`,
    privManage: (n) => `${n} ನನ್ನ ಔಷಧಿಗಳನ್ನು ಸೇರಿಸಬಹುದು ಅಥವಾ ಬದಲಾಯಿಸಬಹುದು`,
    privServer: (n) => `Saathi ಸರ್ವರ್ ಬೀಗ ಹಾಕಿದ ಡೇಟಾವನ್ನು ಮಾತ್ರ ಇಡುತ್ತದೆ. ಕೀಲಿ ನಿಮ್ಮ ಮತ್ತು ${n} ಫೋನ್‌ನಲ್ಲಿ ಮಾತ್ರ ಇದೆ.`,
    pause: "ಹಂಚಿಕೆ ನಿಲ್ಲಿಸಿ", resume: "ಮತ್ತೆ ಹಂಚಿಕೊಳ್ಳಿ",
    stop: (n) => `${n} ಜೊತೆ ಹಂಚಿಕೆ ನಿಲ್ಲಿಸಿ`,
    wipe: "ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ",
    wipeConfirm: "ಇದು ನಿಮ್ಮ ಔಷಧಿಗಳು ಮತ್ತು ಇತಿಹಾಸವನ್ನು ಈ ಫೋನ್ ಮತ್ತು Saathi ಸರ್ವರ್‌ನಿಂದ ಅಳಿಸುತ್ತದೆ. ಇದನ್ನು ಹಿಂಪಡೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ.",
    wipeYes: "ಹೌದು, ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ",
    keep: "ಬೇಡ",
    share: "ಕುಟುಂಬದೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ",
    pairHint: "ನಿಮ್ಮ ಮಗ ಅಥವಾ ಮಗಳಿಗೆ ಇದನ್ನು ಅವರ ಫೋನ್ ಕ್ಯಾಮೆರಾದಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಹೇಳಿ.",
    waiting: "ಸ್ಕ್ಯಾನ್‌ಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ…",
    paired: (n) => `${n} ಜೊತೆ ಸಂಪರ್ಕ ಆಯಿತು`,
    done: "ಆಯಿತು",
    remindersOn: "ಜ್ಞಾಪನೆ ಆನ್ ಮಾಡಿ",
    nameQ: "Saathi ನಿಮ್ಮನ್ನು ಏನೆಂದು ಕರೆಯಲಿ?",
    next: "ಮುಂದುವರಿಸಿ",
    close: "ಮುಚ್ಚಿ",
    prePair: "ನೀವು ಪ್ರತಿ ಡೋಸ್ ತೆಗೆದುಕೊಂಡಿರಾ ಎಂದು ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ಕಾಣುತ್ತದೆ. ನೀವು ಕೆಳಗೆ ಅನುಮತಿಸದ ಹೊರತು ಔಷಧಿಗಳ ಹೆಸರುಗಳು ಖಾಸಗಿಯಾಗಿರುತ್ತವೆ.",
    namesFamily: "ನನ್ನ ಔಷಧಿಗಳ ಹೆಸರುಗಳನ್ನು ಕುಟುಂಬ ನೋಡಲಿ",
    welcome: "Saathi ನಿಮಗೆ ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    roleElder: "ಇದು ನನ್ನ ಫೋನ್. ಔಷಧಿಗಳು ನನ್ನವು.",
    roleCare: "ನನ್ನವರನ್ನು ನೋಡಿಕೊಳ್ಳಲು: ಅವರ ಫೋನ್‌ಗೆ ಜೋಡಿಸಿ.",
    linkWarn: "ಈ ಲಿಂಕ್ ಇರುವ ಯಾರಾದರೂ ನೀವು ಹಂಚಿಕೊಂಡದ್ದನ್ನು ನೋಡಬಹುದು. ಇದನ್ನು ಕುಟುಂಬಕ್ಕೆ ಮಾತ್ರ ಕಳುಹಿಸಿ.",
    copyLink: "ಲಿಂಕ್ ನಕಲಿಸಿ",
    copied: "ನಕಲಾಯಿತು",
    remove: "ತೆಗೆದುಹಾಕಿ",
    back: "ಹಿಂದೆ",
  },
};
export const SLOT_EN = { m: "morning", a: "afternoon", n: "night" };
export const SLOT_EN_CAP = { m: "Morning", a: "Afternoon", n: "Night" };

export const PILL_COLORS = [
  { id: "white", label: "White", hex: "#FFFFFF" },
  { id: "pink", label: "Pink", hex: "#F7C6D0" },
  { id: "yellow", label: "Yellow", hex: "#F5D76E" },
  { id: "orange", label: "Orange", hex: "#F28C38" },
  { id: "blue", label: "Blue", hex: "#9EC5E8" },
];
export const SHAPES = [
  { id: "round", label: "Round" },
  { id: "oval", label: "Oval" },
  { id: "capsule", label: "Capsule" },
  { id: "small", label: "Small" },
];

// ---------- the store both entry points share ----------
// S.state: { now (minutes), meds, log: { 'YYYY-MM-DD': { m|a|n: { at } } }, lang, scale, reordered, nudge, since? ('YYYY-MM-DD') }
export const S = { state: null, today: startOfToday() };

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
export function dateOf(offset) {
  const d = new Date(S.today);
  d.setDate(d.getDate() - offset);
  return d;
}
export function dayKey(offset) {
  const d = dateOf(offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function todayLog() {
  const k = dayKey(0);
  if (!S.state.log[k]) S.state.log[k] = {};
  return S.state.log[k];
}

// ---------- helpers ----------
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const slotIndex = (id) => SLOTS.findIndex((s) => s.id === id);
export const medsIn = (slotId) => S.state.meds.filter((m) => m.pattern[slotIndex(slotId)] > 0);
export const tabletsIn = (slotId) => medsIn(slotId).reduce((n, m) => n + m.pattern[slotIndex(slotId)], 0);
export const dailyQty = (m) => m.pattern.reduce((a, b) => a + b, 0);
export const qtyText = (q) => (q === 0.5 ? "½" : String(q));
export const L = () => T[S.state.lang] || T.en;

export function clock(mins, withMeridiem = true) {
  const h = Math.floor(mins / 60), m = mins % 60;
  const h12 = ((h + 11) % 12) + 1;
  const base = `${h12}:${String(m).padStart(2, "0")}`;
  return withMeridiem ? `${base} ${h < 12 ? "am" : "pm"}` : base;
}
export const elderTime = (mins) => (S.state.lang === "en" ? clock(mins) : clock(mins, false));
export const minutesNow = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

// Status of one slot on one day (offset 0 = today).
export function slotStatus(offset, slot) {
  if (!medsIn(slot.id).length) return { s: "none" };
  if (S.state.since && dayKey(offset) < S.state.since) return { s: "none" }; // before Saathi was set up
  const rec = S.state.log[dayKey(offset)]?.[slot.id];
  if (rec) return { s: rec.at > slot.time + LATE_AFTER ? "late" : "taken", at: rec.at };
  if (offset > 0) return { s: "missed" };
  if (S.state.now < slot.time - DUE_EARLY) return { s: "upcoming" };
  if (S.state.now <= slot.time + LATE_AFTER) return { s: "due" };
  return { s: "missed", lateBy: S.state.now - slot.time };
}

// What Amma's phone should show right now.
export function currentSlot() {
  const log = S.state.log[dayKey(0)] || {};
  const started = SLOTS.filter((s) => medsIn(s.id).length && S.state.now >= s.time - DUE_EARLY);
  const last = started[started.length - 1];
  if (last && !log[last.id]) return { slot: last, ...slotStatus(0, last) };
  const next = SLOTS.find((s) => medsIn(s.id).length && S.state.now < s.time - DUE_EARLY && !log[s.id]);
  if (next) return { slot: next, s: "upcoming" };
  if (!SLOTS.some((s) => medsIn(s.id).length)) return { slot: null, s: "empty" };
  return { slot: null, s: "done", justTaken: last };
}

export function weekStats(days = 7) {
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
export const shortDate = (offset) => dateOf(offset).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

export function speak(text, onFail) {
  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === "undefined") { onFail?.(); return; }
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = L().speech;
  u.rate = 0.9;
  const voice = synth.getVoices().find((v) => v.lang && v.lang.replace("_", "-").toLowerCase().startsWith(L().speech.slice(0, 2)));
  if (voice) u.voice = voice;
  synth.speak(u);
}
export function readAloudText() {
  const cur = currentSlot(), t = L();
  if (cur.s === "done") return t.allDone;
  if (cur.s === "empty") return t.noMeds;
  const intro = cur.s === "missed" ? t.missed(t.slotOf[cur.slot.id]) : cur.s === "upcoming" ? t.upcoming(elderTime(cur.slot.time)) : t.due;
  const pills = medsIn(cur.slot.id).map((m) => {
    const q = m.pattern[slotIndex(cur.slot.id)];
    return `${m.name}, ${t.qty(q)}${m.food === "any" ? "" : `, ${t.food[m.food]}`}`;
  });
  return [intro, ...pills].join(". ");
}

// ---------- shells and toasts ----------
export function mountScreen(el) {
  el.innerHTML = '<div class="scr-body"></div><div class="toast-region" aria-live="polite"></div>';
  return { el, body: el.querySelector(".scr-body"), region: el.querySelector(".toast-region"), toast: null, timer: null };
}
export function toast(screen, msg, actionLabel, action) {
  screen.toast = { msg, actionLabel, action };
  clearTimeout(screen.timer);
  screen.timer = setTimeout(() => { screen.toast = null; renderToast(screen); }, 6000);
  renderToast(screen);
}
export function renderToast(screen) {
  const t = screen.toast;
  if (!t) { screen.region.innerHTML = ""; return; }
  screen.region.innerHTML = `<div class="toast"><span>${esc(t.msg)}</span>${t.actionLabel ? `<button type="button" data-act="toast-action">${esc(t.actionLabel)}</button>` : ""}</div>`;
  const b = screen.region.querySelector("button");
  if (b) b.onclick = () => { screen.toast = null; renderToast(screen); t.action?.(); };
}

// ---------- drawing ----------
export function pillHTML(m) {
  const second = m.shape === "capsule" ? "--pill2:#FFFFFF;" : "";
  return `<span class="pill" data-shape="${esc(m.shape)}" style="--pill:${esc(m.color)};${second}" aria-hidden="true"></span>`;
}
export function doseHTML(pattern) {
  const parts = pattern.map((q) => `<b ${q === 0 ? "data-zero" : ""}>${qtyText(q)}</b>`);
  const label = pattern.map((q, i) => `${qtyText(q)} ${SLOT_EN[SLOTS[i].id]}`).join(", ");
  return `<span class="dose" role="img" aria-label="${label}">${parts.join('<i aria-hidden="true">–</i>')}</span>`;
}

// ---------- Amma's phone ----------
// opts: { name, caregiver, top (extra HTML under the tools), footer (HTML replacing the call button) }
export function renderElder(screen, opts = {}) {
  const t = L();
  const el = screen.el;
  el.setAttribute("lang", S.state.lang);
  el.style.setProperty("--scale", S.state.scale);
  const name = opts.name || t.amma;
  const carer = opts.caregiver || "Rahul";
  const cur = currentSlot();
  const greetSlot = S.state.now < 12 * 60 ? "m" : S.state.now < 17 * 60 ? "a" : "n";
  const dateLine = S.today.toLocaleDateString(t.locale, { weekday: "long", day: "numeric", month: "long" });

  let card = "";
  if (cur.s === "empty") {
    card = `
      <div class="now-card" data-state="upcoming">
        <h2 class="now-title">${esc(t.noMeds)}</h2>
        <button type="button" class="big-btn" data-act="my-meds" data-key="add-first"><span>${esc(t.addMeds)}</span></button>
      </div>`;
  } else if (cur.s === "done") {
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
      return `<li><span class="pill-slot">${pillHTML(m)}</span><span class="pill-name">${esc(m.name)} ${esc(String(m.strength || "").replace(/\s*mg$/, ""))}<span class="pill-how">${esc(how)}</span></span></li>`;
    }).join("");
    const canTake = cur.s !== "upcoming";
    card = `
      <div class="now-card" data-state="${cardState}">
        ${S.state.nudge && S.state.nudge === slot.id ? `<p class="now-when">${ICON.phone}<span>${esc(t.nudge(carer))}</span></p>` : ""}
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
    const shown = st.s === "late" ? "taken" : st.s;
    return `<li data-state="${shown}"><span>${esc(t.at(t.slot[s.id], elderTime(s.time)))}</span><span class="later-count">${esc(label)}</span></li>`;
  }).join("");

  const langBtns = Object.keys(T).map((k) =>
    `<button type="button" data-act="lang" data-lang="${k}" data-key="lang-${k}" aria-pressed="${S.state.lang === k}" lang="${k}" aria-label="${T[k].name}">${T[k].short}</button>`).join("");
  const sizeBtns = [1, 1.25, 1.5].map((s, i) =>
    `<button type="button" data-act="scale" data-scale="${s}" data-key="scale-${i}" aria-pressed="${S.state.scale === s}" aria-label="${Math.round(s * 100)}%">A</button>`).join("");

  screen.body.innerHTML = `
    <div class="scr-top"><span class="scr-brand">saathi</span></div>
    <div class="elder-tools">
      <div class="seg" role="group" aria-label="${esc(t.lang)}">${langBtns}</div>
      <div class="seg size-seg" role="group" aria-label="${esc(t.size)}">${sizeBtns}</div>
    </div>
    ${opts.top || ""}
    <p class="greet">${esc(t.greet[greetSlot](name))}<small>${esc(dateLine)}</small></p>
    ${card}
    ${laterRows ? `<section class="later" aria-label="${esc(t.later)}"><h3>${esc(t.later)}</h3><ul>${laterRows}</ul></section>` : ""}
    ${opts.footer ?? `<div class="call"><button type="button" class="quiet-btn" data-act="call-carer" data-key="call-carer">${ICON.phone}<span>${esc(t.call(carer))}</span></button></div>`}
    <div style="height:1rem"></div>`;
}

// ---------- the caregiver's phone ----------
// opts: { name, place, statusOverride, alertActions, canCall, canAdd, canSummary, banner, extraActions, hideNames }
export function renderCare(screen, opts = {}) {
  const who = opts.name || "Amma";
  const cur = currentSlot();
  let status, tone = "", alert = "";
  const todayMissed = SLOTS.filter((s) => slotStatus(0, s).s === "missed");

  if (opts.statusOverride) {
    status = opts.statusOverride;
  } else if (cur.s === "empty") {
    status = `${who} hasn’t added any medicines yet.`;
  } else if (cur.s === "missed") {
    const mins = S.state.now - cur.slot.time;
    tone = "alert";
    status = `${who} hasn’t taken the ${SLOT_EN[cur.slot.id]} medicines yet.`;
    const sent = S.state.nudge === cur.slot.id;
    alert = `
      <div class="alert-box" role="status">
        <p>They were due at ${clock(cur.slot.time)}, ${mins} minutes ago.${sent ? ` Reminder sent to ${who}’s phone.` : ""}</p>
        <div class="alert-actions">
          ${opts.canCall === false ? "" : `<button type="button" class="btn btn-solid" data-act="call-elder" data-key="call-elder">Call ${esc(who)}</button>`}
          <button type="button" class="btn ${opts.canCall === false ? "btn-solid" : ""}" data-act="nudge" data-slot="${cur.slot.id}" data-key="nudge" ${sent ? "disabled" : ""}>${sent ? "Reminder sent" : "Send a reminder"}</button>
        </div>
      </div>`;
  } else if (cur.s === "done") {
    const s = weekStats(1);
    status = s.misses.length ? `${who} is done for today, but missed the ${s.misses.map((m) => SLOT_EN[m.s.id]).join(" and ")} medicines.` : `${who} has taken all of today’s medicines.`;
  } else if (cur.s === "due") {
    status = `${who}’s ${SLOT_EN[cur.slot.id]} medicines are due at ${clock(cur.slot.time)}.`;
  } else {
    const log = S.state.log[dayKey(0)] || {};
    const lastTaken = [...SLOTS].reverse().find((s) => log[s.id]);
    status = lastTaken
      ? `${who} took the ${SLOT_EN[lastTaken.id]} medicines at ${clock(log[lastTaken.id].at)}.`
      : `${who}’s first medicines are at ${clock(cur.slot.time)}.`;
  }
  if (!opts.statusOverride && cur.s !== "missed" && cur.s !== "done" && todayMissed.length) {
    status += ` The ${todayMissed.map((s) => SLOT_EN[s.id]).join(" and ")} dose was missed.`;
  }

  const todayRow = SLOTS.map((s) => {
    const st = slotStatus(0, s);
    const what = { taken: `Taken ${clock(st.at)}`, late: `Taken late, ${clock(st.at)}`, due: `Due ${clock(s.time)}`, upcoming: clock(s.time), missed: "Not taken", none: "Nothing" }[st.s];
    const shown = st.s === "late" ? "taken" : st.s;
    return `<div role="listitem" class="slot" data-state="${shown}"><b>${SLOT_EN_CAP[s.id]}</b><span>${esc(what)}</span></div>`;
  }).join("");

  const markLabel = (st, s) => {
    const n = SLOT_EN_CAP[s.id];
    return { taken: `${n}: taken at ${clock(st.at)}`, late: `${n}: taken late at ${clock(st.at)}`, missed: `${n}: missed`, due: `${n}: due now`, upcoming: `${n}: later today`, none: `${n}: no medicines` }[st.s];
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

  const meds = S.state.meds;
  const refills = [...meds].filter((m) => dailyQty(m) > 0).sort((a, b) => a.stock / dailyQty(a) - b.stock / dailyQty(b)).map((m) => {
    const days = Math.floor(m.stock / dailyQty(m));
    const low = days <= 7;
    const pct = Math.min(100, Math.round((days / 30) * 100));
    const action = S.state.reordered?.[m.id]
      ? `<span class="reordered">Reorder sent</span>`
      : low ? `<button type="button" class="btn btn-small" data-act="reorder" data-med="${esc(m.id)}" data-key="reorder-${esc(m.id)}">Reorder</button>` : "";
    return `<li ${low ? "data-low" : ""}>
      <div class="refill-top"><b>${esc(m.name)}</b><span><em>${days === 1 ? "1 day left" : `${days} days left`}</em> ${action}</span></div>
      <div class="bar" aria-hidden="true"><i style="width:${pct}%"></i></div>
    </li>`;
  }).join("");

  const medRows = meds.map((m) => `
    <li><span class="pill-slot">${pillHTML(m)}</span>
      <span><b>${esc(m.name)}${m.strength ? ` ${esc(m.strength)}` : ""}</b><span>${esc(m.purpose ? `${m.purpose}, ` : "")}${m.food === "any" ? "any time" : `${m.food} food`}</span></span>
      ${doseHTML(m.pattern)}</li>`).join("");

  screen.body.innerHTML = `
    <div class="scr-top">
      <div class="care-who"><span class="avatar" aria-hidden="true">${esc(who.slice(0, 1).toUpperCase())}</span><span><b>${esc(who)}</b><span>${esc(opts.place || "")}</span></span></div>
      <span class="scr-brand">saathi</span>
    </div>
    ${opts.banner || ""}
    <p class="status" data-tone="${tone}">${esc(status)}</p>
    ${alert}
    ${meds.length ? `
    <div class="today-row" role="list" aria-label="Today">${todayRow}</div>
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
      ${opts.hideNames ? `<p class="care-note">${ICON.lock} ${esc(who)} keeps medicine names private. You see the schedule only.</p>` : ""}
      <ul class="med-list">${medRows}</ul>
    </section>` : ""}
    <div class="care-actions">
      ${opts.canAdd === false ? "" : `<button type="button" class="btn btn-solid" data-act="add-med" data-key="add-med">Add a medicine</button>`}
      ${opts.canSummary === false || !meds.length ? "" : `<button type="button" class="btn" data-act="summary" data-key="summary">Share with ${esc(who)}’s doctor</button>`}
      ${opts.extraActions || ""}
    </div>`;
}

// ---------- dialogs ----------
const layer = () => document.getElementById("modal-layer");
let lastFocus = null;
let onClose = null;

export function openModal(html, labelId, closeCb) {
  lastFocus = document.activeElement;
  const l = layer();
  l.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="${labelId}">${html}</div>`;
  l.hidden = false;
  onClose = closeCb || null;
  const first = l.querySelector("input, button, select");
  if (first) first.focus();
}
export function closeModal() {
  const l = layer();
  l.hidden = true;
  l.innerHTML = "";
  const cb = onClose; onClose = null;
  cb?.();
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
}
export const modalOpen = () => !layer().hidden;

export function installModalKeys() {
  const l = layer();
  l.addEventListener("mousedown", (ev) => { if (ev.target === l) closeModal(); });
  document.addEventListener("keydown", (ev) => {
    if (l.hidden) return;
    if (ev.key === "Escape") { closeModal(); return; }
    if (ev.key !== "Tab") return;
    const f = [...l.querySelectorAll("button, input, select, textarea, a[href]")].filter((el) => !el.disabled && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  });
}

// ---- add a medicine (by hand, or by scanning a prescription on this phone) ----
const CYCLE = [0, 1, 2, 0.5];
let draft = null;
let saveMed = null;
let scanRows = null;

export function openAddMed(onSave, { scan = true, subtitle } = {}) {
  draft = { name: "", strength: "", pattern: [1, 0, 0], food: "after", shape: "round", color: "#FFFFFF", stock: "", errors: {}, subtitle, scan };
  saveMed = onSave;
  scanRows = null;
  openModal(addMedHTML(), "add-title");
  wireAddMed();
}

function addMedHTML() {
  const e = draft.errors;
  const picker = SLOTS.map((s, i) => `
    <button type="button" data-mact="cycle" data-i="${i}" data-q="${draft.pattern[i]}" aria-label="${SLOT_EN_CAP[s.id]}: ${qtyText(draft.pattern[i])} tablet${draft.pattern[i] === 1 ? "" : "s"}. Tap to change.">
      <b>${qtyText(draft.pattern[i])}</b><span>${SLOT_EN_CAP[s.id]}</span>
    </button>`).join("");
  const food = [["before", "Before food"], ["after", "After food"], ["any", "Any time"]].map(([v, l]) =>
    `<button type="button" data-mact="food" data-v="${v}" aria-pressed="${draft.food === v}">${l}</button>`).join("");
  const shapes = SHAPES.map((s) =>
    `<button type="button" data-mact="shape" data-v="${s.id}" aria-pressed="${draft.shape === s.id}">${s.label}</button>`).join("");
  const colors = PILL_COLORS.map((c) =>
    `<button type="button" data-mact="color" data-v="${c.hex}" aria-pressed="${draft.color === c.hex}"><span class="swatch" style="--sw:${c.hex}" aria-hidden="true"></span>${c.label}</button>`).join("");
  return `
    <h2 id="add-title">Add a medicine</h2>
    <p class="sub">${esc(draft.subtitle || "It shows up on Amma’s phone as soon as you save.")}</p>
    ${draft.scan ? `
    <div class="scan-box">
      <button type="button" class="btn btn-solid" data-mact="scan">Scan a prescription</button>
      <p class="hint">${ICON.lock} Read on this phone. The photo is never uploaded or saved.</p>
      <button type="button" class="link-button" data-mact="sample">No prescription handy? Try a sample</button>
      <input type="file" accept="image/*" capture="environment" id="scan-file" hidden>
      <div id="scan-out" aria-live="polite"></div>
    </div>
    <p class="or"><span>or add one by hand</span></p>` : ""}
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
        <button type="button" class="btn" data-mact="close">Cancel</button>
        <button type="submit" class="btn btn-solid">Save medicine</button>
      </div>
    </form>`;
}

function syncDraft() {
  const l = layer();
  const n = l.querySelector("#f-name"), s = l.querySelector("#f-strength"), k = l.querySelector("#f-stock");
  if (n) draft.name = n.value;
  if (s) draft.strength = s.value;
  if (k) draft.stock = k.value;
}
function rerender(focusSel) {
  const modal = layer().querySelector(".modal");
  const scroll = modal.scrollTop;
  const scanOut = modal.querySelector("#scan-out")?.innerHTML || "";
  modal.innerHTML = addMedHTML();
  const so = modal.querySelector("#scan-out");
  if (so) so.innerHTML = scanOut;
  modal.scrollTop = scroll;
  const el = focusSel && modal.querySelector(focusSel);
  if (el) el.focus();
}

function wireAddMed() {
  const l = layer();
  l.onclick = (ev) => {
    const b = ev.target.closest("[data-mact]");
    if (!b) return;
    const act = b.dataset.mact;
    if (act === "close") { closeModal(); return; }
    if (act === "scan") { l.querySelector("#scan-file").click(); return; }
    if (act === "sample") { runScan("sample-prescription.png"); return; }
    if (act === "scan-cycle") {
      const r = scanRows[Number(b.dataset.r)], i = Number(b.dataset.i);
      r.pattern[i] = CYCLE[(CYCLE.indexOf(r.pattern[i]) + 1) % CYCLE.length];
      renderScanRows(`[data-mact="scan-cycle"][data-r="${b.dataset.r}"][data-i="${i}"]`);
      return;
    }
    if (act === "scan-add") { addScanned(); return; }
    syncDraft();
    if (act === "cycle") {
      const i = Number(b.dataset.i);
      draft.pattern[i] = CYCLE[(CYCLE.indexOf(draft.pattern[i]) + 1) % CYCLE.length];
      delete draft.errors.pattern;
      rerender(`[data-mact="cycle"][data-i="${i}"]`);
    } else if (act === "food" || act === "shape" || act === "color") {
      draft[act] = b.dataset.v;
      rerender(`[data-mact="${act}"][data-v="${CSS.escape(b.dataset.v)}"]`);
    }
  };
  l.oninput = (ev) => {
    const el = ev.target;
    if (el.matches("[data-scan-field]")) {
      const r = scanRows[Number(el.dataset.r)];
      if (el.type === "checkbox") r.use = el.checked; else r[el.dataset.scanField] = el.value;
      return;
    }
    if (el.getAttribute("aria-invalid") !== "true") return;
    el.removeAttribute("aria-invalid");
    l.querySelector(`#${el.id}-err`)?.remove();
    delete draft.errors[el.id === "f-name" ? "name" : "stock"];
  };
  l.onchange = (ev) => {
    if (ev.target.id === "scan-file" && ev.target.files?.[0]) runScan(ev.target.files[0]);
    else if (ev.target.matches("select[data-scan-field]")) scanRows[Number(ev.target.dataset.r)].food = ev.target.value;
  };
  l.onsubmit = (ev) => { ev.preventDefault(); submitAddMed(); };
}

function submitAddMed() {
  syncDraft();
  const errors = {};
  if (!draft.name.trim()) errors.name = "Enter the medicine name as it’s printed on the strip.";
  if (!draft.pattern.some((q) => q > 0)) errors.pattern = "Choose at least one time of day.";
  const stock = draft.stock === "" ? 30 : Number(draft.stock);
  if (!Number.isFinite(stock) || stock < 0) errors.stock = "Enter a number of tablets, or leave it empty.";
  draft.errors = errors;
  if (Object.keys(errors).length) {
    rerender(errors.name ? "#f-name" : errors.stock ? "#f-stock" : '[data-mact="cycle"]');
    return;
  }
  const med = {
    id: `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, name: draft.name.trim(), strength: draft.strength.trim(),
    pattern: draft.pattern.slice(), food: draft.food, shape: draft.shape, color: draft.color, stock: Math.round(stock), purpose: "",
  };
  const cb = saveMed;
  closeModal();
  cb?.([med]);
}

// On-device OCR: Tesseract (WebAssembly) is served from this site, so the image never leaves the phone.
let workerPromise = null;
function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement("script");
    s.src = src; s.onload = res; s.onerror = () => rej(new Error(`Couldn’t load ${src}`));
    document.head.append(s);
  });
}
async function ocrWorker(progress) {
  if (!workerPromise) {
    workerPromise = (async () => {
      await loadScript("vendor/tesseract/tesseract.min.js");
      const base = new URL("vendor/tesseract/", location.href).href;
      return window.Tesseract.createWorker("eng", 1, {
        workerPath: base + "worker.min.js",
        corePath: base + "core",
        langPath: base + "lang",
        gzip: true,
        logger: (m) => progress?.(m),
      });
    })();
    workerPromise.catch(() => { workerPromise = null; });
  }
  return workerPromise;
}
async function prepareImage(src) {
  const url = typeof src === "string" ? src : URL.createObjectURL(src);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("That file isn’t a photo Saathi can read.")); i.src = url; });
    const scale = Math.min(1, 2000 / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    const g = c.getContext("2d");
    g.filter = "grayscale(1) contrast(1.25)";
    g.drawImage(img, 0, 0, c.width, c.height);
    return c;
  } finally {
    if (typeof src !== "string") URL.revokeObjectURL(url);
  }
}

async function runScan(src) {
  const out = layer().querySelector("#scan-out");
  if (!out) return;
  const say = (html) => { out.innerHTML = html; };
  say(`<p class="scan-status">Getting the reader ready on this phone…</p>`);
  try {
    const worker = await ocrWorker((m) => {
      if (m.status === "recognizing text") say(`<p class="scan-status">Reading the prescription… ${Math.round(m.progress * 100)}%</p>`);
    });
    const canvas = await prepareImage(src);
    const { data } = await worker.recognize(canvas);
    const { parsePrescription } = await import("./parser.js");
    const found = parsePrescription(data.text || "");
    if (!found.length) {
      say(`<p class="error">Saathi couldn’t find any medicines in that photo. Try again in good light, with the page flat, or add them by hand below.</p>`);
      return;
    }
    scanRows = found.map((r, i) => ({ ...r, use: !r.sos, stock: "", shape: "round", color: PILL_COLORS[i % PILL_COLORS.length].hex }));
    renderScanRows();
  } catch (err) {
    say(`<p class="error">${esc(err.message || "Scanning didn’t work on this phone.")} You can add medicines by hand below.</p>`);
  } finally {
    const f = layer().querySelector("#scan-file");
    if (f) f.value = "";
  }
}

function renderScanRows(focusSel) {
  const out = layer().querySelector("#scan-out");
  if (!out || !scanRows) return;
  out.innerHTML = `
    <p class="scan-status"><b>Found ${scanRows.length} medicine${scanRows.length === 1 ? "" : "s"}.</b> Check each one against the prescription before adding. Tap a number to change it.</p>
    <ul class="scan-list">${scanRows.map((r, i) => `
      <li ${r.confidence < 3 ? 'data-check="true"' : ""}>
        <label class="scan-use"><input type="checkbox" data-scan-field="use" data-r="${i}" ${r.use ? "checked" : ""}><span class="sr-only">Add ${esc(r.name)}</span></label>
        <div class="scan-fields">
          <div class="row2">
            <input type="text" aria-label="Name" data-scan-field="name" data-r="${i}" value="${esc(r.name)}">
            <input type="text" aria-label="Strength" data-scan-field="strength" data-r="${i}" value="${esc(r.strength)}">
          </div>
          <div class="scan-dose">
            ${SLOTS.map((s, j) => `<button type="button" data-mact="scan-cycle" data-r="${i}" data-i="${j}" data-q="${r.pattern[j]}" aria-label="${SLOT_EN_CAP[s.id]}: ${qtyText(r.pattern[j])}">${qtyText(r.pattern[j])}</button>`).join('<i aria-hidden="true">–</i>')}
            <select aria-label="Food" data-scan-field="food" data-r="${i}">
              ${[["before", "Before food"], ["after", "After food"], ["any", "Any time"]].map(([v, l]) => `<option value="${v}" ${r.food === v ? "selected" : ""}>${l}</option>`).join("")}
            </select>
          </div>
          ${r.note || r.confidence < 3 ? `<p class="hint">${esc(r.note || "Check this one: the text was hard to read.")}</p>` : ""}
          <p class="scan-raw">“${esc(r.raw)}”</p>
        </div>
      </li>`).join("")}
    </ul>
    <button type="button" class="btn btn-solid" data-mact="scan-add">Add the ticked medicines</button>`;
  const el = focusSel && out.querySelector(focusSel);
  if (el) el.focus();
}

function addScanned() {
  const picked = scanRows.filter((r) => r.use && r.name.trim() && r.pattern.some((q) => q > 0));
  if (!picked.length) {
    layer().querySelector("#scan-out")?.insertAdjacentHTML("beforeend", `<p class="error">Tick at least one medicine with a time of day.</p>`);
    return;
  }
  const meds = picked.map((r) => ({
    id: `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    name: r.name.trim(), strength: r.strength.trim(), pattern: r.pattern.slice(), food: r.food,
    shape: r.shape, color: r.color, stock: r.days ? Math.ceil(r.days * dailyQtyOf(r.pattern)) : 30, purpose: "",
  }));
  const cb = saveMed;
  closeModal();
  cb?.(meds);
}
const dailyQtyOf = (p) => p.reduce((a, b) => a + b, 0);

// ---- 7-day summary for the doctor ----
export function openSummary(who = "Amma", hideNames = false) {
  const ws = weekStats();
  const pct = ws.due ? Math.round((ws.taken / ws.due) * 100) : 100;
  const list = (arr) => arr.map((x) => `${SLOT_EN_CAP[x.s.id]} on ${shortDate(x.d)}`).join("; ");
  const lines = [
    `Saathi summary for ${who}, ${shortDate(6)} to ${shortDate(0)}`,
    ``,
    `Doses taken: ${ws.taken} of ${ws.due} (${pct}%)`,
    ws.misses.length ? `Missed: ${list(ws.misses)}` : `Missed: none`,
    ws.lates.length ? `Taken more than ${LATE_AFTER} min late: ${list(ws.lates)}` : null,
    ``,
    `Current medicines (morning–afternoon–night):`,
    ...S.state.meds.map((m) => `• ${m.name}${m.strength ? ` ${m.strength}` : ""}  ${m.pattern.map(qtyText).join("–")}, ${m.food === "any" ? "any time" : `${m.food} food`}`),
    hideNames ? `(${who} keeps medicine names private in Saathi; ask to see the strips.)` : null,
  ].filter((l) => l !== null);
  const text = lines.join("\n");
  openModal(`
    <h2 id="sum-title">Share with ${esc(who)}’s doctor</h2>
    <p class="sub">A plain summary of the last 7 days. Copy it into WhatsApp or show it at the clinic.</p>
    <div class="summary" id="summary-text">${esc(text)}</div>
    <div class="modal-actions">
      <button type="button" class="btn" data-mact="close">Close</button>
      <button type="button" class="btn btn-solid" data-mact="copy">Copy summary</button>
    </div>`, "sum-title");
  layer().onclick = (ev) => {
    const b = ev.target.closest("[data-mact]");
    if (!b) return;
    if (b.dataset.mact === "close") closeModal();
    if (b.dataset.mact === "copy") {
      const done = () => { b.textContent = "Copied"; };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => { b.textContent = "Select the text to copy"; });
      else b.textContent = "Select the text to copy";
    }
  };
}

// Keep keyboard focus on the same control across re-renders.
export function withFocus(fn) {
  const a = document.activeElement;
  const key = a && a.dataset ? a.dataset.key : null;
  fn();
  if (key) {
    const again = document.querySelector(`[data-key="${CSS.escape(key)}"]`);
    if (again && !again.disabled) again.focus({ preventScroll: true });
  }
}
