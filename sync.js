// Encrypted relay between Amma's phone and her family's phone.
// The household id and AES key travel only inside the pairing QR code (the URL fragment,
// which browsers never send to a server). Firestore only ever stores { c: ciphertext, iv, t }.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection, addDoc, getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let db = null;
async function store() {
  if (db) return db;
  const cfg = await (await fetch(new URL("firebase/config.json", location.href))).json();
  db = getFirestore(initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }));
  return db;
}

const b64u = {
  enc: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  dec: (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), (c) => c.charCodeAt(0)),
};

export async function newHousehold() {
  const hid = b64u.enc(crypto.getRandomValues(new Uint8Array(16)));
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  return { hid, key: b64u.enc(await crypto.subtle.exportKey("raw", key)) };
}

const keyCache = new Map();
async function cryptoKey(k) {
  if (!keyCache.has(k)) keyCache.set(k, await crypto.subtle.importKey("raw", b64u.dec(k), "AES-GCM", false, ["encrypt", "decrypt"]));
  return keyCache.get(k);
}
async function seal(k, obj) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const c = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await cryptoKey(k), new TextEncoder().encode(JSON.stringify(obj)));
  return { c: b64u.enc(c), iv: b64u.enc(iv), t: Date.now() };
}
async function unseal(k, d) {
  const p = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64u.dec(d.iv) }, await cryptoKey(k), b64u.dec(d.c));
  return JSON.parse(new TextDecoder().decode(p));
}

export function pairLink(h) {
  const u = new URL("app.html", location.href);
  u.hash = `join=${h.hid}.${h.key}`;
  return u.href;
}
export function readPairLink(hash) {
  const m = /join=([A-Za-z0-9_-]{22,43})\.([A-Za-z0-9_-]{40,50})/.exec(hash || "");
  return m ? { hid: m[1], key: m[2] } : null;
}

// Amma's phone → one sealed snapshot of what she chose to share.
export async function publish(h, snapshot) {
  await setDoc(doc(await store(), "h", h.hid, "s", "state"), await seal(h.key, snapshot));
}
export async function watchSnapshot(h, cb, onError) {
  return onSnapshot(doc(await store(), "h", h.hid, "s", "state"), async (snap) => {
    if (!snap.exists()) { cb(null); return; }
    try { cb(await unseal(h.key, snap.data())); } catch { onError?.(new Error("This link’s key doesn’t match. Ask for a new QR code.")); }
  }, (e) => onError?.(e));
}

// Family's phone → sealed requests in Amma's inbox (hello, reminder, add medicine).
export async function send(h, msg) {
  await addDoc(collection(await store(), "h", h.hid, "in"), await seal(h.key, msg));
}
export async function watchInbox(h, cb, onError) {
  const d = await store();
  return onSnapshot(collection(d, "h", h.hid, "in"), (qs) => {
    qs.docChanges().forEach(async (ch) => {
      if (ch.type !== "added") return;
      const ref = ch.doc.ref;
      try { cb(await unseal(h.key, ch.doc.data())); } catch { /* not for us: drop it */ }
      deleteDoc(ref).catch(() => {});
    });
  }, (e) => onError?.(e));
}

// Delete everything this household ever put on the server.
export async function wipe(h) {
  const d = await store();
  const inbox = await getDocs(collection(d, "h", h.hid, "in"));
  await Promise.all(inbox.docs.map((x) => deleteDoc(x.ref)));
  await deleteDoc(doc(d, "h", h.hid, "s", "state"));
}
